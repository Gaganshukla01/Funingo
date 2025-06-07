import mongoose from 'mongoose';

const redeemCoinSchema = new mongoose.Schema({
  redeemBy: {
    type: String,
    required: true,
  },
  redeemOff: {
    type: String,
    required: true,
  },
  coins: {
    type: Number,
    required: true,
  },
  activity: {
    type: String,
    required: true,
  }
}, { timestamps: true });

const RedeemCoinHistory = mongoose.model('RedeemCoinHistory', redeemCoinSchema);
export default RedeemCoinHistory;