import QRTicket from "../models/qr-ticket.js";
import ExpressError from "../utilities/express-error.js";
import { razorpay } from "../index.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";
import constants from "../constants.js";
import { sendMessageToPhone } from "../utilities/utils.js";

export const getQRTicketDetails = async (req, res) => {
  const { short_id } = req.params;
  const ticket = await QRTicket.findOne({ short_id }).populate(
    "parent_ticket",
    "phone_no"
  );
  if (!ticket) {
    throw new ExpressError("Ticket not found", 404);
  }

  res.status(200).send({
    success: true,
    ticket: ticket,
  });
};

export const redeemFlags = async (req, res) => {
  const { short_id } = req.params;
  const { red = 0, green = 0, yellow = 0, golden = 0 } = req.body;
  const ticket = await QRTicket.findOne({ short_id });
  if (!ticket) {
    throw new ExpressError("Ticket not found", 404);
  }
  if (
    ticket.red < red ||
    ticket.green < green ||
    ticket.yellow < yellow ||
    ticket.golden < golden
  ) {
    throw new ExpressError("Insufficient flag", 500);
  }

  ticket.red -= red;
  ticket.green -= green;
  ticket.yellow -= yellow;
  ticket.golden -= golden;

  await ticket.save();
  res.status(200).send({
    success: true,
  });
};

export const createQRTicketOrder = async (req, res) => {
  console.log("request from qrtcket creatiion", req);
  const { total_amount, red, green, yellow, golden, short_id, premium } =
    req.body;
  let totalAmount = 0;

  totalAmount += constants.coinPrice * yellow;

  if (premium === "50%") {
    totalAmount = Math.floor(totalAmount / 2);
  }

  totalAmount += 0.18 * totalAmount;
  totalAmount = Math.round((totalAmount + Number.EPSILON) * 100) / 100;

  if (totalAmount !== total_amount) {
    throw new ExpressError("Total amount doesn't match", 400);
  }

  const options = {
    amount: total_amount * 100,
    currency: "INR",
    receipt: short_id,
  };
  const response = await razorpay.orders.create(options);
  res.status(200).send(response);
};

export const verifyQRTicketPayment = async (req, res) => {
  const {
    short_id,
    order_id,
    razorpay_payment_id,
    razorpay_signature,
    red,
    green,
    yellow,
    golden,
  } = req.body;

  const resp = validatePaymentVerification(
    {
      order_id,
      payment_id: razorpay_payment_id,
    },
    razorpay_signature,
    process.env.RAZORPAY_API_KEY_SECRET
  );

  if (!resp) {
    throw new ExpressError("Couldn't verify your payment", 400);
  }
  const ticket = await QRTicket.findOne({ short_id }).populate("parent_ticket");

  ticket.red += red;
  ticket.green += green;
  ticket.yellow += yellow;
  ticket.golden += golden;
  await ticket.save();

  // For stats
  const parentTicket = ticket.parent_ticket;
  let amount =
    constants.red_flag_price * red +
    constants.green_flag_price * green +
    constants.yellow_flag_price * yellow +
    constants.golden_flag_price * golden;

  if (ticket.premium === "50%") {
    amount = Math.floor(amount / 2);
  }

  parentTicket.total_amount = amount;

  await parentTicket.save();

  await sendMessageToPhone({
    phone_no: parentTicket.phone_no,
    message: `Added flags on your ticket id: ${short_id}`,
  });

  res.status(200).send({
    ticket,
    success: true,
  });
};
