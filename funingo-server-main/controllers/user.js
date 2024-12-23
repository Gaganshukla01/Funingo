import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import otpGenerator from "otp-generator";
import OtpVerification from "../models/otp-verification.js";
import User from "../models/user.js";
import { sendOtpToPhone } from "./otp.js";
import { sendMessageToPhone } from "../utilities/utils.js";
import ExpressError from "../utilities/express-error.js";
import constants from "../constants.js";
import { razorpay } from "../index.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";
import Transaction from "../models/transaction.js";

export const registerUser = async (req, res) => {
  const saltRounds = 10;

  const phone_no = req.body.phone_no;
  const user = await User.findOne({ phone_no });
  if (user) {
    if (!user.password) {
      throw new ExpressError("password_not_set", 400);
    }
    throw new ExpressError("User already registered", 400);
  }

  const hash_password = await bcrypt.hash(req.body.password, saltRounds);
  const newUser = new User({
    ...req.body,
    hash_password,
    verified: false,
    reg_date: new Date(),
  });

  const json_secret_key = process.env.JWT_SECRET_KEY;
  const token = jwt.sign(newUser._id.toString(), json_secret_key);

  await newUser.save();
  req.user = newUser;

  await sendOtpToPhone(req);

  res.status(200).send({
    success: true,
    token,
    user: {
      ...newUser.toJSON(),
      hash_password: undefined,
    },
  });
};

export const loginUser = async (req, res) => {
  const { email, phone_no, password } = req.body;
  let user;
  if (email) user = await User.findOne({ email });
  else if (phone_no) user = await User.findOne({ phone_no });
  else throw new ExpressError("One of email or phone_no is compulsory", 400);

  if (user) {
    const match = await bcrypt.compare(password, user.hash_password);
    if (match) {
      const json_secret_key = process.env.JWT_SECRET_KEY;
      const token = jwt.sign(user._id.toString(), json_secret_key);

      res.status(200).send({
        success: true,
        user: {
          ...user.toJSON(),
          hash_password: undefined,
        },
        token,
      });
    } else {
      throw new ExpressError("Phone number and password doesn't match", 400);
    }
  } else {
    throw new ExpressError("User not found", 400);
  }
};

export const updateUser = async (req, res) => {
  const { user } = req;
  if (!user) {
    throw new ExpressError("User not found", 401);
  }
  const newUser = await User.findByIdAndUpdate(
    user._id,
    { ...req.body, dob: req.body.dob ? new Date(req.body.dob) : undefined },
    { runValidators: true, new: true }
  );
  res.status(200).send({
    success: true,
    user: { ...newUser.toJSON(), hash_password: undefined },
  });
};

export const fetchSelf = async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ExpressError("User not found", 401);
  }

  res.status(200).send({
    success: true,
    user: { ...user.toJSON(), hash_password: undefined },
  });
};

export const forgetPassword = async (req, res) => {
  const { phone_no } = req.body;
  const user = await User.findOne({ phone_no });
  if (!user) {
    throw new ExpressError("This phone number doesn't exist", 400);
  }

  const otp = otpGenerator.generate(4, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  await sendMessageToPhone({
    phone_no,
    message: `This is your One Time Password for Funingo: ${otp}`,
  });

  const otpVerification = await OtpVerification.findOne({ user });
  if (otpVerification) {
    otpVerification.otp = otp;
    otpVerification.created_at = Date.now();
    otpVerification.expires_at = Date.now() + 10 * 60 * 60 * 1000;
    await otpVerification.save();
  } else {
    const newOtpVerification = new OtpVerification({
      otp,
      user,
      created_at: Date.now(),
      expires_at: Date.now() + 10 * 60 * 60 * 1000,
    });
    await newOtpVerification.save();
  }

  res.status(200).send({
    success: true,
  });
};

export const validateAndUpdatePassword = async (req, res) => {
  const { phone_no, new_password, otp } = req.body;
  const user = await User.findOne({ phone_no });
  if (!user) {
    throw new ExpressError("This phone number doesn't exist", 400);
  }
  const saltRounds = 10;
  const hash_password = await bcrypt.hash(new_password, saltRounds);

  if (process.env.NODE_ENV !== "production") {
    if (otp === "1234") {
      user.hash_password = hash_password;
      await user.save();
      res.status(200).send({
        success: true,
      });
    } else {
      throw new ExpressError("The OTP doesn't match", 401);
    }
    return;
  }

  const otpVerification = await OtpVerification.findOne({ user });
  if (otpVerification?.otp === otp) {
    if (otpVerification.expires_at > Date.now()) {
      user.hash_password = hash_password;
      await user.save();
      res.status(200).send({
        success: true,
      });
      return;
    } else {
      throw new ExpressError("Your Otp is expired. Please try again", 401);
    }
  }

  throw new ExpressError("The OTP doesn't match", 401);
};

export const getFreebies = async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ExpressError("User not found", 401);
  }

  res.status(200).send({
    success: true,
    freebies: user.existing_flags?.filter(
      (freebie) => new Date(freebie.expires_on) > new Date()
    ),
  });
};

export const getFuningoCoinsFromPhnNo = async (req, res) => {
  const { phone_no } = req.params;
  const user = await User.findOne({
    $or: [{ phone_no }, { short_id: phone_no }],
  }).populate("booked_tickets");

  if (!user) {
    throw new ExpressError("User not found", 401);
  }
  let dob;

  if (
    new Date(user.booked_tickets.slice(-1)[0]?.fun_date).toDateString() ===
    new Date().toDateString()
  ) {
    dob = user.dob;
  }

  res.status(200).json({
    success: true,
    name: (user?.first_name || "") + " " + (user?.last_name || ""),
    funingo_money: user.funingo_money,
    address: {
      state: user.state,
      city: user.city,
      locality: user.locality,
    },
    premium: user.premium,
    dob,
  });
};

export const createPremiumOrder = async (req, res) => {
  const { short_id, total_amount } = req.body;
  const { user } = req;

  const options = {
    amount: total_amount * 100,
    currency: "INR",
    receipt: short_id,
    notes: {
      user_id: user._id,
      for: "premium",
    },
  };
  const response = await razorpay.orders.create(options);
  res.status(200).send(response);
};

export const verifyPremiumPayment = async (req, res) => {
  const {
    short_id,
    order_id,
    premium_data,
    total_amount,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  // ****premium_data format****
  // [
  //   {
  //     expiry: ['6_months', '1_year', '100_years'],
  //     premium_type: ['50%', '100%']
  //   }
  // ]

  const { user } = req;
  const resp = validatePaymentVerification(
    {
      order_id,
      payment_id: razorpay_payment_id,
    },
    razorpay_signature,
    process.env.RAZORPAY_API_KEY_SECRET
  );

  if (!resp) {
    throw new ExpressError("Couldn't verify your payment", 400);
  }

  let totalAmount = 0;
  const today = new Date();
  const premiumData = premium_data?.map((premium) => {
    let amount = 0,
      expires_on;
    if (premium.premium_type === "50%") {
      if (premium.expiry === "6_months") {
        // expires_on = Date.now() + 6 * 30 * 24 * 60 * 60 * 1000;
        expires_on = new Date(today.setMonth(today.getMonth() + 6));
        amount += constants.premium_50_price_for_6_months;
      } else if (premium.expiry === "1_year") {
        // expires_on = Date.now() + 12 * 30 * 24 * 60 * 60 * 1000;
        expires_on = new Date(today.setFullYear(today.getFullYear() + 1));
        amount += constants.premium_50_price_for_1_year;
      } else if (premium.expiry === "100_years") {
        // expires_on = Date.now() + 100 * 12 * 30 * 24 * 60 * 60 * 1000;
        expires_on = new Date(today.setFullYear(today.getFullYear() + 100));
        amount += constants.premium_50_price_for_100_years;
      }
    } else {
      if (premium.expiry === "6_months") {
        // expires_on = Date.now() + 6 * 30 * 24 * 60 * 60 * 1000;
        expires_on = new Date(today.setMonth(today.getMonth() + 6));
        amount += constants.premium_100_price_for_6_months;
      } else if (premium.expiry === "1_year") {
        // expires_on = Date.now() + 12 * 30 * 24 * 60 * 60 * 1000;
        expires_on = new Date(today.setFullYear(today.getFullYear() + 1));
        amount += constants.premium_100_price_for_1_year;
      } else if (premium.expiry === "100_years") {
        // expires_on = Date.now() + 100 * 12 * 30 * 24 * 60 * 60 * 1000;
        expires_on = new Date(today.setFullYear(today.getFullYear() + 100));
        amount += constants.premium_100_price_for_100_years;
      }
    }
    totalAmount += amount;

    return {
      expires_on,
      premium_type: premium.premium_type,
      premium_duration: premium.expiry,
    };
  });

  if (totalAmount !== total_amount) {
    throw new ExpressError("Total amount doesn't match user.js", 400);
  }

  user.premium = [...user.premium, ...premiumData];
  await user.save();
  res.status(200).send({
    success: true,
  });
};

export const createAddFuningoMoneyOrder = async (req, res) => {
  const { phone_no, total_amount, coins } = req.body;

  const user = await User.findOne({ phone_no });

  if (!user) throw new ExpressError("User not found", 404);

  let isPremium = false;
  for (let data of user.premium || []) {
    if (new Date(data.expires_on) > Date.now()) {
      isPremium = true;
    }
  }

  let totalAmount = coins * constants.coinPrice;

  if (isPremium) {
    totalAmount /= 2;
  }

  if (totalAmount !== total_amount)
    throw new ExpressError("Total amount doesn't match", 400);

  const options = {
    amount: total_amount * 100,
    currency: "INR",
    receipt: phone_no,
    notes: {
      user_id: user._id,
      for: "add funingo money",
    },
  };
  const response = await razorpay.orders.create(options);
  res.status(200).send(response);
};

export const verifyAddFuningoMoneyPayment = async (req, res) => {
  const {
    phone_no,
    order_id,
    total_amount,
    coins,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  const user = await User.findOne({ phone_no });

  if (!user) throw new ExpressError("User not found", 404);

  const resp = validatePaymentVerification(
    {
      order_id,
      payment_id: razorpay_payment_id,
    },
    razorpay_signature,
    process.env.RAZORPAY_API_KEY_SECRET
  );

  if (!resp) {
    throw new ExpressError("Couldn't verify your payment", 400);
  }

  let isPremium = false;
  for (let data of user.premium || []) {
    if (new Date(data.expires_on) > Date.now()) {
      isPremium = true;
    }
  }

  let totalAmount = coins * constants.coinPrice;

  if (isPremium) {
    totalAmount /= 2;
  }

  if (totalAmount !== total_amount)
    throw new ExpressError("Total amount doesn't match", 400);
  user.funingo_money += coins;
  await user.save();

  const transaction = new Transaction({
    user: user._id,
    coins: coins,
    type: "credit",
    description: "Purchased coins",
  });
  await transaction.save();

  res.status(200).send({ success: true, coins: user.funingo_money });
};

export const getTransactions = async (req, res) => {
  const { user } = req;
  const transactions = await Transaction.find({ user: user._id }).sort({
    created_at: -1,
  });

  res.status(200).send({ success: true, transactions });
};
