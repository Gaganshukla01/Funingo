import express from 'express';
import catchAsync from '../../utilities/catch-async.js';
import { authenticateAdmin } from '../../middleware.js';
import {
  checkConsent,
  getAddedFreebies,
  getBookingFrequency,
  getMonthlyStatistics,
  getPlayerAddedFreebies,
  getStatistics,
  getUsersWRTFreebies,
  getUsersWRTFuningoMoney,
  getWeekdayMonthlyStatistics,
  getWeekendMonthlyStatistics,
  playerAgeData,
  playerGenderData,
  spendingPerVisit,
  userGenderDetails,
  userLocationDetails,
  usersWRTPremium,
  usersWithUpcomingBday,
  Getdetailfunction
} from '../../controllers/admin/index.js';

const router = express.Router();

router.get('/get-stats', authenticateAdmin, catchAsync(getStatistics));
router.get(
  '/check-consent/:short_id',
  authenticateAdmin,
  catchAsync(checkConsent)
);

router.get(
  '/monthly-stats',
  authenticateAdmin,
  catchAsync(getMonthlyStatistics)
);
router.get(
  '/weekend-stats',
  authenticateAdmin,
  catchAsync(getWeekendMonthlyStatistics)
);
router.get(
  '/weekday-stats',
  authenticateAdmin,
  catchAsync(getWeekdayMonthlyStatistics)
);
router.get(
  '/getDetails',
  authenticateAdmin,
  catchAsync(Getdetailfunction)
);
router.get(
  '/booking-frequency',
  authenticateAdmin,
  catchAsync(getBookingFrequency)
);
router.get(
  '/users-wrt-fm',
  authenticateAdmin,
  catchAsync(getUsersWRTFuningoMoney)
);
router.get(
  '/users-wrt-freebies',
  authenticateAdmin,
  catchAsync(getUsersWRTFreebies)
);

router.get(
  '/users-wrt-premium',
  authenticateAdmin,
  catchAsync(usersWRTPremium)
);

router.get(
  '/user-gender-details',
  authenticateAdmin,
  catchAsync(userGenderDetails)
);

router.get(
  '/user-location-details',
  authenticateAdmin,
  catchAsync(userLocationDetails)
);
router.get(
  '/spending-per-visit',
  authenticateAdmin,
  catchAsync(spendingPerVisit)
);

router.get(
  '/player-gender-data',
  authenticateAdmin,
  catchAsync(playerGenderData)
);

router.get('/player-age-data', authenticateAdmin, catchAsync(playerAgeData));

router.get('/added-freebies', authenticateAdmin, catchAsync(getAddedFreebies));

router.get(
  '/player-added-freebies',
  authenticateAdmin,
  catchAsync(getPlayerAddedFreebies)
);

router.get(
  '/upcoming-bday',
  authenticateAdmin,
  catchAsync(usersWithUpcomingBday)
);

export default router;
