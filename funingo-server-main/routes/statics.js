import express from "express"
const router = express.Router();
import {salesFetch,salesAdd,activitiesFetch,activityAdd
    ,customerinsightFetch,customerinsightAdd,employeeFetch,employeeAdd} from "../controllers/insights.js"

router.route("/salesfetch").get(salesFetch)
router.route("/salesadd").post(salesAdd)

router.route("/activityfetch").get(activitiesFetch)
router.route("/activityadd").post(activityAdd)

router.route("/customerinsightfetch").get(customerinsightFetch)
router.route("/customerinsightadd").post(customerinsightAdd)

router.route("/employeefetch").get(employeeFetch)
router.route("/employeeadd").post(employeeAdd)


export default router;