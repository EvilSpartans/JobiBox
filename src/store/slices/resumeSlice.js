import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const AWS_RESUME_URL = process.env.REACT_APP_AWS_BASE_URL_RESUME;

const initialState = {
 status: "idle",
 error: null,
 resume: null,
 //  previewHtml: null,
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
 },
);

export const createResume = createAsyncThunk(
 "resume/create",
 async (
  { token, title, template, mainColor, anonymous },
  { rejectWithValue },
 ) => {
  try {
   const body = { title, template, mainColor };
   if (anonymous !== undefined) body.anonymous = anonymous;
   const { data } = await axios.post(`${BASE_URL}/resume/create`, body, {
    headers: {
     Authorization: `Bearer ${token}`,
     "Content-Type": "application/json",
    },
   });

   return data;
  } catch (error) {
   return rejectWithValue(error.response?.data);
  }
 },
);

export const previewResume = createAsyncThunk( // depreciated
 "resume/preview",
 async ({ token, id, lang }, { rejectWithValue }) => {
  try {
   const params = {};
   if (lang) params.lang = lang;

   const { data } = await axios.get(`${BASE_URL}/resume/${id}/preview`, {
    headers: {
     Authorization: `Bearer ${token}`,
    },
    params,
   });

   return data;
  } catch (error) {
   return rejectWithValue(error.response?.data);
  }
 },
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

   if (payload.ats !== undefined) {
    formData.append("ats", payload.ats ? "true" : "false");
   }

   if (payload.anonymous !== undefined) {
    formData.append("anonymous", payload.anonymous ? "true" : "false");
   }

   if (payload.locale !== undefined) {
    formData.append("locale", payload.locale);
   }

   if (payload.qrcodePostId !== undefined) {
    formData.append("qrcodePostId", payload.qrcodePostId ?? "");
   }

   if (payload.alternanceDuration !== undefined) {
    formData.append("alternanceDuration", payload.alternanceDuration);
   }

   if (payload.alternanceStartDate !== undefined) {
    formData.append("alternanceStartDate", payload.alternanceStartDate || "");
   }

   if (payload.age !== undefined) {
    formData.append(
     "age",
     payload.age === "" || payload.age == null ? "" : String(payload.age),
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

   if (Array.isArray(payload.softSkills)) {
    payload.softSkills.forEach((softSkill, i) => {
     formData.append(`softSkills[${i}]`, softSkill);
    });
   }

   if (Array.isArray(payload.interests)) {
    payload.interests.forEach((item, i) => {
     formData.append(`interests[${i}]`, item);
    });
   }

   if (payload.socialNetworks !== undefined) {
    const networks = Array.isArray(payload.socialNetworks)
     ? payload.socialNetworks.filter((sn) => sn && (sn.platform || sn.url))
     : [];
    formData.append("socialNetworks", JSON.stringify(networks));
   }

   if (Array.isArray(payload.drivingLicenses)) {
    payload.drivingLicenses.forEach((license, i) => {
     formData.append(`drivingLicenses[${i}]`, license);
    });
   }

   if (payload.other !== undefined) {
    formData.append("other", payload.other || "");
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
 },
);

export const uploadResumeAudio = createAsyncThunk(
 "resume/audio",
 async ({ token, key, audio, lang }, { rejectWithValue }) => {
  try {
   const formData = new FormData();
   formData.append("key", key);
   formData.append("audio", audio);
   formData.append("lang", lang || "fr");

   const { data } = await axios.post(`${BASE_URL}/resume/audio`, formData, {
    headers: {
     Authorization: `Bearer ${token}`,
    },
   });

   return data;
  } catch (error) {
   return rejectWithValue(error.response?.data);
  }
 },
);

export const uploadResumeText = createAsyncThunk(
 "resume/text",
 async ({ token, resumeId, key, text, lang }, { rejectWithValue }) => {
  try {
   const formData = new FormData();
   formData.append("key", key);
   formData.append("text", text);
   formData.append("lang", lang || "fr");
   if (resumeId) formData.append("resumeId", resumeId);

   const { data } = await axios.post(`${BASE_URL}/resume/audio`, formData, {
    headers: {
     Authorization: `Bearer ${token}`,
    },
   });

   return data;
  } catch (error) {
   return rejectWithValue(error.response?.data);
  }
 },
);

export const getResumeDownloadUrl = (id, lang) => {
 if (!id) return "";
 const url = `${BASE_URL}/resume/${id}/download`;
 if (lang) return `${url}?lang=${encodeURIComponent(lang)}`;
 return url;
};

export const translateResume = createAsyncThunk(
 "resume/translate",
 async ({ token, id, language, save = true }, { rejectWithValue }) => {
  try {
   const { data } = await axios.post(
    `${BASE_URL}/resume/${id}/translate`,
    { language, save },
    {
     headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
     },
    },
   );
   return data;
  } catch (error) {
   return rejectWithValue(error.response?.data || error.message);
  }
 },
);

export const selectResumePdfUrl = (state) => {
 const resume = state.resume.resume;
 if (!resume?.cvPdfPath) return null;
 const base = getResumePdfUrlBase(resume);
 return `${base}`;
};

function getResumePdfUrlBase(resume) {
 const path = resume?.cvPdfPath;
 if (!path) return null;
 if (/^https?:\/\//i.test(path)) return path;
 const normalized = path.replace(/^\//, "");
 const base = resume?.assetsOnS3
  ? AWS_RESUME_URL
  : BASE_URL;
 if (!base) return null;
 return base.replace(/\/?$/, "/") + normalized;
}

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

   // TRANSLATE
   .addCase(translateResume.fulfilled, (state, action) => {
    if (action.payload && typeof action.payload === "object" && state.resume) {
     state.resume = { ...state.resume, ...action.payload };
    }
   })

   // UPDATE
   .addCase(updateResume.pending, (state) => {
    state.status = "loading";
   })
   .addCase(updateResume.fulfilled, (state, action) => {
    state.status = "succeeded";
    state.resume = action.payload;
   })
   .addCase(updateResume.rejected, (state) => {
    state.status = "failed";
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
   })

   // TEXT
   .addCase(uploadResumeText.pending, (state) => {
    state.status = "loading";
   })
   .addCase(uploadResumeText.fulfilled, (state) => {
    state.status = "succeeded";
   })
   .addCase(uploadResumeText.rejected, (state, action) => {
    state.status = "failed";
    state.error = action.payload;
   });
 },
});

export const { resetResumeState } = ResumeSlice.actions;
export default ResumeSlice.reducer;
