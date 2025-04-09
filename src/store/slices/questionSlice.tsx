import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Question } from "../../models/Question";
import { createQuestion, getQuestions } from "../../services/question.service";

// Types
interface QuestionState {
    status: string;
    error: string | null;
    questions: Question[];
}

const initialState: QuestionState = {
    status: '',
    error: null,
    questions: [],
};

export const questionSlice = createSlice({
    name: "question",
    initialState,
    reducers: {
        changeStatus: (state, action: PayloadAction<string>) => {
            state.status = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getQuestions.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getQuestions.fulfilled, (state, action: PayloadAction<Question[]>) => {
                state.status = 'succeeded';
                state.error = null;
                state.questions = action.payload;
            })
            .addCase(getQuestions.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || 'Failed to fetch questions';
            })
            .addCase(createQuestion.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createQuestion.fulfilled, (state, action: PayloadAction<Partial<Question>>) => {
                state.status = 'succeeded';
                state.error = null;
                state.questions.push(action.payload as Question);
            })
            .addCase(createQuestion.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || 'Failed to create question';
            });
    },
});

export const { } = questionSlice.actions;

export default questionSlice.reducer;
