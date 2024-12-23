// import mongoose from 'mongoose';

// const couponSchema = new mongoose.Schema(
//   {
//     code: {
//       type: String,
//       unique: true,
//       required: true
//     },
//     discount_type: {
//       type: String,
//       enum: ['flat', 'percent'],
//       required: true
//     },
//     max_discount: {
//       // in ruppees
//       type: Number,
//       required: true
//     },
//     discount: {
//       // for flat discount === max_discount, for percent discount is in %
//       type: Number,
//       required: true
//     },
//     min_amount: {
//       type: Number,
//       required: true,
//       default: 0
//     }
//   },
//   {
//     versionKey: false
//   }
// );

// const Coupon = mongoose.model('Coupon', couponSchema);

// export default Coupon;






import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      required: true
    },
    count: {
      type: Number,
      required: true
    },
    discount_type: {
      type: String,
      enum: ['flat', 'percent'],
      required: true
    },
    max_discount: {
      // in ruppees
      type: Number,
      required: true
    },
    discount: {
      type: Number,
      required: true
    },
    min_amount: {
      type: Number,
      required: true,
      default: 0
    }
  },
  {
    versionKey: false
  }
);

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;
