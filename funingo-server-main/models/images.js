import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true
    },
    image_type: {
      type: String,
      required: true,
      enum: ['banner', 'sport_event', 'birthday_party', 'corporate_event']
    },
    filename: {
      type: String,
      required: true
    }
  },
  {
    versionKey: false
  }
);

const Image = mongoose.model('Image', imageSchema);

export default Image;
