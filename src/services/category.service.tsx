import { createAsyncThunk } from "@reduxjs/toolkit";
import { APIError } from "../models/ApiError";
import axios, { AxiosError } from 'axios';
import { Category } from "../models/Category";

const BASE_URL = `${process.env.REACT_APP_BASE_URL}`;

export const getAllCategories = createAsyncThunk<
  Category[],
  void,
  {rejectValue: APIError}
>('api/categories', async (_, {rejectWithValue}) => {
  try {
    const url = `${BASE_URL}/categories`;
    // console.log('API Route:', url);
    const {data} = await axios.get<Category[]>(url); 
    return data; 
  } catch (error) {
    const axiosError = error as AxiosError<APIError>;
    return rejectWithValue(
      axiosError.response?.data || {message: 'Unknown error'},
    );
  }
});

export const getAllSubCategories = createAsyncThunk<
  Category[],
  Partial<Category>,
  {rejectValue: APIError}
>('api/subCategories', async (params, {rejectWithValue}) => {
  try {
    const url = `${BASE_URL}/subCategories`;
    // console.log('API Route:', url);
    const {data} = await axios.get<Category[]>(url, {params}); 
    return data; 
  } catch (error) {
    const axiosError = error as AxiosError<APIError>;
    return rejectWithValue(
      axiosError.response?.data || {message: 'Unknown error'},
    );
  }
});