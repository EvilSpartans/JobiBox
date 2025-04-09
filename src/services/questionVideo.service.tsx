import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from 'axios';
import { APIError } from "../models/ApiError";
import { QuestionVideo } from "../models/QuestionVideo";

const BASE_URL = `${process.env.REACT_APP_BASE_URL}`;

export const getQuestionVideos = createAsyncThunk<
  QuestionVideo[], 
  string,
  { rejectValue: APIError }
>(
  'api/questionVideos',
  async (token, { rejectWithValue }) => { 
    try {
      const businessId = localStorage.getItem("businessId");
      const url = businessId ? `${BASE_URL}/questionVideos?businessId=${businessId}` : `${BASE_URL}/questionVideos`;
      const { data } = await axios.get<QuestionVideo[]>(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<APIError>;
      return rejectWithValue(
        axiosError.response?.data || { message: 'Failed to fetch question videos' }
      );
    }
  }
);

export const getQuestionVideo = createAsyncThunk<
  QuestionVideo, 
  { token: string; id: string },
  { rejectValue: APIError } 
>(
  'questionVideo/show',
  async ({token, id}, { rejectWithValue }) => { 
    try {
        const { data } = await axios.get(`${BASE_URL}/questionVideo/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data;
    } catch (error) {
      const axiosError = error as AxiosError<APIError>;
      return rejectWithValue(
        axiosError.response?.data || { message: 'Failed to fetch question videos' }
      );
    }
  }
);
