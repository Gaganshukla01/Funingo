import axios from 'axios';
import { apiUrl } from '../constants';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getAllFranchises = createAsyncThunk(
  'fetch/franchise',
  async (_, { getState }) => {
    const {
      userSlice: { token }
    } = getState();
    const response = await axios.get(`${apiUrl}/franchise`, {
      headers: {
        token
      }
    });
    return response.data;
  }
);

export const deleteFranchise = createAsyncThunk(
  'delete/franchise',
  async ({ id }, { dispatch, getState }) => {
    const {
      userSlice: { token }
    } = getState();
    const response = await axios.delete(`${apiUrl}/franchise/${id}`, {
      headers: {
        token
      }
    });
    dispatch(getAllFranchises({ token }));
    return response.data;
  }
);

export const addFranchise = createAsyncThunk(
  'add/franchise',
  async ({ data }, { getState }) => {
    const {
      userSlice: { token }
    } = getState();
    const response = await axios.post(`${apiUrl}/franchise`, data, {
      headers: {
        token
      }
    });
    return response.data;
  }
);
