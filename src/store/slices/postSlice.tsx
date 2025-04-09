import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Post } from '../../models/Post';
import { createPost } from "../../services/post.service";

// Types
interface PostState {
    status: string;
    error: string | null;
    post: Post | null;
}

const initialState: PostState = {
    status: '',
    error: null,
    post: null,
};

export const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        changeStatus: (state, action: PayloadAction<string>) => {
            state.status = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createPost.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createPost.fulfilled, (state, action: PayloadAction<Partial<Post>>) => {
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(createPost.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || 'Failed to create post';
            });
    },
});

export const { changeStatus } = postSlice.actions;
export default postSlice.reducer;
