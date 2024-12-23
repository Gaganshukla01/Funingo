import QRTicket from "../models/qr-ticket.js";
import Coupon from "../models/coupon.js";
import Ticket from "../models/ticket.js";
import ExpressError from "../utilities/express-error.js";
import constants from "../constants.js";
import Package from "../models/package.js";

import {
  calculateDiscountPrice,
  calculateFuningoMoneyToAdd,
  sendMessageToPhone,
} from "../utilities/utils.js";
import { razorpay } from "../index.js";
import ShortUniqueId from "short-unique-id";
import {
  validatePaymentVerification,
  validateWebhookSignature,
} from "razorpay/dist/utils/razorpay-utils.js";
import User from "../models/user.js";
import Activity from "../models/activity.js";
import Transaction from "../models/transaction.js";

export const getAllTickets = async (req, res) => {
  const { phone_no } = req.query;
  const tickets =
    (await Ticket.find({ phone_no, payment_verified: true })
      .populate("details.package")
      .sort({ fun_date: -1 })) || [];

  res.status(200).send({
    success: true,
    tickets,
  });
};

export const getQRTickets = async (req, res) => {
  const { phone_no, number_of_tickets, ticket_id } = req.query;
  let ticket_count = parseInt(number_of_tickets);
  let user;
  if (ticket_id) {
    const ticket = await Ticket.findOne({ short_id: ticket_id }).populate(
      "user"
    );
    if (!ticket) throw new ExpressError("Ticket not found", 400);
    ticket_count = ticket.details.length;
    user = ticket.user;
  } else {
    user = await User.findOne({ phone_no }).populate("booked_tickets");
  }

  if (!user) {
    throw new ExpressError("User not found", 404);
  }

  if (Math.floor(user.funingo_money / 2000) < ticket_count) {
    throw new ExpressError(
      "Minimum required coins need to be 2000 per user",
      400
    );
  }

  if (!user.short_id) {
    const new_short_id = new ShortUniqueId({
      dictionary: "alphanum_upper",
      length: 4,
    });
    user.short_id = new_short_id();
    await user.save();
  }

  const qr = `http://api.qrserver.com/v1/create-qr-code/?data=${
    constants.website_url
  }/e/redeem?tid=${user.phone_no.split("-")[1]}`;

  const finalData = [...Array(ticket_count)].map(() => ({
    qr,
    phone_no,
    short_id: user.short_id,
  }));

  res.status(200).send({
    success: true,
    tickets: finalData,
    total_coins: user.funingo_money,
  });
};

export const getDiscount = async (req, res) => {
  var { code, total_amount } = req.body;

  const discount = await calculateDiscountPrice({ code, total_amount });
  res.status(200).send({
    success: true,
    ...discount,
  });
};

export const createTicketOrder = async (req, res) => {
  var {
    preferred_slot,
    total_amount,
    details,
    fun_date,
    short_id,
    phone_no,
    email,
    coupon,
    count,
  } = req.body;

  const { user } = req;
  let totalAmount = 0;
  const newDetails = await Promise.all(
    details.map(async (person) => {
      if (person?.package) {
        const pack = await Package.findById(person.package);
        totalAmount += pack.price;
      } else {
        throw new ExpressError("Person without package is not allowed");
      }
      return person;
    })
  );

  let isPremium = false;
  for (let data of user.premium || []) {
    if (new Date(data.expires_on) > Date.now()) {
      isPremium = true;
    }
  }

  if (isPremium) {
    totalAmount /= 2;
  }

  if (coupon) {
    const discount = await calculateDiscountPrice({
      code: coupon,
      total_amount: totalAmount,
      updateCouponCount: true,
    });
    totalAmount -= discount.discount;
  }

  if (totalAmount !== total_amount) {
    throw new ExpressError("Total amount doesn't match ticket.js", 400);
  }

  const newTicket = new Ticket({
    fun_date: new Date(fun_date),
    preferred_slot,
    total_amount,
    payment_verified: false,
    details: newDetails,
    user,
    short_id,
    phone_no,
    email,
    coupon_used: coupon,
    count,
  });

  user.booked_tickets.push(newTicket);

  await newTicket.save();
  await user.save();

  const options = {
    amount: total_amount * 100,
    currency: "INR",
    receipt: short_id,
    notes: {
      ticket_id: newTicket._id.toString(),
      user_id: user._id,
    },
  };
  const response = await razorpay.orders.create(options);
  res.status(200).send(response);
};

export const verifyTicketPayment = async (req, res) => {
  const { short_id, order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  const { user } = req;

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
  const ticket = await Ticket.findOne({ short_id }).populate([
    "details.package",
    "user",
  ]);
  ticket.payment_verified = true;
  await ticket.save();

  // Adding coins (funingo_money) in user profile
  const totalCoins = ticket.details.reduce(
    (total, curr_person) => total + curr_person.package.coins,
    0
  );
  ticket.user.funingo_money += totalCoins;

  await ticket.user.save();

  const transaction = new Transaction({
    user: ticket.user._id,
    coins: totalCoins,
    type: "credit",
    description: "Purchased coins",
  });
  await transaction.save();

  await sendMessageToPhone({
    phone_no: user.phone_no,
    message: `Your ticket id is ${ticket.short_id}. Please collect your passes from the counter.`,
  });

  res.status(200).send({
    ticket,
    success: true,
  });
};

export const webhookPaymentVerification = async (req, res) => {
  const resp = validateWebhookSignature(
    JSON.stringify(req.body),
    req.headers["x-razorpay-signature"],
    "secret"
  );

  if (resp) {
    const short_id = req.body.payload.order.entity.receipt;
    const ticket = await Ticket.findOne({ short_id }).populate("user");
    if (!ticket.payment_verified) {
      ticket.payment_verified = true;
      await ticket.save();
      await sendMessageToPhone({
        phone_no: ticket.user.phone_no,
        message: `Your ticket id is ${ticket.short_id}. Please collect your passes from the counter.`,
      });
    }
  }

  res.status(200).send({
    success: true,
  });
};

export const saveTicketRiskImage = async (req, res) => {
  const image = {
    url: req?.file?.path,
    filename: req?.file?.filename,
  };
  const { short_id } = req.body;
  const ticket = await Ticket.findOne({ short_id });

  if (!ticket) throw new ExpressError("Ticket not found!", 404);

  ticket.riskConsentImage = image;
  await ticket.save();

  res.status(200).send({ success: true });
};

export const deleteTicket = async (req, res) => {
  const { short_id } = req.params;
  const { user } = req;

  const ticket = await Ticket.find({ short_id, user: user._id });
  if (!ticket) throw new ExpressError("Ticket not found with the user!!", 404);

  await Ticket.findByIdAndDelete(ticket._id);

  res.status(200).send({ success: true });
};

export const redeemFuningoCoins = async (req, res) => {
  const { phone_no, coins, activity_name, short_id } = req.body;

  const user = await User.findOne({
    $or: [{ phone_no }, { short_id }],
  });
  user.funingo_money -= coins;
  await user.save();

  let activity = await Activity.findOne({ name: activity_name });
  if (!activity) {
    activity = new Activity({ name: activity_name, bookings: 0 });
  }
  activity.bookings += 1;
  await activity.save();

  const transaction = new Transaction({
    user: user._id,
    coins: coins,
    activity: activity._id,
    type: "debit",
    description: "Redeemed for " + activity_name,
  });
  await transaction.save();

  res.status(200).json({
    success: true,
    funingo_money: user.funingo_money,
    bookings: activity.bookings,
  });
};
