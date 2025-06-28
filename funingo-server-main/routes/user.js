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
  getAllusers,
  getFuningoCoinsFromPhnNo,
  createPremiumOrder,
  verifyPremiumPayment,
  userUnlimtedAdd,
  createAddFuningoMoneyOrder,
  verifyAddFuningoMoneyPayment,
  getTransactions,
  updateUserType,
  historyAdd,
  getUserNameByPhone,
  getAllTransactions
} from "../controllers/user.js";
import { authenticateEmployee, authenticateUser } from "../middleware.js";
const router = express.Router();

router
  .route("/")
  .post(catchAsync(registerUser))
  .get(authenticateUser, catchAsync(fetchSelf))
  .put(authenticateUser, catchAsync(updateUser));


router.route("/getallusers").get(authenticateUser,getAllusers)
router.route("/getloginUser").get(authenticateUser,fetchSelf);
router.route("/addhistory").put(authenticateUser,historyAdd);
router.route("/login").post(catchAsync(loginUser));
router.route("/forget-password").post(catchAsync(forgetPassword));
router.route("/getusername/:phone_no").get(catchAsync(getUserNameByPhone));
router.route("/updateusertype").put(catchAsync(updateUserType));
router.route("/unlimitedupdate").put(catchAsync(userUnlimtedAdd));
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
router.get("/getalltransactions", authenticateUser, catchAsync(getAllTransactions));

export default router;
