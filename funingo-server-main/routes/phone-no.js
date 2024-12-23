import express from 'express';
import catchAsync from '../utilities/catch-async.js';
import { authenticateAdmin } from '../middleware.js';
import {
  addPhoneNumber,
  deletePhoneNumber,
  getAllPhoneNo
} from '../controllers/phone-no.js';
const router = express.Router();

router
  .route('/')
  .get(catchAsync(getAllPhoneNo))
  .post(authenticateAdmin, catchAsync(addPhoneNumber));
router.route('/:id').delete(authenticateAdmin, catchAsync(deletePhoneNumber));

export default router;
