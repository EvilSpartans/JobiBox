import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = `${process.env.BASE_URL}`;

const initialState = {
    status: "",
    error: "",
    questions: []
};

export const getQuestions = createAsyncThunk(
    "api/questions",
    async (token, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${BASE_URL}/questions`, {
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

export const createQuestion = createAsyncThunk(
    "question/create",
    async (values, { rejectWithValue }) => {
        const { token, title, type, userId } = values;
        try {
            const { data } = await axios.post(
                `${BASE_URL}/question/create`,
                {
                    title,
                    type,
                    userId
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return data;
        } catch (error) {
            return rejectWithValue(error.response);
        }
    }
);

export const questionSlice = createSlice({
    name: "question",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(getQuestions.pending, (state) => {
                state.status = "loading";
            })
            .addCase(getQuestions.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.questions = action.payload;
            })
            .addCase(getQuestions.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(createQuestion.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createQuestion.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.questions.push(action.payload);
            })
            .addCase(createQuestion.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export const { } = questionSlice.actions;

export default questionSlice.reducer;
