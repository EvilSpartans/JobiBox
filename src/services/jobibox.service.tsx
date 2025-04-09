import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from 'axios';
import { APIError } from "../models/ApiError";
import { JobiBox } from "../models/JobiBox";

const BASE_URL = `${process.env.REACT_APP_BASE_URL}`;

// Get all JobiBox
export const getJobibox = createAsyncThunk<
    JobiBox[], 
    Partial<JobiBox>,  
    { rejectValue: APIError } 
>(
    "api/jobibox",
    async (params, { rejectWithValue }) => {
        try {
            const url = `${BASE_URL}/jobibox`;
            const {data} = await axios.get<JobiBox[]>(url, {params}); 
            return data;
        } catch (error) {
            const axiosError = error as AxiosError<APIError>;
            return rejectWithValue(
                axiosError.response?.data || { message: 'Failed to fetch jobibox' }
            );
        }
    }
);

// Get one JobiBox
export const getJobiboxPortals = createAsyncThunk<
    JobiBox, 
    { id: string },
    { rejectValue: APIError } 
>(
    "jobibox/getPortals",
    async ({ id }, { rejectWithValue }) => {
        try {
            const { data } = await axios.get<JobiBox>(`${BASE_URL}/jobibox/${id}`, {});
            return data;
        } catch (error) {
            const axiosError = error as AxiosError<APIError>;
            return rejectWithValue(
                axiosError.response?.data || { message: 'Failed to a jobibox' }
            );
        }
    }
);

// Update an existing JobiBox
export const updateJobibox = createAsyncThunk<
    JobiBox, 
    {
        id: string;
        version: string;
    },
    { rejectValue: APIError } 
>(
    "jobibox/update",
    async (values, { rejectWithValue }) => {
        try {
            const { id, version } = values;

            const { data } = await axios.put<JobiBox>(
                `${BASE_URL}/jobibox/${id}`,
                {
                    version
                },
            );
            return data;
        } catch (error) {
            const axiosError = error as AxiosError<APIError>;
            return rejectWithValue(
                axiosError.response?.data || { message: 'Failed to update jobibox' }
            );
        }
    }
);
