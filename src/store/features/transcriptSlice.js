import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = `${process.env.BASE_URL}`;

const initialState = {
    status: "",
    error: "",
    transcriptions: [],
};

export const getTranscription = createAsyncThunk(
    "api/speechToText",
    async (token, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${BASE_URL}/speechToText`, {
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

export const createTranscription = createAsyncThunk(
    "speechToText/create",
    async (values, { rejectWithValue }) => {
        const { token, transcription } = values;
        try {
            const formData = new FormData();
            formData.append("transcription", transcription);

            const { data } = await axios.post(
                `${BASE_URL}/speechToText/create`,
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

export const transcriptionSlice = createSlice({
    name: "transcription",
    initialState,
    reducers: {
        changeStatus: (state, action) => {
            state.status = action.payload;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(getTranscription.pending, (state) => {
                state.status = "loading";
            })
            .addCase(getTranscription.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.transcriptions = action.payload;
            })
            .addCase(getTranscription.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(createTranscription.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createTranscription.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.transcriptions = action.payload;
            })
            .addCase(createTranscription.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export const { changeStatus } = transcriptionSlice.actions;
export default transcriptionSlice.reducer;
