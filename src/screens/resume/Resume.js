import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import ResumeHeader from "../../components/resume/ResumeHeader";
import { RESUME_IA_STEPS } from "../../utils/IAResume";
import Header from "../../components/resume/Header";
import GlowBackground from "../../components/resume/GlowBackground";

export default function Resume() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleStart = () => {
    navigate("/personnalization");
  };

  const STEP_KEYS = ["personnalisation", "profilCandidat", "interests", "competences", "generation", "finalisation"];
const steps = RESUME_IA_STEPS;

  return (
    <div className="relative h-screen dark:bg-dark_bg_1 overflow-hidden">
      <ResumeHeader />

      <GlowBackground />
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
          <div className="text-center space-y-6">
            <Header
              step={t("resume.intro.step")}
              title={t("resume.intro.title")}
              description={t("resume.intro.description")}
              hint={t("resume.intro.hint")}
            />
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

          <div className="mt-14 sm:mt-16 relative flex-1 flex flex-col">
            <div className="mb-10 sm:mb-12 flex justify-center">
              <div
                className="px-6 py-2.5 rounded-full
                 text-xs sm:text-sm tracking-[0.2em] font-semibold
                 text-emerald-300
                 bg-emerald-500/10
                 ring-1 ring-emerald-500/25"
              >
                {t("resume.intro.stepsLabel")}
              </div>
            </div>

            <div className="relative flex-1 flex flex-col justify-center max-w-2xl mx-auto">
              <div className="relative grid grid-cols-[36px_1fr_56px] gap-x-6 sm:gap-x-8">
                <div className="absolute left-4 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-emerald-500/30 to-transparent" />

                {steps.map((item, idx) => (
                  <div
                    key={item.step}
                    className="col-span-3 grid grid-cols-[36px_1fr_56px] items-center py-6 sm:py-7"
                  >
                    <div className="relative">
                      <span
                        className="absolute left-4 top-1/2 -translate-x-1/2 -translate-y-1/2
                         w-3.5 h-3.5 rounded-full bg-emerald-400
                         shadow-[0_0_12px_rgba(16,185,129,0.5)]
                         animate-pulse-dot"
                      />
                      <span
                        className="absolute left-4 top-1/2 -translate-x-1/2 -translate-y-1/2
                         w-3.5 h-3.5 rounded-full border-2 border-emerald-400/60
                         animate-ping-dot"
                      />
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-white">
                        {t(`resume.steps.${STEP_KEYS[idx]}`)}
                      </h3>
                      <p className="mt-2 text-sm sm:text-base text-gray-300 leading-relaxed max-w-lg">
                        {t(`resume.steps.${STEP_KEYS[idx]}Desc`)}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-4xl sm:text-5xl font-bold text-emerald-500/[0.08] select-none tabular-nums">
                        {item.step}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto pt-14 flex flex-col items-center space-y-6">
            <p className="text-sm text-gray-400 text-center max-w-md">
              {t("resume.intro.footer")}
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
                {t("resume.intro.startButton")}
                <span className="arrow-loop inline-block text-xl">→</span>
              </span>

              <style>{`
    @keyframes pulseDot {
      0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.1); }
    }
    .animate-pulse-dot {
      animation: pulseDot 2s ease-in-out infinite;
    }
    @keyframes pingDot {
      0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
      100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
    }
    .animate-ping-dot {
      animation: pingDot 2s ease-out infinite;
    }
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
