import React from "react";
import { useNavigate } from "react-router-dom";
import Logout from "../../components/core/Logout";
import GoBack from "../../components/core/GoBack";

export default function Resume() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/personnalization");
  };

  const steps = [
    {
      step: "01",
      title: "Personnalisation",
      desc: "Choix du titre, du design et de la couleur de ton CV",
    },
    {
      step: "02",
      title: "Profil candidat",
      desc: "Informations personnelles et type de contrat recherché",
    },
    {
      step: "03",
      title: "Compétences & langues",
      desc: "Sélection de tes skills et langues clés",
    },
    {
      step: "04",
      title: "Génération intelligente",
      desc: "L’IA génère automatiquement ta présentation, tes expériences et formations",
    },
    {
      step: "05",
      title: "Finalisation",
      desc: "Ajout de la photo, du CV vidéo et validation du CV papier",
    },
  ];

  return (
    <div className="relative h-screen dark:bg-dark_bg_1 overflow-hidden">
      <Logout />
      <GoBack />
      {/* Background glow */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-emerald-800/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full h-full flex items-center justify-center px-4">
        {/* Carte principale */}
        <div
          className="flex flex-col w-full max-w-3xl
                     p-6 sm:p-10 md:p-12
                     rounded-3xl
                     bg-gradient-to-br from-dark_bg_2/80 to-dark_bg_1/80
                     backdrop-blur-xl shadow-2xl ring-1 ring-white/10
                     min-h-[85vh] max-h-[90vh] overflow-y-auto scrollbar-none"
        >
          {/* Header */}
          <div className="text-center space-y-6">
            <span
              className="inline-block px-4 py-1 rounded-full text-sm font-semibold 
                             bg-emerald-900/40 text-emerald-300 tracking-wide"
            >
              Génération intelligente de CV
            </span>

            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
              CV papier
            </h2>

            <p className="text-lg sm:text-xl text-gray-300 max-w-xl mx-auto">
              Crée un CV professionnel, structuré et prêt à l’emploi, conçu
              automatiquement par l’IA.
            </p>
          </div>

          {/* Parcours vertical */}
          {/* <div className="mt-12 space-y-6">
            {steps.map((item) => (
              <div
                key={item.step}
                className="relative p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10"
              >
                <span className="absolute -top-6 -right-4 text-6xl sm:text-7xl font-black text-emerald-500/10">
                  {item.step}
                </span>

                <h3 className="text-lg sm:text-xl font-semibold text-emerald-300">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm text-gray-300 leading-relaxed max-w-lg">
                  {item.desc}
                </p>
              </div>
            ))}
          </div> */}

          <div className="mt-14 relative rounded-3xl ring-1 ring-white/5 bg-white/[0.02] p-6">
            {/* Label centré */}
            <div className="mb-10 flex justify-center">
              <div
                className="px-4 py-1 rounded-full
                 text-[10px] tracking-[0.32em] font-semibold
                 bg-dark_bg_1/80 text-emerald-400
                 ring-1 ring-white/10
                 shadow-[0_0_16px_rgba(16,185,129,0.15)]"
              >
                LES ÉTAPES QUE TU VAS RETROUVER
              </div>
            </div>

            <div className="relative grid grid-cols-[28px_1fr_auto] gap-x-6">
              {/* Trait vertical */}
              <div className="absolute left-3 top-0 bottom-0 w-px bg-emerald-500/25" />

              {steps.map((item) => (
                <div
                  key={item.step}
                  className="col-span-3 grid grid-cols-[28px_1fr_auto] items-center py-4"
                >
                  {/* Colonne trait + point */}
                  <div className="relative">
                    <span
                      className="absolute left-3 top-1/2 -translate-x-1/2 -translate-y-1/2
                       w-2.5 h-2.5 rounded-full bg-emerald-400
                       shadow-[0_0_14px_rgba(16,185,129,0.7)]"
                    />
                  </div>

                  {/* Contenu */}
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-emerald-300">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-xs sm:text-sm text-gray-300 leading-relaxed max-w-lg">
                      {item.desc}
                    </p>
                  </div>

                  {/* Numéro */}
                  <div className="text-right pr-1">
                    <span className="text-5xl sm:text-6xl font-black text-emerald-500/10 select-none leading-none">
                      {item.step}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto pt-14 flex flex-col items-center space-y-6">
            <p className="text-sm text-gray-400 text-center max-w-md">
              Ton CV sera sauvegardé et accessible à tout moment dans ton espace
              privé Jobissim.
            </p>

            <button
              onClick={handleStart}
              className="relative px-10 sm:px-14 py-4 rounded-full
             bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700
             text-lg font-semibold text-white
             shadow-[0_18px_40px_-15px_rgba(16,185,129,0.6)]
             active:scale-[0.97]
             active:shadow-[0_12px_25px_-12px_rgba(16,185,129,0.8)]
             transition-transform duration-150 ease-out
             overflow-hidden"
            >
              {/* halo pulsé permanent (mobile friendly) */}
              <span
                className="absolute inset-0
               bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.18),transparent_60%)]
               animate-pulse-soft"
              />

              {/* ripple au tap */}
              <span className="tap-ripple absolute inset-0" />

              {/* contenu */}
              <span className="relative z-10 inline-flex items-center gap-3">
                Commencer l’expérience
                <span className="arrow-loop inline-block text-xl">→</span>
              </span>

              <style>{`
    @keyframes arrowLoop {
      0% { transform: translateX(0); opacity: 0.6; }
      50% { transform: translateX(8px); opacity: 1; }
      100% { transform: translateX(0); opacity: 0.6; }
    }
    .arrow-loop {
      animation: arrowLoop 1.1s ease-in-out infinite;
    }

    @keyframes pulseSoft {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }
    .animate-pulse-soft {
      animation: pulseSoft 2.2s ease-in-out infinite;
    }

    button:active .tap-ripple {
      background: radial-gradient(circle, rgba(255,255,255,0.35) 10%, transparent 11%);
      animation: ripple 0.4s ease-out;
    }

    @keyframes ripple {
      from { transform: scale(0); opacity: 0.6; }
      to { transform: scale(2.5); opacity: 0; }
    }
  `}</style>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
