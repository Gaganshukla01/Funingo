import mongoose from "mongoose";
import { stringify } from "querystring";

const salesSchema = new mongoose.Schema({
  _id: { type: String, required: true }, 
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  section: { type: String, required: true }, 
  split: { type: String, required: true },
});

const Sales = mongoose.model('Sales', salesSchema);
export default Sales;
