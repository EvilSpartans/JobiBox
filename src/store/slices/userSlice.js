import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = `${process.env.REACT_APP_BASE_URL}`;

const initialState = {
    status: "",
    error: "",
    user: {
        id: "",
        firstname: "",
        lastname: "",
        email: "",
        avatar: "",
        token: ""
    }
}

export const registerUser = createAsyncThunk("api/signup", async (values, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(`${BASE_URL}/signup`, { ... values});
        return data;
    } catch (error) {
        return rejectWithValue(error.response);
    }
})

export const loginUser = createAsyncThunk(
    "api/signin",
    async (values, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(`${BASE_URL}/signin`, {
                ...values,
            });
            return data;
        } catch (error) {
            return rejectWithValue(error.response);
        }
    }
);

export const userSlice = createSlice({
    name: "User",
    initialState,
    reducers: {
        logout: (state) => {
            state.status = "",
            state.error = "",
            state.user = {
                id: "",
                firstname: "",
                lastname: "",
                email: "",
                avatar: "",
                token: ""
            };
        },
        changeStatus: (state, action) => {
            state.status = action.payload;
        },
    },
    extraReducers(builder) {
        builder.addCase(registerUser.pending, (state) => {
            state.status = "loading";
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.error = action.payload.data;
            state.user = {
                ...action.payload.user,
                token: action.payload.token
            };
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload.data.detail;
        })
        .addCase(loginUser.pending, (state) => {
            state.status = "loading";
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.error = action.payload.data.message;
            state.user = {
                ...action.payload.data,
                token: action.payload.token
            };
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload.data.message;
        });
    }
})

export const { logout, changeStatus } = userSlice.actions;
export default userSlice.reducer;