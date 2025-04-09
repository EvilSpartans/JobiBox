import {createAsyncThunk} from '@reduxjs/toolkit';
import axios, {AxiosError} from 'axios';
import {Post} from '../models/Post';
import { APIError } from "../models/ApiError";

const BASE_URL = `${process.env.REACT_APP_BASE_URL}`;

export const createPost = createAsyncThunk<
  Post,
  {
    token: string;
    title: string;
    description: string;
    category: string;
    subCategory: string;
    city: string;
    contracts: string;
    formation: boolean;
    remote: string;
    video: string;
    image: File;
    date: string;
    businessId: string | null,
    portal: string,
    km: string;
    createdFrom: string;
    diploma: string;
  },
  {rejectValue: APIError}
>('post/create', async (values, {rejectWithValue}) => {
  const {
    token,
    title,
    description,
    category,
    subCategory,
    city,
    contracts,
    formation,
    remote,
    video,
    image,
    date,
    businessId,
    portal,
    km,
    createdFrom,
    diploma,
  } = values;

  try {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('subCategory', subCategory);
    formData.append('city', city);
    formData.append('contracts', contracts);
    formData.append('km', km);
    formData.append('formation', formation ? "Oui" : "Non");
    formData.append('remote', remote);
    formData.append('video', video);
    formData.append('date', date);
    if (businessId) formData.append("businessId", businessId);
    formData.append("portal", portal);
    formData.append('diploma', diploma);
    formData.append('createdFrom', createdFrom);
    formData.append('image', image);

    const {data} = await axios.post<Post>(`${BASE_URL}/post/create`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error) {
    console.log(error);
    const axiosError = error as AxiosError<APIError>;
    return rejectWithValue(
      axiosError.response?.data || {message: 'Failed to create post'},
    );
  }
});

export const getPosts = createAsyncThunk<
Post[], 
{ token: string; id: string },  
    { rejectValue: APIError } 
>(
    "api/posts",
    async ({ token, id }, { rejectWithValue }) => {
        try {
            const { data } = await axios.get<Post[]>(`${BASE_URL}/posts/user/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data;
        } catch (error) {
            const axiosError = error as AxiosError<APIError>;
            return rejectWithValue(
                axiosError.response?.data || { message: 'Failed to fetch video posts' }
            );
        }
    }
);

