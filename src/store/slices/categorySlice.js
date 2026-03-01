import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = `${process.env.REACT_APP_BASE_URL}`;

const initialState = {
    status: "",
    error: "",
    categories: []
};

export const getCategories = createAsyncThunk(
    "api/categories",
    async (arg, { rejectWithValue }) => {
        try {
            const token = typeof arg === "string" ? arg : arg?.token;
            const lang = typeof arg === "object" ? arg?.lang : undefined;

            const params = {};
            if (lang && lang !== "fr") params.lang = lang;

            const { data } = await axios.get(`${BASE_URL}/categories`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params,
            });
            return data;
        } catch (error) {
            return rejectWithValue(error.response);
        }
    }
);

export const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(getCategories.pending, (state) => {
                state.status = "loading";
            })
            .addCase(getCategories.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.categories = action.payload;
            })
            .addCase(getCategories.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export const { } = categorySlice.actions;

export default categorySlice.reducer;
