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
            const { data } = await axios.get(`${BASE_URL}/questionVideos`, {
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

export const createQuestionVideo = createAsyncThunk(
    "questionVideo/create",
    async (values, { rejectWithValue }) => {

        const {
            token,
            video,
            questionId,
            themeId,
            musicId,
            fontSize,
            fontColor
        } = values;

        try {
            const formData = new FormData();
            formData.append("video", video);
            formData.append("questionId", questionId);
            formData.append("themeId", themeId);
            formData.append("musicId", musicId);
            formData.append("fontSize", fontSize);
            formData.append("fontColor", fontColor);

            const { data } = await axios.post(
                `${BASE_URL}/questionVideo/create`,
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

export const updateQuestionVideo = createAsyncThunk(
    "questionVideo/update",
    async (values, { rejectWithValue }) => {

        const {
            token,
            video,
            startValue,
            endValue,
            id
        } = values;

        try {
            const formData = new FormData();
            formData.append("video", video);
            formData.append("startValue", startValue);
            formData.append("endValue", endValue);

            const { data } = await axios.post(
                `${BASE_URL}/questionVideo/${id}`,
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

export const deleteQuestionVideo = createAsyncThunk(
    "questionVideo/delete",
    async ({ token, id }, { rejectWithValue }) => {
        try {
            const { data } = await axios.delete(`${BASE_URL}/questionVideo/${id}`, {
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
            })
            /** Create */
            .addCase(createQuestionVideo.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createQuestionVideo.fulfilled, (state) => {
                state.status = "succeeded";
            })
            .addCase(createQuestionVideo.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            /** Update */
            .addCase(updateQuestionVideo.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updateQuestionVideo.fulfilled, (state) => {
                state.status = "succeeded";
            })
            .addCase(updateQuestionVideo.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            /** Delete */
            .addCase(deleteQuestionVideo.pending, (state) => {
                state.status = "loading";
            })
            .addCase(deleteQuestionVideo.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.videoProcesses = action.payload;
            })
            .addCase(deleteQuestionVideo.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export const { changeStatus } = questionVideoSlice.actions;
export default questionVideoSlice.reducer;
