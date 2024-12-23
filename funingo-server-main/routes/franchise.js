import express from 'express';
import catchAsync from '../utilities/catch-async.js';
import { authenticateAdmin, authenticateUser } from '../middleware.js';
import {
  addNewFranchise,
  deleteFranchise,
  getAllFranchise
} from '../controllers/franchise.js';

const router = express.Router();

router
  .route('/')
  .get(authenticateAdmin, catchAsync(getAllFranchise))
  .post(authenticateUser, catchAsync(addNewFranchise));
router.route('/:id').delete(authenticateAdmin, catchAsync(deleteFranchise));

export default router;
