import mongoose from 'mongoose';

const toysSchema = new mongoose.Schema({
  totalToysSold: {
    type: Number,
    required: true,
  },
  totalAmountReceived: {
    type: Number,
    required: true,
  },
  numberOfToysAvailable: {
    type: Number,
    required: true,
  },
  averageToyPrice: {
    type: Number,
    required: true,
  },
  totalDiscounts: {
    type: Number,
    required: true,
  },
  totalRefunds: {
    type: Number,
    required: true,
  },
  mostPopularToy: {
    type: String,
    required: true,
  },
  customerFeedbackCount: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const Toys = mongoose.model('Toys', toysSchema);
export default Toys;