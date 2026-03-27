import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { normalizeAiTrainingDates } from "../../utils/DateUtils";

/**
 * ResumeUpdateDto : trainings[i][degree|school|startDate|endDate|description], idem experiences avec title|company|…
 * Pas de JSON string pour tout le tableau — une clé par champ (multipart/form-data).
 */
function appendItemWithDateFields(formData, prefix, item) {
 if (!item || typeof item !== "object") return;
 const normalized = normalizeAiTrainingDates({ ...item });
 Object.entries(normalized).forEach(([key, value]) => {
  if (value === undefined) return;
  if (key.startsWith("__")) return;
  if (key === "startDate" || key === "endDate") return;
  formData.append(`${prefix}[${key}]`, String(value ?? ""));
 });

 const sd = String(normalized.startDate ?? "");
 const ed = String(normalized.endDate ?? "");
 formData.append(`${prefix}[startDate]`, sd);
 formData.append(`${prefix}[endDate]`, ed);
 /** Symfony / DTO souvent en snake_case pour le multipart */
 formData.append(`${prefix}[start_date]`, sd);
 formData.append(`${prefix}[end_date]`, ed);
}

function isEmptyResumeDate(v) {
 if (v === undefined || v === null) return true;
 if (typeof v === "string" && v.trim() === "") return true;
 return false;
}

function patchItemDatesFromSent(serverItem, sentItem) {
 if (!sentItem) return serverItem;
 /** Réponse API incomplète ou null : on garde ce qu’on a posté. */
 if (!serverItem) return sentItem;
 const next = { ...serverItem };
 if (isEmptyResumeDate(next.startDate) && !isEmptyResumeDate(sentItem.startDate)) {
  next.startDate = sentItem.startDate;
 }
 if (isEmptyResumeDate(next.endDate) && !isEmptyResumeDate(sentItem.endDate)) {
  next.endDate = sentItem.endDate;
 }
 return next;
}

/** Réponse POST parfois sans startDate/endDate (année seule) : on réinjecte ce qu'on a envoyé. */
function mergeResumeWithSentDates(serverResume, sentPayload) {
 if (!serverResume || typeof serverResume !== "object" || !sentPayload || typeof sentPayload !== "object") {
  return serverResume;
 }
 const next = { ...serverResume };

 const mergeList = (key) => {
  const sent = sentPayload[key];
  if (!Array.isArray(sent) || sent.length === 0) return;
  const st = serverResume[key];
  if (!Array.isArray(st) || st.length === 0) {
   next[key] = sent;
   return;
  }
  if (st.length === sent.length) {
   next[key] = st.map((item, i) => patchItemDatesFromSent(item, sent[i]));
  } else {
   next[key] = sent;
  }
 };

 mergeList("trainings");
 mergeList("experiences");

 /** POST : la réponse Symfony omet parfois ats / anonymous alors que le CV est bien à jour. */
 if (sentPayload.ats !== undefined) {
  next.ats = sentPayload.ats;
 }
 if (sentPayload.anonymous !== undefined) {
  next.anonymous = sentPayload.anonymous;
 }

 return next;
}

const BASE_URL = process.env.REACT_APP_BASE_URL;
/** Base complète legacy — utilisée si REACT_APP_AWS_CLOUDFRONT est une autre distribution. */
const AWS_URL_FOR_RESUME_PDFS =
 process.env.REACT_APP_AWS_URL || process.env.REACT_APP_AWS_BASE_URL_RESUME || "";

/** Distribution CloudFront des PDFs CV (identifiant seul). Surcharge via REACT_APP_AWS_CLOUDFRONT. */
const DEFAULT_RESUME_CLOUDFRONT_DIST = "dfrad1ytun997";

/**
 * https://{id}.cloudfront.net — même logique que Symfony (AWS_CLOUDFRONT).
 */
function getCloudFrontPdfBaseUrlFromEnv() {
 const id = (process.env.REACT_APP_AWS_CLOUDFRONT || DEFAULT_RESUME_CLOUDFRONT_DIST).trim();
 if (/^https?:\/\//i.test(id)) {
  return id.replace(/\/+$/, "");
 }
 return `https://${id}.cloudfront.net`;
}

function stripQueryAndHash(url) {
 const s = String(url).trim();
 const [base] = s.split(/[?#]/);
 return base || s;
}

function firstNonEmptyString(...candidates) {
 for (const c of candidates) {
  if (c === undefined || c === null) continue;
  const s = String(c).trim();
  if (s !== "") return s;
 }
 return undefined;
}

/**
 * Symfony / sérialiseur : cv_pdf_path, cv_pdf_url, assets_on_s3.
 * On fusionne en camelCase pour tout le slice + écrans.
 */
function normalizeResumeFromApi(raw) {
 if (!raw || typeof raw !== "object") return raw;
 const cvPdfPath = firstNonEmptyString(raw.cvPdfPath, raw.cv_pdf_path);
 const cvPdfUrl = firstNonEmptyString(raw.cvPdfUrl, raw.cv_pdf_url);
 let assetsOnS3 = raw.assetsOnS3 ?? raw.assets_on_s3;
 if (assetsOnS3 === "true" || assetsOnS3 === "1" || assetsOnS3 === 1) assetsOnS3 = true;
 if (assetsOnS3 === "false" || assetsOnS3 === "0" || assetsOnS3 === 0) assetsOnS3 = false;

 return {
  ...raw,
  cvPdfPath,
  cvPdfUrl,
  assetsOnS3,
 };
}

const initialState = {
 status: "idle",
 error: null,
 resume: null,
 /** Incrémenté quand cvPdfPath change → cache-buster visionneuse PDF (équivalent thumbnailVersions). */
 pdfEmbedLocalVersion: 0,
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

/**
 * POST /api/resume/{id} — corps formulaire (multipart FormData), pas JSON seul pour trainings/experiences.
 * JWT : Authorization Bearer. Champs imbriqués : trainings[i][startDate], experiences[i][title], etc.
 */
export const updateResume = createAsyncThunk(
 "resume/update",
 async ({ token, id, payload }, { getState, rejectWithValue }) => {
  try {
   const { resume } = getState().resume;
   if (!resume) throw new Error("Resume non chargé");

   const formData = new FormData();

   const title = String(payload.title ?? resume.title ?? "").trim();
   formData.append("title", title || "CV");

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
     appendItemWithDateFields(formData, `experiences[${i}]`, exp);
    });
   }

   if (Array.isArray(payload.trainings)) {
    payload.trainings.forEach((training, i) => {
     appendItemWithDateFields(formData, `trainings[${i}]`, training);
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

/**
 * URL « brute » du PDF (sans ?v= ni #) : CloudFront + chemin issu du resume, ou URL complète renvoyée par l’API.
 */
export function getResumePdfUrl(resume) {
 if (!resume || typeof resume !== "object") return null;
 const r = normalizeResumeFromApi(resume);

 const fromApi = r.cvPdfUrl;
 if (fromApi != null && String(fromApi).trim() !== "") {
  const u = String(fromApi).trim();
  if (/^https?:\/\//i.test(u)) return stripQueryAndHash(u);
 }

 const path = r.cvPdfPath;
 if (!path) return null;
 const trimmed = String(path).trim();
 if (/^https?:\/\//i.test(trimmed)) return stripQueryAndHash(trimmed);

 const normalized = trimmed.replace(/^\//, "");
 if (!normalized) return null;

 const cfBase = getCloudFrontPdfBaseUrlFromEnv();
 const fromCf = joinUrlBaseAndPath(cfBase, normalized);
 if (fromCf) return fromCf;
 const legacy = AWS_URL_FOR_RESUME_PDFS;
 if (legacy) return joinUrlBaseAndPath(String(legacy).replace(/\/+$/, ""), normalized);
 return null;
}

/** URL iframe : même base + ?v= cache-buster + #toolbar=… (comme l’aperçu Angular / navigateur). */
export function getResumePdfEmbedUrl(resume, localVersion = 0) {
 const url = getResumePdfUrl(resume);
 if (!url) return null;
 const serverTs = String(resume?.updatedAt ?? resume?.createdAt ?? "").replace(/\D/g, "");
 const v =
  (localVersion ?? 0) > 0
   ? String(localVersion)
   : serverTs.length >= 10
    ? serverTs.slice(0, 13)
    : String(resume?.id ?? "1");
 const sep = url.includes("?") ? "&" : "?";
 return `${url}${sep}v=${encodeURIComponent(v)}#toolbar=0&navpanes=0&scrollbar=0`;
}

export const selectResumePdfUrl = (state) => {
 const resume = state.resume.resume;
 if (!resume) return null;
 return getResumePdfUrl(resume);
};

export const selectResumePdfEmbedUrl = (state) => {
 const resume = state.resume.resume;
 if (!resume) return null;
 const localVersion = state.resume.pdfEmbedLocalVersion ?? 0;
 return getResumePdfEmbedUrl(resume, localVersion);
};

function joinUrlBaseAndPath(base, pathSegment) {
 if (!base || !pathSegment) return null;
 const b = String(base).replace(/\/+$/, "");
 const p = String(pathSegment).replace(/^\/+/, "");
 return `${b}/${p}`;
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
    const prevPath = state.resume?.cvPdfPath ?? state.resume?.cv_pdf_path ?? "";
    const prevUrl = state.resume?.cvPdfUrl ?? state.resume?.cv_pdf_url ?? "";
    state.resume = normalizeResumeFromApi(action.payload);
    const nextPath = state.resume?.cvPdfPath ?? "";
    const nextUrl = state.resume?.cvPdfUrl ?? "";
    if (prevPath !== nextPath || prevUrl !== nextUrl) {
     state.pdfEmbedLocalVersion = (state.pdfEmbedLocalVersion ?? 0) + 1;
    }
   })

   // CREATE
   .addCase(createResume.pending, (state) => {
    state.status = "loading";
   })
   .addCase(createResume.fulfilled, (state, action) => {
    state.status = "succeeded";
    state.resume = normalizeResumeFromApi(action.payload);
    const p = action.payload;
    if (p?.cvPdfPath || p?.cv_pdf_path || p?.cvPdfUrl || p?.cv_pdf_url) {
     state.pdfEmbedLocalVersion = (state.pdfEmbedLocalVersion ?? 0) + 1;
    }
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
     const prevPath = state.resume.cvPdfPath ?? "";
     const prevUrl = state.resume.cvPdfUrl ?? "";
     state.resume = normalizeResumeFromApi({ ...state.resume, ...action.payload });
     const nextPath = state.resume.cvPdfPath ?? "";
     const nextUrl = state.resume.cvPdfUrl ?? "";
     if (prevPath !== nextPath || prevUrl !== nextUrl) {
      state.pdfEmbedLocalVersion = (state.pdfEmbedLocalVersion ?? 0) + 1;
     }
    }
   })

   // UPDATE
   .addCase(updateResume.pending, (state) => {
    state.status = "loading";
   })
   .addCase(updateResume.fulfilled, (state, action) => {
    state.status = "succeeded";
    const prevPath = state.resume?.cvPdfPath ?? "";
    const prevUrl = state.resume?.cvPdfUrl ?? "";
    const sent = action.meta?.arg?.payload;
    const merged = mergeResumeWithSentDates(action.payload, sent);
    const nextPath = merged?.cvPdfPath ?? merged?.cv_pdf_path ?? "";
    const nextUrl = merged?.cvPdfUrl ?? merged?.cv_pdf_url ?? "";
    state.resume = normalizeResumeFromApi(merged);
    if (prevPath !== nextPath || prevUrl !== nextUrl) {
     state.pdfEmbedLocalVersion = (state.pdfEmbedLocalVersion ?? 0) + 1;
    }
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
