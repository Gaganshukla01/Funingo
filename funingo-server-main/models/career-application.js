import mongoose from 'mongoose';

const careerApplicationSchema = new mongoose.Schema(
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
    highest_qualification: {
      type: String,
      required: true
    },
    resume_url: {
      type: String,
      required: true
    },
    resume_filename: {
      type: String,
      required: true
    }
  },
  {
    versionKey: false
  }
);

const CareerApplication = mongoose.model(
  'CareerApplication',
  careerApplicationSchema
);

export default CareerApplication;
