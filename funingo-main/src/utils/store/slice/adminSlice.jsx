import { createSlice } from '@reduxjs/toolkit';
import { getAllFranchises } from '../../../actions/franchise';
import { fetchApplication } from '../../../actions/career';
import {
  getAddedFreebies,
  getBookingFrequency,
  getDemographics,
  getMonthlyStats,
  getPlayerAddedFreebies,
  getPlayerAgeDetails,
  getPlayerGenderDetails,
  getUserGenderDetails,
  getUserLocationDetails,
  getUserSpendingLimit,
  getUsersWRTFM,
  getUsersWRTFreebies,
  getUsersWRTPremium,
  getWeekdayData,
  getWeekendData,
  usersWithUpcomingBday
} from '../../../actions/admin';

const adminSlice = createSlice({
  name: 'adminSlice',
  initialState: {
    franchises: [],
    careerApplications: [],
    monthlyStats: {},
    weekdayStats: {},
    weekendStats: {},
    repeatRateData: [],
    demographicsData: {},
    addedFreebies: {},
    userBase: {
      premiumUserData: [],
      genderData: [],
      locationData: [],
      funingoMoneyData: [],
      freebiesData: [],
      spendingPerVisitData: [],
      bookingFreqData: {}
    },
    playerBase: {
      ageData: [],
      genderData: [],
      freebiesData: {}
    },
    upcomingBdays: []
  },
  reducers: {
    updatePhoneNumbers: (state, action) => {
      state.phone_numbers = action.payload;
    },
    clearUpcomingBdays: state => {
      state.upcomingBdays = [];
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getAllFranchises.fulfilled, (state, action) => {
        if (action.payload.success)
          state.franchises = action.payload.franchises;
      })
      .addCase(fetchApplication.fulfilled, (state, action) => {
        if (action.payload.success)
          state.careerApplications = action.payload.applications;
      })
      .addCase(getMonthlyStats.fulfilled, (state, action) => {
        state.monthlyStats = action.payload;
      })
      .addCase(getWeekendData.fulfilled, (state, action) => {
        state.weekendStats = action.payload;
      })
      .addCase(getWeekdayData.fulfilled, (state, action) => {
        state.weekdayStats = action.payload;
      })
      .addCase(getDemographics.fulfilled, (state, action) => {
        state.demographicsData = action.payload;
      })
      .addCase(getAddedFreebies.fulfilled, (state, action) => {
        state.addedFreebies = action.payload;
      })
      .addCase(usersWithUpcomingBday.fulfilled, (state, action) => {
        state.upcomingBdays = action.payload.users;
      })
      // user base
      .addCase(getUsersWRTPremium.fulfilled, (state, action) => {
        state.userBase.premiumUserData = action.payload.users;
      })
      .addCase(getUserGenderDetails.fulfilled, (state, action) => {
        state.userBase.genderData = action.payload.users;
      })
      .addCase(getUserLocationDetails.fulfilled, (state, action) => {
        state.userBase.locationData = action.payload.users;
      })
      .addCase(getUsersWRTFM.fulfilled, (state, action) => {
        state.userBase.funingoMoneyData = action.payload.users;
      })
      .addCase(getUsersWRTFreebies.fulfilled, (state, action) => {
        state.userBase.freebiesData = action.payload.users;
      })
      .addCase(getUserSpendingLimit.fulfilled, (state, action) => {
        state.userBase.spendingPerVisitData = action.payload.users;
      })
      .addCase(getBookingFrequency.fulfilled, (state, action) => {
        state.userBase.bookingFreqData = action.payload;
      })
      // Player base
      .addCase(getPlayerGenderDetails.fulfilled, (state, action) => {
        state.playerBase.genderData = action.payload.playerGenderData;
      })
      .addCase(getPlayerAgeDetails.fulfilled, (state, action) => {
        state.playerBase.ageData = action.payload.playerAgeData;
      })
      .addCase(getPlayerAddedFreebies.fulfilled, (state, action) => {
        state.playerBase.freebiesData = action.payload.data;
      });
  }
});

export const { clearUpcomingBdays, updatePhoneNumbers } = adminSlice.actions;
export default adminSlice.reducer;
