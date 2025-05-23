import mongoose from "mongoose";
const activitySchema = new mongoose.Schema({
  _id: { type: String, required: true }, 
  name: { type: String, required: true },
  redemptions: { type: Number, required: true },
  date: { type: String, required: true }, 
  assignedPeople: [{ type: String }],
});
const ActivitiesSales = mongoose.model('ActivitiesSales', activitySchema);
export default ActivitiesSales;