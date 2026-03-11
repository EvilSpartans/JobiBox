import React, { useCallback, useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PulseLoader from "react-spinners/PulseLoader";
import { useDispatch, useSelector } from "react-redux";

import ResumeHeader from "../../components/resume/ResumeHeader";

import {
 getResume,
 uploadResumeAudio,
 uploadResumeText,
 updateResume,
} from "../../store/slices/resumeSlice";
import { getCurrentLang } from "../../i18n";
import {
 SMART_GENERATION_STEP_KEYS,
 SMART_GENERATION_STEPS_CONFIG,
} from "../../utils/IAResume";
import Footer from "../../components/resume/Footer";
import CVStepper from "../../components/resume/Stepper";
import TrainingForm from "../../components/resume/TrainingForm";
import GlowBackground from "../../components/resume/GlowBackground";
import ExperienceForm from "../../components/resume/ExperienceForm";
import { formatDate, parseDate } from "../../utils/DateUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faPenToSquare } from "@fortawesome/free-solid-svg-icons";

/* ---------------- CONFIG ---------------- */

const STEP_KEYS = SMART_GENERATION_STEP_KEYS;
const STEPS_CONFIG = SMART_GENERATION_STEPS_CONFIG;

/* ---------------- COMPONENT ---------------- */

export default function SmartGeneration() {
 const navigate = useNavigate();
 const dispatch = useDispatch();
 const { t } = useTranslation();

 const user = useSelector((state) => state.user.user);
 const { resume, status } = useSelector((state) => state.resume);

 const loading = status === "loading";

 const [step, setStep] = useState(1);
 const [validatedSteps, setValidatedSteps] = useState([]);
 const [recording, setRecording] = useState(false);
 const [countdown, setCountdown] = useState(null);
 const [isUploading, setIsUploading] = useState(false);
 const [confirmOverwrite, setConfirmOverwrite] = useState(false);
 const [confirmOverwriteMode, setConfirmOverwriteMode] = useState("audio");
 const [isSaving, setIsSaving] = useState(false);
 const [editingItemIndex, setEditingItemIndex] = useState(null);
 const [inputMode, setInputMode] = useState("audio");
 const [textInput, setTextInput] = useState("");
 const [textError, setTextError] = useState(null);

 const mediaRecorderRef = useRef(null);
 const audioChunksRef = useRef([]);

 const currentKey = STEP_KEYS[step];
 const current = STEPS_CONFIG.find((s) => s.id === step);
 const currentStep = 5;
 const completedSteps = [1, 2, 3, 4];

 const [presentationDraft, setPresentationDraft] = useState("");

 const clean = (value) =>
  typeof value === "string" && value.trim() ? value.trim() : null;

 const joinDefined = (parts, separator = " — ") =>
  parts.filter(Boolean).join(separator);

 const existingText =
  currentKey === "presentation"
   ? resume?.presentation
   : currentKey === "trainings"
     ? resume?.trainings
        ?.map((t) => {
         const main = joinDefined([clean(t.degree), clean(t.school)]);

         const dates = joinDefined(
          [clean(t.startDate), clean(t.endDate)],
          " → ",
         );

         return joinDefined([main, dates ? `(${dates})` : null], " ");
        })
        .join("\n")
     : currentKey === "experiences"
       ? resume?.experiences
          ?.map((e) => {
           const main = joinDefined([clean(e.job), clean(e.company)]);

           const dates = joinDefined(
            [clean(e.startDate), clean(e.endDate)],
            " → ",
           );

           return joinDefined([main, dates ? `(${dates})` : null], " ");
          })
          .join("\n")
       : "";

 const hasExistingAnswer = Boolean(existingText && existingText.length > 0);
 const recordButtonRef = useRef(null);
 const isKeyPressed = useRef(false);

 /* ----------- LOAD RESUME ----------- */

 useEffect(() => {
  const handleKeyDown = (event) => {
   if (isKeyPressed.current) return;

   const activeElement = document.activeElement;
   const isTyping =
    activeElement?.tagName === "INPUT" ||
    activeElement?.tagName === "TEXTAREA" ||
    activeElement?.isContentEditable;

   if (isTyping) return;

   // accepte TOUTES les touches du pad / clavier
   if (/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/.test(event.key)) {
    isKeyPressed.current = true;

    if (recordButtonRef.current && !recordButtonRef.current.disabled) {
     recordButtonRef.current.click();
    }
   }
  };

  const handleKeyUp = () => {
   isKeyPressed.current = false;
  };

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);

  return () => {
   window.removeEventListener("keydown", handleKeyDown);
   window.removeEventListener("keyup", handleKeyUp);
  };
 }, []);

 useEffect(() => {
  const resumeId = localStorage.getItem("resumeId");
  if (!resumeId || !user?.token) return;

  dispatch(getResume({ token: user.token, id: resumeId }));
 }, [dispatch, user]);

 useEffect(() => {
  if (!resume) return;

  const done = [];

  if (resume.presentation && resume.presentation.length > 0) {
   done.push(1);
  }

  if (Array.isArray(resume.trainings) && resume.trainings.length > 0) {
   done.push(2);
  }

  if (Array.isArray(resume.experiences) && resume.experiences.length > 0) {
   done.push(3);
  }

  setValidatedSteps(done);
 }, [resume]);

 useEffect(() => {
  setTextInput("");
  setTextError(null);
 }, [step]);

 /* ----------- RECORDING ----------- */

 const startCountdownAndRecord = () => {
  if (recording || loading || isUploading) return;

  let value = 3;
  setCountdown(value);

  const interval = setInterval(() => {
   value -= 1;
   setCountdown(value);

   if (value === 0) {
    clearInterval(interval);
    setCountdown(null);
    startRecording();
   }
  }, 700);
 };

 const startRecording = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mediaRecorder = new MediaRecorder(stream);

  audioChunksRef.current = [];

  mediaRecorder.ondataavailable = (e) => {
   if (e.data.size) audioChunksRef.current.push(e.data);
  };

  mediaRecorder.onstop = async () => {
   const audioBlob = new Blob(audioChunksRef.current, {
    type: "audio/wav",
   });

   await handleAudioComplete(audioBlob);
   stream.getTracks().forEach((t) => t.stop());
  };

  mediaRecorderRef.current = mediaRecorder;
  mediaRecorder.start();
  setRecording(true);
 };

 const stopRecording = () => {
  mediaRecorderRef.current?.stop();
  setRecording(false);
 };

 /* ----------- AUDIO → IA → UPDATE ----------- */

 const handleAudioComplete = async (audioBlob) => {
  if (!resume?.id || !user?.token) return;

  setIsUploading(true); // 🔒 lock UI

  try {
   const key = STEP_KEYS[step];

   const audioFile = new File([audioBlob], `${key}.wav`, {
    type: "audio/wav",
   });

   const aiResult = await dispatch(
    uploadResumeAudio({
     token: user.token,
     key,
     audio: audioFile,
     lang: getCurrentLang() || "fr",
    }),
   ).unwrap();

   const payload = {
    // 🔒 TOUT ce qui existe déjà (OBLIGATOIRE)
    title: resume.title,
    template: resume.template,
    mainColor: resume.mainColor,
    qrcodePostId: resume.qrcodePostId,
    personalInfo: resume.personalInfo,
    contractType: resume.contractType || [],
    alternanceDuration: resume.alternanceDuration || "",
    alternanceStartDate: resume.alternanceStartDate || "",
    languages: resume.languages || [],
    skills: resume.skills || [],
    softSkills: resume.softSkills || [],

    // valeurs existantes
    presentation: resume.presentation ?? "",
    trainings: resume.trainings ?? [],
    experiences: resume.experiences ?? [],

    // ✅ SEULEMENT la clé courante est modifiée
    ...(key === "presentation" && { presentation: aiResult.text || "" }),
    ...(key === "trainings" && {
  trainings: aiResult.json?.trainings?.map((t) => ({
    ...t,
    startDate: formatDate(parseDate(t.startDate)),
    endDate: formatDate(parseDate(t.endDate)),
  })),
}),
   ...(key === "experiences" && {
  experiences: aiResult.json?.experiences?.map((e) => ({
    ...e,
    startDate: formatDate(parseDate(e.startDate)),
    endDate: formatDate(parseDate(e.endDate)),
  })),
}),

   };

   await dispatch(
    updateResume({
     token: user.token,
     id: resume.id,
     payload,
    }),
   ).unwrap();

   setValidatedSteps((prev) => [...new Set([...prev, step])]);
  } catch (e) {
   console.error("Erreur IA :", e);
  } finally {
   setIsUploading(false); // 🔓 unlock UI
  }
 };

 const handleTextSend = async (textToSend) => {
  if (!textToSend?.trim()) return;
  if (!resume?.id || !user?.token) {
   setTextError("CV non chargé. Actualise la page et réessaie.");
   return;
  }

  setIsUploading(true);
  setTextError(null);

  try {
   const key = STEP_KEYS[step];

   const aiResult = await dispatch(
    uploadResumeText({
     token: user.token,
     resumeId: resume.id,
     key,
     text: textToSend.trim(),
     lang: getCurrentLang() || "fr",
    }),
   ).unwrap();

   const payload = {
    title: resume.title,
    template: resume.template,
    mainColor: resume.mainColor,
    qrcodePostId: resume.qrcodePostId,
    personalInfo: resume.personalInfo,
    contractType: resume.contractType || [],
    alternanceDuration: resume.alternanceDuration || "",
    alternanceStartDate: resume.alternanceStartDate || "",
    languages: resume.languages || [],
    skills: resume.skills || [],
    softSkills: resume.softSkills || [],
    presentation: resume.presentation ?? "",
    trainings: resume.trainings ?? [],
    experiences: resume.experiences ?? [],
    ...(key === "presentation" && {
     presentation: typeof aiResult === "string" ? aiResult : (aiResult?.text || ""),
    }),
    ...(key === "trainings" &&
     Array.isArray(aiResult?.json?.trainings) && {
     trainings: aiResult.json.trainings.map((t) => ({
      ...t,
      startDate: formatDate(parseDate(t.startDate)),
      endDate: formatDate(parseDate(t.endDate)),
     })),
    }),
    ...(key === "experiences" &&
     Array.isArray(aiResult?.json?.experiences) && {
     experiences: aiResult.json.experiences.map((e) => ({
      ...e,
      startDate: formatDate(parseDate(e.startDate)),
      endDate: formatDate(parseDate(e.endDate)),
     })),
    }),
   };

   await dispatch(
    updateResume({
     token: user.token,
     id: resume.id,
     payload,
    }),
   ).unwrap();

   setValidatedSteps((prev) => [...new Set([...prev, step])]);
   setTextInput("");
   setTextError(null);
  } catch (e) {
   console.error("Erreur IA texte :", e);
   const msg =
    (typeof e === "object" && (e?.message || e?.error)) ||
    (typeof e === "string" ? e : null) ||
    "Une erreur est survenue. Réessaie.";
   setTextError(msg);
  } finally {
   setIsUploading(false);
  }
 };

 const getNextIncompleteStep = () => {
  if (!validatedSteps.includes(1)) return 1;
  if (!validatedSteps.includes(2)) return 2;
  if (!validatedSteps.includes(3)) return 3;
  return null; // tout est fait
 };

 const allStepsCompleted = [1, 2, 3].every((s) => validatedSteps.includes(s));

 const buildPayload = (overrides = {}) => ({
  title: resume.title,
  template: resume.template,
  mainColor: resume.mainColor,
  qrcodePostId: resume.qrcodePostId,
  personalInfo: resume.personalInfo,
  contractType: resume.contractType || [],
  alternanceDuration: resume.alternanceDuration || "",
  alternanceStartDate: resume.alternanceStartDate || "",
   interests: resume.interests || [],
   socialNetworks: resume.socialNetworks || [],
   drivingLicenses: resume.drivingLicenses || [],
   other: resume.other,
  languages: resume.languages || [],
  skills: resume.skills || [],
  softSkills: resume.softSkills || [],
  presentation: resume.presentation ?? "",
  trainings: resume.trainings ?? [],
  experiences: resume.experiences ?? [],
  ...overrides,
 });

 useEffect(() => {
  if (resume?.presentation !== undefined) {
   setPresentationDraft(resume.presentation || "");
  }
 }, [resume?.presentation]);

 const savePresentation = useCallback(
  async (text) => {
   if (!resume?.id || !user?.token) return;
   if (text === resume.presentation) return;

   setIsSaving(true);
   try {
    await dispatch(
     updateResume({
      token: user.token,
      id: resume.id,
      payload: buildPayload({ presentation: text }),
     }),
    ).unwrap();

    if (text.trim().length > 0) {
     setValidatedSteps((prev) => [...new Set([...prev, 1])]);
    } else {
     setValidatedSteps((prev) => prev.filter((s) => s !== 1));
    }
   } catch (e) {
    console.error("Erreur mise à jour présentation:", e);
   } finally {
    setIsSaving(false);
   }
  },
  [resume, user, dispatch, buildPayload],
 );

 const debounceRef = useRef(null);

 const handlePresentationChange = (e) => {
  const text = e.target.value;
  setPresentationDraft(text);

  if (debounceRef.current) {
   clearTimeout(debounceRef.current);
  }

  debounceRef.current = setTimeout(() => {
   savePresentation(text);
  }, 800);
 };

 useEffect(() => {
  return () => {
   if (debounceRef.current) {
    clearTimeout(debounceRef.current);
   }
  };
 }, []);

 const handleTrainingChange = async (updatedTraining) => {
  if (!resume?.id || !user?.token) return;

  setIsSaving(true);
  try {
   const trainingToSave = {
    ...updatedTraining,
    startDate: formatDate(updatedTraining.startDate),
    endDate: formatDate(updatedTraining.endDate),
   };

   const newTrainings = resume.trainings.map((t, i) =>
    i === updatedTraining.__index ? trainingToSave : t,
   );

   await dispatch(
    updateResume({
     token: user.token,
     id: resume.id,
     payload: buildPayload({ trainings: newTrainings }),
    }),
   ).unwrap();
  } catch (e) {
   console.error("Erreur mise à jour formation:", e);
  } finally {
   setIsSaving(false);
  }
 };

 const handleTrainingDelete = async (index) => {
  if (!resume?.id || !user?.token) return;

  setIsSaving(true);
  try {
   const newTrainings = resume.trainings.filter((_, i) => i !== index);

   await dispatch(
    updateResume({
     token: user.token,
     id: resume.id,
     payload: buildPayload({ trainings: newTrainings }),
    }),
   ).unwrap();

   if (newTrainings.length === 0) {
    setValidatedSteps((prev) => prev.filter((s) => s !== 2));
   }
  } catch (e) {
   console.error("Erreur suppression formation:", e);
  } finally {
   setIsSaving(false);
  }
 };

 const handleExperienceChange = async (updatedExperience) => {
  if (!resume?.id || !user?.token) return;

  setIsSaving(true);
  try {
   const experienceToSave = {
    ...updatedExperience,
    startDate: formatDate(updatedExperience.startDate),
    endDate: formatDate(updatedExperience.endDate),
   };
   const newExperiences = resume.experiences.map((e, i) =>
    i === updatedExperience.__index ? experienceToSave : e,
   );

   await dispatch(
    updateResume({
     token: user.token,
     id: resume.id,
     payload: buildPayload({ experiences: newExperiences }),
    }),
   ).unwrap();
  } catch (e) {
   console.error("Erreur mise à jour expérience:", e);
  } finally {
   setIsSaving(false);
  }
 };

 const handleExperienceDelete = async (index) => {
  if (!resume?.id || !user?.token) return;

  setIsSaving(true);
  try {
   const newExperiences = resume.experiences.filter((_, i) => i !== index);

   await dispatch(
    updateResume({
     token: user.token,
     id: resume.id,
     payload: buildPayload({ experiences: newExperiences }),
    }),
   ).unwrap();

   if (newExperiences.length === 0) {
    setValidatedSteps((prev) => prev.filter((s) => s !== 3));
   }
  } catch (e) {
   console.error("Erreur suppression expérience:", e);
  } finally {
   setIsSaving(false);
  }
 };

 const getTrainingTitle = (t) =>
  joinDefined([clean(t.degree), clean(t.school)]) || t("resume.smartGeneration.untitledTraining");

 const getExperienceTitle = (e) =>
  joinDefined([clean(e.job) || clean(e.title), clean(e.company)]) || t("resume.smartGeneration.untitledExperience");

 const renderEditableResponse = () => {
  if (currentKey === "trainings" && resume?.trainings?.length > 0) {
   return (
    <div className="mt-6 space-y-4 text-left">
     <div className="flex items-center justify-between">
      <p className="text-sm text-emerald-300 font-semibold">
       {t("resume.smartGeneration.trainings")} ({resume.trainings.length}) :
      </p>
      {isSaving && (
       <span className="text-xs text-gray-400 flex items-center gap-2">
        <PulseLoader color="#10b981" size={6} /> {t("resume.smartGeneration.saving")}
       </span>
      )}
     </div>
     <p className="text-xs text-white/90 mb-3">{t("resume.smartGeneration.clickToEdit")}</p>
     <div className="space-y-2">
      {resume.trainings.map((training, index) => (
       <button
        key={index}
        type="button"
        onClick={() => setEditingItemIndex({ type: "training", index })}
        className="w-full text-left px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-500/40 transition flex items-center justify-between gap-2"
       >
        <span className="font-medium text-white truncate">{getTrainingTitle(training)}</span>
        <span className="text-emerald-400 text-sm flex-shrink-0">✎</span>
       </button>
      ))}
     </div>
    </div>
   );
  }

  if (currentKey === "experiences" && resume?.experiences?.length > 0) {
   return (
    <div className="mt-6 space-y-4 text-left">
     <div className="flex items-center justify-between">
      <p className="text-sm text-emerald-300 font-semibold">
       {t("resume.smartGeneration.experiencesList")} ({resume.experiences.length}) :
      </p>
      {isSaving && (
       <span className="text-xs text-gray-400 flex items-center gap-2">
        <PulseLoader color="#10b981" size={6} /> {t("resume.smartGeneration.saving")}
       </span>
      )}
     </div>
     <p className="text-xs text-white/90 mb-3">{t("resume.smartGeneration.clickToEdit")}</p>
     <div className="space-y-2">
      {resume.experiences.map((experience, index) => (
       <button
        key={index}
        type="button"
        onClick={() => setEditingItemIndex({ type: "experience", index })}
        className="w-full text-left px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-500/40 transition flex items-center justify-between gap-2"
       >
        <span className="font-medium text-white truncate">{getExperienceTitle(experience)}</span>
        <span className="text-emerald-400 text-sm flex-shrink-0">✎</span>
       </button>
      ))}
     </div>
    </div>
   );
  }

  if (currentKey === "presentation" && presentationDraft) {
   return (
    <div className="mt-6 space-y-3 text-left">
     <div className="flex items-center justify-between">
      <p className="text-sm text-emerald-300 font-semibold">
       {t("resume.smartGeneration.presentation")}
      </p>
      {isSaving && (
       <span className="text-xs text-gray-400 flex items-center gap-2">
        <PulseLoader color="#10b981" size={6} /> {t("resume.smartGeneration.saving")}
       </span>
      )}
     </div>
     <textarea
      disabled={!presentationDraft}
      value={presentationDraft}
      onChange={handlePresentationChange}
      className="w-full bg-white/5 text-white rounded-xl px-4 py-3 min-h-[150px] border border-white/10 focus:border-emerald-500 focus:outline-none resize-none placeholder-gray-500"
     />
    </div>
   );
  }

  return null;
 };

 const handleNavigate = async (step, direction) => {
  navigate(step.path);
 };

 /* ---------------- RENDER ---------------- */
 return (
  <div className="relative h-screen dark:bg-dark_bg_1 overflow-hidden">
   <ResumeHeader />

   <GlowBackground />

   <div className="relative z-10 h-full flex items-center justify-center px-4">
    <div
     className="flex flex-col w-full max-w-5xl
                   h-[88vh]
                   overflow-hidden
                   p-6 sm:p-8 md:p-10
                   rounded-3xl
                   bg-gradient-to-br from-dark_bg_2/80 to-dark_bg_1/80
                   backdrop-blur-xl shadow-2xl ring-1 ring-white/10"
    >
     <div className="flex-shrink-0">
      <CVStepper
       currentStep={currentStep}
       completedSteps={completedSteps}
       disabled={!allStepsCompleted}
       loading={loading}
       onNavigate={handleNavigate}
      />
     </div>
     {/* STEPS */}
     <div className="mt-10 flex-shrink-0 grid grid-cols-1 md:grid-cols-3 gap-4">
      {STEPS_CONFIG.map((s) => (
       <div
        key={s.id}
        onClick={() => setStep(s.id)}
        className={`relative rounded-2xl p-4 border transition cursor-pointer ${
         step === s.id
          ? "bg-emerald-600/20 border-emerald-500 text-white"
          : validatedSteps.includes(s.id)
            ? "bg-white/5 border-emerald-500/40 text-emerald-300 hover:bg-white/10"
            : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
        }`}
       >
        {validatedSteps.includes(s.id) && (
         <span className="absolute top-3 right-3 text-emerald-400 text-lg">
          ✔
         </span>
        )}
        <p className="text-xs uppercase tracking-wide mb-1">{t("resume.smartGeneration.step")} {s.id}</p>
        <p className="font-semibold">{t(s.titleKey)}</p>
       </div>
      ))}
     </div>

     {/* CONTENT — zone scrollable, stepper + onglets restent visibles */}
     <div className="mt-10 flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-none flex flex-col">
      <div className="space-y-6 text-center">
       <h3 className="text-lg font-semibold text-emerald-300">
        {t(current.subtitleKey)}
       </h3>

       <p className="text-gray-300">{t(current.descKey)}</p>

       <div className="rounded-xl bg-white/5 border border-white/10 p-5">
        <p className="text-sm text-emerald-300 mb-2">{t("resume.smartGeneration.example")}</p>
        <p className="text-sm text-gray-300 italic">{t(current.exampleKey)}</p>
       </div>

       <p className="text-sm text-gray-400">{t("resume.smartGeneration.speakInstruction")}</p>

       {/* Bascule Parler / Écrire */}
       <div className="flex justify-center gap-2">
        <button
         type="button"
         onClick={() => setInputMode("audio")}
         className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition ${
          inputMode === "audio"
           ? "bg-emerald-600 text-white ring-2 ring-emerald-500"
           : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"
         }`}
        >
         <FontAwesomeIcon icon={faMicrophone} className="w-4 h-4" />
         {t("resume.smartGeneration.recordModeLabel")}
        </button>
        <button
         type="button"
         onClick={() => setInputMode("text")}
         className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition ${
          inputMode === "text"
           ? "bg-emerald-600 text-white ring-2 ring-emerald-500"
           : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"
         }`}
        >
         <FontAwesomeIcon icon={faPenToSquare} className="w-4 h-4" />
         {t("resume.smartGeneration.textModeLabel")}
        </button>
       </div>

       {/* Zone audio ou texte selon le mode */}
       {inputMode === "audio" ? (
        <div className="mt-6 rounded-2xl border border-dashed border-white/15 p-8 flex flex-col items-center justify-center h-[200px]">
         <div
          className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
           recording
            ? "bg-red-500/20 ring-2 ring-red-500"
            : "bg-emerald-600/20 ring-2 ring-emerald-500"
          }`}
         >
          🎙️
         </div>

         {isUploading ? (
          <div className="flex items-center justify-center px-6 py-2 rounded-full bg-white/10">
           <PulseLoader color="#10b981" size={10} />
          </div>
         ) : (
          <button
           ref={recordButtonRef}
           disabled={countdown}
           onClick={() => {
            if (!recording && validatedSteps.includes(step)) {
             setConfirmOverwriteMode("audio");
             setConfirmOverwrite(true);
             return;
            }

            recording ? stopRecording() : startCountdownAndRecord();
           }}
           className={`px-6 py-2 rounded-full font-semibold transition ${
            recording ? "bg-red-600 text-white" : "bg-emerald-600 text-white"
           }`}
          >
           {recording
            ? t("resume.smartGeneration.stop")
            : hasExistingAnswer
              ? t("resume.smartGeneration.recordAgain")
              : t("resume.smartGeneration.record")}
          </button>
         )}
        </div>
       ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-white/15 p-8 flex flex-col gap-4 h-[200px]">
         <textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder=""
          disabled={isUploading}
          className="flex-1 min-h-0 w-full bg-white/5 text-white rounded-xl px-4 py-3 border border-white/10 focus:border-emerald-500 focus:outline-none resize-none placeholder-gray-500"
         />
         {isUploading ? (
          <div className="flex justify-center py-2 flex-shrink-0">
           <PulseLoader color="#10b981" size={10} />
          </div>
         ) : (
          <>
           {textError && (
            <p className="text-sm text-red-400 flex-shrink-0">{textError}</p>
           )}
           <button
            type="button"
            onClick={() => {
             if (hasExistingAnswer) {
              setConfirmOverwriteMode("text");
              setConfirmOverwrite(true);
              return;
             }
             handleTextSend(textInput);
            }}
            disabled={!textInput?.trim()}
            className="px-6 py-2.5 rounded-full font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto flex-shrink-0"
           >
            {t("resume.smartGeneration.sendToAI")}
           </button>
          </>
         )}
        </div>
       )}

       {renderEditableResponse()}

       {validatedSteps.includes(step) && step < 3 && (
        <div className="mt-8 flex justify-center">
         <button
          onClick={() => setStep(step + 1)}
          className="px-8 py-3 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition flex items-center gap-2"
         >
          {t("resume.smartGeneration.nextStep")}
          <span className="text-lg">→</span>
         </button>
        </div>
       )}
      </div>

      {/* FOOTER */}
      {allStepsCompleted && step === 3 && (
       <div className="flex justify-end">
        <Footer
         onClick={() => navigate("/finalization")}
         disabled={!allStepsCompleted}
         text="Générer mon CV"
        />
       </div>
      )}
     </div>
    </div>
   </div>

   {countdown && (
    <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center">
     <span className="text-[160px] font-extrabold text-emerald-400 animate-pulse">
      {countdown}
     </span>
    </div>
   )}

   {editingItemIndex && (
    <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black/90 p-4 sm:p-6">
     <div className="flex-1 min-h-0 flex flex-col max-w-4xl w-full max-h-full bg-dark_bg_2 rounded-2xl border border-white/5 shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 flex-shrink-0 border-b border-white/5">
       <h3 className="text-lg font-semibold text-emerald-300">
        {editingItemIndex.type === "training"
         ? t("resume.smartGeneration.editTraining")
         : t("resume.smartGeneration.editExperience")}
       </h3>
       <button
        onClick={() => setEditingItemIndex(null)}
        className="w-10 h-10 rounded-full bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 transition text-xl leading-none"
       >
        ×
       </button>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-none px-6 py-6 [&_label]:!text-gray-200 [&_input]:!text-white [&_textarea]:!text-white">
       {editingItemIndex.type === "training" && resume?.trainings?.[editingItemIndex.index] && (
        <TrainingForm
         data={{
          ...resume.trainings[editingItemIndex.index],
          __index: editingItemIndex.index,
          startDate: parseDate(resume.trainings[editingItemIndex.index].startDate),
          endDate: parseDate(resume.trainings[editingItemIndex.index].endDate),
         }}
         onChange={(updated) => {
          handleTrainingChange(updated);
         }}
         onDelete={(index) => {
          handleTrainingDelete(index);
          setEditingItemIndex(null);
         }}
        />
       )}
       {editingItemIndex.type === "experience" && resume?.experiences?.[editingItemIndex.index] && (
        <ExperienceForm
         data={{
          ...resume.experiences[editingItemIndex.index],
          title: resume.experiences[editingItemIndex.index].title ?? resume.experiences[editingItemIndex.index].job,
          __index: editingItemIndex.index,
          startDate: parseDate(resume.experiences[editingItemIndex.index].startDate),
          endDate: parseDate(resume.experiences[editingItemIndex.index].endDate),
         }}
         onChange={(updated) => {
          handleExperienceChange(updated);
         }}
         onDelete={(index) => {
          handleExperienceDelete(index);
          setEditingItemIndex(null);
         }}
        />
       )}
      </div>
     </div>
    </div>
   )}

   {confirmOverwrite && (
    <div className="fixed inset-0 z-[10000] bg-black/80 flex items-center justify-center">
     <div className="bg-dark_bg_2 rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
      <h3 className="text-xl font-bold text-white mb-4">{t("resume.smartGeneration.overwriteTitle")}</h3>
      <p className="text-gray-300 mb-6">
       {t("resume.smartGeneration.overwriteMessage")}
      </p>

      <div className="flex justify-center gap-4">
       <button
        onClick={() => {
         setConfirmOverwrite(false);

         const nextStep = getNextIncompleteStep();
         if (nextStep) {
          setStep(nextStep);
         }
        }}
        className="px-6 py-2 rounded-full bg-white/10 text-gray-300"
       >
        {t("resume.smartGeneration.cancel")}
       </button>

       <button
        onClick={() => {
         setConfirmOverwrite(false);
         if (confirmOverwriteMode === "text") {
          handleTextSend(textInput);
         } else {
          startCountdownAndRecord();
         }
        }}
        className="px-6 py-2 rounded-full bg-red-600 text-white font-semibold"
       >
        {t("resume.smartGeneration.replace")}
       </button>
      </div>
     </div>
    </div>
   )}
  </div>
 );
}
