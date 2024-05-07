import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchEncryptedData = createAsyncThunk(
  "data/fetchEncryptedData",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/api/vault");
      // TODO: handle decryption
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateEncryptedData = createAsyncThunk(
  "data/updateEncryptedData",
  async (encryptedData, thunkAPI) => {
    try {
      // TODO: handle encryption
      const response = await axios.put("/api/vault", { encryptedData });
      // TODO: handle decryption
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteEncryptedData = createAsyncThunk(
  "data/deleteEncryptedData",
  async (_, thunkAPI) => {
    try {
      const response = await axios.delete("/api/vault");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const dataSlice = createSlice({
  name: "data",
  initialState: { encryptedData: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEncryptedData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEncryptedData.fulfilled, (state, action) => {
        state.loading = false;
        state.encryptedData = action.payload;
      })
      .addCase(fetchEncryptedData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateEncryptedData.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateEncryptedData.fulfilled, (state, action) => {
        state.loading = false;
        state.encryptedData = action.payload;
      })
      .addCase(updateEncryptedData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteEncryptedData.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteEncryptedData.fulfilled, (state, action) => {
        state.loading = false;
        state.encryptedData = action.payload;
      })
      .addCase(deleteEncryptedData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default dataSlice.reducer;
