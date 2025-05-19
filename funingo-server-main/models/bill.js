import mongoose from 'mongoose';
const BillPaymentSchema = new mongoose.Schema(
  {
    sno: {
      type: String,
      required: true
    },
    Date: {
      type: String,
    },
    paymentType: {
      type: String,
    },
    amount: {
      type: String,
    },
    cgst: {
      type: String,
     
    },
    sgst: {
        type: String,
       
      },
      total: {
        type: String,
       
      }
  },
  {
    versionKey: false
  }
);

const BillPayment = mongoose.model(
  'BillPayment',
  BillPaymentSchema
);

export default BillPayment;
