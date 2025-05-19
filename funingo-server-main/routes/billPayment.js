import express from "express"
import { BillPayment,BillExcel } from "../controllers/billController.js";
const router=express.Router();

router.route("/billpayment").post(BillPayment)
router.route("/billinexcel").get(BillExcel)

export default router;