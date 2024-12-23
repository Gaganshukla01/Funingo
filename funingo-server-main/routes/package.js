import express from "express";
import catchAsync from "../utilities/catch-async.js";
import {
  addPackage,
  deletePackage,
  getAllPackages,
} from "../controllers/package.js";
import { authenticateAdmin } from "../middleware.js";
const router = express.Router();

router
  .route("/")
  .get(catchAsync(getAllPackages))
  .post(authenticateAdmin, catchAsync(addPackage));
router.route("/:id").delete(authenticateAdmin, catchAsync(deletePackage));

export default router;
