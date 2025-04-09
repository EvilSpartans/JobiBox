import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from 'axios';
import { Music } from "../models/Music";
import { APIError } from "../models/ApiError";

const BASE_URL = `${process.env.REACT_APP_BASE_URL}`;

export const getMusics = createAsyncThunk<
  Music[], 
  string,
  { rejectValue: APIError }
>(
  'musics/getMusics',
  async (token, { rejectWithValue }) => { 
    try {
      const businessId = localStorage.getItem("businessId");
      const url = businessId ? `${BASE_URL}/musics?businessId=${businessId}` : `${BASE_URL}/musics`;
      const { data } = await axios.get<Music[]>(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(data)
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<APIError>;
      return rejectWithValue(
        axiosError.response?.data || { message: 'Failed to fetch musics' }
      );
    }
  }
);

export const createMusic = createAsyncThunk<
  Music,
  { token: string; title: string; file: File }, 
  { rejectValue: APIError }
>(
  'musics/createMusic',
  async ({ token, title, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("file", file);

      const { data } = await axios.post<Music>(
        `${BASE_URL}/music/create`,
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
        axiosError.response?.data || { message: 'Failed to create music' }
      );
    }
  }
);


