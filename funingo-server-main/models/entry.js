import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema({
  payment_mode: String,
  total_amount: Number,
});

const Entry = mongoose.model('Entry', entrySchema);
export default Entry;
