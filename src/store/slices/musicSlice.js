import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = `${process.env.REACT_APP_BASE_URL}`;

const initialState = {
    status: "",
    error: "",
    musics: [],
};

export const getMusics = createAsyncThunk(
    "api/musics",
    async (token, { rejectWithValue }) => {
        try {
            const businessId = localStorage.getItem("businessId");
            const isValidBusinessId = businessId && businessId !== "null";

            const url = isValidBusinessId
                ? `${BASE_URL}/musics?businessId=${businessId}&limit=20`
                : `${BASE_URL}/musics?limit=20`;
            const { data } = await axios.get(url, {
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

export const createMusic = createAsyncThunk(
    "music/create",
    async (values, { rejectWithValue }) => {
        const { token, title, file } = values;
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("file", file);

            const { data } = await axios.post(
                `${BASE_URL}/music/create`,
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

export const musicSlice = createSlice({
    name: "music",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(getMusics.pending, (state) => {
                state.status = "loading";
            })
            .addCase(getMusics.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.musics = action.payload;
            })
            .addCase(getMusics.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(createMusic.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createMusic.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.musics.push(action.payload);
            })
            .addCase(createMusic.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export const { } = musicSlice.actions;

export default musicSlice.reducer;
