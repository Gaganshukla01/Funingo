import express from 'express';
import catchAsync from '../utilities/catch-async.js';
import { sendOtpToPhone, validateOtp } from '../controllers/otp.js';
import { authenticateUser } from '../middleware.js';

const router = express.Router();

router.route('/send').put(authenticateUser, catchAsync(sendOtpToPhone));
router.route('/verify').post(authenticateUser, catchAsync(validateOtp));

export default router;
