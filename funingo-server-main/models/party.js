import mongoose from 'mongoose';

const partySchema = new mongoose.Schema({
  totalPartyPackagesSold: {
    type: Number,
    required: true,
  },
  totalAmountReceived: {
    type: Number,
    required: true,
  },
  numberOfPartiesHeld: {
    type: Number,
    required: true,
  },
  averagePackagePrice: {
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
  mostPopularPackage: {
    type: String,
    required: true,
  },
  customerFeedbackCount: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const Party = mongoose.model('Party', partySchema);
export default Party;