import express from "express";
import catchAsync from "../utilities/catch-async.js";
import { authenticateEmployee } from "../middleware.js";
import { checkActivityBooking } from "../controllers/employee/index.js";

const router = express.Router();

router.get(
  "/:activity_name",
  authenticateEmployee,
  catchAsync(checkActivityBooking)
);

export default router;
