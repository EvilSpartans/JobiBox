import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = `${process.env.BASE_URL}`;

const initialState = {
    status: "",
    error: "",
    themes: [],
};

export const getThemes = createAsyncThunk(
    "api/themes",
    async (token, { rejectWithValue }) => {
        try {
            const businessId = localStorage.getItem("businessId");
            const url = businessId ? `${BASE_URL}/themes?businessId=${businessId}` : `${BASE_URL}/themes`;
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

export const createTheme = createAsyncThunk(
    "theme/create",
    async (values, { rejectWithValue }) => {
        const { token, title, file } = values;
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("file", file);

            const { data } = await axios.post(
                `${BASE_URL}/theme/create`,
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

export const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(getThemes.pending, (state) => {
                state.status = "loading";
            })
            .addCase(getThemes.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.themes = action.payload;
            })
            .addCase(getThemes.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(createTheme.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createTheme.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.themes.push(action.payload);
            })
            .addCase(createTheme.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export const { } = themeSlice.actions;

export default themeSlice.reducer;
