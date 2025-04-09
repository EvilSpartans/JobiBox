import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from 'axios';
import { Question } from "../models/Question";
import { APIError } from "../models/ApiError";

const BASE_URL = `${process.env.REACT_APP_BASE_URL}`;

export const getQuestions = createAsyncThunk<
  Question[], 
  string,
  { rejectValue: APIError }
>(
  'questions/getQuestions',
  async (token, { rejectWithValue }) => { 
    try {
      const businessId = localStorage.getItem("businessId");
      const url = businessId ? `${BASE_URL}/questions?businessId=${businessId}` : `${BASE_URL}/questions`;
      const { data } = await axios.get<Question[]>(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<APIError>;
      return rejectWithValue(
        axiosError.response?.data || { message: 'Failed to fetch questions' }
      );
    }
  }
);

export const createQuestion = createAsyncThunk<
  Question,
  { token: string; title: string; type: string; userId: string; businessId?: string },
  { rejectValue: APIError }
>(
  'questions/createQuestion',
  async ({ token, title, type, userId, businessId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post<Question>(
        `${BASE_URL}/question/create`,
        { title, type, userId, businessId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<APIError>;
      return rejectWithValue(
        axiosError.response?.data || { message: 'Failed to create question' }
      );
    }
  }
);