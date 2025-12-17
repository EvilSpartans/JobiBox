import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const initialState = {
  status: "idle",
  error: null,
  resume: null,
  previewHtml: null,
};

export const getResume = createAsyncThunk(
  "resume/get",
  async ({ token, id }, { rejectWithValue }) => {
    try {
      console.log("➡️ getResume appelé avec id :", id);

      const { data } = await axios.get(`${BASE_URL}/resume/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ getResume data reçue :", data);

      return data;
    } catch (error) {
      console.error("❌ getResume error :", error.response?.data || error);
      return rejectWithValue(error.response?.data);
    }
  }
);

export const createResume = createAsyncThunk(
  "resume/create",
  async ({ token, title, template, mainColor }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/resume/create`,
        {
          title,
          template,
          mainColor, 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const previewResume = createAsyncThunk(
  "resume/preview",
  async ({ token, id }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/resume/${id}/preview`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateResume = createAsyncThunk(
  "resume/update",
  async ({ token, id, payload }, { getState, rejectWithValue }) => {
    try {
      const { resume } = getState().resume;
      if (!resume) throw new Error("Resume non chargé");

      const formData = new FormData();

      formData.append("title", payload.title ?? resume.title);

      if (payload.presentation !== undefined) {
        formData.append("presentation", payload.presentation);
      }

      if (payload.template !== undefined) {
        formData.append("template", payload.template);
      }

      if (payload.mainColor !== undefined) {
        formData.append("mainColor", payload.mainColor);
      }

      if (payload.qrcodePostId !== undefined) {
        formData.append("qrcodePostId", payload.qrcodePostId ?? "");
      }

      if (payload.alternanceDuration !== undefined) {
        formData.append("alternanceDuration", payload.alternanceDuration);
      }

      if (payload.alternanceStartDate !== undefined) {
        formData.append(
          "alternanceStartDate",
          payload.alternanceStartDate || ""
        );
      }

      if (payload.avatar instanceof File) {
        formData.append("avatar", payload.avatar);
      }

      if (payload.personalInfo) {
        Object.entries(payload.personalInfo).forEach(([key, value]) => {
          if (value !== undefined) {
            formData.append(`personalInfo[${key}]`, value);
          }
        });
      }

      if (Array.isArray(payload.contractType)) {
        payload.contractType.forEach((type) => {
          formData.append("contractType[]", type);
        });
      }

      if (Array.isArray(payload.languages)) {
        payload.languages.forEach((lang, i) => {
          if (lang?.label !== undefined) {
            formData.append(`languages[${i}][label]`, lang.label);
          }
          if (lang?.level !== undefined) {
            formData.append(`languages[${i}][level]`, lang.level);
          }
        });
      }

      if (Array.isArray(payload.experiences)) {
        payload.experiences.forEach((exp, i) => {
          Object.entries(exp).forEach(([key, value]) => {
            if (value !== undefined) {
              formData.append(`experiences[${i}][${key}]`, value);
            }
          });
        });
      }

      if (Array.isArray(payload.trainings)) {
        payload.trainings.forEach((training, i) => {
          Object.entries(training).forEach(([key, value]) => {
            if (value !== undefined) {
              formData.append(`trainings[${i}][${key}]`, value);
            }
          });
        });
      }

      if (Array.isArray(payload.skills)) {
        payload.skills.forEach((skill, i) => {
          formData.append(`skills[${i}]`, skill);
        });
      }

      const { data } = await axios.post(`${BASE_URL}/resume/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const uploadResumeAudio = createAsyncThunk(
  "resume/audio",
  async ({ token, key, audio }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("key", key);
      formData.append("audio", audio);

      const { data } = await axios.post(`${BASE_URL}/resume/audio`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const ResumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    resetResumeState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getResume.fulfilled, (state, action) => {
        console.log("📦 Resume stocké dans le state :", action.payload);
        state.resume = action.payload;
      })

      // CREATE
      .addCase(createResume.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createResume.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.resume = action.payload;
      })
      .addCase(createResume.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // PREVIEW
      .addCase(previewResume.fulfilled, (state, action) => {
        state.previewHtml = action.payload;
      })

      // UPDATE
      .addCase(updateResume.fulfilled, (state, action) => {
        state.resume = action.payload;
      })

      // AUDIO
      .addCase(uploadResumeAudio.pending, (state) => {
        state.status = "loading";
      })
      .addCase(uploadResumeAudio.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(uploadResumeAudio.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetResumeState } = ResumeSlice.actions;
export default ResumeSlice.reducer;
