import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = `${process.env.REACT_APP_BASE_URL}`;

const initialState = {
    status: "",
    error: "",
    subCategories: []
};

export const getSubCategories = createAsyncThunk(
    "api/subCategories",
    async (token, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${BASE_URL}/subCategories`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data;
        } catch (error) {
            return rejectWithValue(error.response);
        }
    }
);

export const subCategorySlice = createSlice({
    name: "subCategory",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(getSubCategories.pending, (state) => {
                state.status = "loading";
            })
            .addCase(getSubCategories.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.subCategories = action.payload;
            })
            .addCase(getSubCategories.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export const { } = subCategorySlice.actions;

export default subCategorySlice.reducer;
