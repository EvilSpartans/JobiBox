import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = `${process.env.REACT_APP_BASE_URL}`;

const initialState = {
    status: "",
    error: "",
    groupQuestions: []
};

export const getGroupQuestions = createAsyncThunk(
    "api/groupQuestions",
    async (token, { rejectWithValue }) => {
        try {
            const businessId = localStorage.getItem("businessId");
            const isValidBusinessId = businessId && businessId !== "null";

            const url = isValidBusinessId
            ? `${BASE_URL}/groupQuestions?businessId=${businessId}&limit=100`
            : `${BASE_URL}/groupQuestions?limit=100`;
            const { data } = await axios.get(url, {
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

export const groupQuestionSlice = createSlice({
    name: "groupQuestions",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(getGroupQuestions.pending, (state) => {
                state.status = "loading";
            })
            .addCase(getGroupQuestions.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.groupQuestions = action.payload;
            })
            .addCase(getGroupQuestions.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export const { } = groupQuestionSlice.actions;

export default groupQuestionSlice.reducer;
