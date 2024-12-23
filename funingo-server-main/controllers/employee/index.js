import ShortUniqueId from "short-unique-id";
import User from "../../models/user.js";
import Package from "../../models/package.js";
import ExpressError from "../../utilities/express-error.js";
import Ticket from "../../models/ticket.js";
import Coupon from "../../models/coupon.js";
import constants from "../../constants.js";
import { calculateDiscountPrice } from "../../utilities/utils.js";
import Activity from "../../models/activity.js";
import Transaction from "../../models/transaction.js";

export const bookTicket = async (req, res) => {
  let {
    details,
    total_amount,
    phone_no,
    payment_mode,
    coupon,
    dob,
    state,
    city,
    locality,
    name,
    custom_discount,
    count,
  } = req.body;
  let totalAmount = 0;
  let user = await User.findOne({ phone_no });

  if (user && new Date(user.dob).getTime() !== new Date(dob).getTime()) {
    throw new ExpressError("DOB doesn't match", 400);
  }

  const first_name = name.split(" ")[0];
  const last_name = name.split(" ").slice(1).join(" ");

  if (!user) {
    user = new User({
      phone_no,
      dob: new Date(dob),
      state,
      city,
      locality,
      first_name,
      last_name,
    });
  }

  let total_coins = 0;

  const newDetails = await Promise.all(
    details.map(async (person) => {
      if (person.package) {
        const pack = await Package.findById(person.package);
        totalAmount += pack.price;
        total_coins += pack.coins;
      }
      if (!person.age) delete person.age;
      if (!person.name) delete person.name;
      if (!person.gender) delete person.gender;
      return person;
    })
  );

  user.funingo_money += total_coins;

  let isPremium = false;
  for (let data of user.premium || []) {
    if (new Date(data.expires_on) > Date.now()) {
      isPremium = true;
      break;
    }
  }
  if (isPremium) {
    totalAmount /= 2;
  }

  if (custom_discount) {
    totalAmount -= custom_discount;
  }

  if (coupon) {
    const discount = await calculateDiscountPrice({
      code: coupon,
      total_amount: totalAmount,
      updateCouponCount: true,
    });
    totalAmount -= discount.discount;
  }
  console.log("discount", { totalAmount });

  if (totalAmount !== total_amount) {
    throw new ExpressError("Total amount doesn't match", 400);
  }

  const new_short_id = new ShortUniqueId({
    dictionary: "number",
    // length: 3
  });

  const newTicket = new Ticket({
    fun_date: new Date(),
    total_amount,
    expired: false,
    payment_verified: true,
    details: newDetails,
    short_id: new_short_id(),
    user,
    payment_mode,
    phone_no: phone_no ?? "",
    custom_discount,
    count,
  });

  user.booked_tickets.push(newTicket);

  const transaction = new Transaction({
    user: user._id,
    coins: total_coins,
    type: "credit",
    description: "Purchased coins",
  });
  await transaction.save();

  await newTicket.save();
  await user.save();

  res.status(200).send({
    short_id: newTicket.short_id,
    success: true,
  });
};

export const checkActivityBooking = async (req, res) => {
  const { activity_name } = req.params;
  const activity = await Activity.findOne({ name: activity_name });

  if (!activity) {
    const activity = new Activity({ name: activity_name, bookings: 0 });
    await activity.save();
  }

  res.status(200).send({ success: true, bookings: activity?.bookings || 0 });
};

export const addComplementaryCoins = async (req, res) => {
  const { phone_no, coins } = req.body;
  const user = await User.findOne({ phone_no }).populate("booked_tickets");
  if (!user) {
    throw new ExpressError("User not found", 404);
  }

  const ticket = user.booked_tickets.slice(-1)[0];

  const ticket_date = new Date(ticket.fun_date);
  const current_date = new Date();

  if (
    ticket_date.getDate() !== current_date.getDate() ||
    ticket_date.getMonth() !== current_date.getMonth() ||
    ticket_date.getFullYear() !== current_date.getFullYear()
  ) {
    throw new ExpressError("Ticket is not for today", 400);
  }

  user.funingo_money += coins;
  await user.save();
  res.status(200).send({ success: true, coins: user.funingo_money });
};
