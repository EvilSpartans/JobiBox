import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { QuestionVideo } from "../../models/QuestionVideo";
import { getQuestionVideo, getQuestionVideos } from "../../services/questionVideo.service";

// Types
interface QuestionState {
    status: string;
    error: string | null;
    questionVideos: QuestionVideo[];
    questionVideo: QuestionVideo | null
}

const initialState: QuestionState = {
    status: '',
    error: null,
    questionVideos: [],
    questionVideo: null,
};

export const questionVideoSlice = createSlice({
    name: "questionVideo",
    initialState,
    reducers: {
        changeStatus: (state, action: PayloadAction<string>) => {
            state.status = action.payload;
        },
    },
    extraReducers(builder) {
        builder
            /** Get all */
            .addCase(getQuestionVideos.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getQuestionVideos.fulfilled, (state, action: PayloadAction<QuestionVideo[]>) => {
                state.status = 'succeeded';
                state.error = null;
                state.questionVideos = action.payload;
            })
            .addCase(getQuestionVideos.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || 'Failed to fetch question videos';
            })

            /** Get one */
            .addCase(getQuestionVideo.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getQuestionVideo.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.questionVideo = action.payload;
            })
            .addCase(getQuestionVideo.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || 'Failed to fetch question video';
            });
    },
});

export const { changeStatus } = questionVideoSlice.actions;
export default questionVideoSlice.reducer;
