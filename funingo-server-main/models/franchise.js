import mongoose from 'mongoose';

const franchiseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    phone_no: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    location: {
      type: String,
      required: true
    },
    available_area: {
      type: String,
      required: true
    },
    available_investment: {
      type: String,
      required: true
    },
    suitable_timings: {
      type: String,
      required: true
    }
  },
  {
    versionKey: false
  }
);

const Franchise = mongoose.model('Franchise', franchiseSchema);

export default Franchise;
