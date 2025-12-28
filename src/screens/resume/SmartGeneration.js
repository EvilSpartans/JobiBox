import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PulseLoader from "react-spinners/PulseLoader";

import Logout from "../../components/core/Logout";
import GoBack from "../../components/core/GoBack";

import {
  getResume,
  uploadResumeAudio,
  updateResume,
} from "../../store/slices/resumeSlice";

/* ---------------- CONFIG ---------------- */

const STEP_KEYS = {
  1: "presentation",
  2: "trainings",
  3: "experiences",
};

const stepsConfig = [
  {
    id: 1,
    title: "Présente-toi",
    subtitle: "Qui es-tu ?",
    description:
      "Présente-toi librement en quelques phrases. Dis qui tu es, ce que tu recherches et ce qui te motive.",
    example:
      "« Je m’appelle Alex, j’ai 24 ans et je recherche un poste dans la logistique. J’aime le travail d’équipe et je suis motivé à apprendre et évoluer rapidement. »",
  },
  {
    id: 2,
    title: "Formations & parcours scolaire",
    subtitle: "Ton parcours académique",
    description:
      "Parle de tes formations, diplômes ou apprentissages. Précise le nom de l’établissement, la période et ce que tu as appris.",
    example:
      "« J’ai suivi un CAP Matelot au lycée maritime d’Étaples entre 2023 et 2025. J’y ai appris la navigation, la sécurité en mer et le travail en équipe. »",
  },
  {
    id: 3,
    title: "Expériences professionnelles",
    subtitle: "Ton expérience terrain",
    description:
      "Parle de tes expériences professionnelles. Pour chaque expérience, indique où tu as travaillé, sur quelle période et ce que tu faisais concrètement.",
    example:
      "« En 2024, j’ai travaillé sur des chantiers de rénovation à Étaples : placo, peinture, menuiserie, revêtements de sol. J’ai aussi effectué un stage maritime. »",
  },
];

/* ---------------- COMPONENT ---------------- */

export default function SmartGeneration() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  const { resume, status } = useSelector((state) => state.resume);

  const loading = status === "loading";

  const [step, setStep] = useState(1);
  const [validatedSteps, setValidatedSteps] = useState([]);
  const [recording, setRecording] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [confirmOverwrite, setConfirmOverwrite] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const current = stepsConfig.find((s) => s.id === step);
  const currentKey = STEP_KEYS[step];

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
          const main = joinDefined([
            clean(t.degree),
            clean(t.school),
          ]);

          const dates = joinDefined(
            [clean(t.startDate), clean(t.endDate)],
            " → "
          );

          return joinDefined(
            [main, dates ? `(${dates})` : null],
            " "
          );
        })
        .join("\n")
    : currentKey === "experiences"
    ? resume?.experiences
        ?.map((e) => {
          const main = joinDefined([
            clean(e.job),
            clean(e.company),
          ]);

          const dates = joinDefined(
            [clean(e.startDate), clean(e.endDate)],
            " → "
          );

          return joinDefined(
            [main, dates ? `(${dates})` : null],
            " "
          );
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

    if (!done.includes(1)) {
      setStep(1);
    } else if (!done.includes(2)) {
      setStep(2);
    } else if (!done.includes(3)) {
      setStep(3);
    } else {
      setStep(3); // tout est validé
    }
  }, [resume]);

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
        })
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

        // valeurs existantes
        presentation: resume.presentation ?? "",
        trainings: resume.trainings ?? [],
        experiences: resume.experiences ?? [],

        // ✅ SEULEMENT la clé courante est modifiée
        ...(key === "presentation" && { presentation: aiResult.text || "" }),
        ...(key === "trainings" && {
          trainings: aiResult.json?.trainings || [],
        }),
        ...(key === "experiences" && {
          experiences: aiResult.json?.experiences || [],
        }),
      };

      await dispatch(
        updateResume({
          token: user.token,
          id: resume.id,
          payload,
        })
      ).unwrap();

      setValidatedSteps((prev) => [...new Set([...prev, step])]);

      if (step < 3) setStep(step + 1);
    } catch (e) {
      console.error("Erreur IA :", e);
    } finally {
      setIsUploading(false); // 🔓 unlock UI
    }
  };

  const getNextIncompleteStep = () => {
    if (!validatedSteps.includes(1)) return 1;
    if (!validatedSteps.includes(2)) return 2;
    if (!validatedSteps.includes(3)) return 3;
    return null; // tout est fait
  };

  /* ---------------- RENDER ---------------- */

  return (
    <div className="relative h-screen dark:bg-dark_bg_1 overflow-hidden">
      <Logout />
      <GoBack />

      {/* Glow background */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-emerald-600/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-emerald-800/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 h-full flex items-center justify-center px-4">
        <div className="flex flex-col w-full max-w-5xl min-h-[85vh] p-8 rounded-3xl bg-gradient-to-br from-dark_bg_2/80 to-dark_bg_1/80 backdrop-blur-xl shadow-2xl ring-1 ring-white/10">
          {/* HEADER */}
          <div className="text-center space-y-4">
            <span className="inline-block px-4 py-1 rounded-full text-sm font-semibold bg-emerald-900/40 text-emerald-300">
              Étape 4 · Génération intelligente
            </span>
            <h2 className="text-4xl font-extrabold text-white">
              Parle naturellement
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Réponds oralement. L’IA structure automatiquement ton CV.
            </p>
          </div>

          {/* STEPS */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            {stepsConfig.map((s) => (
              <div
                key={s.id}
                onClick={() => {
                  if (validatedSteps.includes(s.id)) {
                    setStep(s.id);
                  }
                }}
                className={`relative rounded-2xl p-4 border transition cursor-pointer ${
                  step === s.id
                    ? "bg-emerald-600/20 border-emerald-500 text-white"
                    : validatedSteps.includes(s.id)
                    ? "bg-white/5 border-emerald-500/40 text-emerald-300 hover:bg-white/10"
                    : "border-white/10 text-gray-400 cursor-default"
                }`}
              >
                {validatedSteps.includes(s.id) && (
                  <span className="absolute top-3 right-3 text-emerald-400 text-lg">
                    ✔
                  </span>
                )}
                <p className="text-xs uppercase tracking-wide mb-1">
                  Étape {s.id}
                </p>
                <p className="font-semibold">{s.title}</p>
              </div>
            ))}
          </div>

          {/* CONTENT */}
          <div className="mt-10 flex-1 flex flex-col justify-between">
            <div className="space-y-6 text-center">
              <h3 className="text-lg font-semibold text-emerald-300">
                {current.subtitle}
              </h3>

              <p className="text-gray-300">{current.description}</p>

              <div className="rounded-xl bg-white/5 border border-white/10 p-5">
                <p className="text-sm text-emerald-300 mb-2">
                  Exemple de réponse :
                </p>
                <p className="text-sm text-gray-300 italic">
                  {current.example}
                </p>
              </div>

              {/* AUDIO */}
              <div className="mt-6 rounded-2xl border border-dashed border-white/15 p-8 flex flex-col items-center">
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
                        setConfirmOverwrite(true);
                        return;
                      }

                      recording ? stopRecording() : startCountdownAndRecord();
                    }}
                    className={`px-6 py-2 rounded-full font-semibold transition ${
                      recording
                        ? "bg-red-600 text-white"
                        : "bg-emerald-600 text-white"
                    }`}
                  >
                    {recording
                      ? "Arrêter"
                      : hasExistingAnswer
                      ? "Recommencer l’enregistrement"
                      : "Démarrer l’enregistrement"}
                  </button>
                )}
              </div>

{/* Réponse */}
              {hasExistingAnswer && (
  <div className="mt-6 rounded-xl bg-emerald-600/10 border border-emerald-500/30 p-5 max-h-[160px] overflow-y-auto">
    <p className="text-sm text-emerald-300 mb-2 font-semibold">
      Ta réponse :
    </p>

    <p className="text-sm text-gray-200 whitespace-pre-line">
      {existingText}
    </p>
  </div>
)}

            </div>

            {/* FOOTER */}
            {validatedSteps.includes(3) && (
              <div className="pt-10 flex justify-end">
                <button
                  onClick={() => navigate("/finalization")}
                  className="px-10 py-4 rounded-full text-lg font-semibold bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-xl"
                >
                  Générer mon CV
                </button>
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

      {confirmOverwrite && (
        <div className="fixed inset-0 z-[10000] bg-black/80 flex items-center justify-center">
          <div className="bg-dark_bg_2 rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
            <h3 className="text-xl font-bold text-white mb-4">Attention</h3>
            <p className="text-gray-300 mb-6">
              Cette action va remplacer l’enregistrement existant pour cette
              étape. Souhaites-tu continuer ?
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
                Annuler
              </button>

              <button
                onClick={() => {
                  setConfirmOverwrite(false);
                  startCountdownAndRecord();
                }}
                className="px-6 py-2 rounded-full bg-red-600 text-white font-semibold"
              >
                Remplacer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
