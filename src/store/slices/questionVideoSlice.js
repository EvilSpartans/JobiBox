import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = `${process.env.REACT_APP_BASE_URL}`;

const initialState = {
    status: "",
    error: "",
    questionVideos: []
};

export const getQuestionVideos = createAsyncThunk(
    "api/questionVideos",
    async (token, { rejectWithValue }) => {
        try {
            const businessId = localStorage.getItem("businessId");
            const url = businessId ? `${BASE_URL}/questionVideos?businessId=${businessId}` : `${BASE_URL}/questionVideos`;
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

export const getQuestionVideo = createAsyncThunk(
    "questionVideo/show",
    async ({ token, id }, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${BASE_URL}/questionVideo/${id}`, {
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

export const questionVideoSlice = createSlice({
    name: "questionVideo",
    initialState,
    reducers: {
        changeStatus: (state, action) => {
            state.status = action.payload;
        },
    },
    extraReducers(builder) {
        builder
            /** Get all */
            .addCase(getQuestionVideos.pending, (state) => {
                state.status = "loading";
            })
            .addCase(getQuestionVideos.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.videoProcesses = action.payload;
            })
            .addCase(getQuestionVideos.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            /** Get one */
            .addCase(getQuestionVideo.pending, (state) => {
                state.status = "loading";
            })
            .addCase(getQuestionVideo.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.videoProcesses = action.payload;
            })
            .addCase(getQuestionVideo.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export const { changeStatus } = questionVideoSlice.actions;
export default questionVideoSlice.reducer;
