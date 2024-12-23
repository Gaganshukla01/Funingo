import { createSlice } from "@reduxjs/toolkit";
import {
  getActivityUsage,
  getCoinsPerPerson,
  downloadUserData,
  getUserFrequency,
  getRevenueTransactionSplit,
} from "../../../actions/new-stats";

const initialState = {
  activityUsage: [],
  coinsPerPerson: {},
  userFrequency: {},
  revenueTransactionSplit: [],
  downloadUrl: "",
  loading: false,
};

const statsSlice = createSlice({
  name: "stats",
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getActivityUsage.fulfilled, (state, action) => {
        state.activityUsage = action.payload.result;
        state.loading = false;
      })
      .addCase(getCoinsPerPerson.fulfilled, (state, action) => {
        state.coinsPerPerson = action.payload;
        state.loading = false;
      })
      .addCase(getUserFrequency.fulfilled, (state, action) => {
        state.userFrequency = action.payload;
        state.loading = false;
      })
      .addCase(getRevenueTransactionSplit.fulfilled, (state, action) => {
        state.revenueTransactionSplit = action.payload.result;
        state.loading = false;
      })
      .addCase(downloadUserData.fulfilled, (state, action) => {
        state.downloadUrl = action.payload?.url;
        state.loading = false;
      })
      .addCase(downloadUserData.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(downloadUserData.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(getUserFrequency.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getUserFrequency.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(getActivityUsage.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getActivityUsage.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(getCoinsPerPerson.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getCoinsPerPerson.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(getRevenueTransactionSplit.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getRevenueTransactionSplit.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export default statsSlice.reducer;
