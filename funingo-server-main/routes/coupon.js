import express from "express";
import catchAsync from "../utilities/catch-async.js";
import { authenticateAdmin } from "../middleware.js";
import {
  addCoupon,
  deleteCoupon,
  getAllCoupons,
} from "../controllers/coupon.js";
const router = express.Router();

router
  .route("/")
  .get(authenticateAdmin, catchAsync(getAllCoupons))
  .post(authenticateAdmin, catchAsync(addCoupon));
router.route("/:id").delete(authenticateAdmin, catchAsync(deleteCoupon));

export default router;
