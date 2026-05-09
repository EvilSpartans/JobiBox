import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logout from "../../components/core/Logout";
import { AuthPageShell } from "../../components/core/AuthLayout";
import { useDispatch, useSelector } from "react-redux";
import PulseLoader from "react-spinners/PulseLoader";
import {
  getJobiboxPortals,
  updateJobibox,
} from "../../store/slices/jobiboxSlice";
import { AppVersion } from "../../components/core/AppVersion";

const chevronIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 opacity-35 transition group-hover:opacity-60 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

function ModuleIcon({ children, className }) {
  return (
    <div
      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ring-1 ring-inset ${className}`}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const training = localStorage.getItem("trainingActivated");
  const resume = localStorage.getItem("resumeActivated");
  const offers = localStorage.getItem("offersActivated");
  const careerGuide = localStorage.getItem("careerGuideActivated");
  const examenInProgress = localStorage.getItem("examenInProgress");
  const beginnerInProgress = localStorage.getItem("beginnerInProgress");
  const intermediateInProgress = localStorage.getItem("intermediateInProgress");
  const expertInProgress = localStorage.getItem("expertInProgress");
  const existingSelectedGreenFilter = localStorage.getItem(
    "selectedGreenFilter",
  );
  const [loading, setLoading] = useState(true);

  const modules = useMemo(
    () =>
      [
        {
          path: "/cvVideo",
          title: "CV Vidéo",
          subtitle: "Enregistre ta présentation et publie-la sur Jobissim.",
          accent: "border-l-blue_1",
          iconWrap: "bg-blue_1/10 text-blue_1 ring-blue_1/20",
          icon: (
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
            </svg>
          ),
          show: true,
        },
        {
          path: "/train",
          title: "Simulation d'entretien",
          subtitle: "Questions réelles, caméra, puis analyse de ta performance.",
          accent: "border-l-blue_3",
          iconWrap: "bg-blue_3/10 text-blue_3 ring-blue_3/25",
          icon: (
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h2m10 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0H7" />
            </svg>
          ),
          show: training === "true",
        },
        {
          path: "/resume",
          title: "CV papier",
          subtitle: "CV classique ou saisie vocale assistée par l'IA.",
          accent: "border-l-green_1",
          iconWrap: "bg-green_1/10 text-green_1 ring-green_1/25",
          icon: (
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
          show: resume === "true",
        },
        {
          path: "/career",
          title: "Guide de carrière",
          subtitle: "Agents IA pour structurer ta recherche et tes candidatures.",
          accent: "border-l-amber-400",
          iconWrap: "bg-amber-400/10 text-amber-300 ring-amber-400/25",
          icon: (
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          ),
          show: careerGuide === "true",
        },
        {
          path: "/offers",
          title: "Offres d'emploi",
          subtitle: "Parcours les annonces disponibles pour ta borne.",
          accent: "border-l-dark_text_5",
          iconWrap: "bg-dark_text_5/15 text-dark_text_5 ring-dark_text_5/30",
          icon: (
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          ),
          show: offers === "true",
        },
      ].filter((m) => m.show),
    [training, resume, offers, careerGuide],
  );

  useEffect(() => {
    const fetchJobibox = async () => {
      try {
        const jobiboxId = localStorage.getItem("jobiboxId");
        const response = await dispatch(getJobiboxPortals({ id: jobiboxId }));
        const portalsData = response.payload;

        localStorage.setItem("trainingActivated", portalsData.training);
        localStorage.setItem("examActivated", portalsData.exam);
        localStorage.setItem("resumeActivated", portalsData.resume);
        localStorage.setItem("offersActivated", portalsData.offers);
        if (portalsData.career !== undefined) {
          localStorage.setItem("careerGuideActivated", String(portalsData.career));
        } else if (portalsData.careerGuide !== undefined) {
          localStorage.setItem("careerGuideActivated", String(portalsData.careerGuide));
        }

        // ---- Version + AnyDesk Sync ----
        const appVersion = await AppVersion();
        let anydeskId = null;

        if (
          typeof window !== "undefined" &&
          window.electron &&
          window.electron.anydeskApi &&
          typeof window.electron.anydeskApi.getFreshId === "function"
        ) {
          try {
            anydeskId = await window.electron.anydeskApi.getFreshId();
          } catch (error) {
            console.warn("RustDesk/AnyDesk indisponible :", error);
          }
        }

        const updatePayload = {
          id: jobiboxId,
          version:
            portalsData.version !== appVersion
              ? appVersion
              : portalsData.version,
        };

        // Ajout conditionnel sécurisé
        if (anydeskId) {
          updatePayload.rustdeskId = anydeskId;
        }

        console.log("📡 Payload envoyé à updateJobibox:", updatePayload);

        // 👉 Une seule requête clean
        await dispatch(updateJobibox(updatePayload));

        if (!portalsData.training && !portalsData.offers) {
          navigate("/cvVideo");
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des portails :", error);
      }
    };

    fetchJobibox();

    if (examenInProgress === "true") {
      localStorage.removeItem("examenInProgress");
    }

    if (beginnerInProgress) {
      localStorage.removeItem("beginnerInProgress");
    }

    if (intermediateInProgress) {
      localStorage.removeItem("intermediateInProgress");
    }

    if (expertInProgress) {
      localStorage.removeItem("expertInProgress");
    }

    if (existingSelectedGreenFilter) {
      localStorage.removeItem("selectedGreenFilter");
    }
  }, [
    navigate,
    dispatch,
    examenInProgress,
    existingSelectedGreenFilter,
    expertInProgress,
    intermediateInProgress,
    beginnerInProgress,
  ]);

  if (loading) {
    return (
      <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
        <div className="flex w-full mx-auto h-full min-h-0">
          <AuthPageShell>
            <div className="flex flex-1 flex-col w-full min-h-0 box-border">
              <div className="my-auto w-full flex flex-col items-center justify-center py-8 tall:py-12">
                <PulseLoader color="#e296f2" size={16} />
              </div>
            </div>
          </AuthPageShell>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
      <Logout />
      <div className="flex w-full mx-auto h-full min-h-0">
        <AuthPageShell>
          <div className="flex flex-1 flex-col w-full min-h-0 box-border">
            <div className="my-auto w-full max-w-[min(1240px,calc(100vw-2rem))] tall:max-w-[min(1320px,calc(100vw-5rem))] mx-auto flex flex-col gap-10 tall:gap-12 px-8 tall:px-14 py-8 tall:py-12 box-border">
              <div className="text-center">
                <h1 className="text-4xl tall:text-5xl font-bold tracking-tight dark:text-dark_text_1">
                  <span className="text-blue_3">J</span>obiBox
                </h1>
                <p className="mt-3 text-xs font-medium uppercase tracking-[0.28em] text-dark_text_2">
                  Choisis un parcours
                </p>
                <p className="mt-8 text-lg tall:text-xl text-dark_text_1">
                  Bonjour{" "}
                  <span className="font-semibold text-blue_3">{user.username}</span>
                </p>
              </div>

              <nav className="flex w-full flex-col gap-4 tall:gap-5" aria-label="Modules JobiBox">
                {modules.map((mod) => (
                  <button
                    key={mod.path}
                    type="button"
                    onClick={() => navigate(mod.path)}
                    className={`group relative w-full overflow-hidden rounded-3xl border border-white/[0.06] border-l-4 ${mod.accent} bg-dark_bg_3/70 px-6 tall:px-8 py-5 tall:py-6 text-left transition duration-200 hover:bg-dark_bg_4/90 hover:border-white/[0.1] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue_3/45 focus-visible:ring-offset-2 focus-visible:ring-offset-dark_bg_2 active:scale-[0.998]`}
                  >
                    <div className="relative flex items-center gap-5 tall:gap-6">
                      <ModuleIcon className={mod.iconWrap}>{mod.icon}</ModuleIcon>
                      <div className="min-w-0 flex-1">
                        <span className="block text-xl tall:text-2xl font-semibold tracking-tight text-dark_text_1">
                          {mod.title}
                        </span>
                        <span className="mt-1.5 block text-base tall:text-lg leading-snug text-dark_text_4">
                          {mod.subtitle}
                        </span>
                      </div>
                      <div className="shrink-0 text-dark_text_2">{chevronIcon}</div>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </AuthPageShell>
      </div>
    </div>
  );
}
