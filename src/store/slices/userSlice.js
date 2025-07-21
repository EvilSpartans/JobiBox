import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = `${process.env.REACT_APP_BASE_URL}`;

const initialState = {
  status: "",
  error: "",
  user: {
    id: "",
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    avatar: "",
    token: "",
    questionLists: [],
    offerCandidacyIds: [],
  },
};

export const registerUser = createAsyncThunk(
  "api/register",
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/register`, { ...values });
      return data;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

export const loginUser = createAsyncThunk(
  "api/login",
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/login`, {
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
      (state.status = ""),
        (state.error = ""),
        (state.user = {
          id: "",
          username: "",
          firstname: "",
          lastname: "",
          email: "",
          avatar: "",
          token: "",
          questionLists: [],
          offerCandidacyIds: [],
        });
    },
    changeStatus: (state, action) => {
      state.status = action.payload;
    },
    updateQuestionLists: (state, action) => {
      if (state.user && state.user.questionLists) {
        const newElement = action.payload;

        if (!newElement || typeof newElement.id === "undefined") {
          console.error("❌ Élément invalide reçu :", newElement);
          return;
        }

        const exists = state.user.questionLists.some(
          (questionList) => questionList.id === newElement.id
        );

        if (!exists) {
          state.user.questionLists.push(newElement);
        }
      }
    },

    addCandidacy: (state, action) => {
      const newOfferId = action.payload;
      if (!state.user.offerCandidacyIds.includes(newOfferId)) {
        state.user.offerCandidacyIds.push(newOfferId);
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        const userData = action.payload.data;
        state.status = "succeeded";
        state.error = "";

        state.user = {
          id: userData.id,
          username: userData.username,
          firstname: userData.firstname,
          lastname: userData.lastname,
          email: userData.email,
          avatar: userData.avatar || "",
          token: action.payload.token,
          questionLists: userData.questionLists || [],
          offerCandidacyIds: userData.offerCandidacyIds || [],
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
        const userData = action.payload.data;
        state.status = "succeeded";
        state.error = "";

        state.user = {
          id: userData.id,
          username: userData.username,
          firstname: userData.firstname,
          lastname: userData.lastname,
          email: userData.email,
          avatar: userData.avatar || "",
          token: action.payload.token,
          questionLists: userData.questionLists || [],
          offerCandidacyIds: userData.offerCandidacyIds || [],
        };
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.data.message;
      });
  },
});

export const { logout, changeStatus, updateQuestionLists, addCandidacy } =
  userSlice.actions;
export default userSlice.reducer;
