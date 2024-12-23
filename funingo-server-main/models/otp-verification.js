import mongoose from 'mongoose';

const otpVerificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      unique: true
    },
    otp: {
      type: String,
      required: true
    },
    created_at: {
      type: Date,
      required: true
    },
    expires_at: {
      type: Date,
      required: true
    }
  },
  {
    versionKey: false
  }
);

const OtpVerification = mongoose.model(
  'OtpVerification',
  otpVerificationSchema
);

export default OtpVerification;
