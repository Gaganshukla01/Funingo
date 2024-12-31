import express from "express";
const router = express.Router();
import {restaurant,party,trampoline,toys} from "../controllers/data.js";

router.route("/restaurant").post(restaurant);

router.route("/party").post(party);

router.route("/trampoline").post(trampoline);

router.route("/toys").post(toys);

export default router;
