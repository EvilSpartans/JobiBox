import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = `${process.env.BASE_URL}`;

const initialState = {
    status: "",
    error: "",
    portals: []
};

export const getPortals = createAsyncThunk(
    "api/portals",
    async ( rejectWithValue ) => {
        try {
            const { data } = await axios.get(`${BASE_URL}/portals`, {});
            return data;
        } catch (error) {
            return rejectWithValue(error.response);
        }
    }
);

export const accessPortal = createAsyncThunk(
    "portal/access",
    async (values, { rejectWithValue }) => {
        const { password, id } = values;
        try {
            const formData = new FormData();
            formData.append("password", password);
            formData.append("id", id);

            const { data } = await axios.post(
                `${BASE_URL}/portal/access`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return data;
        } catch (error) {
            return rejectWithValue(error.response);
        }
    }
);

export const portalSlice = createSlice({
    name: "question",
    initialState,
    reducers: {
        changeStatus: (state, action) => {
            state.status = action.payload;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(getPortals.pending, (state) => {
                state.status = "loading";
            })
            .addCase(getPortals.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.portals = action.payload;
            })
            .addCase(getPortals.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload.data.message;
            })
            .addCase(accessPortal.pending, (state) => {
                state.status = "loading";
            })
            .addCase(accessPortal.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.portals = action.payload;
            })
            .addCase(accessPortal.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload.data.message;
            });
    },
});

export const { changeStatus } = portalSlice.actions;
export default portalSlice.reducer;
