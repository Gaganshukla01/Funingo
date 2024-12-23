import { json2csv } from "json-2-csv";

import { PutObjectCommand } from "@aws-sdk/client-s3";

import { s3_client } from "../../index.js";

import Ticket from "../../models/ticket.js";
import Transaction from "../../models/transaction.js";
import { generatePresignedUrl } from "../../utilities/utils.js";

export const revenueTransactionSplit = async (req, res) => {
  const { start_date, end_date } = req.query;

  const endDate = new Date(end_date);

  const endDateUTC =
    new Date(
      Date.UTC(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate(),
        23,
        59,
        59,
        999
      )
    ) ?? new Date();

  const filter = {
    fun_date: {
      $gte: new Date(start_date) ?? new Date(0),
      $lte: endDateUTC,
    },
  };

  const pipeline = [
    {
      $match: filter,
    },
    {
      $group: {
        _id: "$payment_mode",
        total_amount: { $sum: "$total_amount" },
      },
    },
    {
      $project: {
        _id: 1,
        total_amount: 1,
      },
    },
  ];

  const result = await Ticket.aggregate(pipeline);

  res.status(200).send({
    success: true,
    result,
  });
};

export const activityUsage = async (req, res) => {
  const { start_date, end_date } = req.query;

  const endDate = new Date(end_date);

  const endDateUTC =
    new Date(
      Date.UTC(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate(),
        23,
        59,
        59,
        999
      )
    ) ?? new Date();

  const filter = {
    createdAt: {
      $gte: new Date(start_date) ?? new Date(0),
      $lte: endDateUTC,
    },
    activity: { $ne: null },
  };

  const pipeline = [
    {
      $match: filter,
    },
    {
      $group: {
        _id: "$activity",
        total_coins: { $sum: "$coins" },
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "activities",
        localField: "_id",
        foreignField: "_id",
        as: "activity",
        pipeline: [{ $project: { name: 1 } }],
      },
    },
    {
      $project: {
        _id: 1,
        total_coins: 1,
        count: 1,
        activity_name: { $arrayElemAt: ["$activity.name", 0] },
      },
    },
  ];

  const result = await Transaction.aggregate(pipeline);

  res.status(200).send({
    success: true,
    result,
  });
};

export const userFrequency = async (req, res) => {
  const {
    start_date,
    end_date,
    limit = 10,
    offset = 0,
    sort = "desc",
    min_age = 0,
    max_age = 100,
    phone_no = "",
  } = req.query;
  const endDate = new Date(end_date);
  const endDateUTC =
    new Date(
      Date.UTC(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate(),
        23,
        59,
        59,
        999
      )
    ) ?? new Date();

  const all_filter = {
    fun_date: {
      $gte: new Date(start_date) ?? new Date(0),
      $lte: endDateUTC,
    },
    user: { $ne: null },
  };

  const pipeline = [
    {
      $match: all_filter,
    },
    {
      $group: {
        _id: "$user",
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        count: sort === "desc" ? -1 : 1,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
        pipeline: [
          {
            $project: {
              first_name: 1,
              last_name: 1,
              phone_no: 1,
              dob: 1,
              funingo_money: 1,
            },
          },
        ],
      },
    },
    {
      $match: {
        "user.dob": {
          $gte: new Date(
            new Date().setFullYear(new Date().getFullYear() - max_age)
          ),
          $lte: new Date(
            new Date().setFullYear(new Date().getFullYear() - min_age)
          ),
        },
        ...(phone_no ? { "user.phone_no": { $regex: phone_no } } : {}),
      },
    },
    {
      $skip: parseInt(offset),
    },
    {
      $limit: parseInt(limit),
    },
    {
      $project: {
        _id: 1,
        count: 1,
        first_name: { $arrayElemAt: ["$user.first_name", 0] },
        last_name: { $arrayElemAt: ["$user.last_name", 0] },
        phone_no: { $arrayElemAt: ["$user.phone_no", 0] },
        dob: { $arrayElemAt: ["$user.dob", 0] },
        funingo_money: { $arrayElemAt: ["$user.funingo_money", 0] },
      },
    },
  ];

  const total_pages_pipeline = [
    {
      $match: all_filter,
    },
    {
      $group: {
        _id: "$user",
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
        pipeline: [{ $project: { phone_no: 1, dob: 1 } }],
      },
    },
    {
      $match: {
        "user.dob": {
          $gte: new Date(
            new Date().setFullYear(new Date().getFullYear() - max_age)
          ),
          $lte: new Date(
            new Date().setFullYear(new Date().getFullYear() - min_age)
          ),
        },
        ...(phone_no ? { "user.phone_no": { $regex: phone_no } } : {}),
      },
    },
    {
      $project: {
        _id: 1,
      },
    },
  ];

  const totalPages = await Ticket.aggregate(total_pages_pipeline);

  const result = await Ticket.aggregate(pipeline);

  res.status(200).send({
    success: true,
    result,
    totalPages: Math.ceil(totalPages.length / parseInt(limit)),
  });
};

export const downloadUserData = async (req, res) => {
  const { start_date, end_date } = req.query;
  const endDate = new Date(end_date);

  const endDateUTC =
    new Date(
      Date.UTC(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate(),
        23,
        59,
        59,
        999
      )
    ) ?? new Date();

  const all_filter = {
    fun_date: {
      $gte: new Date(start_date) ?? new Date(0),
      $lte: endDateUTC,
    },
    user: { $ne: null },
  };

  const pipeline = [
    {
      $match: all_filter,
    },
    {
      $group: {
        _id: "$user",
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
        pipeline: [
          {
            $project: {
              first_name: 1,
              last_name: 1,
              phone_no: 1,
              dob: 1,
              gender: 1,
              city: 1,
              state: 1,
              locality: 1,
              email: 1,
              funingo_money: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 1,
        count: 1,
        first_name: { $arrayElemAt: ["$user.first_name", 0] },
        last_name: { $arrayElemAt: ["$user.last_name", 0] },
        phone_no: { $arrayElemAt: ["$user.phone_no", 0] },
        email: { $arrayElemAt: ["$user.email", 0] },
        dob: { $arrayElemAt: ["$user.dob", 0] },
        gender: { $arrayElemAt: ["$user.gender", 0] },
        city: { $arrayElemAt: ["$user.city", 0] },
        state: { $arrayElemAt: ["$user.state", 0] },
        locality: { $arrayElemAt: ["$user.locality", 0] },
        funingo_money: { $arrayElemAt: ["$user.funingo_money", 0] },
      },
    },
  ];

  const result = await Ticket.aggregate(pipeline);

  const csv = json2csv(result, {
    emptyFieldValue: "-",
  });

  const file_name = `user-data-${Date.now()}.csv`;
  const bucket_name = "funingo-user-data-csv-1";

  const command = new PutObjectCommand({
    Bucket: bucket_name,
    Key: file_name,
    Body: csv,
    ContentType: "text/csv",
  });

  await s3_client.send(command);

  const url = await generatePresignedUrl(bucket_name, file_name);

  res.status(200).send({
    success: true,
    url,
  });
};

export const getCoinsPerPerson = async (req, res) => {
  const { start_date, end_date } = req.query;

  const endDate = new Date(end_date);

  const endDateUTC =
    new Date(
      Date.UTC(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate(),
        23,
        59,
        59,
        999
      )
    ) ?? new Date();

  const pipeline = [
    {
      $match: {
        type: "credit",
        createdAt: {
          $gte: new Date(start_date) ?? new Date(0),
          $lte: endDateUTC,
        },
      },
    },
    {
      $group: {
        _id: "$user",
        total_coins: { $sum: "$coins" },
      },
    },
  ];

  const result = await Transaction.aggregate(pipeline);

  const total_coins = result.reduce((acc, curr) => acc + curr.total_coins, 0);
  const total_users = result.length;

  res.status(200).send({
    success: true,
    total_coins,
    total_users,
    coins_per_user: Math.round(total_coins / total_users),
  });
};

export const downlaodDailySales = async (req, res) => {
  const { start_date, end_date } = req.query;

  const endDate = new Date(end_date);

  const endDateUTC =
    new Date(
      Date.UTC(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate(),
        23,
        59,
        59,
        999
      )
    ) ?? new Date();

  const all_filter = {
    fun_date: {
      $gte: new Date(start_date) ?? new Date(0),
      $lte: endDateUTC,
    },
    user: { $ne: null },
  };

  const pipeline = [
    {
      $match: all_filter,
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$fun_date" } },
          payment_mode: "$payment_mode",
        },
        total_amount: { $sum: "$total_amount" },
      },
    },
    {
      $sort: {
        "_id.date": 1,
        "_id.payment_mode": 1,
      },
    },
  ];

  const result = await Ticket.aggregate(pipeline);

  // Transform the result into a 2D array
  const dates = [...new Set(result.map((item) => item._id.date))];
  const paymentModes = [
    ...new Set(result.map((item) => item._id.payment_mode)),
  ];

  const dataMatrix = dates.map((date) => {
    const row = { date };
    paymentModes.forEach((mode) => {
      const entry = result.find(
        (item) => item._id.date === date && item._id.payment_mode === mode
      );
      row[mode] = entry ? entry.total_amount : 0;
    });
    return row;
  });

  const csv = json2csv(dataMatrix, {
    emptyFieldValue: "-",
  });

  const file_name = `sales/sales-data-${Date.now()}.csv`;
  const bucket_name = "funingo-user-data-csv-1";

  const command = new PutObjectCommand({
    Bucket: bucket_name,
    Key: file_name,
    Body: csv,
    ContentType: "text/csv",
  });

  await s3_client.send(command);

  const url = await generatePresignedUrl(bucket_name, file_name);

  res.status(200).send({
    success: true,
    url,
  });
};
