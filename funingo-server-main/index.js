import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { SNSClient } from "@aws-sdk/client-sns";
import { S3Client } from "@aws-sdk/client-s3";

import Razorpay from "razorpay";
import cron from "node-cron";

import userRouter from "./routes/user.js";
import otpRouter from "./routes/otp.js";
import ticketRouter from "./routes/ticket.js";
import packageRouter from "./routes/package.js";
import qrRouter from "./routes/qr-ticket.js";
import adminRouter from "./routes/admin/index.js";
import adminStatsRouter from "./routes/admin/stats.js";
import imageRouter from "./routes/images.js";
import couponRouter from "./routes/coupon.js";
import phoneNoRouter from "./routes/phone-no.js";
import franchiseRouter from "./routes/franchise.js";
import careerApplicationSchema from "./routes/career-application.js";
import activityRouter from "./routes/activity.js";
import { saveFreebiesAutomationFunction } from "./utilities/utils.js";
// import { getAddedFreebies } from './controllers/admin/index.js'; // Import the function
import Ticket from "./models/ticket.js";

if (["production", "development"].includes(process.env.NODE_ENV)) {
  dotenv.config();
}

mongoose.connect(process.env.DB_URI).then(
  () => console.log("Database connected"),
  (err) => console.log("Error connecting database ", err)
);

export const sns_client = new SNSClient({
  region: "ap-south-1",
});

export const s3_client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY_ID,
  key_secret: process.env.RAZORPAY_API_KEY_SECRET,
});

const entrySchema = new mongoose.Schema({
  payment_mode: String,
  total_amount: Number,
});

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["*"],
    allowedHeaders: ["*"],
    credentials: true,
  })
);

// app.use(
//   cors({
//     origin: ["https://funingo.fun", "http://127.0.0.1:8000"],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );

app.use("/user", userRouter);
app.use("/otp", otpRouter);
app.use("/ticket", ticketRouter);
app.use("/package", packageRouter);
app.use("/qr", qrRouter);
app.use("/admin", adminRouter);
app.use("/admin/stats", adminStatsRouter);
app.use("/image", imageRouter);
app.use("/coupon", couponRouter);
app.use("/phone", phoneNoRouter);
app.use("/franchise", franchiseRouter);
app.use("/career-application", careerApplicationSchema);
app.use("/activity", activityRouter);

app.get("/", async (req, res) => {
  res.status(200).send(`Server up and running on ${process.env.NODE_ENV}!`);
});

app.get("/getDetails", async (req, res) => {
  console.log("entering");
  Ticket.find()
    .then((Ticket) => {
      return res.json(Ticket);
    })
    .catch((err) => {
      console.log("error find ticket", err);
      return res.json(err);
    });
});

app.all("*", async (req, res) => {
  res.status(404).send({ error: "Url not found!" });
});

app.use((err, req, res, next) => {
  const { status_code = 500 } = err;
  if (!err.message) err.message = "internal_server_error";
  res.status(status_code).send({
    error: err.message,
  });
});

cron.schedule("53 1 * * *", saveFreebiesAutomationFunction, {
  timezone: "Asia/Kolkata",
  scheduled: true,
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
