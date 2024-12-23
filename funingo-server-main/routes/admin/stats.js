import express from "express";
import { authenticateAdmin } from "../../middleware.js";
import catchAsync from "../../utilities/catch-async.js";
import {
  activityUsage,
  downloadUserData,
  getCoinsPerPerson,
  revenueTransactionSplit,
  userFrequency,
  downlaodDailySales,
} from "../../controllers/admin/stats.js";

const router = express.Router();

router.get(
  "/revenue/split",
  authenticateAdmin,
  catchAsync(revenueTransactionSplit)
);

router.get("/activity/usage", authenticateAdmin, catchAsync(activityUsage));

router.get("/user-frequency", authenticateAdmin, catchAsync(userFrequency));

router.get(
  "/download-user-data",
  authenticateAdmin,
  catchAsync(downloadUserData)
);

router.get(
  "/download-sales-data",
  authenticateAdmin,
  catchAsync(downlaodDailySales)
);

router.get(
  "/coins-per-person",
  authenticateAdmin,
  catchAsync(getCoinsPerPerson)
);

export default router;
