import React, { useMemo, useState } from "react";
import axios from "axios";
import { CAREER_AGENTS } from "../../utils/careerGuideConstants";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

export default function ResumeAnalyzeAI({ resume, token }) {
 const [result, setResult] = useState(null);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);
 const [modalOpen, setModalOpen] = useState(false);

 const { t } = useTranslation();

 const Andy = CAREER_AGENTS.find((agent) => agent.id === "cv_profil");

 const andyMessage = useMemo(() => {
  const messages = t("resume.finalization.andyMessages", {
   returnObjects: true,
  });
  return Array.isArray(messages)
   ? messages[Math.floor(Math.random() * messages.length)]
   : "";
 }, [i18next.language]);

 const runAnalysis = async () => {
  if (!resume?.id) return;
  setModalOpen(true);
  setLoading(true);
  setError(null);
  setResult(null);

  try {
   const formData = new FormData();
   formData.append("resumeId", String(resume.id));

   const { data } = await axios.post(
    `${process.env.REACT_APP_BASE_URL}/resume/analyze`,
    formData,
    { headers: { Authorization: `Bearer ${token}` } },
   );
   setResult(data);
  } catch {
   setError(t("resume.finalization.analyzeError"));
  } finally {
   setLoading(false);
  }
 };

 const retry = () => {
  setError(null);
  runAnalysis();
 };

 const reset = () => {
  setResult(null);
  setError(null);
  setModalOpen(false);
 };

 const closeModal = () => {
  setModalOpen(false);
 };

 return (
  <>
   <div className="rounded-2xl bg-white/5 border border-white/10 text-white p-6 flex flex-col gap-6">
    <div className="flex flex-row items-stretch gap-4">
     <div className="flex min-w-0 flex-1 gap-3">
      <img
       src={Andy.avatar}
       alt={Andy.firstName}
       className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
      />
      <div className="min-w-0 flex-1">
       <h3 className="text-sm font-semibold leading-tight text-white">{Andy.firstName}</h3>
       <p className="mt-1 line-clamp-2 text-sm leading-snug text-gray-400">{andyMessage}</p>
      </div>
     </div>
     {!loading && !result && (
      <button
       type="button"
       onClick={runAnalysis}
       className="flex shrink-0 items-center justify-center self-stretch rounded-lg bg-emerald-600 px-3 sm:px-4 text-sm font-medium text-white transition hover:bg-emerald-500"
      >
       <span className="text-center leading-tight">
        ✨ {t("resume.finalization.analyzeCv")}
       </span>
      </button>
     )}
     {!loading && result && (
      <button
       type="button"
       onClick={() => setModalOpen(true)}
       className="flex shrink-0 items-center justify-center self-stretch rounded-lg bg-emerald-600/80 px-3 sm:px-4 text-sm font-medium text-white transition hover:bg-emerald-500"
      >
       <span className="text-center leading-tight">
        {t("resume.finalization.analyzeSeeResult")}
       </span>
      </button>
     )}
    </div>
   </div>

   {modalOpen && (
    <div
     className="fixed inset-0 z-[10002] flex items-center justify-center bg-black/85 p-4"
     onClick={closeModal}
     role="presentation"
    >
     <div
      className="relative flex w-full max-h-[90vh] max-w-4xl flex-col overflow-hidden rounded-2xl bg-dark_bg_2 shadow-2xl ring-1 ring-white/10 sm:max-h-[92vh]"
      onClick={(e) => e.stopPropagation()}
     >
      <div className="flex flex-shrink-0 items-center justify-between border-b border-white/10 px-6 py-5">
       <h3 className="pr-8 text-xl font-semibold text-white sm:text-2xl">
        {t("resume.finalization.analyzeModalTitle")}
       </h3>
       <button
        type="button"
        onClick={closeModal}
        className="text-white text-2xl leading-none hover:text-emerald-400 transition"
        aria-label="Fermer"
       >
        ×
       </button>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
       {loading && (
        <div className="flex flex-col items-center gap-3 py-8">
         <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
         <p className="text-gray-400 text-sm text-center">
          {t("resume.finalization.analyzeLoading")}
         </p>
        </div>
       )}

       {!loading && error && (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
         <p className="text-red-300 text-sm">{error}</p>
         <button
          type="button"
          onClick={retry}
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition"
         >
          {t("resume.finalization.analyzeRetry")}
         </button>
        </div>
       )}

       {!loading && !error && result && (
        <div className="flex flex-col gap-5">
         <div className="flex justify-center">
          <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full border-4 border-emerald-500 bg-white/5 sm:h-32 sm:w-32">
           <span className="text-4xl font-bold leading-none text-white sm:text-5xl">
            {result.overallScore}
           </span>
           <span className="text-xs text-gray-400 sm:text-sm">/100</span>
          </div>
         </div>

         {result.summary && (
          <div className="rounded-xl bg-white/5 p-5 sm:p-6">
           <h4 className="mb-2 text-base font-semibold text-emerald-400">
            {t("resume.finalization.analyzeResume")}
           </h4>
           <p className="text-base leading-relaxed text-gray-300">{result.summary}</p>
          </div>
         )}

         {result.strengths?.length > 0 && (
          <div className="rounded-xl bg-white/5 p-5 sm:p-6">
           <h4 className="mb-2 text-base font-semibold text-emerald-400">
            {t("resume.finalization.analyzeStrengths")}
           </h4>
           <ul className="flex flex-col gap-2">
            {result.strengths.map((s, i) => (
             <li key={i} className="flex gap-2 text-base text-gray-300">
              <span className="text-emerald-400 flex-shrink-0">•</span>
              {s}
             </li>
            ))}
           </ul>
          </div>
         )}

         {result.improvements?.length > 0 && (
          <div className="rounded-xl bg-white/5 p-5 sm:p-6">
           <h4 className="mb-2 text-base font-semibold text-amber-400">
            {t("resume.finalization.analyzeImprovements")}
           </h4>
           <ul className="flex flex-col gap-2">
            {result.improvements.map((item, i) => (
             <li key={i} className="flex gap-2 text-base text-gray-300">
              <span className="text-amber-400 flex-shrink-0">•</span>
              {item}
             </li>
            ))}
           </ul>
          </div>
         )}

         <button
          type="button"
          onClick={reset}
          className="w-full rounded-lg bg-white/10 px-4 py-3 text-base text-gray-300 transition hover:bg-white/20"
         >
          {t("resume.finalization.analyzeReset")}
         </button>
        </div>
       )}
      </div>
     </div>
    </div>
   )}
  </>
 );
}
