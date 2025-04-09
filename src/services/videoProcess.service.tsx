import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from 'axios';
import { VideoProcess } from "../models/VideoProcess";
import { APIError } from "../models/ApiError";

const BASE_URL = `${process.env.REACT_APP_BASE_URL}`;

// Get all video processes
export const getVideoProcesses = createAsyncThunk<
    VideoProcess[], 
    string,  
    { rejectValue: APIError } 
>(
    "api/videoProcesses",
    async (token, { rejectWithValue }) => {
        try {
            const { data } = await axios.get<VideoProcess[]>(`${BASE_URL}/videoProcesses`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data;
        } catch (error) {
            const axiosError = error as AxiosError<APIError>;
            return rejectWithValue(
                axiosError.response?.data || { message: 'Failed to fetch video processes' }
            );
        }
    }
);

// Get one video process
export const getVideoProcess = createAsyncThunk<
    VideoProcess, 
    { token: string; id: string },
    { rejectValue: APIError } 
>(
    "videoProcess/show",
    async ({ token, id }, { rejectWithValue }) => {
        try {
            const { data } = await axios.get<VideoProcess>(`${BASE_URL}/videoProcess/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data;
        } catch (error) {
            const axiosError = error as AxiosError<APIError>;
            return rejectWithValue(
                axiosError.response?.data || { message: 'Failed to fetch video process' }
            );
        }
    }
);

// Create a new video process
export const createVideoProcess = createAsyncThunk<
    VideoProcess,
    {
        token: string;
        video: string;
        questionId: string;
        themeId: string;
        musicId: string;
        fontSize: string;
        fontColor: string;
        fontFamily: string;
        questionVideo: string;
        animation: string;
    },
    { rejectValue: APIError } 
>(
    "videoProcess/create",
    async (values, { rejectWithValue }) => {
        try {
            const {
                token,
                video,
                questionId,
                themeId,
                musicId,
                fontSize,
                fontColor,
                fontFamily,
                questionVideo,
                animation
            } = values;

            const formData = new FormData();
            formData.append("video", video);
            formData.append("questionId", questionId);
            formData.append("themeId", themeId);
            formData.append("musicId", musicId);
            formData.append("fontSize", fontSize);
            formData.append("fontColor", fontColor);
            formData.append("fontFamily", fontFamily);
            formData.append("questionVideo", questionVideo);
            formData.append("animation", animation);

            const { data } = await axios.post<VideoProcess>(
                `${BASE_URL}/videoProcess/create`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            // Log successful response
            // console.log('API response:', data);

            return data;
        } catch (error) {
            const axiosError = error as AxiosError<APIError>;

            return rejectWithValue(
                axiosError.response?.data || { message: 'Failed to create video process' }
            );
        }
    }
);

// Update an existing video process
export const updateVideoProcess = createAsyncThunk<
    VideoProcess, 
    {
        token: string;
        video?: string;
        startValue: any;
        endValue: any;
        id: string;
        questionVideo?: string;
    },
    { rejectValue: APIError } 
>(
    "videoProcess/update",
    async (values, { rejectWithValue }) => {
        try {
            const { token, video, startValue, endValue, id, questionVideo } = values;

            const formData = new FormData();
            if (video) { formData.append("video", video); }
            if (questionVideo) { formData.append("questionVideo", questionVideo); }

            formData.append("startValue", startValue);
            formData.append("endValue", endValue);

            const { data } = await axios.post<VideoProcess>(
                `${BASE_URL}/videoProcess/${id}`,
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
                axiosError.response?.data || { message: 'Failed to update video process' }
            );
        }
    }
);

// Compile a video process
export const compileVideoProcess = createAsyncThunk<
    VideoProcess, 
    { token: string; type: string }, 
    { rejectValue: APIError } 
>(
    "videoProcess/compile",
    async ({ token, type }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append("type", type);

            console.log("Envoi de la requête compile video avec :", {
                url: `${BASE_URL}/videoProcess/compile`,
                token,
                type,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
                formDataEntries: [...formData.entries()],
            });

            const { data } = await axios.post<VideoProcess>(
                `${BASE_URL}/videoProcess/compile`,
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
            console.error("Erreur lors de la compilation vidéo :", axiosError.response?.status, axiosError.response?.data);
            return rejectWithValue(
                axiosError.response?.data || { message: 'Failed to compile video process' }
            );
        }
    }
);

// Delete a video process
export const deleteVideoProcess = createAsyncThunk<
    VideoProcess, 
    { token: string; id: string }, 
    { rejectValue: APIError } 
>(
    "videoProcess/delete",
    async ({ token, id }, { rejectWithValue }) => {
        try {
            const { data } = await axios.delete<VideoProcess>(
                `${BASE_URL}/videoProcess/${id}`,
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
                axiosError.response?.data || { message: 'Failed to delete video process' }
            );
        }
    }
);
