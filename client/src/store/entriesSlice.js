import { createSlice, createAsyncThunk, unwrapResult } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchEntries = createAsyncThunk(
  "entries/fetchEntries",
  async (publicKey, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BLOCKCRAFT_NODE_URL
        }/api/entries?publicKey=${publicKey}&pageLimit=all`
      );
      return { publicKey, data: response.data };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchEntriesForAllKeys = createAsyncThunk(
  "entries/fetchEntriesForAllKeys",
  async (_, { dispatch, getState, rejectWithValue }) => {
    const keypairs = getState().data.unencryptedData.keypairs;
    try {
      const results = await Promise.all(
        keypairs.map(({ publicKey }) =>
          dispatch(fetchEntries(publicKey)).then(unwrapResult)
        )
      );
      return results;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const entriesSlice = createSlice({
  name: "entries",
  initialState: { data: {}, status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEntries.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEntries.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { publicKey, data } = action.payload;
        state.data[publicKey] = data;
      })
      .addCase(fetchEntries.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default entriesSlice.reducer;
