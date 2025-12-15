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
    <div className="relative h-screen flex items-center justify-center dark:bg-dark_bg_1 overflow-hidden">
      <Logout />
      <GoBack />
      {/* Background glow */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-emerald-800/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full h-full flex items-center justify-center px-4">
        {/* Carte principale */}
        <div
          className="flex flex-col justify-between w-full max-w-3xl
                     p-6 sm:p-10 md:p-12
                     rounded-3xl
                     bg-gradient-to-br from-dark_bg_2/80 to-dark_bg_1/80
                     backdrop-blur-xl shadow-2xl ring-1 ring-white/10
                     max-h-[90vh] overflow-y-auto scrollbar-none"
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
          <div className="mt-12 space-y-6">
            {steps.map((item) => (
              <div
                key={item.step}
                className="relative p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10
                           hover:border-emerald-500/40 transition duration-300"
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
          </div>

          {/* Footer */}
          <div className="mt-14 flex flex-col items-center space-y-6">
            <p className="text-sm text-gray-400 text-center max-w-md">
              Ton CV sera sauvegardé et accessible à tout moment dans ton espace
              privé Jobissim.
            </p>

            <button
              onClick={handleStart}
              className="group relative overflow-hidden px-10 sm:px-12 py-4 rounded-full
                         bg-gradient-to-r from-emerald-600 to-emerald-700
                         text-lg font-semibold text-white shadow-xl
                         hover:from-emerald-700 hover:to-emerald-800
                         transition-all duration-300"
            >
              <span className="relative z-10">Commencer l’expérience</span>

              <span
                className="absolute inset-0 bg-white/10 opacity-0 
                               group-hover:opacity-100 transition duration-300"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
