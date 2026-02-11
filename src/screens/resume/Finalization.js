import React, { useEffect, useRef, useState } from "react";

import axios from "axios";
import Confetti from "react-confetti";
import { QRCodeSVG } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import { useDispatch, useSelector } from "react-redux";

import {
 getResume,
 updateResume,
 previewResume,
 getResumeDownloadUrl,
 resetResumeState,
} from "../../store/slices/resumeSlice";
import Photo from "../../components/core/Photo";
import Logout from "../../components/core/Logout";
import GoBack from "../../components/core/GoBack";
import Modal from "../../components/resume/Modal";
import CVStepper from "../../components/resume/Stepper";
import ConfirmModal from "../../components/modals/ConfirmModal";
import FormSeparator from "../../components/resume/FormSeparator";
import GlowBackground from "../../components/resume/GlowBackground";

export default function Finalization() {
 const IMAGE_BASE_URL = process.env.REACT_APP_AWS_IMAGE_BASE_URL;

 const dispatch = useDispatch();
 const navigate = useNavigate();
 const user = useSelector((state) => state.user.user);
 const { resume, previewHtml, status } = useSelector((state) => state.resume);
 const loading = status === "loading";

 const [showMediasModal, setShowMediasModal] = useState(false);
 const [showPreview, setShowPreview] = useState(false);
 const [showConfetti, setShowConfetti] = useState(true);
 const [showExitModal, setShowExitModal] = useState(false);

 // Stepper config
 const currentStep = 5;
 const completedSteps = [1, 2, 3, 4];

 useEffect(() => {
  const timer = setTimeout(() => setShowConfetti(false), 4000);
  return () => clearTimeout(timer);
 }, []);

 /* ================= MEDIAS ================= */
 const [videos, setVideos] = useState([]);
 const [selectedVideoId, setSelectedVideoId] = useState(null);
 const photoRef = useRef(null);
 const [videoSelectOpen, setVideoSelectOpen] = useState(false);

 /* ================= FETCH ================= */
 useEffect(() => {
  const resumeId = localStorage.getItem("resumeId");
  if (!resumeId || !user?.token) return;

  dispatch(getResume({ token: user.token, id: resumeId }));
  dispatch(previewResume({ token: user.token, id: resumeId }));
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
 }, [resume]);

 /* ================= SAVE MEDIAS ================= */
 const saveMedias = async () => {
  const payload = {
   ...resume,
   qrcodePostId: selectedVideoId,
  };

  await dispatch(updateResume({ token: user.token, id: resume.id, payload }));
  dispatch(previewResume({ token: user.token, id: resume.id }));
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

   <Logout />
   <GoBack />

   <GlowBackground />

   {/* ================= PAGE PRINCIPALE ================= */}
   <div className="relative z-10 h-full flex items-center justify-center px-4 overflow-y-auto py-8">
    <div className="w-full max-w-5xl min-h-[85vh] flex flex-col p-10 rounded-3xl bg-gradient-to-br from-dark_bg_2/80 to-dark_bg_1/80 backdrop-blur-xl shadow-2xl ring-1 ring-white/10">
     {/* Stepper */}
     <CVStepper
      currentStep={currentStep}
      completedSteps={completedSteps}
      loading={loading}
     />

     <h2 className="text-4xl py-10 font-extrabold text-center text-white">Félicitations ! 🎉</h2>

     <p className=" text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
      Ton CV est prêt. Tu peux ajouter une photo et un CV vidéo.
     </p>

     <div className="mt-10 flex justify-center">
      <button
       onClick={() => setShowMediasModal(true)}
       className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition flex items-center gap-4"
      >
       <span className="text-3xl">📸</span>
       <div className="text-left">
        <p className="font-semibold">Photo & CV vidéo</p>
        <p className="text-sm text-gray-400">
         Ajouter une photo de profil et lier un CV vidéo
        </p>
       </div>
      </button>
     </div>

     <div className="mt-12 flex flex-col items-center">
      <p className="mb-6 text-sm text-gray-400 text-center max-w-md">
       Scanne le QR code pour récupérer ton CV. Il reste disponible à tout
       moment dans ton espace privé sur{" "}
       <span className="text-emerald-400 font-medium">jobissim.com</span>.
      </p>

      <div className="bg-white p-5 rounded-2xl shadow-lg">
       <QRCodeSVG value={getResumeDownloadUrl(resume?.id)} size={180} />
      </div>

      <div className="mt-8 flex flex-col items-center gap-4">
       <button
        onClick={() => setShowPreview(true)}
        className="px-10 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold shadow-lg active:scale-[0.98] transition"
       >
        Voir le CV
       </button>

       <button
        onClick={handleBackHome}
        className="px-8 py-2 rounded-full bg-transparent text-gray-400 underline underline-offset-4 active:text-gray-200"
       >
        Retour à l'accueil
       </button>
      </div>
     </div>
    </div>
   </div>

   <Modal
    isOpen={showMediasModal}
    onClose={() => setShowMediasModal(false)}
    title="Photo & CV vidéo"
    onSave={saveMedias}
   >
    {/* PHOTO DE PROFIL */}
    <Section title="Photo de profil">
     <Photo ref={photoRef} user={user} mode="resume" />
    </Section>

    <FormSeparator />

    {/* CV VIDÉO */}
    <Section title="CV vidéo">
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
            ? "Aucun CV vidéo disponible"
            : "Sélectionner un CV vidéo"}
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
      Ce CV vidéo sera accessible via le QR code du CV.
     </p>
    </Section>
   </Modal>

   {showPreview && (
    <div
     className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
     onClick={() => setShowPreview(false)}
    >
     <button
      onClick={() => setShowPreview(false)}
      className="absolute top-6 right-6 text-white text-2xl hover:text-gray-300 transition"
     >
      ✕
     </button>
     {loading ? (
      <PulseLoader color="#10b981" />
     ) : (
      <iframe
       srcDoc={previewHtml}
       title="CV"
       onClick={(e) => e.stopPropagation()}
       className="w-[794px] h-[1123px] bg-white rounded-lg shadow-2xl"
      />
     )}
    </div>
   )}

   <ConfirmModal
    isOpen={showExitModal}
    title="Veux-tu vraiment revenir à l'accueil ?"
    message="Tu pourras toujours éditer ton CV depuis le site Jobissim."
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
