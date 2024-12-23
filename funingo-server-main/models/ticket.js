import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    fun_date: {
      type: Date,
      required: true,
    },
    short_id: {
      type: String,
      unique: true,
    },
    preferred_slot: String,
    details: [
      {
        person_name: String,
        age: Number,
        gender: {
          type: String,
          enum: ["male", "female", "others"],
        },
        package: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Package",
        },
      },
    ],
    premium_types: {
      type: String, // 50%-6_months | 50%-1_year | 50%-100_years | null
      default: null,
    },
    total_amount: Number,
    coupon_used: {
      type: String,
      required: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    phone_no: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    payment_verified: {
      type: Boolean,
      default: false,
    },
    payment_mode: {
      type: String,
      enum: ["razorpay", "online", "cash", "card"],
      default: "razorpay",
    },
    riskConsentImage: {
      url: String,
      filename: String,
    },
    custom_discount: {
      type: Number,
      default: 0,
    },
    count: {
      type: Number,
      default: 1,
    },
  },
  {
    versionKey: false,
  }
);

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;
