import mongoose from "mongoose";
const customerInsightSchema = new mongoose.Schema({
  popularPackages: [{ name: { type: String, required: true }, sales: { type: Number, required: true } }],
  ageGroups: [{ ageRange: { type: String, required: true }, count: { type: Number, required: true } }],
  repeatRate: { type: Number, required: true }, 
  avgOrderValue: { type: Number, required: true }, 
});
const CustomerInsight = mongoose.model('CustomerInsight', customerInsightSchema);
export default CustomerInsight;