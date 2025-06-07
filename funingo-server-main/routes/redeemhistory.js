import express from "express";
const router = express.Router();
import { redeemadd , redeemFetch} from "../controllers/redeemHistoryController.js";

router.route("/redeemadd").post(redeemadd);

router.route("/redeemfetch").get(redeemFetch);


export default router;