import mongoose from "mongoose";

const activitySchema = mongoose.Schema(
  {
    name: String,
    bookings: {
      type: Number,
      default: 0,
    },
    coins_required: {
      type: Number,
      default: 0,
    },
  },
  {
    versionKey: false,
  }
);

const Activity = new mongoose.model("Activity", activitySchema);

export default Activity;
