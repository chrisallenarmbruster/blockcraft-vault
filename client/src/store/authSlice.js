import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getItem, removeItem } from "./cryptoMemStore";
import {
  fetchEncryptedData,
  resetData,
  updateEncryptedData,
} from "./dataSlice";
import axios from "axios";
import { fetchEntriesForAllKeys, resetEntries } from "./entriesSlice";

export const login = createAsyncThunk(
  "auth/login",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const clientHashedUserId = getItem("clientHashedUserId");
      const clientHashedPassword = getItem("clientHashedPassword");

      const response = await axios.post("/api/auth/login", {
        clientHashedUserId,
        clientHashedPassword,
      });

      await dispatch(fetchEncryptedData());
      dispatch(fetchEntriesForAllKeys());

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const clientHashedUserId = getItem("clientHashedUserId");
      const clientHashedPassword = getItem("clientHashedPassword");

      const response = await axios.post("/api/auth/register", {
        clientHashedUserId,
        clientHashedPassword,
      });

      if (response.data.clientHashedUserId) {
        await dispatch(login());
      }

      dispatch(updateEncryptedData({ keypairs: [], addresses: [] }));

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    const response = await axios.post("/api/auth/logout");

    removeItem("clientHashedUserId");
    removeItem("clientHashedPassword");
    removeItem("encryptionKey");

    dispatch(resetData());
    dispatch(resetEntries());

    return response.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: { isAuthenticated: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state) => {
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        console.log(action.payload);
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      .addCase(register.fulfilled, (state) => {
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        console.log(action.payload);
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export default authSlice.reducer;
