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
    async ( rejectWithValue ) => {
        try {
            const { data } = await axios.get(`${BASE_URL}/jobibox`, {});
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
            });
    },
});

export const { changeStatus } = jobiboxSlice.actions;
export default jobiboxSlice.reducer;
