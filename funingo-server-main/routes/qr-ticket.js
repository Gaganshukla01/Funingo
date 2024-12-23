import express from 'express';
import catchAsync from '../utilities/catch-async.js';

import { authenticateUser } from '../middleware.js';
import {
  createQRTicketOrder,
  getQRTicketDetails,
  redeemFlags,
  verifyQRTicketPayment
} from '../controllers/qr-ticket.js';
const router = express.Router();

router.route('/create-order').post(catchAsync(createQRTicketOrder));
router.route('/verify-payment').post(catchAsync(verifyQRTicketPayment));

router.post('/:short_id/redeem', authenticateUser, catchAsync(redeemFlags));
router.get('/:short_id', catchAsync(getQRTicketDetails));

export default router;
