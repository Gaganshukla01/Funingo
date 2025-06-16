import express from "express"
const router = express.Router();
import {salesFetch,salesAdd,activitiesFetch,activityAdd,employeeActivityUpdate,activityPersonAssign
    ,customerinsightFetch,customerinsightAdd,employeeFetch,employeeAdd,salesLastId} from "../controllers/insights.js"

router.route("/salesfetch").get(salesFetch)
router.route("/salesId").get(salesLastId)
router.route("/salesadd").post(salesAdd)

router.route("/activityfetch").get(activitiesFetch)
router.route("/activityadd").post(activityAdd)
router.route("/activityassignpeople").post(activityPersonAssign)

router.route("/customerinsightfetch").get(customerinsightFetch)
router.route("/customerinsightadd").post(customerinsightAdd)

router.route("/employeefetch").get(employeeFetch)
router.route("/employeeadd").post(employeeAdd)
router.route("/employeeactivityupdate").put(employeeActivityUpdate)


export default router;