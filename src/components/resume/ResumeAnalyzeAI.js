import React, { useMemo, useState } from "react";
import axios from "axios";
import { CAREER_AGENTS } from "../../utils/careerGuideConstants";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

export default function ResumeAnalyzeAI({ resume, token }) {
 const [result, setResult] = useState(null);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);

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
   setError("L'analyse a échoué. Veuillez réessayer.");
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
 };

 return (
  <div className="rounded-2xl bg-white/5 border border-white/10 text-white p-6 flex flex-col gap-6">
   <div className="flex items-start gap-4">
    <img
     src={Andy.avatar}
     alt={Andy.firstName}
     className="w-12 h-12 rounded-full object-cover flex-shrink-0"
    />
    <div className="flex-1 min-w-0">
     <h3 className="font-semibold text-white text-sm">{Andy.firstName}</h3>
     <p className="text-gray-400 text-sm mt-1">{andyMessage}</p>
    </div>
    {!loading && !error && !result && (
     <button
      type="button"
      onClick={runAnalysis}
      className="flex-shrink-0 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition flex items-center gap-2"
     >
      ✨ {t("resume.finalization.analyzeCv")}
     </button>
    )}
   </div>

   {loading && (
    <div className="flex flex-col items-center gap-3 py-4">
     <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
     <p className="text-gray-400 text-sm">
      {t("resume.finalization.analyzeLoading")}
     </p>
    </div>
   )}

   {!loading && error && (
    <div className="flex flex-col items-center gap-3 py-4 text-center">
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
      <div className="flex flex-col items-center justify-center w-24 h-24 rounded-full border-4 border-emerald-500 bg-white/5">
       <span className="text-3xl font-bold text-white leading-none">
        {result.overallScore}
       </span>
       <span className="text-xs text-gray-400">/100</span>
      </div>
     </div>

     {result.summary && (
      <div className="bg-white/5 rounded-xl p-4">
       <h4 className="text-sm font-semibold text-emerald-400 mb-2">
        {t("resume.finalization.analyzeResume")}
       </h4>
       <p className="text-gray-300 text-sm">{result.summary}</p>
      </div>
     )}

     {result.strengths?.length > 0 && (
      <div className="bg-white/5 rounded-xl p-4">
       <h4 className="text-sm font-semibold text-emerald-400 mb-2">
        ✅ {t("resume.finalization.analyzeStrengths")}
       </h4>
       <ul className="flex flex-col gap-1">
        {result.strengths.map((s, i) => (
         <li key={i} className="text-gray-300 text-sm flex gap-2">
          <span className="text-emerald-400 flex-shrink-0">•</span>
          {s}
         </li>
        ))}
       </ul>
      </div>
     )}

     {result.improvements?.length > 0 && (
      <div className="bg-white/5 rounded-xl p-4">
       <h4 className="text-sm font-semibold text-amber-400 mb-2">
        ➕ Améliorations suggérées
       </h4>
       <ul className="flex flex-col gap-1">
        {result.improvements.map((item, i) => (
         <li key={i} className="text-gray-300 text-sm flex gap-2">
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
      className="self-center px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 text-sm transition"
     >
      {t("resume.finalization.analyzeReset")}
     </button>
    </div>
   )}
  </div>
 );
}
