import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    number: {
      type: String,
      required: true
    }
  },
  {
    versionKey: false
  }
);

const PhoneNumber = mongoose.model('PhoneNumber', packageSchema);
export default PhoneNumber;
