import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  totalSales: {
    type: Number,
    
  },
  totalAmountReceived: {
    type: Number,
    
  },
  numberOfOrders: {
    type: Number,
  
  },
  averageOrderValue: {
    type: Number,
  
  },
  totalDiscounts: {
    type: Number,
    
  },
  totalRefunds: {
    type: Number,
  
  },
  mostPopularItem: {
    type: String,
  
  },
  customerFeedbackCount: {
    type: Number,
    
  },
}, { timestamps: true });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
export default Restaurant;