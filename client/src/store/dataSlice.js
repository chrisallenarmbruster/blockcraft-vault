import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { decryptData, encryptData } from "./cryptoMemStore";
import axios from "axios";
import { nanoid } from "nanoid";

export const fetchEncryptedData = createAsyncThunk(
  "data/fetchEncryptedData",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/api/vault");
      if (response.data.encryptedData === null) {
        return null;
      }
      const decryptedData = await decryptData(response.data.encryptedData);
      return decryptedData;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateEncryptedData = createAsyncThunk(
  "data/updateEncryptedData",
  async (unencryptedData, thunkAPI) => {
    try {
      const encryptedData = await encryptData(unencryptedData);
      const response = await axios.put("/api/vault", { encryptedData });
      const decryptedData = await decryptData(response.data.encryptedData);
      return decryptedData;
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

export const addKeypair = createAsyncThunk(
  "data/addKeypair",
  async (keypair, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const { unencryptedData } = getState().data;

    const nanoId = nanoid();

    const newUnencryptedData = JSON.parse(JSON.stringify(unencryptedData));

    newUnencryptedData.keypairs
      .push({ ...keypair, nanoId })
      .sort((a, b) => a.label.localeCompare(b.label));

    return dispatch(updateEncryptedData(newUnencryptedData));
  }
);

export const deleteKeypair = createAsyncThunk(
  "data/deleteKeypair",
  async (keypair, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const { unencryptedData } = getState().data;

    const newUnencryptedData = JSON.parse(JSON.stringify(unencryptedData));

    newUnencryptedData.keypairs = newUnencryptedData.keypairs
      .filter((item) => item.nanoId !== keypair.nanoId)
      .sort((a, b) => a.label.localeCompare(b.label));

    return dispatch(updateEncryptedData(newUnencryptedData));
  }
);

export const updateKeypair = createAsyncThunk(
  "data/updateKeypair",
  async (keypair, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const { unencryptedData } = getState().data;

    const newUnencryptedData = JSON.parse(JSON.stringify(unencryptedData));

    newUnencryptedData.keypairs = newUnencryptedData.keypairs
      .map((item) => (item.nanoId === keypair.nanoId ? keypair : item))
      .sort((a, b) => a.label.localeCompare(b.label));

    return dispatch(updateEncryptedData(newUnencryptedData));
  }
);

export const addAddress = createAsyncThunk(
  "data/addAddress",
  async (address, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const { unencryptedData } = getState().data;

    const nanoId = nanoid();

    const newUnencryptedData = JSON.parse(JSON.stringify(unencryptedData));

    newUnencryptedData.addresses
      .push({ ...address, nanoId })
      .sort((a, b) => a.label.localeCompare(b.label));

    return dispatch(updateEncryptedData(newUnencryptedData));
  }
);

export const deleteAddress = createAsyncThunk(
  "data/deleteAddress",
  async (address, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const { unencryptedData } = getState().data;

    const newUnencryptedData = JSON.parse(JSON.stringify(unencryptedData));

    newUnencryptedData.addresses = newUnencryptedData.addresses
      .filter((item) => item.nanoId !== address.nanoId)
      .sort((a, b) => a.label.localeCompare(b.label));

    return dispatch(updateEncryptedData(newUnencryptedData));
  }
);

export const updateAddress = createAsyncThunk(
  "data/updateAddress",
  async (address, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const { unencryptedData } = getState().data;

    const newUnencryptedData = JSON.parse(JSON.stringify(unencryptedData));

    newUnencryptedData.addresses = newUnencryptedData.addresses
      .map((item) => (item.nanoId === address.nanoId ? address : item))
      .sort((a, b) => a.label.localeCompare(b.label));

    return dispatch(updateEncryptedData(newUnencryptedData));
  }
);

const initialState = { unencryptedData: null, loading: false, error: null };

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: { resetData: () => initialState },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEncryptedData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEncryptedData.fulfilled, (state, action) => {
        state.loading = false;
        state.unencryptedData = action.payload;
      })
      .addCase(fetchEncryptedData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateEncryptedData.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateEncryptedData.fulfilled, (state, action) => {
        state.unencryptedData = action.payload;
        state.loading = false;
      })
      .addCase(updateEncryptedData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteEncryptedData.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteEncryptedData.fulfilled, (state) => {
        state.loading = false;
        state.unencryptedData = null;
      })
      .addCase(deleteEncryptedData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetData } = dataSlice.actions;

export default dataSlice.reducer;
