import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import dataSlice from "./dataSlice";

const store = configureStore({
  reducer: { auth: authReducer, data: dataSlice },
});

export default store;
