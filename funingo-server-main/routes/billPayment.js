import express from "express"
import { BillPayment,BillExcel ,Billfetch} from "../controllers/billController.js";
const router=express.Router();

router.route("/billpayment").post(BillPayment)
router.route("/billinexcel").get(BillExcel)
router.route("/billfetch").get(Billfetch)

export default router;