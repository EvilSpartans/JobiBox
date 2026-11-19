import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = `${process.env.REACT_APP_BASE_URL}`;

const initialState = {
    status: "",
    error: "",
    portals: []
};

export const getJobibox = createAsyncThunk(
    "api/jobibox",
    async ({ page = 1, limit = 10, search } = {}, { rejectWithValue }) => {
        try {
            const params = { page, limit: 10 };
            const trimmedSearch = typeof search === "string" ? search.trim() : "";
            if (trimmedSearch) {
                params.search = trimmedSearch;
            }
            const { data } = await axios.get(`${BASE_URL}/jobibox`, { params });
            return data;
        } catch (error) {
            return rejectWithValue(error.response);
        }
    }
);

export const getJobiboxPortals = createAsyncThunk(
    "jobibox/getPortals",
    async ({ id }, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${BASE_URL}/jobibox/${id}`, {});
            return data;
        } catch (error) {
            return rejectWithValue(error.response);
        }
    }
);

export const updateJobibox = createAsyncThunk(
  "jobibox/update",
  async (values, { rejectWithValue }) => {
    const { id, version, rustdeskId, rustdeskPassword } = values;

    const payload = {};
    if (version) payload.version = version;
    if (rustdeskId) payload.rustdeskId = rustdeskId;
    if (rustdeskPassword) payload.rustdeskPassword = rustdeskPassword;

    try {
      const { data } = await axios.put(
        `${BASE_URL}/jobibox/${id}`,
        payload
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

export const jobiboxSlice = createSlice({
    name: "jobibox",
    initialState,
    reducers: {
        changeStatus: (state, action) => {
            state.status = action.payload;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(getJobibox.pending, (state) => {
                state.status = "loading";
            })
            .addCase(getJobibox.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.portals = action.payload;
            })
            .addCase(getJobibox.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload.data.message;
            })
            .addCase(getJobiboxPortals.pending, (state) => {
                state.status = "loading";
            })
            .addCase(getJobiboxPortals.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.portals = action.payload;
            })
            .addCase(getJobiboxPortals.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload.data.message;
            })
            .addCase(updateJobibox.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updateJobibox.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.portals = action.payload;
            })
            .addCase(updateJobibox.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload.data.message;
            });
    },
});

export const { changeStatus } = jobiboxSlice.actions;
export default jobiboxSlice.reducer;
