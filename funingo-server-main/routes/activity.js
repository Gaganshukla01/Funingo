import express from "express";
import catchAsync from "../utilities/catch-async.js";
import { authenticateEmployee } from "../middleware.js";
import { checkActivityBooking,addActivity,activityFetch } from "../controllers/employee/index.js";

const router = express.Router();

router.get("/activityfetch",catchAsync(activityFetch));
router.get(
  "/:activity_name",
  authenticateEmployee,
  catchAsync(checkActivityBooking)
);

router.post("/addactivity",addActivity);
router.get("/activityfetch",catchAsync(activityFetch));

export default router;
