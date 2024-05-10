import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import dataSlice from "./dataSlice";
import entriesSlice from "./entriesSlice";

const store = configureStore({
  reducer: { auth: authReducer, data: dataSlice, entries: entriesSlice },
});

export default store;
