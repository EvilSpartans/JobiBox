import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from 'axios';
import { APIError } from "../models/ApiError";
import { APIResponse } from "../store/slices/userSlice";
import { User } from "../models/User";

const BASE_URL = `${process.env.REACT_APP_BASE_URL}`;

interface updatePassword {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}
  
interface resetPassword {
    token: string;
    newPassword: string;
}

export const registerUser = createAsyncThunk<APIResponse, Partial<User>, { rejectValue: APIError }>(
    'api/signup',
    async (values, { rejectWithValue }) => {
        try {
            const { data } = await axios.post<APIResponse>(`${BASE_URL}/signup`, values);
            return data;
        } catch (error) {
            const axiosError = error as AxiosError<APIError>;
            return rejectWithValue(axiosError.response?.data || { message: 'Unknown error' });
        }
    }
);

export const loginUser = createAsyncThunk<APIResponse, Partial<User>, { rejectValue: APIError }>(
    'api/signin',
    async (values, { rejectWithValue }) => {
        try {
            const { data } = await axios.post<APIResponse>(`${BASE_URL}/signin`, values);
            return data;
        } catch (error) {
            const axiosError = error as AxiosError<APIError>;
            return rejectWithValue(axiosError.response?.data || { message: 'Unknown error' });
        }
    }
);

export const updateUser = createAsyncThunk<User, { id: string | undefined, values: Partial<User> }, { rejectValue: APIError }>(
    'api/profile',
    async ({ id, values }, { rejectWithValue }) => {
        try {
            const { data } = await axios.put<User>(`${BASE_URL}/user/${id}`, values);
            return data;
        } catch (error) {
            const axiosError = error as AxiosError<APIError>;
            return rejectWithValue(axiosError.response?.data || { message: 'Unknown error' });
        }
    }
);

export const updatePassword = createAsyncThunk<APIResponse, { oldPassword: string; newPassword: string; confirmPassword: string; token: string }, { rejectValue: APIError }>(
    'api/resetPassword/update',
    async ({ oldPassword, newPassword, confirmPassword, token }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('oldPassword', oldPassword);
            formData.append('newPassword', newPassword);
            formData.append('confirmPassword', confirmPassword);

            const { data } = await axios.post<APIResponse>(
                `${BASE_URL}/resetPassword/update`, 
                formData, 
                { 
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    } 
                }
            );
            return data;
        } catch (error) {
            const axiosError = error as AxiosError<APIError>;
            return rejectWithValue(axiosError.response?.data || { message: 'Unknown error' });
        }
    }
);

export const sendResetPasswordRequest = createAsyncThunk<APIResponse, { email: string }, { rejectValue: APIError }>(
    'api/resetPassword',
    async ({ email }, { rejectWithValue }) => {
        try {
            const { data } = await axios.post<APIResponse>(
                `${BASE_URL}/resetPassword`, 
                { email } 
            );
            return data;
        } catch (error) {
            const axiosError = error as AxiosError<APIError>;
            // console.error('sendResetPasswordRequest error:', axiosError.response?.data);
            return rejectWithValue(axiosError.response?.data || { message: 'Unknown error' });
        }
    }
);

export const resetPassword = createAsyncThunk<APIResponse, { token: string; newPassword: string }, { rejectValue: APIError }>(
    'api/resetPassword/reset',
    async ({ token, newPassword }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('newPassword', newPassword);
            const url = `${BASE_URL}/resetPassword/${token}`;
            const { data } = await axios.post<APIResponse>(
                url, 
                formData, 
                { 
                    headers: { 
                        'Content-Type': 'multipart/form-data'
                    } 
                }
            );
            return data;
        } catch (error) {
            const axiosError = error as AxiosError<APIError>;
            return rejectWithValue(axiosError.response?.data || { message: 'Unknown error' });
        }
    }
);

