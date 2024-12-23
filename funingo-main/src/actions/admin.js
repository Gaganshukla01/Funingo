import axios from 'axios';
import { apiUrl } from '../constants';
import { createAsyncThunk } from '@reduxjs/toolkit';
// import { useEffect, useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css'



export const getStatistics = async ({
  token,
  year,
  month,
  type,
  payment_mode
}) => {
  try {
    const response = await axios.get(`${apiUrl}/admin/get-stats`, {
      params: {
        year,
        month,
        type,
        payment_mode
      },
      headers: {
        token
      }
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

// Images

//Just to upload images to cloudinary and get the path
export const uploadImages = async ({ data, token }) => {
  try {
    const response = await axios.post(`${apiUrl}/image/upload`, data, {
      headers: {
        token
      }
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const getAllImages = createAsyncThunk(
  'fetch/images',
  async (_, { getState }) => {
    const {
      userSlice: { token }
    } = getState();
    const response = await axios.get(`${apiUrl}/image`, {
      headers: {
        token
      }
    });
    return response.data;
  }
);

export const deleteImage = async ({ token, id }) => {
  try {
    const response = await axios.delete(`${apiUrl}/image/${id}`, {
      headers: {
        token
      }
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

// To actually store the path in the database
export const addImages = async ({ data, token }) => {
  try {
    const response = await axios.post(`${apiUrl}/image`, data, {
      headers: {
        token
      }
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

// Packages Actions
export const getAllPackages = async ({ token }) => {
  try {
    const response = await axios.get(`${apiUrl}/package`, {
      headers: {
        token
      }
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const deletePackage = async ({ token, id }) => {
  try {
    const response = await axios.delete(`${apiUrl}/package/${id}`, {
      headers: {
        token
      }
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const addPackage = async ({ data, token }) => {
  try {
    const response = await axios.post(`${apiUrl}/package`, data, {
      headers: {
        token
      }
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

//Promo code Actions
export const getAllCoupons = async ({ token }) => {
  try {
    const response = await axios.get(`${apiUrl}/coupon`, {
      headers: {
        token
      }
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const deleteCoupon = async ({ token, id }) => {
  try {
    const response = await axios.delete(`${apiUrl}/coupon/${id}`, {
      headers: {
        token
      }
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const addCoupon = async ({ data, token }) => {
  try {
    const response = await axios.post(`${apiUrl}/coupon`, data, {
      headers: {
        token
      }
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

// Phone Numbers
export const getPhoneNumbers = createAsyncThunk(
  'fetch/phone-numbers',
  async (_, { getState }) => {
    const {
      userSlice: { token }
    } = getState();
    const response = await axios.get(`${apiUrl}/phone`, {
      headers: {
        token
      }
    });
    return response.data;
  }
);

export const deletePhoneNumber = async ({ token, id }) => {
  try {
    const response = await axios.delete(`${apiUrl}/phone/${id}`, {
      headers: {
        token
      }
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const addPhoneNumber = async ({ data, token }) => {
  try {
    const response = await axios.post(`${apiUrl}/phone`, data, {
      headers: {
        token
      }
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

// Statistics

export const getMonthlyStats = createAsyncThunk(
  'fetch/monthly-stats',
  async ({ years, is_premium }, { getState }) => {
    const {
      userSlice: { token }
    } = getState();
    const response = await axios.get(
      `${apiUrl}/admin/monthly-stats?years=${years}&is_premium=${is_premium}`,
      { headers: { token } }
    );
    return response.data;
  }
);

export const getWeekendData = createAsyncThunk(
  'fetch/weekend-data',
  async ({ year, months, is_premium }, { getState }) => {
    const {
      userSlice: { token }
    } = getState();
    const response = await axios.get(
      `${apiUrl}/admin/weekend-stats?months=${months}&year=${year}&is_premium=${is_premium}`,
      { headers: { token } }
    );
    return response.data;
  }
);

export const getWeekdayData = createAsyncThunk(
  'fetch/weekday-data',
  async ({ year, months, is_premium }, { getState }) => {
    const {
      userSlice: { token }
    } = getState();
    const response = await axios.get(
      `${apiUrl}/admin/weekday-stats?months=${months}&year=${year}&is_premium=${is_premium}`,
      { headers: { token } }
    );
    return response.data;
  }
);

export const getDemographics = createAsyncThunk(
  'fetch/demographics',
  async ({ startDate, endDate, is_premium }, { getState }) => {
    const {
      userSlice: { token }
    } = getState();
    const response = await axios.get(
      `${apiUrl}/admin/demographics?startDate=${startDate}&endDate=${endDate}&is_premium=${is_premium}`,
      { headers: { token } }
    );
    return response.data;
  }
);

export const getUsers = async ({ min_funingo_money, min_freebies, token }) => {
  try {
    const response = await axios.get(`${apiUrl}/admin/users`, {
      headers: { token },
      params: { min_funingo_money, min_freebies }
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

// User Base
export const getUsersWRTFM = createAsyncThunk(
  'fetch/users-wrt-fm',
  async (_, { getState }) => {
    const {
      userSlice: { token }
    } = getState();
    const response = await axios.get(`${apiUrl}/admin/users-wrt-fm`, {
      headers: { token }
    });
    return response.data;
  }
);

export const getUsersWRTFreebies = createAsyncThunk(
  'fetch/users-wrt-freebies',
  async (_, { getState }) => {
    const {
      userSlice: { token }
    } = getState();
    const response = await axios.get(`${apiUrl}/admin/users-wrt-freebies`, {
      headers: { token }
    });
    return response.data;
  }
);

export const getUsersWRTPremium = createAsyncThunk(
  'fetch/users-wrt-premium',
  async (_, { getState }) => {
    const {
      userSlice: { token }
    } = getState();
    const response = await axios.get(`${apiUrl}/admin/users-wrt-premium`, {
      headers: { token }
    });
    return response.data;
  }
);

export const getUserGenderDetails = createAsyncThunk(
  'fetch/users-gender-details',
  async (_, { getState }) => {
    const {
      userSlice: { token }
    } = getState();
    const response = await axios.get(`${apiUrl}/admin/user-gender-details`, {
      headers: { token }
    });
    return response.data;
  }
);

export const getUserLocationDetails = createAsyncThunk(
  'fetch/users-location-details',
  async (_, { getState }) => {
    const {
      userSlice: { token }
    } = getState();
    const response = await axios.get(`${apiUrl}/admin/user-location-details`, {
      headers: { token }
    });
    return response.data;
  }
);

export const getUserSpendingLimit = createAsyncThunk(
  'fetch/user-spending-per-visit',
  async ({ startDate, endDate, is_premium }, { getState }) => {
    const {
      userSlice: { token }
    } = getState();
    const response = await axios.get(
      `${apiUrl}/admin/spending-per-visit?startDate=${startDate}&endDate=${endDate}&is_premium=${is_premium}`,
      { headers: { token } }
    );
    return response.data;
  }
);

export const getBookingFrequency = createAsyncThunk(
  'fetch/booking-frequency',
  async ({ startDate, endDate, is_premium }, { getState }) => {
    const {
      userSlice: { token }
    } = getState();
    const response = await axios.get(
      `${apiUrl}/admin/booking-frequency?startDate=${startDate}&endDate=${endDate}&is_premium=${is_premium}`,
      { headers: { token } }
    );
    return response.data;
  }
);

// Player Base
export const getPlayerGenderDetails = createAsyncThunk(
  'fetch/player-gender-details',
  async ({ startDate, endDate, is_premium }, { getState }) => {
    const {
      userSlice: { token }
    } = getState();
    const response = await axios.get(
      `${apiUrl}/admin/player-gender-data?startDate=${startDate}&endDate=${endDate}&is_premium=${is_premium}`,
      { headers: { token } }
    );
    return response.data;
  }
);

export const getPlayerAgeDetails = createAsyncThunk(
  'fetch/player-age-details',
  async ({ startDate, endDate, is_premium }, { getState }) => {
    const {
      userSlice: { token }
    } = getState();
    const response = await axios.get(
      `${apiUrl}/admin/player-age-data?startDate=${startDate}&endDate=${endDate}&is_premium=${is_premium}`,
      { headers: { token } }
    );
    return response.data;
  }
);

export const getAddedFreebies = createAsyncThunk(
  'fetch/added-freebies',
  async ({ years, is_premium }, { getState }) => {
    const {
      userSlice: { token }
    } = getState();
    const response = await axios.get(
      `${apiUrl}/admin/added-freebies?years=${years}&is_premium=${is_premium}`,
      { headers: { token } }
    );
    console.log("checking response",response);
    return response.data;
  }
);

export const getPlayerAddedFreebies = createAsyncThunk(
  'fetch/player-added-freebies',
  async ({ startDate, endDate, is_premium }, { getState }) => {
    const {
      userSlice: { token }
    } = getState();
    const response = await axios.get(
      `${apiUrl}/admin/player-added-freebies?startDate=${startDate}&endDate=${endDate}&is_premium=${is_premium}`,
      { headers: { token } }
    );
    return response.data;
  }
);

export const usersWithUpcomingBday = createAsyncThunk(
  'fetch/upcoming-bday',
  async ({ days_left }, { getState }) => {
    const {
      userSlice: { token }
    } = getState();
    const response = await axios.get(
      `${apiUrl}/admin/upcoming-bday?days_left=${days_left}`,
      { headers: { token } }
    );
    return response.data;
  }
);
