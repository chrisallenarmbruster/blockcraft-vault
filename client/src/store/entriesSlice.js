import { createSlice, createAsyncThunk, unwrapResult } from "@reduxjs/toolkit";
import axios from "axios";
import elliptic from "elliptic";

const EC = elliptic.ec;
const ec = new EC("secp256k1");

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

export const addEntry = createAsyncThunk(
  "entries/addEntry",
  async ({ from, to, amount, privateKey }, thunkAPI) => {
    try {
      const balance = await computeAccountBalance(from);
      if (balance < amount) {
        return thunkAPI.rejectWithValue("Insufficient balance");
      }

      const unsignedEntry = {
        from,
        to,
        amount,
        type: "crypto",
        initiationTimestamp: Date.now(),
        data: `Wallet transaction @ ${new Date()
          .toLocaleString("en-US", {
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })
          .replace(", ", "-")}`,
      };

      const entryHash = await hashEntry(unsignedEntry);
      const entryToSign = {
        ...unsignedEntry,
        hash: entryHash,
      };

      const signature = await signEntry(entryToSign, privateKey);
      const signedEntry = {
        ...unsignedEntry,
        hash: entryHash,
        signature: signature,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BLOCKCRAFT_NODE_URL}/api/entries`,
        signedEntry
      );

      thunkAPI.dispatch(fetchEntries(from));

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

async function computeAccountBalance(publicKey) {
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_BLOCKCRAFT_NODE_URL
      }/api/entries?publicKey=${publicKey}`
    );
    return response.data.meta.netAmount;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

// function signEntry(entry, privateKeyHex) {
//   const sign = crypto.createSign("SHA256");
//   sign.update(JSON.stringify(entry));
//   sign.end();
//   const ecKeyPair = ec.keyFromPrivate(privateKeyHex);
//   const signature = ecKeyPair.sign(JSON.stringify(entry)).toDER("hex");
//   return signature;
// }

async function signEntry(entry, privateKeyHex) {
  const msgHashHex = await hashEntry(entry);
  const msgHash = hexStringToUint8Array(msgHashHex);
  const keyPair = ec.keyFromPrivate(privateKeyHex);
  const signature = keyPair.sign(msgHash);

  return signature.toDER("hex");
}

function hexStringToUint8Array(hexString) {
  if (hexString.length % 2 !== 0) {
    throw new Error("Invalid hexString");
  }
  const arrayBuffer = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < hexString.length; i += 2) {
    const byteValue = parseInt(hexString.substring(i, i + 2), 16);
    arrayBuffer[i / 2] = byteValue;
  }
  return arrayBuffer;
}

// function hashEntry(entry) {
//   const hash = crypto.createHash("SHA256");
//   hash.update(JSON.stringify(entry));
//   return hash.digest("hex");
// }

async function hashEntry(entry) {
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(entry));
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

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
