import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = `${process.env.REACT_APP_BASE_URL}`;

const initialState = {
    status: "",
    error: "",
    posts: [],
};

export const createPost = createAsyncThunk(
    "post/create",
    async (values, { rejectWithValue }) => {

        const { 
            token, 
            title, 
            description, 
            category,
            subCategory,
            city, 
            salary,
            contracts,
            hmy,
            activateComments,
            formation,
            remote,
            video,
            image,
            date,
            businessId,
            portal,
            km,
            createdFrom,
            diploma
        } = values;

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("category", category);
            formData.append("subCategory", subCategory);
            formData.append("city", city);
            formData.append("contracts", contracts);
            formData.append("km", km);
            formData.append("activateComments", activateComments);
            formData.append("formation", formation);
            formData.append("remote", remote);
            formData.append("image", image);
            formData.append("video", video);
            formData.append("date", date);
            formData.append("businessId", businessId);
            formData.append("portal", portal);
            formData.append("diploma", diploma);
            formData.append("createdFrom", createdFrom);

            const { data } = await axios.post(
                `${BASE_URL}/post/create`,
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

export const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        changeStatus: (state, action) => {
            state.status = action.payload;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(createPost.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.posts.push(action.payload);
            })
            .addCase(createPost.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload.data.detail;
            });
    },
});

export const { changeStatus } = postSlice.actions;
export default postSlice.reducer;
