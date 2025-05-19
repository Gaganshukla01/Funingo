import express from "express";
import catchAsync from "../utilities/catch-async.js";
import { authenticateAdmin } from "../middleware.js";
import { pdfUploadS3 } from "../controllers/invoiceUpload.js";
const router = express.Router();

router.route("/uploadfile").post(catchAsync(pdfUploadS3));

export default router;
