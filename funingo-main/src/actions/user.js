import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiUrl } from "../constants";

export const fetchSelf = createAsyncThunk("fetch/self", async () => {
  const token = localStorage.getItem("token");
  const resp = await axios.get(`${apiUrl}/user`, {
    headers: {
      token,
    },
  });
  return resp.data;
});

export const getTransactions = createAsyncThunk(
  "get/transactions",
  async () => {
    const token = localStorage.getItem("token");
    const resp = await axios.get(`${apiUrl}/user/transactions`, {
      headers: {
        token,
      },
    });
    return resp.data;
  }
);
