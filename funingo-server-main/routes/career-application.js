import express from 'express';
import catchAsync from '../utilities/catch-async.js';
import { authenticateAdmin, authenticateUser } from '../middleware.js';
import multer from 'multer';
import { storage } from '../cloudinary/index.js';

import {
  addApplication,
  deleteApplication,
  fetchAllApplications
} from '../controllers/career-application.js';
const upload = multer({ storage });

const router = express.Router();

router
  .route('/')
  .post(authenticateUser, upload.single('resume'), catchAsync(addApplication))
  .get(authenticateAdmin, catchAsync(fetchAllApplications));

router.route('/:id').delete(authenticateAdmin, catchAsync(deleteApplication));

export default router;
