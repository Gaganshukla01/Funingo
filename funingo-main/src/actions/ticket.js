import axios from "axios";
import { apiUrl } from "../constants";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getDiscount = async ({ code, total_amount, token }) => {
  try {
    const response = await axios.post(
      `${apiUrl}/ticket/get-discount`,
      { code, total_amount },
      { headers: { token } }
    );
    return response.data;
  } catch (e) {
    if (e.response.data === "User is not authenticated.")
      alert(e.response.data);
    else console.log(e);
  }
};

export const getAllTickets = async ({ phone_no, token }) => {
  try {
    const response = await axios.get(
      `${apiUrl}/ticket/get-all-tickets?phone_no=${encodeURIComponent(
        phone_no
      )}`,
      {
        headers: { token },
      }
    );

    return response.data;
  } catch (e) {
    console.log(e);
  }
};

export const getFreebies = createAsyncThunk(
  "fetch/freebies",
  async (_, { getState }) => {
    const {
      userSlice: { token },
    } = getState();

    const response = await axios.get(`${apiUrl}/user/freebies`, {
      headers: { token },
    });
    return response.data;
  }
);

export const saveTicketRiskImage = async ({ short_id, imageBlob, token }) => {
  const data = new FormData();
  data.append("short_id", short_id);
  data.append("image", imageBlob);

  const response = await axios.post(
    `${apiUrl}/ticket/save-ticket-risk-image`,
    data,
    {
      headers: { token },
    }
  );
  return response.data;
};
