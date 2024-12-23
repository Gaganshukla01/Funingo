import express from 'express';
import catchAsync from '../utilities/catch-async.js';
import { authenticateAdmin } from '../middleware.js';
import multer from 'multer';
import { storage } from '../cloudinary/index.js';
import {
  addImages,
  deleteImage,
  fetchImages,
  uploadImage
} from '../controllers/images.js';
const upload = multer({ storage });

const router = express.Router();

router.post(
  '/upload',
  authenticateAdmin,
  upload.array('image'),
  catchAsync(uploadImage)
);
router
  .route('/')
  .get(catchAsync(fetchImages))
  .post(authenticateAdmin, catchAsync(addImages));
router.route('/:id').delete(authenticateAdmin, catchAsync(deleteImage));

export default router;
