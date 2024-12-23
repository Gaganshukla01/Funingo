import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import userSlice from "./slice/userSlice";
import appSlice from "./slice/appSlice";
import adminSlice from "./slice/adminSlice";
import statsSlice from "./slice/stats";
const store = configureStore({
  reducer: {
    userSlice,
    appSlice,
    adminSlice,
    statsSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;
