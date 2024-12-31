import mongoose from 'mongoose';

const trampolineSchema = new mongoose.Schema({
  totalTicketsSold: {
    type: Number,
    required: true,
  },
  totalAmountReceived: {
    type: Number,
    required: true,
  },
  numberOfSessionsHeld: {
    type: Number,
    required: true,
  },
  averageTicketPrice: {
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
  mostPopularSession: {
    type: String,
    required: true,
  },
  customerFeedbackCount: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const Trampoline = mongoose.model('Trampoline', trampolineSchema);
export default Trampoline;