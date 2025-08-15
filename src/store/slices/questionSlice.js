import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = `${process.env.REACT_APP_BASE_URL}`;

const initialState = {
  status: "",
  error: "",
  questions: [],
};

export const getQuestions = createAsyncThunk(
  "api/questions",
  async ({ token, groupQuestionId }, { rejectWithValue }) => {
    try {
      const url = `${BASE_URL}/questions?groupQuestionId=${groupQuestionId}&limit=100`;
      const { data } = await axios.get(url, {
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

export const createQuestion = createAsyncThunk(
  "question/create",
  async (values, { rejectWithValue }) => {
    const { token, title, groupQuestionId, userId, businessId } = values;
    try {
      const { data } = await axios.post(
        `${BASE_URL}/question/create`,
        {
          title,
          groupQuestionId,
          userId,
          businessId,
        },
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

export const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getQuestions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getQuestions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.questions = action.payload;
      })
      .addCase(getQuestions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createQuestion.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createQuestion.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (!state.questions.items) state.questions.items = [];
        state.questions.items.push(action.payload);
      })
      .addCase(createQuestion.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const {} = questionSlice.actions;

export default questionSlice.reducer;
