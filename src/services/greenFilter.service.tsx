import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from 'axios';
import { GreenFilter } from "../models/GreenFilter";
import { APIError } from "../models/ApiError";

const BASE_URL = `${process.env.REACT_APP_BASE_URL}`;

export const getGreenFilters = createAsyncThunk<
  GreenFilter[], 
  string,
  { rejectValue: APIError }
>(
  'greenFilters/getGreenFilters',
  async (token, { rejectWithValue }) => { 
    try {
      const url = `${BASE_URL}/greenFilters`;
      const { data } = await axios.get<GreenFilter[]>(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<APIError>;
      return rejectWithValue(
        axiosError.response?.data || { message: 'Failed to fetch greenFilters' }
      );
    }
  }
);

export const createGreenFilter = createAsyncThunk<
GreenFilter,
  { token: string; title: string; file: File }, 
  { rejectValue: APIError }
>(
  'greenFilter/create',
  async ({ token, title, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("file", file);

      const { data } = await axios.post<GreenFilter>(
        `${BASE_URL}/greenFilter/create`,
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
      const axiosError = error as AxiosError<APIError>;
      return rejectWithValue(
        axiosError.response?.data || { message: 'Failed to create green filter' }
      );
    }
  }
);

