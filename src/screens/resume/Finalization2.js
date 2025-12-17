import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import { QRCodeSVG } from "qrcode.react";

import Logout from "../../components/core/Logout";
import GoBack from "../../components/core/GoBack";
import { previewResume } from "../../store/slices/resumeSlice";

export default function Finalization() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.user);
  const { resume, previewHtml, status } = useSelector((state) => state.resume);

  const loading = status === "loading" || !previewHtml;
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const resumeId = localStorage.getItem("resumeId");
    if (!resumeId || !user?.token) return;

    dispatch(
      previewResume({
        token: user.token,
        id: resumeId,
      })
    );
  }, [dispatch, user]);

  const steps = [
    "Template",
    "Informations CV",
    "Informations personnelles",
    "Contrat recherché",
    "Expériences professionnelles",
    "Formation",
    "Compétences",
    "Langues",
  ];

  return (
    <div className="relative h-screen dark:bg-dark_bg_1 overflow-hidden">
      <Logout />
      <GoBack />

      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-emerald-600/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-emerald-800/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 h-full flex items-center justify-center px-4">
        <div
          className="
            flex flex-col w-full max-w-5xl
            min-h-[85vh] max-h-[90vh]
            overflow-hidden
            p-6 sm:p-8 md:p-10
            rounded-3xl
            bg-gradient-to-br from-dark_bg_2/80 to-dark_bg_1/80
            backdrop-blur-xl shadow-2xl ring-1 ring-white/10
          "
        >
          {/* HEADER */}
          <div className="text-center space-y-4">
            <span className="inline-block px-4 py-1 rounded-full text-sm font-semibold bg-emerald-900/40 text-emerald-300">
              Étape 5 · Finalisation
            </span>

            <h2 className="text-4xl font-extrabold text-white">
              {resume?.title || "Mon CV"}
            </h2>

            <p className="text-gray-300">
              Toutes les étapes sont terminées
            </p>
          </div>

          {/* STEPS (fermées) */}
          <div className="mt-10 space-y-3">
            {steps.map((label) => (
              <div
                key={label}
                className="flex items-center justify-between px-5 py-4 rounded-xl bg-white/5 border border-white/10"
              >
                <span className="text-gray-200">{label}</span>
                <span className="text-gray-400">▾</span>
              </div>
            ))}
          </div>

          {/* QR + ACTIONS */}
          <div className="mt-10 flex flex-col items-center gap-6">
            <div className="bg-white p-4 rounded-xl">

<QRCodeSVG value={`${window.location.origin}/resume/${resume?.id || ""}`} />

            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowPreview(true)}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold shadow-lg hover:from-emerald-700 hover:to-emerald-800"
              >
                Voir le CV
              </button>

              <button
                onClick={() => navigate("/")}
                className="px-8 py-3 rounded-full bg-white/10 text-gray-300 hover:bg-white/20"
              >
                Retour à l’accueil
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODALE PREVIEW */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <button
            onClick={() => setShowPreview(false)}
            className="absolute top-6 right-6 text-white text-2xl"
          >
            ✕
          </button>

          {loading ? (
            <PulseLoader color="#10b981" size={16} />
          ) : (
            <div className="bg-white shadow-2xl">
              <iframe
                title="CV PDF"
                srcDoc={previewHtml}
                className="w-[794px] h-[1123px] border-none block"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
