import express from "express"
const router = express.Router();
import {salesFetch,salesAdd,activitiesFetch,activityAdd
    ,customerinsightFetch,customerinsightAdd} from "../controllers/insights.js"

router.route("/salesfetch").get(salesFetch)
router.route("/salesadd").post(salesAdd)

router.route("/activityfetch").get(activitiesFetch)
router.route("/activityadd").post(activityAdd)

router.route("/customerinsightfetch").get(customerinsightFetch)
router.route("/customerinsightadd").post(customerinsightAdd)


export default router;