import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = `${process.env.REACT_APP_BASE_URL}`;

const initialState = {
 softSkills: [],
 status: "",
 error: "",
};

export const getSoftSkills = createAsyncThunk(
 "softSkill/getSoftSkills",
 async (arg, { rejectWithValue }) => {
  try {
   const query = typeof arg === "string" ? arg : arg?.query ?? "";
   const lang = typeof arg === "object" ? arg?.lang : undefined;

   const params = { name: query, limit: 10 };
   if (lang && lang !== "fr") params.lang = lang;

   const { data } = await axios.get(`${BASE_URL}/softSkills`, {
    params,
   });
   return data.items;
  } catch (error) {
   const message =
    error?.response?.data?.detail ||
    error?.response?.data?.message ||
    error?.message ||
    "Erreur lors du chargement des softSkills";

   console.error("Erreur Axios getSoftSkills:", message, error);
   return rejectWithValue({ message });
  }
 }
);

export const softSkillSlice = createSlice({
 name: "softSkill",
 initialState,
 reducers: {
  clearSoftSkill: (state) => {
   state.softSkills = [];
   state.status = "";
   state.error = "";
  },
 },
 extraReducers(builder) {
  builder
   .addCase(getSoftSkills.pending, (state) => {
    state.status = "loading";
   })
   .addCase(getSoftSkills.fulfilled, (state, action) => {
    state.status = "succeeded";
    state.softSkills = action.payload;
   })
   .addCase(getSoftSkills.rejected, (state, action) => {
    state.status = "failed";
    state.error =
     action.payload?.message || "Erreur lors du chargement des softSkills";
   });
 },
});

export const { clearSoftSkill } = softSkillSlice.actions;
export default softSkillSlice.reducer;
