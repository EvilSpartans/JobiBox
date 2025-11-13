import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = `${process.env.REACT_APP_BASE_URL}`;

const initialState = {
 cities: [],
 status: "",
 error: "",
};

export const fetchCities = createAsyncThunk(
 "city/fetchCities",
 async (query, { rejectWithValue }) => {
  try {
   const { data } = await axios.get(`${BASE_URL}/cities`, {
    params: { name: query, limit: 10 },
   });
   return data.items;
  } catch (error) {
   const message =
    error?.response?.data?.detail ||
    error?.response?.data?.message ||
    error?.message ||
    "Erreur lors du chargement des villes";

   console.error("Erreur Axios fetchCities:", message, error);
   return rejectWithValue({ message });
  }
 }
);

export const citySlice = createSlice({
 name: "city",
 initialState,
 reducers: {
  clearCities: (state) => {
   state.cities = [];
   state.status = "";
   state.error = "";
  },
 },
 extraReducers(builder) {
  builder
   .addCase(fetchCities.pending, (state) => {
    state.status = "loading";
   })
   .addCase(fetchCities.fulfilled, (state, action) => {
    state.status = "succeeded";
    state.cities = action.payload;
   })
   .addCase(fetchCities.rejected, (state, action) => {
    state.status = "failed";
    state.error =
     action.payload?.message || "Erreur lors du chargement des villes";
   });
 },
});

export const { clearCities } = citySlice.actions;
export default citySlice.reducer;
