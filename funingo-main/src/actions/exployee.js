import axios from "axios";
import { apiUrl } from "../constants";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const windowPurchase = async ({
  total_amount,
  online_amount,
  cash_amount,
  details,
  token,
  phone_no,
  payment_mode,
  coupon,
  dob,
  name,
  custom_discount,
  count,
}) => {
  console.log("details from exployee.js", details);
  const response = await axios.post(
    `${apiUrl}/ticket/e/book-ticket`,
    {
      total_amount,
      cash_amount,
      online_amount,
      details,
      phone_no,
      payment_mode,
      coupon,
      dob,
      name,
      custom_discount,
      count,
    },
    {
      headers: {
        token,
      },
    }
  );
  console.log("response from exployee", response);
  return response.data;
};

export const addComplementaryCoins = createAsyncThunk(
  "add/complementary/coins",
  async ({ phone_no, coins , description }, { getState }) => {
    const {
      userSlice: { token },
    } = getState();
    const response = await axios.post(
      `${apiUrl}/ticket/e/add-complementary-coins`,
      {
        phone_no,
        coins,
        description,
      },
      {
        headers: { token },
      }
    );
    return response.data;
  }
);
