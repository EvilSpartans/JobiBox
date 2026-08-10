import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const initialState = {
  status: "",
  error: "",
  simulation: null,
};

function resolveToken(explicitToken, getState) {
  const fromStore = getState?.()?.user?.user?.token;
  const token = explicitToken || fromStore || "";
  return typeof token === "string" ? token.trim() : "";
}

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` };
}

function apiErrorMessage(error, fallback) {
  return (
    error.response?.data?.error ||
    error.response?.data?.message ||
    error.response?.data?.detail ||
    fallback
  );
}

export const createInterviewSimulation = createAsyncThunk(
  "interviewSimulation/create",
  async ({ token, payload }, { rejectWithValue, getState }) => {
    try {
      const authToken = resolveToken(token, getState);
      if (!authToken) {
        return rejectWithValue("Session expirée. Reconnecte-toi.");
      }
      const { data } = await axios.post(
        `${BASE_URL}/interview-simulations`,
        payload,
        { headers: authHeaders(authToken) },
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        apiErrorMessage(error, "Échec de la création de l'entretien"),
      );
    }
  },
);

export const answerInterviewSimulation = createAsyncThunk(
  "interviewSimulation/answer",
  async ({ token, id, body, audio }, { rejectWithValue, getState }) => {
    try {
      const authToken = resolveToken(token, getState);
      if (!authToken) {
        return rejectWithValue("Session expirée. Reconnecte-toi.");
      }

      if (audio) {
        const formData = new FormData();
        formData.append("audio", audio);
        if (body?.questionIndex != null && body.questionIndex !== "") {
          formData.append("questionIndex", String(body.questionIndex));
        }
        if (body?.skipped) {
          formData.append("skipped", "1");
        }
        if (body?.lang) {
          formData.append("lang", String(body.lang));
        }
        const { data } = await axios.post(
          `${BASE_URL}/interview-simulations/${id}/answer`,
          formData,
          { headers: authHeaders(authToken) },
        );
        return data;
      }

      const { data } = await axios.post(
        `${BASE_URL}/interview-simulations/${id}/answer`,
        body,
        { headers: authHeaders(authToken) },
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        apiErrorMessage(error, "Échec de l'enregistrement de la réponse"),
      );
    }
  },
);

export const completeInterviewSimulation = createAsyncThunk(
  "interviewSimulation/complete",
  async ({ token, id }, { rejectWithValue, getState }) => {
    try {
      const authToken = resolveToken(token, getState);
      if (!authToken) {
        return rejectWithValue("Session expirée. Reconnecte-toi.");
      }
      const { data } = await axios.post(
        `${BASE_URL}/interview-simulations/${id}/complete`,
        {},
        { headers: authHeaders(authToken) },
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        apiErrorMessage(error, "Échec de l'évaluation"),
      );
    }
  },
);

const interviewSimulationSlice = createSlice({
  name: "interviewSimulation",
  initialState,
  reducers: {
    clearInterviewSimulation(state) {
      state.simulation = null;
      state.status = "";
      state.error = "";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(createInterviewSimulation.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(createInterviewSimulation.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.simulation = action.payload;
      })
      .addCase(createInterviewSimulation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Erreur";
      })
      .addCase(answerInterviewSimulation.fulfilled, (state, action) => {
        state.simulation = action.payload;
      })
      .addCase(completeInterviewSimulation.fulfilled, (state, action) => {
        state.simulation = action.payload;
      });
  },
});

export const { clearInterviewSimulation } = interviewSimulationSlice.actions;
export default interviewSimulationSlice.reducer;
