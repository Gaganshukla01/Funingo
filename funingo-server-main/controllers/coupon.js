// import Coupon from '../models/coupon.js';

// export const getAllCoupons = async (req, res) => {
//   const coupons = await Coupon.find();
//   res.status(200).send({
//     success: true,
//     coupons
//   });
// };

// export const deleteCoupon = async (req, res) => {
//   const { id } = req.params;
//   await Coupon.findByIdAndDelete(id);
//   res.status(200).send({
//     success: true
//   });
// };

// export const addCoupon = async (req, res) => {
//   const { code, discount_type, max_discount, discount, min_amount } = req.body;
//   let maxDiscount = max_discount;
//   if (discount_type === 'flat') {
//     maxDiscount = discount;
//   }
//   const newCoupon = new Coupon({
//     code,
//     discount_type,
//     max_discount: maxDiscount,
//     discount,
//     min_amount
//   });
//   await newCoupon.save();

//   res.status(200).send({
//     success: true
//   });
// };






import Coupon from '../models/coupon.js';

export const getAllCoupons = async (req, res) => {
  
  const coupons = await Coupon.find();
  res.status(200).send({
    success: true,
    coupons
  });
};

export const deleteCoupon = async (req, res) => {
  const { id } = req.params;
  await Coupon.findByIdAndDelete(id);
  res.status(200).send({
    success: true
  });
};




export const addCoupon = async (req, res) => {
  const coupons = await Coupon.find();
    
    // Print the count property of each coupon
    // coupons.forEach(coupon => {
    // });

  const { code, count, discount_type, max_discount, discount, min_amount } = req.body;
  let maxDiscount = max_discount;
  if (discount_type === 'flat') {
    maxDiscount = discount;
  }
  const newCoupon = new Coupon({
    code,
    count,
    discount_type,
    max_discount: maxDiscount,
    discount,
    min_amount
  });
  await newCoupon.save();

  res.status(200).send({
    success: true
  });
};
