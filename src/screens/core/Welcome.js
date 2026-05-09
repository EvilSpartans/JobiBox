import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import welcomeImage from "../../../assets/images/jobibox2.png";
import { AuthPageShell } from "../../components/core/AuthLayout";

const features = [
  {
    title: "CV Vidéo",
    description: "Filme ta présentation et diffuse-la aux recruteurs sur Jobissim.",
    accent: "border-l-blue_1",
    wash: "from-blue_1/10",
  },
  {
    title: "CV Papier & IA Vocal",
    description: "Crée ton CV classique ou génère-le en parlant grâce à l'IA.",
    accent: "border-l-green_1",
    wash: "from-green_1/10",
  },
  {
    title: "Simulation d'entretien",
    description: "Entraîne-toi face caméra avec des questions réelles.",
    accent: "border-l-blue_3",
    wash: "from-blue_3/10",
  },
  {
    title: "Guide de carrière",
    description: "6 agents IA spécialisés pour booster ta recherche d'emploi.",
    accent: "border-l-amber-400",
    wash: "from-amber-400/10",
  },
  {
    title: "Offres d'emploi",
    description: "Consulte les offres disponibles directement depuis la borne.",
    accent: "border-l-dark_text_5",
    wash: "from-dark_text_5/10",
  },
];

export default function Welcome() {
  const navigate = useNavigate();
  const existingBusiness = localStorage.getItem("businessId");

  const handleKeyDown = useCallback((e) => {
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "b") {
      localStorage.removeItem("businessId");
      localStorage.removeItem("jobiboxId");
      alert("Configuration réinitialisée");
      navigate("/config");
    }
  }, [navigate]);

  useEffect(() => {
    if (localStorage.getItem("urlQrcode")) {
      localStorage.removeItem("urlQrcode");
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    if (!existingBusiness) {
      navigate("/config");
    }
  }, [existingBusiness, navigate]);

  return (
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
      <div className="flex w-full mx-auto h-full min-h-0">
        <AuthPageShell>
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="relative flex flex-col items-center px-8 sm:px-10 pt-20 sm:pt-28 pb-6">
              <h2 className="text-5xl sm:text-6xl font-bold tracking-tight dark:text-dark_text_1">
                <span className="text-blue_3">J</span>obiBox
              </h2>
              <p className="mt-2 text-lg uppercase tracking-[0.25em] dark:text-dark_text_2 opacity-60 font-medium">
                Ta borne de carrière
              </p>
              <div className="relative mt-6 flex items-center justify-center">
                <div
                  className="absolute rounded-full blur-3xl opacity-40 pointer-events-none"
                  style={{ width: 280, height: 140, background: "rgba(59,130,246,0.6)" }}
                />
                <img
                  src={welcomeImage}
                  alt="JobiBox"
                  className="relative z-[1] drop-shadow-2xl"
                  style={{ maxHeight: "380px", width: "auto", height: "auto" }}
                />
              </div>
              <p className="relative z-[1] my-6 text-xl text-center dark:text-dark_text_2 max-w-2xl leading-relaxed px-2">
                La cabine <span className="text-blue_3 font-semibold">vidéo + IA</span> qui booste l&apos;employabilité
              </p>
            </div>

            <div className="flex flex-1 flex-col gap-6 px-8 sm:px-10 pb-6">
              <div className="mx-auto flex w-full max-w-2xl flex-col gap-3">
                {features.map((feature) => (
                  <div
                    key={feature.title}
                    className={`cursor-default select-none rounded-2xl border border-white/[0.08] border-l-4 ${feature.accent} bg-gradient-to-r ${feature.wash} to-transparent px-4 py-3.5 sm:px-5 sm:py-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]`}
                  >
                    <p className="text-[0.95rem] sm:text-base leading-relaxed text-dark_text_4">
                      <span className="font-semibold text-dark_text_1">{feature.title}</span>
                      <span className="text-dark_text_2"> — </span>
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-center text-sm dark:text-dark_text_2 opacity-50 max-w-lg mx-auto pt-1">
                Les fonctionnalités disponibles dépendent de la configuration de ta borne.
              </p>
            </div>

            <div className="mt-auto flex gap-4 px-8 sm:px-10 pb-10 pt-2">
              <button
                type="button"
                className="text-lg flex-1 flex justify-center bg-blue_3 text-gray-100 py-4 rounded-full tracking-wide font-semibold focus:outline-none hover:bg-blue_4 shadow-lg cursor-pointer transition ease-in duration-300"
                onClick={() => navigate("/register")}
              >
                Inscription
              </button>
              <button
                type="button"
                className="text-lg flex-1 flex justify-center dark:bg-dark_bg_1 dark:text-dark_text_2 py-4 rounded-full tracking-wide font-semibold focus:outline-none dark:hover:bg-dark_bg_1/80 shadow-lg cursor-pointer transition ease-in duration-300 ring-1 ring-white/10"
                onClick={() => navigate("/login")}
              >
                Connexion
              </button>
            </div>
          </div>
        </AuthPageShell>
      </div>
    </div>
  );
}
