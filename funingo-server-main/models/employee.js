import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
  empid: { type: String,unique: true,required:true },
  name: { type: String, required: true },
  phone:{type:String},
  activities: [
    {
      name: { type: String },
      count: { type: Number, default: 1 },
      date:{type:String},
    },

  ],
});
const EmployeeModel = mongoose.model('Employee', EmployeeSchema);

export default EmployeeModel;
