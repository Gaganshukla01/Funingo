import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { apiUrl } from "../constants.jsx";

export const getRevenueTransactionSplit = createAsyncThunk(
  "admin/getRevenueTransactionSplit",
  async ({ startDate, endDate }, { getState }) => {
    const {
      userSlice: { token },
    } = getState();
    const response = await axios.get(
      `${apiUrl}/admin/stats/revenue/split?start_date=${startDate}&end_date=${endDate}`,
      {
        headers: { token },
      }
    );
    return response.data;
  }
);

export const getActivityUsage = createAsyncThunk(
  "admin/getActivityUsage",
  async ({ startDate, endDate }, { getState }) => {
    const {
      userSlice: { token },
    } = getState();
    const response = await axios.get(
      `${apiUrl}/admin/stats/activity/usage?start_date=${startDate}&end_date=${endDate}`,
      {
        headers: { token },
      }
    );
    return response.data;
  }
);

export const getUserFrequency = createAsyncThunk(
  "admin/getUserFrequency",
  async (
    { startDate, endDate, sort, offset, phoneNumber, minAge, maxAge },
    { getState }
  ) => {
    const {
      userSlice: { token },
    } = getState();
    const response = await axios.get(
      `${apiUrl}/admin/stats/user-frequency?start_date=${startDate}&end_date=${endDate}&sort=${sort}&offset=${offset}&phone_no=${phoneNumber}&min_age=${minAge}&max_age=${maxAge}`,
      {
        headers: { token },
      }
    );
    return response.data;
  }
);

export const downloadUserData = createAsyncThunk(
  "admin/downloadUserData",
  async ({ startDate, endDate }, { getState }) => {
    const {
      userSlice: { token },
    } = getState();
    const response = await axios.get(
      `${apiUrl}/admin/stats/download-user-data?start_date=${startDate}&end_date=${endDate}`,
      {
        headers: { token },
      }
    );
    return response.data;
  }
);

export const getCoinsPerPerson = createAsyncThunk(
  "admin/getCoinsPerPerson",
  async ({ startDate, endDate }, { getState }) => {
    const {
      userSlice: { token },
    } = getState();
    const response = await axios.get(
      `${apiUrl}/admin/stats/coins-per-person?start_date=${startDate}&end_date=${endDate}`,
      {
        headers: { token },
      }
    );
    return response.data;
  }
);

export const downloadSalesData = createAsyncThunk(
  "admin/downloadSalesData",
  async ({ startDate, endDate }, { getState }) => {
    const {
      userSlice: { token },
    } = getState();
    const response = await axios.get(
      `${apiUrl}/admin/stats/download-sales-data?start_date=${startDate}&end_date=${endDate}`,
      { headers: { token } }
    );
    return response.data;
  }
);
