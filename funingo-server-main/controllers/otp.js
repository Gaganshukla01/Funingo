import otpGenerator from 'otp-generator';
import OtpVerification from '../models/otp-verification.js';
import ExpressError from '../utilities/express-error.js';
import { sendMessageToPhone } from '../utilities/utils.js';

let otpgenerated=0;

export const sendOtpToPhone = async (req, res) => {
  const { user } = req;
  const { phone_no } = user;
  if (phone_no?.length < 10) {
    throw new ExpressError('Phone number not valid', 400);
  }
  const otp = otpGenerator.generate(4, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false
  });
  otpgenerated=otp;
  await sendMessageToPhone({
    phone_no,
    message: `This is your One Time Password for Funingo: ${otp}`
  });

  const otpVerification = await OtpVerification.findOne({ user });
  if (otpVerification){
    otpVerification.otp = otp;
    otpVerification.created_at = Date.now();
    otpVerification.expires_at = Date.now() + 10 * 60 * 60 * 1000;
    await otpVerification.save();
  }else {
    const newOtpVerification = new OtpVerification({
      otp,
      user,
      created_at: Date.now(),
      expires_at: Date.now() + 10 * 60 * 60 * 1000
    });
    await newOtpVerification.save();
  }
  res?.status(200)?.send({
    success: true
  });
};

export const validateOtp = async (req, res) => {
  const { otp } = req.body;
  const { user } = req;

  const otpVerification = await OtpVerification.findOne({ user: user._id });
  if (process.env.NODE_ENV !== 'production') {
    if (otp === otpgenerated) {
      user.verified = true;
      await user.save();
      res.status(200).send({
        success: true
      });
    } else {
      throw new ExpressError("The OTP doesn't match", 401);
    }
    return;
  }

  if (otpVerification?.otp === otp) {
    if (otpVerification.expires_at > Date.now()) {
      user.verified = true;
      await user.save();
      res.status(200).send({
        success: true
      });
      return;
    } else {
      await sendOtpToPhone(req);
      throw new ExpressError(
        'Your Otp is expired, we have sent you new OTP!',
        401
      );
    }
  }

  throw new ExpressError("The OTP doesn't match", 401);
};
