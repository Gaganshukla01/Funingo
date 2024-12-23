import axios from 'axios';
import { apiUrl } from '../constants';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const sendApplication = createAsyncThunk(
  'post/career-application',
  async ({ data }, { getState }) => {
    const {
      userSlice: { token }
    } = getState();
    const response = await axios.post(`${apiUrl}/career-application`, data, {
      headers: {
        token
      }
    });
    return response.data;
  }
);

export const fetchApplication = createAsyncThunk(
  'fetch/career-applications',
  async (_, { getState }) => {
    const {
      userSlice: { token }
    } = getState();
    const response = await axios.get(`${apiUrl}/career-application`, {
      headers: {
        token
      }
    });
    return response.data;
  }
);

export const deleteApplication = createAsyncThunk(
  'deleteCareer-application',
  async ({ id }, { getState, dispatch }) => {
    const {
      userSlice: { token }
    } = getState();
    const response = await axios.delete(`${apiUrl}/career-application/${id}`, {
      headers: {
        token
      }
    });
    dispatch(fetchApplication());
    return response.data;
  }
);
