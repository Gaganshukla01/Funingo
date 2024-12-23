import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    product_mode:String,
    total_amount:Number
  })
const UserModel = mongoose.model('User', UserSchema);
export default UserModel;