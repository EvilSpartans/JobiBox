import React, { useEffect, useRef, useState } from "react";

import axios from "axios";
import { useTranslation } from "react-i18next";
import Confetti from "react-confetti";
import { QRCodeSVG } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import { useDispatch, useSelector } from "react-redux";

import {
 getResume,
 updateResume,
 selectResumePdfUrl,
 translateResume,
 getResumeDownloadUrl,
 resetResumeState,
} from "../../store/slices/resumeSlice";
import Photo from "../../components/core/Photo";
import ResumeHeader from "../../components/resume/ResumeHeader";
import Modal from "../../components/resume/Modal";
import CVStepper from "../../components/resume/Stepper";
import ConfirmModal from "../../components/modals/ConfirmModal";
import FormSeparator from "../../components/resume/FormSeparator";
import GlowBackground from "../../components/resume/GlowBackground";
import { supportedLangs } from "../../i18n";
import ResumeAnalyzeAI from "../../components/resume/ResumeAnalyzeAI";

const TRANSLATE_LANGS = supportedLangs.filter((l) => l !== "fr");

export default function Finalization() {
 const IMAGE_BASE_URL = process.env.REACT_APP_AWS_IMAGE_BASE_URL;

 const dispatch = useDispatch();
 const navigate = useNavigate();
 const { t } = useTranslation();
 const user = useSelector((state) => state.user.user);
 const { resume, status } = useSelector((state) => state.resume);
 const pdfUrl = useSelector(selectResumePdfUrl);
 const loading = status === "loading";

 const [showMediasModal, setShowMediasModal] = useState(false);
 const [ats, setAts] = useState(false);
 const [translateLang, setTranslateLang] = useState("en");
 const [translating, setTranslating] = useState(false);
 const [toast, setToast] = useState(null);
 const [showPreview, setShowPreview] = useState(false);
 const [showConfetti, setShowConfetti] = useState(true);
 const [showExitModal, setShowExitModal] = useState(false);
 //resume pdf from aws
 const [pdfReady, setPdfReady] = useState(false);
 const pdfPollRef = useRef(null);
 const [isPolling, setIsPolling] = useState(false);

 // Stepper config
 const currentStep = 6;
 const completedSteps = [1, 2, 3, 4, 5];

 useEffect(() => {
  const timer = setTimeout(() => setShowConfetti(false), 4000);
  return () => clearTimeout(timer);
 }, []);

 /* ================= MEDIAS ================= */
 const [videos, setVideos] = useState([]);
 const [selectedVideoId, setSelectedVideoId] = useState(null);
 const photoRef = useRef(null);
 const previewIframeRef = useRef(null);
 const [videoSelectOpen, setVideoSelectOpen] = useState(false);

 /* ================= FETCH ================= */
 useEffect(() => {
  const resumeId = localStorage.getItem("resumeId");
  if (!resumeId || !user?.token) return;

  dispatch(getResume({ token: user.token, id: resumeId }));
 }, [dispatch, user]);

 useEffect(() => {
  if (!user?.id || !user?.token) return;

  const fetchVideos = async () => {
   try {
    const { data } = await axios.get(
     `${process.env.REACT_APP_BASE_URL}/posts`,
     {
      params: {
       userId: user.id,
       page: 1,
       limit: 50,
      },
      headers: {
       Authorization: `Bearer ${user.token}`,
      },
     },
    );

    setVideos(Array.isArray(data.items) ? data.items : []);
   } catch (e) {
    console.error("Erreur récupération CV vidéos", e);
   }
  };

  fetchVideos();
 }, [user?.id, user?.token]);

 useEffect(() => {
  const close = () => setVideoSelectOpen(false);
  if (videoSelectOpen) {
   window.addEventListener("click", close);
  }
  return () => window.removeEventListener("click", close);
 }, [videoSelectOpen]);

 /* ================= POPULATE ================= */
 useEffect(() => {
  if (!resume) return;
  setSelectedVideoId(resume.qrcodePostId || null);
  setAts(resume.ats ?? false);
 }, [resume]);

 /* ================= TOAST ================= */
 useEffect(() => {
  if (!toast) return;
  const timer = setTimeout(() => setToast(null), 4000);
  return () => clearTimeout(timer);
 }, [toast]);

useEffect(() => {
  return () => clearPdfPoll();
}, []);
 const clearPdfPoll = () => {
  if (pdfPollRef.current) {
    clearTimeout(pdfPollRef.current);
    pdfPollRef.current = null;
  }
};

const pollUntilPdfChanges = (previousPath) => {
  if (pdfPollRef.current) clearTimeout(pdfPollRef.current);
  setPdfReady(false);
  setIsPolling(true); 
  const maxAttempts = 45;
  const intervalMs = 2000;
  let attempts = 0;

  const run = async () => {
    attempts++;
    if (attempts >= maxAttempts) {
      setIsPolling(false);
      setPdfReady(true);
      return;
    }
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/resume/${resume.id}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      const newPath = (data.cvPdfPath ?? "").trim();
      const oldPath = (previousPath ?? "").trim();
      const changed = oldPath
        ? newPath.length > 0 && newPath !== oldPath
        : newPath.length > 0;

      if (changed) {
        await dispatch(getResume({ token: user.token, id: String(resume.id) }));
        setIsPolling(false); 
        setPdfReady(true);
      } else {
        pdfPollRef.current = setTimeout(run, intervalMs);
      }
    } catch {
      pdfPollRef.current = setTimeout(run, intervalMs);
    }
  };

  run();
};

 // pdf from aws
const handleShowPreview = () => {
  setShowPreview(true);
  if (!isPolling) {
    setPdfReady(true); 
  }
};

 /* ================= ATS TOGGLE ================= */
 const handleAtsToggle = async () => {
  const newAts = !ats;
  setAts(newAts);
  const previousPath = resume?.cvPdfPath;
  const payload = { ...resume, ats: newAts };
  await dispatch(updateResume({ token: user.token, id: resume.id, payload }));
  pollUntilPdfChanges(previousPath);
 };

 /* ================= TRANSLATE ================= */
 const handleTranslate = async () => {
  if (!translateLang || translateLang === "fr" || translating) return;
  if (resume?.locale === translateLang) return;

   const previousPath = resume?.cvPdfPath;
  setTranslating(true);
  try {
   await dispatch(
    translateResume({
     token: user.token,
     id: resume.id,
     language: translateLang,
     save: true,
    }),
   ).unwrap();
   setToast({ type: "success", msg: t("resume.finalization.translated") });
   await dispatch(getResume({ token: user.token, id: resume.id }));
    pollUntilPdfChanges(previousPath);
  //  dispatch(previewResume({ token: user.token, id: resume.id }));
  } catch {
   setToast({ type: "error", msg: t("resume.finalization.translateError") });
  } finally {
   setTranslating(false);
  }
 };

 /* ================= SAVE MEDIAS ================= */
 const saveMedias = async () => {
   const previousPath = resume?.cvPdfPath;
  const payload = {
   ...resume,
   qrcodePostId: selectedVideoId,
   ats,
  };

  await dispatch(updateResume({ token: user.token, id: resume.id, payload }));
  dispatch(getResume({ token: user.token, id: resume.id }));
  pollUntilPdfChanges(previousPath);
  setShowMediasModal(false);
 };

 /* ================= NAVIGATION ================= */
 const handleBackHome = () => {
  setShowExitModal(true);
 };

 const confirmBackHome = () => {
  dispatch(resetResumeState());
  localStorage.removeItem("resumeId");
  setShowExitModal(false);
  navigate("/");
 };

 const cancelBackHome = () => {
  setShowExitModal(false);
 };

 return (
  <div className="relative h-screen dark:bg-dark_bg_1 overflow-hidden">
   {showConfetti && (
    <Confetti
     numberOfPieces={250}
     gravity={0.25}
     recycle={false}
     colors={["#10b981", "#34d399", "#6ee7b7", "#ffffff"]}
    />
   )}

   <ResumeHeader />

   <GlowBackground />

   {/* ================= PAGE PRINCIPALE ================= */}
   <div className="relative z-10 h-full flex items-center justify-center px-4">
    <div
     className="flex flex-col w-full max-w-5xl
                   h-[88vh]
                   overflow-y-auto scrollbar-none
                   p-6 sm:p-8 md:p-10
                   rounded-3xl
                   bg-gradient-to-br from-dark_bg_2/80 to-dark_bg_1/80
                   backdrop-blur-xl shadow-2xl ring-1 ring-white/10"
    >
     {/* Stepper */}
     <CVStepper
      currentStep={currentStep}
      completedSteps={completedSteps}
      loading={loading}
     />

     <h2 className="text-4xl py-12 font-extrabold text-center text-white">
      {t("resume.finalization.congrats")} 🎉
     </h2>

     <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
      {t("resume.finalization.ready")}
     </p>

     <div className="mt-14 flex justify-center">
      <button
       onClick={() => setShowMediasModal(true)}
       className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition flex items-center gap-4"
      >
       <span className="text-3xl">📸</span>
       <div className="text-left">
        <p className="font-semibold">{t("resume.finalization.photoVideo")}</p>
        <p className="text-sm text-gray-400">
         {t("resume.finalization.photoVideoDesc")}
        </p>
       </div>
      </button>
     </div>

     {/* Traduire et sauvegarder — directement sous le bouton Photo & CV vidéo */}
     <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-3">
      <select
       value={translateLang}
       onChange={(e) => setTranslateLang(e.target.value)}
       className="bg-dark_bg_2 border border-white/20 text-white rounded-lg px-4 py-2 min-w-[180px]"
      >
       <option value="">{t("resume.finalization.selectLanguage")}</option>
       <option value="fr" className="bg-dark_bg_2">
        {t("languages.fr")}
       </option>
       {TRANSLATE_LANGS.map((l) => (
        <option key={l} value={l} className="bg-dark_bg_2">
         {t(`languages.${l}`)}
        </option>
       ))}
      </select>
      <button
       onClick={handleTranslate}
       disabled={
        !translateLang ||
        translateLang === "fr" ||
        resume?.locale === translateLang ||
        translating
       }
       className="px-6 py-2 rounded-lg bg-emerald-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
       {translating ? <PulseLoader color="#fff" size={8} /> : null}
       {t("resume.finalization.translate")}
      </button>
     </div>
     {toast && (
      <div
       className={`mt-3 px-4 py-2 rounded-lg text-sm text-center ${
        toast.type === "success"
         ? "bg-emerald-600/30 text-emerald-200"
         : "bg-red-600/30 text-red-200"
       }`}
      >
       {toast.msg}
      </div>
     )}

     <div className="mt-16 flex flex-col items-center">
      <p className="mb-8 text-sm text-gray-400 text-center max-w-md">
       {t("resume.finalization.qrHint")}{" "}
       <span className="text-emerald-400 font-medium">jobissim.com</span>.
      </p>

      <div className="bg-white p-3 rounded-2xl shadow-lg">
       <QRCodeSVG
        value={getResumeDownloadUrl(resume?.id, resume?.locale)}
        size={100}
       />
      </div>

      {/* ATS + Traduction */}
      <div className="mt-10 flex flex-col items-center gap-4">
       <label className="flex items-center gap-3 cursor-pointer">
        <input
         type="checkbox"
         checked={ats}
         onChange={handleAtsToggle}
         className="w-5 h-5 rounded text-emerald-500"
        />
        <span className="text-gray-300">
         {t("resume.finalization.atsToggle")}
        </span>
       </label>
      </div>

      <div className="mt-10 flex flex-col items-center gap-5">
       <button
        onClick={handleShowPreview}
        className="relative px-12 py-4 rounded-full bg-emerald-600 text-white font-bold text-lg hover:bg-emerald-500 active:scale-[0.98] transition shadow-lg overflow-visible"
       >
        <span className="absolute inset-0 rounded-full bg-emerald-500/[0.18] animate-ping" />
        <span className="relative">{t("resume.finalization.seeCv")}</span>
       </button>

       <ResumeAnalyzeAI resume={resume} token={user.token} />

       <button
        onClick={handleBackHome}
        className="px-8 py-2 rounded-full bg-transparent text-gray-400 underline underline-offset-4 active:text-gray-200"
       >
        {t("resume.finalization.backHome")}
       </button>
      </div>
     </div>
    </div>
   </div>

   <Modal
    isOpen={showMediasModal}
    onClose={() => setShowMediasModal(false)}
    title={t("resume.finalization.modalTitle")}
    onSave={saveMedias}
   >
    {/* PHOTO DE PROFIL */}
    <Section title={t("resume.finalization.profilePhoto")}>
     <Photo ref={photoRef} user={user} mode="resume" />
    </Section>

    <FormSeparator compact />

    <div className="mt-4" />

    {/* CV VIDÉO */}
    <Section title={t("resume.finalization.cvVideo")}>
     <div className="relative">
      <button
       type="button"
       onClick={(e) => {
        e.stopPropagation();
        setVideoSelectOpen((v) => !v);
       }}
       disabled={videos.length === 0}
       className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border border-white/10 transition ${
        videos.length === 0
         ? "bg-white/5 text-gray-500 cursor-not-allowed"
         : "bg-white/5 text-white hover:bg-white/10"
       }`}
      >
       <div className="flex items-center gap-3">
        {selectedVideoId &&
         (() => {
          const video = videos.find((v) => v.id === selectedVideoId);
          return (
           <img
            src={
             video?.image
              ? `${IMAGE_BASE_URL}/${video.image}`
              : "/placeholder-video.png"
            }
            alt=""
            className="w-10 h-10 object-cover rounded"
           />
          );
         })()}

        <span>
         {selectedVideoId
          ? videos.find((v) => v.id === selectedVideoId)?.title ||
            `CV vidéo #${selectedVideoId}`
          : videos.length === 0
            ? t("resume.finalization.noVideo")
            : t("resume.finalization.selectVideo")}
        </span>
       </div>

       <span className="text-gray-400">▾</span>
      </button>

      {videoSelectOpen && videos.length > 0 && (
       <div
        className="absolute z-50 mt-2 w-full bg-dark_bg_1 rounded-xl border border-white/10 shadow-xl max-h-64 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
       >
        {videos.map((video) => {
         const selected = video.id === selectedVideoId;

         return (
          <button
           key={video.id}
           type="button"
           onClick={() => {
            setSelectedVideoId(video.id);
            setVideoSelectOpen(false);
           }}
           className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/10 ${
            selected ? "bg-white/10" : ""
           }`}
          >
           <img
            src={
             video.image
              ? `${IMAGE_BASE_URL}/${video.image}`
              : "/placeholder-video.png"
            }
            alt=""
            className="w-10 h-10 object-cover rounded"
           />

           <span className="flex-1 text-white">
            {video.title || `CV vidéo #${video.id}`}
           </span>
           {selected && <span className="text-emerald-400">✓</span>}
          </button>
         );
        })}
       </div>
      )}
     </div>

     <p className="text-sm text-gray-400 mt-2">
      {t("resume.finalization.videoHint")}
     </p>
    </Section>
   </Modal>

   {showPreview && (
    <div
     className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center py-8"
     onClick={() => setShowPreview(false)}
    >
     <button
      onClick={() => setShowPreview(false)}
      className="absolute top-6 right-6 text-white text-2xl hover:text-gray-300 transition z-10"
     >
      ✕
     </button>

     {/* ATS banner */}
     {resume?.ats && (
      <div
       className="flex flex-col items-center gap-4 mb-4"
       onClick={(e) => e.stopPropagation()}
      >
       <div className="px-4 py-2 rounded-lg bg-amber-500/20 text-amber-200 text-sm">
        {t("resume.finalization.atsBanner")}
       </div>
      </div>
     )}

     {!pdfReady ? (
      <PulseLoader color="#10b981" />
     ) : pdfUrl && (
      <iframe
      key={pdfUrl}
       src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
       title="CV"
       onClick={(e) => e.stopPropagation()}
       className="w-[794px] h-[1123px] bg-white rounded-lg shadow-2xl"
      />
     )}
    </div>
   )}

   <ConfirmModal
    isOpen={showExitModal}
    title={t("resume.finalization.exitTitle")}
    message={t("resume.finalization.exitMessage")}
    onCancel={cancelBackHome}
    onConfirm={confirmBackHome}
    confirmClass="bg-emerald-600"
   />
  </div>
 );
}

function Section({ title, children }) {
 return (
  <div className="mb-6">
   <h4 className="text-emerald-300 font-semibold mb-4">{title}</h4>
   <div className="space-y-4">{children}</div>
  </div>
 );
}
