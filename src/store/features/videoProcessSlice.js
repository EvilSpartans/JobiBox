import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = `${process.env.BASE_URL}`;

const initialState = {
    status: "",
    error: "",
    videoProcesses: []
};

export const getVideoProcesses = createAsyncThunk(
    "api/videoProcesses",
    async (token, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${BASE_URL}/videoProcesses`, {
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

export const getVideoProcess = createAsyncThunk(
    "videoProcess/show",
    async ({ token, id }, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${BASE_URL}/videoProcess/${id}`, {
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

export const createVideoProcess = createAsyncThunk(
    "videoProcess/create",
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
                `${BASE_URL}/videoProcess/create`,
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

export const updateVideoProcess = createAsyncThunk(
    "videoProcess/update",
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
                `${BASE_URL}/videoProcess/${id}`,
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

export const compileVideoProcess = createAsyncThunk(
    "videoProcess/compile",
    async (token, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(
                `${BASE_URL}/videoProcess/compile`,
                {},
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

export const deleteVideoProcess = createAsyncThunk(
    "videoProcess/delete",
    async ({ token, id }, { rejectWithValue }) => {
        try {
            const { data } = await axios.delete(`${BASE_URL}/videoProcess/${id}`, {
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

export const videoProcessSlice = createSlice({
    name: "videoProcess",
    initialState,
    reducers: {
        changeStatus: (state, action) => {
            state.status = action.payload;
        },
    },
    extraReducers(builder) {
        builder
            /** Get all */
            .addCase(getVideoProcesses.pending, (state) => {
                state.status = "loading";
            })
            .addCase(getVideoProcesses.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.videoProcesses = action.payload;
            })
            .addCase(getVideoProcesses.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            /** Get one */
            .addCase(getVideoProcess.pending, (state) => {
                state.status = "loading";
            })
            .addCase(getVideoProcess.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.videoProcesses = action.payload;
            })
            .addCase(getVideoProcess.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            /** Create */
            .addCase(createVideoProcess.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createVideoProcess.fulfilled, (state) => {
                state.status = "succeeded";
            })
            .addCase(createVideoProcess.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            /** Update */
            .addCase(updateVideoProcess.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updateVideoProcess.fulfilled, (state) => {
                state.status = "succeeded";
            })
            .addCase(updateVideoProcess.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            /** Compile */
            .addCase(compileVideoProcess.pending, (state) => {
                state.status = "loading";
            })
            .addCase(compileVideoProcess.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.videoProcesses = action.payload;
            })
            .addCase(compileVideoProcess.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            /** Delete */
            .addCase(deleteVideoProcess.pending, (state) => {
                state.status = "loading";
            })
            .addCase(deleteVideoProcess.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.videoProcesses = action.payload;
            })
            .addCase(deleteVideoProcess.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export const { changeStatus } = videoProcessSlice.actions;
export default videoProcessSlice.reducer;
