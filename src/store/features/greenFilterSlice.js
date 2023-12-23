import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = `${process.env.BASE_URL}`;

const initialState = {
    status: "",
    error: "",
    greenFilters: [],
};

export const getGreenFilters = createAsyncThunk(
    "api/greenFilters",
    async (token, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${BASE_URL}/greenFilters`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data.error.message);
        }
    }
);

export const createGreenFilter = createAsyncThunk(
    "greenFilter/create",
    async (values, { rejectWithValue }) => {
        const { token, title, file } = values;
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("file", file);

            const { data } = await axios.post(
                `${BASE_URL}/greenFilter/create`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
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

export const greenFilterSlice = createSlice({
    name: "greenFilter",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(getGreenFilters.pending, (state) => {
                state.status = "loading";
            })
            .addCase(getGreenFilters.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.themes = action.payload;
            })
            .addCase(getGreenFilters.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(createGreenFilter.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createGreenFilter.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.themes.push(action.payload);
            })
            .addCase(createGreenFilter.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export const { } = greenFilterSlice.actions;

export default greenFilterSlice.reducer;
