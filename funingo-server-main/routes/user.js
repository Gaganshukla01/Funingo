import express from "express";
import catchAsync from "../utilities/catch-async.js";
import {
  fetchSelf,
  loginUser,
  registerUser,
  forgetPassword,
  validateAndUpdatePassword,
  updateUser,
  getFreebies,
  getFuningoCoinsFromPhnNo,
  createPremiumOrder,
  verifyPremiumPayment,
  createAddFuningoMoneyOrder,
  verifyAddFuningoMoneyPayment,
  getTransactions,
} from "../controllers/user.js";
import { authenticateEmployee, authenticateUser } from "../middleware.js";
const router = express.Router();

router
  .route("/")
  .post(catchAsync(registerUser))
  .get(authenticateUser, catchAsync(fetchSelf))
  .put(authenticateUser, catchAsync(updateUser));

router.route("/login").post(catchAsync(loginUser));
router.route("/forget-password").post(catchAsync(forgetPassword));
router
  .route("/validate-and-update-password")
  .post(catchAsync(validateAndUpdatePassword));

router.get("/freebies", authenticateUser, catchAsync(getFreebies));

router
  .route("/premium/create-order")
  .post(authenticateUser, catchAsync(createPremiumOrder));
router
  .route("/premium/verify-payment")
  .post(authenticateUser, catchAsync(verifyPremiumPayment));

router
  .route("/coins/create-order")
  .post(catchAsync(createAddFuningoMoneyOrder));
router
  .route("/coins/verify-payment")
  .post(catchAsync(verifyAddFuningoMoneyPayment));

router.get("/coins/:phone_no", catchAsync(getFuningoCoinsFromPhnNo));

router.get("/transactions", authenticateUser, catchAsync(getTransactions));

export default router;
