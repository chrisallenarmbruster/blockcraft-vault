import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getItem, removeItem } from "./cryptoMemStore";
import { fetchEncryptedData, updateEncryptedData } from "./dataSlice";
import axios from "axios";

export const login = createAsyncThunk("auth/login", async (_, { dispatch }) => {
  console.log("login");
  const clientHashedUserId = getItem("clientHashedUserId");
  const clientHashedPassword = getItem("clientHashedPassword");

  const response = await axios.post("/api/auth/login", {
    clientHashedUserId,
    clientHashedPassword,
  });

  dispatch(fetchEncryptedData());

  return response.data;
});

export const register = createAsyncThunk(
  "auth/register",
  async (_, { dispatch }) => {
    console.log("register");
    const clientHashedUserId = getItem("clientHashedUserId");
    const clientHashedPassword = getItem("clientHashedPassword");

    const response = await axios.post("/api/auth/register", {
      clientHashedUserId,
      clientHashedPassword,
    });

    console.log("response", response.data);

    if (response.data.clientHashedUserId) {
      await dispatch(login());
    }

    return response.data;
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  const response = await axios.post("/api/auth/logout");

  removeItem("clientHashedUserId");
  removeItem("clientHashedPassword");
  removeItem("encryptionKey");

  return response.data;
});

const authSlice = createSlice({
  name: "auth",
  initialState: { isAuthenticated: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state) => {
        state.isAuthenticated = true;
      })
      .addCase(register.fulfilled, (state) => {
        state.isAuthenticated = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
      });
  },
});

export default authSlice.reducer;
