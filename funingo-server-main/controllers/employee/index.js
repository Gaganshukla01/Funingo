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
import { error } from "console";

export const bookTicket = async (req, res) => {
  
  let {
    details,
    total_amount,
    cash_amount,
    online_amount,
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

  console.log("Received details:", JSON.stringify(details, null, 2));

  let totalAmount = 0;
  let user = await User.findOne({ phone_no });

  if (
    user &&
    user.dob &&
    new Date(user.dob).getTime() !== new Date(dob).getTime()
  ) {
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
  let hasUnlimitedPackage = false;
  let regularPackageProcessed = false; // Flag to track if regular package is already processed

  const newDetails = await Promise.all(
    details.map(async (person) => {
      console.log("Processing person:", person);

      if (person.packageType === "unlimited" && person.unlimitedPackageData) {
        hasUnlimitedPackage = true;

        const unlimitedPrice = parseInt(person.unlimitedPackageData.price) || 0;
        totalAmount += unlimitedPrice;

        total_coins += 0;

        console.log("Added unlimited package price:", unlimitedPrice);
      } else if (person.package && !regularPackageProcessed) {
        // Only process regular package once
        console.log("Processing regular package:", person.package);

        const pack = await Package.findById(person.package);
        if (pack) {
          totalAmount += pack.price; // Add price only once
          total_coins += pack.coins; // Add coins only once
          regularPackageProcessed = true; // Mark as processed
          console.log("Added regular package price (once):", pack.price);
        }
      }

      if (!person.age) delete person.age;
      if (!person.person_name) delete person.person_name;
      if (!person.gender) delete person.gender;

      return person;
    })
  );

  console.log("Total amount before discounts:", totalAmount);

  user.funingo_money += total_coins;

  let isPremium = false;
  for (let data of user.premium || []) {
    if (new Date(data.expires_on) > Date.now()) {
      isPremium = true;
      break;
    }
  }

  if (isPremium) {
    totalAmount = Math.floor(totalAmount / 2);
    console.log("Applied premium discount, new total:", totalAmount);
  }

  if (custom_discount) {
    totalAmount -= parseInt(custom_discount);
    console.log(
      "Applied custom discount:",
      custom_discount,
      "New total:",
      totalAmount
    );
  }

  if (coupon) {
    const discount = await calculateDiscountPrice({
      code: coupon,
      total_amount: totalAmount,
      updateCouponCount: true,
    });
    totalAmount -= discount.discount;
    console.log(
      "Applied coupon discount:",
      discount.discount,
      "New total:",
      totalAmount
    );
  }

  console.log("Final calculated total:", totalAmount);
  console.log("Received total_amount:", total_amount);

  if (Math.abs(totalAmount - total_amount) > 0.01) {
    throw new ExpressError(
      `Total amount doesn't match. Calculated: ${totalAmount}, Received: ${total_amount}`,
      400
    );
  }

  const new_short_id = new ShortUniqueId({
    dictionary: "number",
  });

  const newTicket = new Ticket({
    fun_date: new Date(),
    total_amount: total_amount,
    cash_amount,
    online_amount,
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

  const transactionDescription = hasUnlimitedPackage
    ? "UNLIMITED PACKAGE"
    : "Purchased coins";

  const transaction = new Transaction({
    user: user._id,
    coins: total_coins,
    type: "credit",
    description: transactionDescription,
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
  const { phone_no, coins, description } = req.body;

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
  let details=description+" (Complementary Coins)"
  user.funingo_money += coins;
  await user.save();
  const transaction = new Transaction({
    user: user._id,
    coins: coins,
    type: "credit",
    description: details,
  });

  await transaction.save();

  res.status(200).send({ success: true, coins: user.funingo_money });
};

export const addActivity = async (req, res) => {
  try {
    const { name, coins_required } = req.body;
    if (!name && !coins_required) {
      return res.json({ success: false, message: "Please Enter Details" });
    }

    const activity = new Activity({
      name: name,
      coins_required: coins_required,
    });
    await activity.save();
    return res.json({ success: true, message: activity });
  } catch {
    return res.json({ success: false, message: error });
  }
};

export const activityFetch = async (req, res) => {
  try {
    const activities = await Activity.find();
    res.json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
