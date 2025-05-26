import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
  empid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  activities: [
    {
      name: { type: String, required: true },
      count: { type: Number, default: 1 },
      date:{type:String,required:true},
    },

  ],
});
const EmployeeModel = mongoose.model('Employee', EmployeeSchema);

export default EmployeeModel;
