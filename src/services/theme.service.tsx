import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from 'axios';
import { Theme } from "../models/Theme";
import { APIError } from "../models/ApiError";

const BASE_URL = `${process.env.REACT_APP_BASE_URL}`;

export const getThemes = createAsyncThunk<
  Theme[], 
  string,
  { rejectValue: APIError }
>(
  'themes/getThemes',
  async (token, { rejectWithValue }) => { 
    try {
      const businessId = localStorage.getItem("businessId");
      const url = businessId ? `${BASE_URL}/themes?businessId=${businessId}` : `${BASE_URL}/themes`;
      const { data } = await axios.get<Theme[]>(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<APIError>;
      return rejectWithValue(
        axiosError.response?.data || { message: 'Failed to fetch themes' }
      );
    }
  }
);

export const createTheme = createAsyncThunk<
  Theme,
  { token: string; title: string; file: File; }, 
  { rejectValue: APIError }
>(
  'themes/createTheme',
  async ({ token, title, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("file", file);

      const { data } = await axios.post<Theme>(
        `${BASE_URL}/theme/create`,
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
        axiosError.response?.data || { message: 'Failed to create theme' }
      );
    }
  }
);

