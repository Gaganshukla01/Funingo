// import QRTicket from '../../models/qr-ticket.js';
// import Ticket from '../../models/ticket.js';
// import User from '../../models/user.js';
// import { monthDataToGroupOfWeeks } from '../../utilities/utils.js';

// export const getStatistics = async (req, res) => {
//   const year = parseInt(req.query.year);
//   const month = parseInt(req.query.month ?? 0);
//   let payment_mode = req.query.payment_mode ?? 'razorpay,online,cash,card';
//   payment_mode = payment_mode?.split(',');

//   const { type = 'yearly' } = req.query; // [daywise, weekends, monthly, yearly]

//   let result;

//   if (type === 'yearly') {
//     result = await Ticket.aggregate([
//       {
//         $match: {
//           fun_date: {
//             $gte: new Date(`${year}-01-01T00:00:00.000Z`),
//             $lt: new Date(`${year + 1}-01-01T00:00:00.000Z`)
//           },
//           payment_mode: { $in: payment_mode },
//           payment_verified: true
//         }
//       },
//       {
//         $group: {
//           _id: {
//             month: { $month: '$fun_date' }
//           },
//           totalRevenue: { $sum: '$total_amount' },
//           totalCustomers: { $sum: { $size: '$details' } }
//         }
//       },
//       {
//         $sort: { '_id.month': 1 }
//       }
//     ]);
//   } else if (type === 'monthly') {
//     const startDate = new Date(year, month - 1, 1); // Month is zero-based
//     const endDate = new Date(year, month, 0); // Calculate the last day of the month

//     result = result = await Ticket.aggregate([
//       {
//         $match: {
//           fun_date: {
//             $gte: startDate,
//             $lte: endDate
//           },
//           payment_mode: { $in: payment_mode },
//           payment_verified: true
//         }
//       },
//       {
//         $group: {
//           _id: {
//             day: { $dayOfMonth: '$fun_date' }
//           },
//           totalRevenue: { $sum: '$total_amount' },
//           totalCustomers: { $sum: { $size: '$details' } }
//         }
//       },
//       {
//         $sort: { '_id.day': 1 }
//       }
//     ]);
//   } else if (type === 'weekends') {
//     result = [];

//     // Iterate through each month
//     for (let month = 1; month <= 12; month++) {
//       const startDate = new Date(year, month - 1, 1); // Start of the month
//       const endDate = new Date(year, month, 0); // End of the month

//       // Find weekends (Saturdays and Sundays) within the month
//       const weekends = [];
//       for (
//         let date = startDate;
//         date <= endDate;
//         date.setDate(date.getDate() + 1)
//       ) {
//         const dayOfWeek = date.getDay();
//         if (dayOfWeek === 0 || dayOfWeek === 6) {
//           weekends.push(new Date(date)); // Add weekend dates to the array
//         }
//       }

//       // Calculate the total revenue and total customers for each weekend in this month
//       const weekendData = await Promise.all(
//         weekends.map(async weekend => {
//           const startDate = new Date(weekend);
//           startDate.setUTCHours(0, 0, 0, 0);
//           const endDate = new Date(weekend);
//           endDate.setUTCHours(23, 59, 59, 999);

//           const pipeline = [
//             {
//               $match: {
//                 fun_date: {
//                   $gte: startDate,
//                   $lte: endDate
//                 },
//                 payment_mode: { $in: payment_mode }
//               }
//             },
//             {
//               $group: {
//                 _id: null,
//                 totalRevenue: { $sum: '$total_amount' },
//                 totalCustomers: { $sum: { $size: '$details' } }
//               }
//             }
//           ];

//           const data = await Ticket.aggregate(pipeline);
//           return {
//             date: weekend,
//             data: data[0] || { totalRevenue: 0, totalCustomers: 0 }
//           };
//         })
//       );

//       // Create a result object for this month
//       const monthResult = {
//         month: month,
//         year: year,
//         weekends: weekendData
//       };

//       result.push(monthResult);
//     }
//   } else {
//     const dayWiseData = [];

//     for (let month = 0; month < 12; month++) {
//       // Calculate the start and end dates for the current month
//       const startDate = new Date(year, month, 1);
//       const endDate = new Date(year, month + 1, 0);

//       // Group the data by the day of the week (0 = Sunday, 1 = Monday, etc.)
//       const dayData = await Ticket.aggregate([
//         {
//           $match: {
//             fun_date: {
//               $gte: startDate,
//               $lte: endDate
//             },
//             payment_mode: { $in: payment_mode },
//             payment_verified: true
//           }
//         },
//         {
//           $group: {
//             _id: { $dayOfWeek: '$fun_date' },
//             totalRevenue: { $sum: '$total_amount' },
//             totalCustomers: { $sum: { $size: '$details' } }
//           }
//         }
//       ]);

//       // Add the day-wise data to the array
//       dayWiseData.push({
//         month: month + 1, // Add 1 to month to match the human-readable month
//         data: dayData
//       });
//     }

//     result = dayWiseData;
//   }

//   res.status(200).send({
//     success: true,
//     result
//   });
// };

// export const checkConsent = async (req, res) => {
//   const { short_id } = req.params;
//   const ticket = await Ticket.findOne({ short_id });
//   res.status(200).send({
//     success: true,
//     ticket: ticket
//   });
// };

// export const getMonthlyStatistics = async (req, res) => {
//   const { years, is_premium = 'false' } = req.query;

//   // Convert years to an array of integers
//   const yearArray = years.split(',').map(Number);
//   const response = {};
//   for (let year of yearArray) {
//     const monthlyStatistics = await Ticket.aggregate([
//       {
//         $match: {
//           $and: [
//             {
//               fun_date: {
//                 $gte: new Date(year, 0, 1),
//                 $lt: new Date(year + 1, 0, 1)
//               }
//             },
//             {
//               is_premium: is_premium === 'true'
//             },
//             {
//               payment_verified: true
//             }
//           ]
//         }
//       },
//       {
//         $group: {
//           _id: {
//             year: { $year: '$fun_date' },
//             month: { $month: '$fun_date' }
//           },
//           total_revenue: { $sum: '$total_amount' }
//         }
//       },
//       {
//         $project: {
//           _id: 0,
//           month: '$_id.month',
//           total_revenue: 1
//         }
//       },
//       {
//         $sort: {
//           year: 1,
//           month: 1
//         }
//       }
//     ]);
//     response[year.toString()] = monthlyStatistics;
//   }

//   res.json(response);
// };

// export const getWeekendMonthlyStatistics = async (req, res) => {
//   let { months, year, is_premium = 'false' } = req.query;
//   const response = {};
//   months = months.split(',');
//   year = parseInt(year);

//   for (let month of months) {
//     // To make month 0 index
//     month -= 1;
//     const startDate = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
//     if (month === 11) {
//       month = 0;
//       year += 1;
//     } else {
//       month += 1;
//     }
//     const endDate = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));

//     const weekendRevenueComparison = await Ticket.aggregate([
//       {
//         $match: {}
//       },
//       {
//         $match: {
//           $and: [
//             {
//               fun_date: {
//                 $gte: startDate,
//                 $lt: endDate
//               }
//             },
//             {
//               is_premium: is_premium === 'true'
//             },
//             {
//               payment_verified: true
//             }
//           ]
//         }
//       },
//       {
//         $project: {
//           total_amount: 1,
//           dayOfWeek: { $dayOfWeek: '$fun_date' },
//           dayOfMonth: { $dayOfMonth: '$fun_date' },
//           month: { $month: '$fun_date' }
//         }
//       },
//       {
//         $match: {
//           dayOfWeek: { $in: [1, 7] } // Assuming 1 is Sunday and 7 is Saturday
//         }
//       },
//       {
//         $group: {
//           _id: {
//             month: '$month',
//             dayOfMonth: '$dayOfMonth'
//           },
//           total_revenue: { $sum: '$total_amount' }
//         }
//       },
//       {
//         $project: {
//           _id: 0,
//           month: '$_id.month',
//           dayOfMonth: '$_id.dayOfMonth',
//           dayOfWeek: '$_id.dayOfWeek',
//           total_revenue: 1
//         }
//       },
//       {
//         $sort: {
//           month: 1,
//           dayOfMonth: 1
//         }
//       }
//     ]);

//     response[`${startDate.getMonth() + 1}`] = monthDataToGroupOfWeeks(
//       weekendRevenueComparison
//     );
//   }

//   res.json(response);
// };

// export const getWeekdayMonthlyStatistics = async (req, res) => {
//   let { months, year, is_premium = 'false' } = req.query;
//   const response = {};
//   months = months.split(',');
//   year = parseInt(year);

//   for (let month of months) {
//     // To make month 0 index
//     month -= 1;
//     const startDate = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
//     if (month === 11) {
//       month = 0;
//       year += 1;
//     } else {
//       month += 1;
//     }
//     const endDate = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));

//     const weekdayRevenueComparison = await Ticket.aggregate([
//       {
//         $match: {
//           $and: [
//             {
//               fun_date: {
//                 $gte: startDate,
//                 $lt: endDate
//               }
//             },
//             {
//               is_premium: is_premium === 'true'
//             },
//             {
//               payment_verified: true
//             }
//           ]
//         }
//       },
//       {
//         $project: {
//           total_amount: 1,
//           dayOfWeek: { $dayOfWeek: '$fun_date' },
//           dayOfMonth: { $dayOfMonth: '$fun_date' },
//           month: { $month: '$fun_date' }
//         }
//       },
//       {
//         $match: {
//           dayOfWeek: { $in: [2, 3, 4, 5, 6] } // Assuming 1 is Sunday and 7 is Saturday
//         }
//       },
//       {
//         $group: {
//           _id: {
//             month: '$month',
//             dayOfMonth: '$dayOfMonth',
//             dayOfWeek: '$dayOfWeek'
//           },
//           total_revenue: { $sum: '$total_amount' }
//         }
//       },
//       {
//         $project: {
//           _id: 0,
//           month: '$_id.month',
//           dayOfMonth: '$_id.dayOfMonth',
//           dayOfWeek: '$_id.dayOfWeek',
//           total_revenue: 1
//         }
//       },
//       {
//         $sort: {
//           month: 1,
//           dayOfMonth: 1
//         }
//       }
//     ]);
//     response[`${startDate.getMonth() + 1}`] = monthDataToGroupOfWeeks(
//       weekdayRevenueComparison
//     );
//   }

//   res.json(response);
// };

// export const getBookingFrequency = async (req, res) => {
//   const { startDate, endDate, is_premium = 'false' } = req.query;

//   let bookingFrequencyWithUsers;
//   if (is_premium === 'false') {
//     const nonPremium = await Ticket.aggregate([
//       {
//         $match: {
//           $and: [
//             {
//               fun_date: {
//                 $gte: new Date(startDate),
//                 $lte: new Date(new Date(endDate).setHours(23, 59, 59))
//               }
//             },
//             {
//               is_premium: false
//             },
//             {
//               payment_verified: true
//             }
//           ]
//         }
//       },
//       {
//         $group: {
//           _id: '$user',
//           totalBookings: { $sum: 1 }
//         }
//       },
//       {
//         $group: {
//           _id: '$totalBookings',
//           userCount: { $sum: 1 },
//           users: {
//             $addToSet: '$_id' // Use $addToSet to collect unique user IDs
//           }
//         }
//       },
//       {
//         $lookup: {
//           from: 'users', // assuming 'users' is the name of the User model's collection
//           localField: 'users',
//           foreignField: '_id',
//           as: 'populatedUsers'
//         }
//       },
//       {
//         $project: {
//           repeatCount: '$_id',
//           userCount: 1,
//           populatedUsers: {
//             $map: {
//               input: '$populatedUsers',
//               as: 'user',
//               in: {
//                 first_name: '$$user.first_name',
//                 phone_no: '$$user.phone_no',
//                 email: '$$user.email'
//               }
//             }
//           }
//         }
//       },
//       {
//         $sort: {
//           repeatCount: 1
//         }
//       }
//     ]);
//     bookingFrequencyWithUsers = {
//       no_premium: nonPremium
//     };
//   } else {
//     const premium_50_1_year = await Ticket.aggregate([
//       {
//         $match: {
//           $and: [
//             {
//               fun_date: {
//                 $gte: new Date(startDate),
//                 $lte: new Date(new Date(endDate).setHours(23, 59, 59))
//               }
//             },
//             {
//               premium_types: {
//                 $elemMatch: {
//                   $eq: '50%-1_year'
//                 }
//               }
//             },
//             {
//               payment_verified: true
//             }
//           ]
//         }
//       },
//       {
//         $group: {
//           _id: '$user',
//           totalBookings: { $sum: 1 }
//         }
//       },
//       {
//         $group: {
//           _id: '$totalBookings',
//           userCount: { $sum: 1 },
//           users: {
//             $addToSet: '$_id' // Use $addToSet to collect unique user IDs
//           }
//         }
//       },
//       {
//         $lookup: {
//           from: 'users', // assuming 'users' is the name of the User model's collection
//           localField: 'users',
//           foreignField: '_id',
//           as: 'populatedUsers'
//         }
//       },
//       {
//         $project: {
//           repeatCount: '$_id',
//           userCount: 1,
//           populatedUsers: {
//             $map: {
//               input: '$populatedUsers',
//               as: 'user',
//               in: {
//                 first_name: '$$user.first_name',
//                 phone_no: '$$user.phone_no',
//                 email: '$$user.email'
//               }
//             }
//           }
//         }
//       },
//       {
//         $sort: {
//           repeatCount: 1
//         }
//       }
//     ]);
//     const premium_50_6_months = await Ticket.aggregate([
//       {
//         $match: {
//           $and: [
//             {
//               fun_date: {
//                 $gte: new Date(startDate),
//                 $lte: new Date(new Date(endDate).setHours(23, 59, 59))
//               }
//             },
//             {
//               premium_types: {
//                 $elemMatch: {
//                   $eq: '50%-6_months'
//                 }
//               }
//             },
//             {
//               payment_verified: true
//             }
//           ]
//         }
//       },
//       {
//         $group: {
//           _id: '$user',
//           totalBookings: { $sum: 1 }
//         }
//       },
//       {
//         $group: {
//           _id: '$totalBookings',
//           userCount: { $sum: 1 },
//           users: {
//             $addToSet: '$_id' // Use $addToSet to collect unique user IDs
//           }
//         }
//       },
//       {
//         $lookup: {
//           from: 'users', // assuming 'users' is the name of the User model's collection
//           localField: 'users',
//           foreignField: '_id',
//           as: 'populatedUsers'
//         }
//       },
//       {
//         $project: {
//           repeatCount: '$_id',
//           userCount: 1,
//           populatedUsers: {
//             $map: {
//               input: '$populatedUsers',
//               as: 'user',
//               in: {
//                 first_name: '$$user.first_name',
//                 phone_no: '$$user.phone_no',
//                 email: '$$user.email'
//               }
//             }
//           }
//         }
//       },
//       {
//         $sort: {
//           repeatCount: 1
//         }
//       }
//     ]);
//     const premium_50_100_years = await Ticket.aggregate([
//       {
//         $match: {
//           $and: [
//             {
//               fun_date: {
//                 $gte: new Date(startDate),
//                 $lte: new Date(new Date(endDate).setHours(23, 59, 59))
//               }
//             },
//             {
//               premium_types: {
//                 $elemMatch: {
//                   $eq: '50%-100_years'
//                 }
//               }
//             },
//             {
//               payment_verified: true
//             }
//           ]
//         }
//       },
//       {
//         $group: {
//           _id: '$user',
//           totalBookings: { $sum: 1 }
//         }
//       },
//       {
//         $group: {
//           _id: '$totalBookings',
//           userCount: { $sum: 1 },
//           users: {
//             $addToSet: '$_id' // Use $addToSet to collect unique user IDs
//           }
//         }
//       },
//       {
//         $lookup: {
//           from: 'users', // assuming 'users' is the name of the User model's collection
//           localField: 'users',
//           foreignField: '_id',
//           as: 'populatedUsers'
//         }
//       },
//       {
//         $project: {
//           repeatCount: '$_id',
//           userCount: 1,
//           populatedUsers: {
//             $map: {
//               input: '$populatedUsers',
//               as: 'user',
//               in: {
//                 first_name: '$$user.first_name',
//                 phone_no: '$$user.phone_no',
//                 email: '$$user.email'
//               }
//             }
//           }
//         }
//       },
//       {
//         $sort: {
//           repeatCount: 1
//         }
//       }
//     ]);
//     const premium_100_6_months = await Ticket.aggregate([
//       {
//         $match: {
//           $and: [
//             {
//               fun_date: {
//                 $gte: new Date(startDate),
//                 $lte: new Date(new Date(endDate).setHours(23, 59, 59))
//               }
//             },
//             {
//               premium_types: {
//                 $elemMatch: {
//                   $eq: '100%-6_months'
//                 }
//               }
//             }
//           ]
//         }
//       },
//       {
//         $group: {
//           _id: '$user',
//           totalBookings: { $sum: 1 }
//         }
//       },
//       {
//         $group: {
//           _id: '$totalBookings',
//           userCount: { $sum: 1 },
//           users: {
//             $addToSet: '$_id' // Use $addToSet to collect unique user IDs
//           }
//         }
//       },
//       {
//         $lookup: {
//           from: 'users', // assuming 'users' is the name of the User model's collection
//           localField: 'users',
//           foreignField: '_id',
//           as: 'populatedUsers'
//         }
//       },
//       {
//         $project: {
//           repeatCount: '$_id',
//           userCount: 1,
//           populatedUsers: {
//             $map: {
//               input: '$populatedUsers',
//               as: 'user',
//               in: {
//                 first_name: '$$user.first_name',
//                 phone_no: '$$user.phone_no',
//                 email: '$$user.email'
//               }
//             }
//           }
//         }
//       },
//       {
//         $sort: {
//           repeatCount: 1
//         }
//       }
//     ]);
//     const premium_100_1_year = await Ticket.aggregate([
//       {
//         $match: {
//           $and: [
//             {
//               fun_date: {
//                 $gte: new Date(startDate),
//                 $lte: new Date(new Date(endDate).setHours(23, 59, 59))
//               }
//             },
//             {
//               premium_types: {
//                 $elemMatch: {
//                   $eq: '100%-1_year'
//                 }
//               }
//             },
//             {
//               payment_verified: true
//             }
//           ]
//         }
//       },
//       {
//         $group: {
//           _id: '$user',
//           totalBookings: { $sum: 1 }
//         }
//       },
//       {
//         $group: {
//           _id: '$totalBookings',
//           userCount: { $sum: 1 },
//           users: {
//             $addToSet: '$_id' // Use $addToSet to collect unique user IDs
//           }
//         }
//       },
//       {
//         $lookup: {
//           from: 'users', // assuming 'users' is the name of the User model's collection
//           localField: 'users',
//           foreignField: '_id',
//           as: 'populatedUsers'
//         }
//       },
//       {
//         $project: {
//           repeatCount: '$_id',
//           userCount: 1,
//           populatedUsers: {
//             $map: {
//               input: '$populatedUsers',
//               as: 'user',
//               in: {
//                 first_name: '$$user.first_name',
//                 phone_no: '$$user.phone_no',
//                 email: '$$user.email'
//               }
//             }
//           }
//         }
//       },
//       {
//         $sort: {
//           repeatCount: 1
//         }
//       }
//     ]);
//     const premium_100_100_years = await Ticket.aggregate([
//       {
//         $match: {
//           $and: [
//             {
//               fun_date: {
//                 $gte: new Date(startDate),
//                 $lte: new Date(new Date(endDate).setHours(23, 59, 59))
//               }
//             },
//             {
//               premium_types: {
//                 $elemMatch: {
//                   $eq: '100%-100_years'
//                 }
//               }
//             },
//             {
//               payment_verified: true
//             }
//           ]
//         }
//       },
//       {
//         $group: {
//           _id: '$user',
//           totalBookings: { $sum: 1 }
//         }
//       },
//       {
//         $group: {
//           _id: '$totalBookings',
//           userCount: { $sum: 1 },
//           users: {
//             $addToSet: '$_id' // Use $addToSet to collect unique user IDs
//           }
//         }
//       },
//       {
//         $lookup: {
//           from: 'users', // assuming 'users' is the name of the User model's collection
//           localField: 'users',
//           foreignField: '_id',
//           as: 'populatedUsers'
//         }
//       },
//       {
//         $project: {
//           repeatCount: '$_id',
//           userCount: 1,
//           populatedUsers: {
//             $map: {
//               input: '$populatedUsers',
//               as: 'user',
//               in: {
//                 first_name: '$$user.first_name',
//                 phone_no: '$$user.phone_no',
//                 email: '$$user.email'
//               }
//             }
//           }
//         }
//       },
//       {
//         $sort: {
//           repeatCount: 1
//         }
//       }
//     ]);

//     bookingFrequencyWithUsers = {
//       '50%-6_months': premium_50_6_months,
//       '50%-1_year': premium_50_1_year,
//       '50%-100_years': premium_50_100_years,
//       '100%-6_months': premium_100_6_months,
//       '100%-1_year': premium_100_1_year,
//       '100%-100_years': premium_100_100_years
//     };
//   }

//   res.json(bookingFrequencyWithUsers);
// };

// export const playerAgeData = async (req, res) => {
//   const { startDate, endDate, is_premium = 'false' } = req.query;

//   const playerAgeData = await Ticket.aggregate([
//     {
//       $match: {
//         $and: [
//           {
//             fun_date: {
//               $gte: new Date(startDate),
//               $lte: new Date(new Date(endDate).setHours(23, 59, 59))
//             }
//           },
//           {
//             is_premium: is_premium === 'true'
//           },
//           {
//             payment_verified: true
//           }
//         ]
//       }
//     },
//     {
//       $unwind: '$details'
//     },
//     {
//       $group: {
//         _id: {
//           ageGroup: {
//             $cond: [
//               {
//                 $and: [
//                   { $lte: ['$details.age', 8] },
//                   { $gte: ['$details.age', 0] }
//                 ]
//               },
//               '0-7',
//               {
//                 $cond: [
//                   { $lte: ['$details.age', 12] },
//                   '8-12',
//                   {
//                     $cond: [
//                       { $lte: ['$details.age', 17] },
//                       '13-17',
//                       {
//                         $cond: [
//                           { $lte: ['$details.age', 22] },
//                           '18-22',
//                           {
//                             $cond: [
//                               { $lte: ['$details.age', 29] },
//                               '23-29',
//                               {
//                                 $cond: [
//                                   { $lte: ['$details.age', 40] },
//                                   '30-40',
//                                   {
//                                     $cond: [
//                                       { $lte: ['$details.age', 55] },
//                                       '41-55',
//                                       {
//                                         $cond: [
//                                           { $lte: ['$details.age', 67] },
//                                           '56-67',
//                                           {
//                                             $cond: [
//                                               { $lte: ['$details.age', 78] },
//                                               '68-78',
//                                               '79+'
//                                             ]
//                                           }
//                                         ]
//                                       }
//                                     ]
//                                   }
//                                 ]
//                               }
//                             ]
//                           }
//                         ]
//                       }
//                     ]
//                   }
//                 ]
//               }
//             ]
//           }
//         },
//         count: { $sum: 1 }
//       }
//     },
//     {
//       $project: {
//         _id: 0,
//         ageGroup: '$_id.ageGroup',
//         count: 1
//       }
//     }
//   ]);

//   res.status(200).send({
//     success: true,
//     playerAgeData
//   });
// };

// export const playerGenderData = async (req, res) => {
//   const { startDate, endDate, is_premium = 'false' } = req.query;
//   const playerGenderData = await Ticket.aggregate([
//     {
//       $match: {
//         $and: [
//           {
//             fun_date: {
//               $gte: new Date(startDate),
//               $lte: new Date(new Date(endDate).setHours(23, 59, 59))
//             }
//           },
//           {
//             is_premium: is_premium === 'true'
//           },
//           {
//             payment_verified: true
//           }
//         ]
//       }
//     },
//     {
//       $unwind: '$details'
//     },
//     {
//       $group: {
//         _id: '$details.gender',
//         count: { $sum: 1 }
//       }
//     },
//     {
//       $project: {
//         _id: 0,
//         gender: '$_id',
//         count: 1
//       }
//     }
//   ]);
//   res.status(200).send({
//     success: true,
//     playerGenderData
//   });
// };

// export const getUsersWRTFuningoMoney = async (req, res) => {
//   const users = await User.aggregate([
//     {
//       $group: {
//         _id: {
//           $switch: {
//             branches: [
//               { case: { $lt: ['$funingo_money', 500] }, then: '0-500' },
//               { case: { $lt: ['$funingo_money', 1000] }, then: '500-1000' },
//               { case: { $lt: ['$funingo_money', 1500] }, then: '1000-1500' },
//               { case: { $lt: ['$funingo_money', 2000] }, then: '1500-2000' }
//             ],
//             default: '2000+' // for funingo_money >= 2000
//           }
//         },
//         users: {
//           $push: {
//             first_name: '$first_name',
//             phone_no: '$phone_no',
//             email: '$email'
//           }
//         },
//         totalUsers: { $sum: 1 }
//       }
//     },
//     {
//       $project: {
//         _id: 0,
//         group: '$_id',
//         users: 1,
//         totalUsers: 1
//       }
//     },
//     {
//       $sort: { group: 1 }
//     }
//   ]);
//   res.status(200).send({
//     success: true,
//     users
//   });
// };

// export const getUsersWRTFreebies = async (req, res) => {
//   const currentDate = new Date();
//   const users = await User.aggregate([
//     {
//       $addFields: {
//         totalRed: {
//           $sum: {
//             $map: {
//               input: {
//                 $filter: {
//                   input: '$existing_flags',
//                   as: 'flag',
//                   cond: { $gt: ['$$flag.expires_on', currentDate] }
//                 }
//               },
//               as: 'filteredFlag',
//               in: '$$filteredFlag.red'
//             }
//           }
//         },
//         totalGreen: {
//           $sum: {
//             $map: {
//               input: {
//                 $filter: {
//                   input: '$existing_flags',
//                   as: 'flag',
//                   cond: { $gt: ['$$flag.expires_on', currentDate] }
//                 }
//               },
//               as: 'filteredFlag',
//               in: '$$filteredFlag.green'
//             }
//           }
//         },
//         totalYellow: {
//           $sum: {
//             $map: {
//               input: {
//                 $filter: {
//                   input: '$existing_flags',
//                   as: 'flag',
//                   cond: { $gt: ['$$flag.expires_on', currentDate] }
//                 }
//               },
//               as: 'filteredFlag',
//               in: '$$filteredFlag.yellow'
//             }
//           }
//         },
//         totalGolden: {
//           $sum: {
//             $map: {
//               input: {
//                 $filter: {
//                   input: '$existing_flags',
//                   as: 'flag',
//                   cond: { $gt: ['$$flag.expires_on', currentDate] }
//                 }
//               },
//               as: 'filteredFlag',
//               in: '$$filteredFlag.golden'
//             }
//           }
//         }
//       }
//     },
//     {
//       $addFields: {
//         totalFlags: {
//           $sum: ['$totalRed', '$totalGreen', '$totalYellow', '$totalGolden']
//         }
//       }
//     },
//     {
//       $match: {
//         totalFlags: { $gte: parseInt(2) }
//       }
//     },
//     {
//       $group: {
//         _id: {
//           $switch: {
//             branches: [
//               { case: { $lt: ['$totalFlags', 5] }, then: '0-5' },
//               { case: { $lt: ['$totalFlags', 10] }, then: '5-10' },
//               { case: { $lt: ['$totalFlags', 20] }, then: '10-20' },
//               { case: { $lt: ['$totalFlags', 30] }, then: '20-30' }
//             ],
//             default: '30+' // for totalFlags >= 30
//           }
//         },
//         users: {
//           $push: {
//             first_name: '$first_name',
//             phone_no: '$phone_no',
//             email: '$email'
//           }
//         },
//         totalUsers: { $sum: 1 }
//       }
//     },
//     {
//       $project: {
//         _id: 0,
//         group: '$_id',
//         users: 1,
//         totalUsers: 1
//       }
//     },
//     {
//       $sort: { group: 1 }
//     }
//   ]);

//   res.status(200).send({
//     success: true,
//     users
//   });
// };

// export const getAddedFreebies = async (req, res) => {
//   const { years, is_premium = 'false' } = req.query;

//   // Convert years to an array of integers
//   const yearArray = years.split(',').map(Number);
//   const response = {};
//   for (let year of yearArray) {
//     const monthlyFreebiesAdded = await QRTicket.aggregate([
//       {
//         $match: {
//           date: {
//             $gte: new Date(year, 0, 1),
//             $lt: new Date(year + 1, 0, 1)
//           },
//           ...(is_premium === 'true' && {
//             premium_discount: {
//               $in: ['50%', '100%'] // Filter by premium_discount values
//             }
//           })
//         }
//       },
//       {
//         $group: {
//           _id: {
//             year: { $year: '$date' },
//             month: { $month: '$date' }
//           },
//           red: { $sum: '$freebies_added.red' },
//           green: { $sum: '$freebies_added.green' },
//           yellow: { $sum: '$freebies_added.yellow' },
//           golden: { $sum: '$freebies_added.golden' },
//           total_tickets: { $sum: 1 }
//         }
//       },
//       {
//         $project: {
//           _id: 0,
//           red: 1,
//           green: 1,
//           yellow: 1,
//           golden: 1,
//           total_tickets: 1,
//           month: '$_id.month'
//         }
//       },
//       {
//         $sort: {
//           month: 1
//         }
//       }
//     ]);

//     response[year.toString()] = monthlyFreebiesAdded;
//   }

//   res.json(response);
// };

// export const usersWRTPremium = async (req, res) => {
//   const users = await User.aggregate([
//     {
//       $unwind: {
//         path: '$premium',
//         preserveNullAndEmptyArrays: true
//       }
//     },
//     {
//       $group: {
//         _id: {
//           premium_type: { $ifNull: ['$premium.premium_type', 'no_premium'] },
//           premium_duration: {
//             $ifNull: ['$premium.premium_duration', 'no_duration']
//           }
//         },
//         users: {
//           $push: {
//             first_name: '$first_name',
//             phone_no: '$phone_no',
//             email: '$email'
//           }
//         },
//         totalUsers: { $sum: 1 }
//       }
//     },
//     {
//       $project: {
//         _id: 0,
//         premium_type: '$_id.premium_type',
//         premium_duration: '$_id.premium_duration',
//         users: 1,
//         totalUsers: 1
//       }
//     }
//   ]);

//   res.status(200).send({
//     success: true,
//     users
//   });
// };

// export const userGenderDetails = async (req, res) => {
//   const users = await User.aggregate([
//     {
//       $group: {
//         _id: '$gender',
//         users: {
//           $push: {
//             first_name: '$first_name',
//             phone_no: '$phone_no',
//             email: '$email'
//           }
//         },
//         totalUsers: { $sum: 1 }
//       }
//     },
//     {
//       $project: {
//         _id: 0,
//         gender: '$_id',
//         users: 1,
//         totalUsers: 1
//       }
//     }
//   ]);
//   res.status(200).send({
//     success: true,
//     users
//   });
// };

// export const userLocationDetails = async (req, res) => {
//   const users = await User.aggregate([
//     {
//       $group: {
//         _id: {
//           city: {
//             $cond: [{ $eq: ['$city', 'Jabalpur'] }, '$locality', '$city']
//           }
//         },
//         totalUsers: { $sum: 1 },
//         users: {
//           $addToSet: {
//             phone_no: '$phone_no',
//             email: '$email',
//             first_name: '$first_name'
//           }
//         }
//       }
//     },
//     {
//       $project: {
//         _id: 0,
//         location: '$_id.city',
//         users: 1,
//         totalUsers: 1
//       }
//     }
//   ]);

//   res.status(200).send({
//     success: true,
//     users
//   });
// };

// export const spendingPerVisit = async (req, res) => {
//   const { startDate, endDate, is_premium = 'false' } = req.query;

//   const usersBySpending = await Ticket.aggregate([
//     {
//       $match: {
//         $and: [
//           {
//             fun_date: {
//               $gte: new Date(startDate),
//               $lte: new Date(new Date(endDate).setHours(23, 59, 59))
//             }
//           },
//           {
//             is_premium: is_premium === 'true'
//           },
//           {
//             payment_verified: true
//           }
//         ]
//       }
//     },
//     {
//       $lookup: {
//         from: 'users',
//         localField: 'user',
//         foreignField: '_id',
//         as: 'userDetails'
//       }
//     },
//     {
//       $unwind: '$userDetails'
//     },
//     {
//       $group: {
//         _id: '$userDetails',
//         totalSpending: { $sum: '$total_amount' },
//         visits: { $sum: 1 }
//       }
//     },
//     {
//       $addFields: {
//         spendingPerVisit: { $divide: ['$totalSpending', '$visits'] }
//       }
//     },
//     {
//       $group: {
//         _id: {
//           $switch: {
//             branches: [
//               { case: { $lt: ['$spendingPerVisit', 500] }, then: '0-500' },
//               { case: { $lt: ['$spendingPerVisit', 1000] }, then: '500-1000' },
//               { case: { $lt: ['$spendingPerVisit', 1500] }, then: '1000-1500' },
//               { case: { $lt: ['$spendingPerVisit', 2000] }, then: '1500-2000' }
//             ],
//             default: '2000+' // for spendingPerVisit >= 2000
//           }
//         },
//         users: {
//           $push: {
//             first_name: '$_id.first_name',
//             phone_no: '$_id.phone_no',
//             email: '$_id.email'
//           }
//         },
//         totalUsers: { $sum: 1 }
//       }
//     },
//     {
//       $project: {
//         _id: 0,
//         group: '$_id',
//         users: 1,
//         totalUsers: 1
//       }
//     },
//     {
//       $sort: { group: 1 }
//     }
//   ]);

//   res.status(200).send({
//     success: true,
//     users: usersBySpending
//   });
// };

// export const getPlayerAddedFreebies = async (req, res) => {
//   const { startDate, endDate, is_premium = 'false' } = req.query;

//   const data = await QRTicket.aggregate([
//     {
//       $match: {
//         date: {
//           $gte: new Date(startDate),
//           $lte: new Date(new Date(endDate).setHours(23, 59, 59))
//         },
//         ...(is_premium === 'true' && {
//           premium_discount: {
//             $in: ['50%', '100%'] // Filter by premium_discount values
//           }
//         })
//       }
//     },
//     {
//       $group: {
//         _id: null,
//         red: { $sum: '$freebies_added.red' },
//         green: { $sum: '$freebies_added.green' },
//         yellow: { $sum: '$freebies_added.yellow' },
//         golden: { $sum: '$freebies_added.golden' },
//         totalTickets: { $sum: 1 }
//       }
//     },
//     {
//       $project: {
//         _id: 0,
//         red: 1,
//         green: 1,
//         yellow: 1,
//         golden: 1,
//         totalTickets: 1
//       }
//     }
//   ]);

//   res.json({ success: true, data: data[0] });
// };

// export const usersWithUpcomingBday = async (req, res) => {
//   const { days_left } = req.query;

//   const bdayDate = new Date();
//   bdayDate.setDate(bdayDate.getDate() + parseInt(days_left));

//   const users = await User.aggregate([
//     {
//       $match: {
//         dob: {
//           $exists: true // Ensure dob field exists
//         }
//       }
//     },
//     {
//       $addFields: {
//         birthDate: { $dayOfMonth: '$dob' },
//         birthMonth: { $month: '$dob' }
//       }
//     },
//     {
//       $match: {
//         birthDate: bdayDate.getDate(),
//         birthMonth: bdayDate.getMonth() + 1
//       }
//     },
//     {
//       $project: {
//         _id: 0,
//         first_name: 1,
//         phone_no: 1,
//         email: 1,
//         dob: 1
//       }
//     }
//   ]);
//   res.status(200).send({
//     success: true,
//     users
//   });
// };











import QRTicket from '../../models/qr-ticket.js';
import Ticket from '../../models/ticket.js';
import User from '../../models/user.js';
import { monthDataToGroupOfWeeks } from '../../utilities/utils.js';
import Entry from '../../models/entry.js';

export const getStatistics = async (req, res) => {
  const year = parseInt(req.query.year);
  const month = parseInt(req.query.month ?? 0);
  let payment_mode = req.query.payment_mode ?? 'razorpay,online,cash,card';
  payment_mode = payment_mode?.split(',');

  const { type = 'yearly' } = req.query; // [daywise, weekends, monthly, yearly]

  let result;

  if (type === 'yearly') {
    result = await Ticket.aggregate([
      {
        $match: {
          fun_date: {
            $gte: new Date(`${year}-01-01T00:00:00.000Z`),
            $lt: new Date(`${year + 1}-01-01T00:00:00.000Z`)
          },
          payment_mode: { $in: payment_mode },
          payment_verified: true
        }
      },
      {
        $group: {
          _id: {
            month: { $month: '$fun_date' }
          },
          totalRevenue: { $sum: '$total_amount' },
          totalCustomers: { $sum: { $size: '$details' } }
        }
      },
      {
        $sort: { '_id.month': 1 }
      }
    ]);
  } else if (type === 'monthly') {
    const startDate = new Date(year, month - 1, 1); // Month is zero-based
    const endDate = new Date(year, month, 0); // Calculate the last day of the month

    result = result = await Ticket.aggregate([
      {
        $match: {
          fun_date: {
            $gte: startDate,
            $lte: endDate
          },
          payment_mode: { $in: payment_mode },
          payment_verified: true
        }
      },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: '$fun_date' }
          },
          totalRevenue: { $sum: '$total_amount' },
          totalCustomers: { $sum: { $size: '$details' } }
        }
      },
      {
        $sort: { '_id.day': 1 }
      }
    ]);
  } else if (type === 'weekends') {
    result = [];

    // Iterate through each month
    for (let month = 1; month <= 12; month++) {
      const startDate = new Date(year, month - 1, 1); // Start of the month
      const endDate = new Date(year, month, 0); // End of the month

      // Find weekends (Saturdays and Sundays) within the month
      const weekends = [];
      for (
        let date = startDate;
        date <= endDate;
        date.setDate(date.getDate() + 1)
      ) {
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          weekends.push(new Date(date)); // Add weekend dates to the array
        }
      }

      // Calculate the total revenue and total customers for each weekend in this month
      const weekendData = await Promise.all(
        weekends.map(async weekend => {
          const startDate = new Date(weekend);
          startDate.setUTCHours(0, 0, 0, 0);
          const endDate = new Date(weekend);
          endDate.setUTCHours(23, 59, 59, 999);

          const pipeline = [
            {
              $match: {
                fun_date: {
                  $gte: startDate,
                  $lte: endDate
                },
                payment_mode: { $in: payment_mode }
              }
            },
            {
              $group: {
                _id: null,
                totalRevenue: { $sum: '$total_amount' },
                totalCustomers: { $sum: { $size: '$details' } }
              }
            }
          ];

          const data = await Ticket.aggregate(pipeline);
          return {
            date: weekend,
            data: data[0] || { totalRevenue: 0, totalCustomers: 0 }
          };
        })
      );

      // Create a result object for this month
      const monthResult = {
        month: month,
        year: year,
        weekends: weekendData
      };

      result.push(monthResult);
    }
  } else {
    const dayWiseData = [];

    for (let month = 0; month < 12; month++) {
      // Calculate the start and end dates for the current month
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);

      // Group the data by the day of the week (0 = Sunday, 1 = Monday, etc.)
      const dayData = await Ticket.aggregate([
        {
          $match: {
            fun_date: {
              $gte: startDate,
              $lte: endDate
            },
            payment_mode: { $in: payment_mode },
            payment_verified: true
          }
        },
        {
          $group: {
            _id: { $dayOfWeek: '$fun_date' },
            totalRevenue: { $sum: '$total_amount' },
            totalCustomers: { $sum: { $size: '$details' } }
          }
        }
      ]);

      // Add the day-wise data to the array
      dayWiseData.push({
        month: month + 1, // Add 1 to month to match the human-readable month
        data: dayData
      });
    }

    result = dayWiseData;
  }

  res.status(200).send({
    success: true,
    result
  });
};

export const checkConsent = async (req, res) => {
  const { short_id } = req.params;
  const ticket = await Ticket.findOne({ short_id });
  res.status(200).send({
    success: true,
    ticket: ticket
  });
};

export const Getdetailfunction = async (req, res) => {
  console.log("entring");
  Ticket.find()
  .then(Ticket=>{console.log(Ticket);return res.json(Ticket)})
  .catch(err=>{console.log("error find ticket",err);return res.json(err)})
};

export const getMonthlyStatistics = async (req, res) => {
  const { years, is_premium = 'false' } = req.query;

  // Convert years to an array of integers
  const yearArray = years.split(',').map(Number);
  const response = {};
  for (let year of yearArray) {
    const monthlyStatistics = await Ticket.aggregate([
      {
        $match: {
          $and: [
            {
              fun_date: {
                $gte: new Date(year, 0, 1),
                $lt: new Date(year + 1, 0, 1)
              }
            },
            {
              is_premium: is_premium === 'true'
            },
            {
              payment_verified: true
            }
          ]
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$fun_date' },
            month: { $month: '$fun_date' }
          },
          total_revenue: { $sum: '$total_amount' }
        }
      },
      {
        $project: {
          _id: 0,
          month: '$_id.month',
          total_revenue: 1
        }
      },
      {
        $sort: {
          year: 1,
          month: 1
        }
      }
    ]);
    response[year.toString()] = monthlyStatistics;
  }

  res.json(response);
};

export const getWeekendMonthlyStatistics = async (req, res) => {
  let { months, year, is_premium = 'false' } = req.query;
  const response = {};
  months = months.split(',');
  year = parseInt(year);

  for (let month of months) {
    // To make month 0 index
    month -= 1;
    const startDate = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
    if (month === 11) {
      month = 0;
      year += 1;
    } else {
      month += 1;
    }
    const endDate = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));

    const weekendRevenueComparison = await Ticket.aggregate([
      {
        $match: {}
      },
      {
        $match: {
          $and: [
            {
              fun_date: {
                $gte: startDate,
                $lt: endDate
              }
            },
            {
              is_premium: is_premium === 'true'
            },
            {
              payment_verified: true
            }
          ]
        }
      },
      {
        $project: {
          total_amount: 1,
          dayOfWeek: { $dayOfWeek: '$fun_date' },
          dayOfMonth: { $dayOfMonth: '$fun_date' },
          month: { $month: '$fun_date' }
        }
      },
      {
        $match: {
          dayOfWeek: { $in: [1, 7] } // Assuming 1 is Sunday and 7 is Saturday
        }
      },
      {
        $group: {
          _id: {
            month: '$month',
            dayOfMonth: '$dayOfMonth'
          },
          total_revenue: { $sum: '$total_amount' }
        }
      },
      {
        $project: {
          _id: 0,
          month: '$_id.month',
          dayOfMonth: '$_id.dayOfMonth',
          dayOfWeek: '$_id.dayOfWeek',
          total_revenue: 1
        }
      },
      {
        $sort: {
          month: 1,
          dayOfMonth: 1
        }
      }
    ]);

    response[`${startDate.getMonth() + 1}`] = monthDataToGroupOfWeeks(
      weekendRevenueComparison
    );
  }

  res.json(response);
};

export const getWeekdayMonthlyStatistics = async (req, res) => {
  let { months, year, is_premium = 'false' } = req.query;
  const response = {};
  months = months.split(',');
  year = parseInt(year);

  for (let month of months) {
    // To make month 0 index
    month -= 1;
    const startDate = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
    if (month === 11) {
      month = 0;
      year += 1;
    } else {
      month += 1;
    }
    const endDate = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));

    const weekdayRevenueComparison = await Ticket.aggregate([
      {
        $match: {
          $and: [
            {
              fun_date: {
                $gte: startDate,
                $lt: endDate
              }
            },
            {
              is_premium: is_premium === 'true'
            },
            {
              payment_verified: true
            }
          ]
        }
      },
      {
        $project: {
          total_amount: 1,
          dayOfWeek: { $dayOfWeek: '$fun_date' },
          dayOfMonth: { $dayOfMonth: '$fun_date' },
          month: { $month: '$fun_date' }
        }
      },
      {
        $match: {
          dayOfWeek: { $in: [2, 3, 4, 5, 6] } // Assuming 1 is Sunday and 7 is Saturday
        }
      },
      {
        $group: {
          _id: {
            month: '$month',
            dayOfMonth: '$dayOfMonth',
            dayOfWeek: '$dayOfWeek'
          },
          total_revenue: { $sum: '$total_amount' }
        }
      },
      {
        $project: {
          _id: 0,
          month: '$_id.month',
          dayOfMonth: '$_id.dayOfMonth',
          dayOfWeek: '$_id.dayOfWeek',
          total_revenue: 1
        }
      },
      {
        $sort: {
          month: 1,
          dayOfMonth: 1
        }
      }
    ]);
    response[`${startDate.getMonth() + 1}`] = monthDataToGroupOfWeeks(
      weekdayRevenueComparison
    );
  }

  res.json(response);
};

export const getBookingFrequency = async (req, res) => {
  const { startDate, endDate, is_premium = 'false' } = req.query;

  let bookingFrequencyWithUsers;
  if (is_premium === 'false') {
    const nonPremium = await Ticket.aggregate([
      {
        $match: {
          $and: [
            {
              fun_date: {
                $gte: new Date(startDate),
                $lte: new Date(new Date(endDate).setHours(23, 59, 59))
              }
            },
            {
              is_premium: false
            },
            {
              payment_verified: true
            }
          ]
        }
      },
      {
        $group: {
          _id: '$user',
          totalBookings: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$totalBookings',
          userCount: { $sum: 1 },
          users: {
            $addToSet: '$_id' // Use $addToSet to collect unique user IDs
          }
        }
      },
      {
        $lookup: {
          from: 'users', // assuming 'users' is the name of the User model's collection
          localField: 'users',
          foreignField: '_id',
          as: 'populatedUsers'
        }
      },
      {
        $project: {
          repeatCount: '$_id',
          userCount: 1,
          populatedUsers: {
            $map: {
              input: '$populatedUsers',
              as: 'user',
              in: {
                first_name: '$$user.first_name',
                phone_no: '$$user.phone_no',
                email: '$$user.email'
              }
            }
          }
        }
      },
      {
        $sort: {
          repeatCount: 1
        }
      }
    ]);
    bookingFrequencyWithUsers = {
      no_premium: nonPremium
    };
  } else {
    const premium_50_1_year = await Ticket.aggregate([
      {
        $match: {
          $and: [
            {
              fun_date: {
                $gte: new Date(startDate),
                $lte: new Date(new Date(endDate).setHours(23, 59, 59))
              }
            },
            {
              premium_types: {
                $elemMatch: {
                  $eq: '50%-1_year'
                }
              }
            },
            {
              payment_verified: true
            }
          ]
        }
      },
      {
        $group: {
          _id: '$user',
          totalBookings: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$totalBookings',
          userCount: { $sum: 1 },
          users: {
            $addToSet: '$_id' // Use $addToSet to collect unique user IDs
          }
        }
      },
      {
        $lookup: {
          from: 'users', // assuming 'users' is the name of the User model's collection
          localField: 'users',
          foreignField: '_id',
          as: 'populatedUsers'
        }
      },
      {
        $project: {
          repeatCount: '$_id',
          userCount: 1,
          populatedUsers: {
            $map: {
              input: '$populatedUsers',
              as: 'user',
              in: {
                first_name: '$$user.first_name',
                phone_no: '$$user.phone_no',
                email: '$$user.email'
              }
            }
          }
        }
      },
      {
        $sort: {
          repeatCount: 1
        }
      }
    ]);
    const premium_50_6_months = await Ticket.aggregate([
      {
        $match: {
          $and: [
            {
              fun_date: {
                $gte: new Date(startDate),
                $lte: new Date(new Date(endDate).setHours(23, 59, 59))
              }
            },
            {
              premium_types: {
                $elemMatch: {
                  $eq: '50%-6_months'
                }
              }
            },
            {
              payment_verified: true
            }
          ]
        }
      },
      {
        $group: {
          _id: '$user',
          totalBookings: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$totalBookings',
          userCount: { $sum: 1 },
          users: {
            $addToSet: '$_id' // Use $addToSet to collect unique user IDs
          }
        }
      },
      {
        $lookup: {
          from: 'users', // assuming 'users' is the name of the User model's collection
          localField: 'users',
          foreignField: '_id',
          as: 'populatedUsers'
        }
      },
      {
        $project: {
          repeatCount: '$_id',
          userCount: 1,
          populatedUsers: {
            $map: {
              input: '$populatedUsers',
              as: 'user',
              in: {
                first_name: '$$user.first_name',
                phone_no: '$$user.phone_no',
                email: '$$user.email'
              }
            }
          }
        }
      },
      {
        $sort: {
          repeatCount: 1
        }
      }
    ]);
    const premium_50_100_years = await Ticket.aggregate([
      {
        $match: {
          $and: [
            {
              fun_date: {
                $gte: new Date(startDate),
                $lte: new Date(new Date(endDate).setHours(23, 59, 59))
              }
            },
            {
              premium_types: {
                $elemMatch: {
                  $eq: '50%-100_years'
                }
              }
            },
            {
              payment_verified: true
            }
          ]
        }
      },
      {
        $group: {
          _id: '$user',
          totalBookings: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$totalBookings',
          userCount: { $sum: 1 },
          users: {
            $addToSet: '$_id' // Use $addToSet to collect unique user IDs
          }
        }
      },
      {
        $lookup: {
          from: 'users', // assuming 'users' is the name of the User model's collection
          localField: 'users',
          foreignField: '_id',
          as: 'populatedUsers'
        }
      },
      {
        $project: {
          repeatCount: '$_id',
          userCount: 1,
          populatedUsers: {
            $map: {
              input: '$populatedUsers',
              as: 'user',
              in: {
                first_name: '$$user.first_name',
                phone_no: '$$user.phone_no',
                email: '$$user.email'
              }
            }
          }
        }
      },
      {
        $sort: {
          repeatCount: 1
        }
      }
    ]);
    const premium_100_6_months = await Ticket.aggregate([
      {
        $match: {
          $and: [
            {
              fun_date: {
                $gte: new Date(startDate),
                $lte: new Date(new Date(endDate).setHours(23, 59, 59))
              }
            },
            {
              premium_types: {
                $elemMatch: {
                  $eq: '100%-6_months'
                }
              }
            }
          ]
        }
      },
      {
        $group: {
          _id: '$user',
          totalBookings: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$totalBookings',
          userCount: { $sum: 1 },
          users: {
            $addToSet: '$_id' // Use $addToSet to collect unique user IDs
          }
        }
      },
      {
        $lookup: {
          from: 'users', // assuming 'users' is the name of the User model's collection
          localField: 'users',
          foreignField: '_id',
          as: 'populatedUsers'
        }
      },
      {
        $project: {
          repeatCount: '$_id',
          userCount: 1,
          populatedUsers: {
            $map: {
              input: '$populatedUsers',
              as: 'user',
              in: {
                first_name: '$$user.first_name',
                phone_no: '$$user.phone_no',
                email: '$$user.email'
              }
            }
          }
        }
      },
      {
        $sort: {
          repeatCount: 1
        }
      }
    ]);
    const premium_100_1_year = await Ticket.aggregate([
      {
        $match: {
          $and: [
            {
              fun_date: {
                $gte: new Date(startDate),
                $lte: new Date(new Date(endDate).setHours(23, 59, 59))
              }
            },
            {
              premium_types: {
                $elemMatch: {
                  $eq: '100%-1_year'
                }
              }
            },
            {
              payment_verified: true
            }
          ]
        }
      },
      {
        $group: {
          _id: '$user',
          totalBookings: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$totalBookings',
          userCount: { $sum: 1 },
          users: {
            $addToSet: '$_id' // Use $addToSet to collect unique user IDs
          }
        }
      },
      {
        $lookup: {
          from: 'users', // assuming 'users' is the name of the User model's collection
          localField: 'users',
          foreignField: '_id',
          as: 'populatedUsers'
        }
      },
      {
        $project: {
          repeatCount: '$_id',
          userCount: 1,
          populatedUsers: {
            $map: {
              input: '$populatedUsers',
              as: 'user',
              in: {
                first_name: '$$user.first_name',
                phone_no: '$$user.phone_no',
                email: '$$user.email'
              }
            }
          }
        }
      },
      {
        $sort: {
          repeatCount: 1
        }
      }
    ]);
    const premium_100_100_years = await Ticket.aggregate([
      {
        $match: {
          $and: [
            {
              fun_date: {
                $gte: new Date(startDate),
                $lte: new Date(new Date(endDate).setHours(23, 59, 59))
              }
            },
            {
              premium_types: {
                $elemMatch: {
                  $eq: '100%-100_years'
                }
              }
            },
            {
              payment_verified: true
            }
          ]
        }
      },
      {
        $group: {
          _id: '$user',
          totalBookings: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$totalBookings',
          userCount: { $sum: 1 },
          users: {
            $addToSet: '$_id' // Use $addToSet to collect unique user IDs
          }
        }
      },
      {
        $lookup: {
          from: 'users', // assuming 'users' is the name of the User model's collection
          localField: 'users',
          foreignField: '_id',
          as: 'populatedUsers'
        }
      },
      {
        $project: {
          repeatCount: '$_id',
          userCount: 1,
          populatedUsers: {
            $map: {
              input: '$populatedUsers',
              as: 'user',
              in: {
                first_name: '$$user.first_name',
                phone_no: '$$user.phone_no',
                email: '$$user.email'
              }
            }
          }
        }
      },
      {
        $sort: {
          repeatCount: 1
        }
      }
    ]);

    bookingFrequencyWithUsers = {
      '50%-6_months': premium_50_6_months,
      '50%-1_year': premium_50_1_year,
      '50%-100_years': premium_50_100_years,
      '100%-6_months': premium_100_6_months,
      '100%-1_year': premium_100_1_year,
      '100%-100_years': premium_100_100_years
    };
  }

  res.json(bookingFrequencyWithUsers);
};

export const playerAgeData = async (req, res) => {
  const { startDate, endDate, is_premium = 'false' } = req.query;

  const playerAgeData = await Ticket.aggregate([
    {
      $match: {
        $and: [
          {
            fun_date: {
              $gte: new Date(startDate),
              $lte: new Date(new Date(endDate).setHours(23, 59, 59))
            }
          },
          {
            is_premium: is_premium === 'true'
          },
          {
            payment_verified: true
          }
        ]
      }
    },
    {
      $unwind: '$details'
    },
    {
      $group: {
        _id: {
          ageGroup: {
            $cond: [
              {
                $and: [
                  { $lte: ['$details.age', 8] },
                  { $gte: ['$details.age', 0] }
                ]
              },
              '0-7',
              {
                $cond: [
                  { $lte: ['$details.age', 12] },
                  '8-12',
                  {
                    $cond: [
                      { $lte: ['$details.age', 17] },
                      '13-17',
                      {
                        $cond: [
                          { $lte: ['$details.age', 22] },
                          '18-22',
                          {
                            $cond: [
                              { $lte: ['$details.age', 29] },
                              '23-29',
                              {
                                $cond: [
                                  { $lte: ['$details.age', 40] },
                                  '30-40',
                                  {
                                    $cond: [
                                      { $lte: ['$details.age', 55] },
                                      '41-55',
                                      {
                                        $cond: [
                                          { $lte: ['$details.age', 67] },
                                          '56-67',
                                          {
                                            $cond: [
                                              { $lte: ['$details.age', 78] },
                                              '68-78',
                                              '79+'
                                            ]
                                          }
                                        ]
                                      }
                                    ]
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        ageGroup: '$_id.ageGroup',
        count: 1
      }
    }
  ]);

  res.status(200).send({
    success: true,
    playerAgeData
  });
};

export const playerGenderData = async (req, res) => {
  const { startDate, endDate, is_premium = 'false' } = req.query;
  const playerGenderData = await Ticket.aggregate([
    {
      $match: {
        $and: [
          {
            fun_date: {
              $gte: new Date(startDate),
              $lte: new Date(new Date(endDate).setHours(23, 59, 59))
            }
          },
          {
            is_premium: is_premium === 'true'
          },
          {
            payment_verified: true
          }
        ]
      }
    },
    {
      $unwind: '$details'
    },
    {
      $group: {
        _id: '$details.gender',
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        gender: '$_id',
        count: 1
      }
    }
  ]);
  res.status(200).send({
    success: true,
    playerGenderData
  });
};

export const getUsersWRTFuningoMoney = async (req, res) => {
  const users = await User.aggregate([
    {
      $group: {
        _id: {
          $switch: {
            branches: [
              { case: { $lt: ['$funingo_money', 500] }, then: '0-500' },
              { case: { $lt: ['$funingo_money', 1000] }, then: '500-1000' },
              { case: { $lt: ['$funingo_money', 1500] }, then: '1000-1500' },
              { case: { $lt: ['$funingo_money', 2000] }, then: '1500-2000' }
            ],
            default: '2000+' // for funingo_money >= 2000
          }
        },
        users: {
          $push: {
            first_name: '$first_name',
            phone_no: '$phone_no',
            email: '$email'
          }
        },
        totalUsers: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        group: '$_id',
        users: 1,
        totalUsers: 1
      }
    },
    {
      $sort: { group: 1 }
    }
  ]);
  res.status(200).send({
    success: true,
    users
  });
};

export const getUsersWRTFreebies = async (req, res) => {
  const currentDate = new Date();
  const users = await User.aggregate([
    {
      $addFields: {
        totalRed: {
          $sum: {
            $map: {
              input: {
                $filter: {
                  input: '$existing_flags',
                  as: 'flag',
                  cond: { $gt: ['$$flag.expires_on', currentDate] }
                }
              },
              as: 'filteredFlag',
              in: '$$filteredFlag.red'
            }
          }
        },
        totalGreen: {
          $sum: {
            $map: {
              input: {
                $filter: {
                  input: '$existing_flags',
                  as: 'flag',
                  cond: { $gt: ['$$flag.expires_on', currentDate] }
                }
              },
              as: 'filteredFlag',
              in: '$$filteredFlag.green'
            }
          }
        },
        totalYellow: {
          $sum: {
            $map: {
              input: {
                $filter: {
                  input: '$existing_flags',
                  as: 'flag',
                  cond: { $gt: ['$$flag.expires_on', currentDate] }
                }
              },
              as: 'filteredFlag',
              in: '$$filteredFlag.yellow'
            }
          }
        },
        totalGolden: {
          $sum: {
            $map: {
              input: {
                $filter: {
                  input: '$existing_flags',
                  as: 'flag',
                  cond: { $gt: ['$$flag.expires_on', currentDate] }
                }
              },
              as: 'filteredFlag',
              in: '$$filteredFlag.golden'
            }
          }
        }
      }
    },
    {
      $addFields: {
        totalFlags: {
          $sum: ['$totalRed', '$totalGreen', '$totalYellow', '$totalGolden']
        }
      }
    },
    {
      $match: {
        totalFlags: { $gte: parseInt(2) }
      }
    },
    {
      $group: {
        _id: {
          $switch: {
            branches: [
              { case: { $lt: ['$totalFlags', 5] }, then: '0-5' },
              { case: { $lt: ['$totalFlags', 10] }, then: '5-10' },
              { case: { $lt: ['$totalFlags', 20] }, then: '10-20' },
              { case: { $lt: ['$totalFlags', 30] }, then: '20-30' }
            ],
            default: '30+' // for totalFlags >= 30
          }
        },
        users: {
          $push: {
            first_name: '$first_name',
            phone_no: '$phone_no',
            email: '$email'
          }
        },
        totalUsers: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        group: '$_id',
        users: 1,
        totalUsers: 1
      }
    },
    {
      $sort: { group: 1 }
    }
  ]);

  res.status(200).send({
    success: true,
    users
  });
};

export const getAddedFreebies = async (req, res) => {
  const { years, is_premium = 'false' } = req.query;

  // Convert years to an array of integers
  const yearArray = years.split(',').map(Number);
  const response = {};
  for (let year of yearArray) {
    const monthlyFreebiesAdded = await QRTicket.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(year, 0, 1),
            $lt: new Date(year + 1, 0, 1)
          },
          ...(is_premium === 'true' && {
            premium_discount: {
              $in: ['50%', '100%'] // Filter by premium_discount values
            }
          })
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          red: { $sum: '$freebies_added.red' },
          green: { $sum: '$freebies_added.green' },
          yellow: { $sum: '$freebies_added.yellow' },
          golden: { $sum: '$freebies_added.golden' },
          total_tickets: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          red: 1,
          green: 1,
          yellow: 1,
          golden: 1,
          total_tickets: 1,
          month: '$_id.month'
        }
      },
      {
        $sort: {
          month: 1
        }
      }
    ]);

    response[year.toString()] = monthlyFreebiesAdded;
  }

  res.json(response);
};


// export const getAddedFreebies = async (req, res) => {
//   try {
//     const entries = await Entry.find({});
//     // console.log("entries",entries);
//     res.json(entries);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// };

export const usersWRTPremium = async (req, res) => {
  const users = await User.aggregate([
    {
      $unwind: {
        path: '$premium',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: {
          premium_type: { $ifNull: ['$premium.premium_type', 'no_premium'] },
          premium_duration: {
            $ifNull: ['$premium.premium_duration', 'no_duration']
          }
        },
        users: {
          $push: {
            first_name: '$first_name',
            phone_no: '$phone_no',
            email: '$email'
          }
        },
        totalUsers: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        premium_type: '$_id.premium_type',
        premium_duration: '$_id.premium_duration',
        users: 1,
        totalUsers: 1
      }
    }
  ]);

  res.status(200).send({
    success: true,
    users
  });
};

export const userGenderDetails = async (req, res) => {
  const users = await User.aggregate([
    {
      $group: {
        _id: '$gender',
        users: {
          $push: {
            first_name: '$first_name',
            phone_no: '$phone_no',
            email: '$email'
          }
        },
        totalUsers: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        gender: '$_id',
        users: 1,
        totalUsers: 1
      }
    }
  ]);
  res.status(200).send({
    success: true,
    users
  });
};

export const userLocationDetails = async (req, res) => {
  const users = await User.aggregate([
    {
      $group: {
        _id: {
          city: {
            $cond: [{ $eq: ['$city', 'Jabalpur'] }, '$locality', '$city']
          }
        },
        totalUsers: { $sum: 1 },
        users: {
          $addToSet: {
            phone_no: '$phone_no',
            email: '$email',
            first_name: '$first_name'
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        location: '$_id.city',
        users: 1,
        totalUsers: 1
      }
    }
  ]);

  res.status(200).send({
    success: true,
    users
  });
};

export const spendingPerVisit = async (req, res) => {
  const { startDate, endDate, is_premium = 'false' } = req.query;

  const usersBySpending = await Ticket.aggregate([
    {
      $match: {
        $and: [
          {
            fun_date: {
              $gte: new Date(startDate),
              $lte: new Date(new Date(endDate).setHours(23, 59, 59))
            }
          },
          {
            is_premium: is_premium === 'true'
          },
          {
            payment_verified: true
          }
        ]
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'userDetails'
      }
    },
    {
      $unwind: '$userDetails'
    },
    {
      $group: {
        _id: '$userDetails',
        totalSpending: { $sum: '$total_amount' },
        visits: { $sum: 1 }
      }
    },
    {
      $addFields: {
        spendingPerVisit: { $divide: ['$totalSpending', '$visits'] }
      }
    },
    {
      $group: {
        _id: {
          $switch: {
            branches: [
              { case: { $lt: ['$spendingPerVisit', 500] }, then: '0-500' },
              { case: { $lt: ['$spendingPerVisit', 1000] }, then: '500-1000' },
              { case: { $lt: ['$spendingPerVisit', 1500] }, then: '1000-1500' },
              { case: { $lt: ['$spendingPerVisit', 2000] }, then: '1500-2000' }
            ],
            default: '2000+' // for spendingPerVisit >= 2000
          }
        },
        users: {
          $push: {
            first_name: '$_id.first_name',
            phone_no: '$_id.phone_no',
            email: '$_id.email'
          }
        },
        totalUsers: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        group: '$_id',
        users: 1,
        totalUsers: 1
      }
    },
    {
      $sort: { group: 1 }
    }
  ]);

  res.status(200).send({
    success: true,
    users: usersBySpending
  });
};

export const getPlayerAddedFreebies = async (req, res) => {
  const { startDate, endDate, is_premium = 'false' } = req.query;

  const data = await QRTicket.aggregate([
    {
      $match: {
        date: {
          $gte: new Date(startDate),
          $lte: new Date(new Date(endDate).setHours(23, 59, 59))
        },
        ...(is_premium === 'true' && {
          premium_discount: {
            $in: ['50%', '100%'] // Filter by premium_discount values
          }
        })
      }
    },
    {
      $group: {
        _id: null,
        red: { $sum: '$freebies_added.red' },
        green: { $sum: '$freebies_added.green' },
        yellow: { $sum: '$freebies_added.yellow' },
        golden: { $sum: '$freebies_added.golden' },
        totalTickets: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        red: 1,
        green: 1,
        yellow: 1,
        golden: 1,
        totalTickets: 1
      }
    }
  ]);

  res.json({ success: true, data: data[0] });
};

export const usersWithUpcomingBday = async (req, res) => {
  const { days_left } = req.query;

  const bdayDate = new Date();
  bdayDate.setDate(bdayDate.getDate() + parseInt(days_left));

  const users = await User.aggregate([
    {
      $match: {
        dob: {
          $exists: true // Ensure dob field exists
        }
      }
    },
    {
      $addFields: {
        birthDate: { $dayOfMonth: '$dob' },
        birthMonth: { $month: '$dob' }
      }
    },
    {
      $match: {
        birthDate: bdayDate.getDate(),
        birthMonth: bdayDate.getMonth() + 1
      }
    },
    {
      $project: {
        _id: 0,
        first_name: 1,
        phone_no: 1,
        email: 1,
        dob: 1
      }
    }
  ]);
  res.status(200).send({
    success: true,
    users
  });
};
