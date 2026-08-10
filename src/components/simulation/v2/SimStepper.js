import React from "react";

const STEPS = [
  { id: "level", label: "Niveau" },
  { id: "intro", label: "Présentation" },
  { id: "interview", label: "Entretien" },
  { id: "bilan", label: "Bilan" },
];

/**
 * @param {'level-select'|'level-intro'|'interview'|'closing'|'evaluation'} currentStep
 */
export default function SimStepper({ currentStep }) {
  const activeIndex =
    currentStep === "level-select"
      ? 0
      : currentStep === "level-intro"
        ? 1
        : currentStep === "interview" || currentStep === "closing"
          ? 2
          : 3;

  return (
    <nav className="w-full max-w-md mx-auto px-1" aria-label="Progression">
      <ol className="flex items-start justify-center list-none m-0 p-0 w-full">
        {STEPS.map((step, i) => {
          const done = i < activeIndex;
          const active = i === activeIndex;
          return (
            <React.Fragment key={step.id}>
              <li
                className={`flex flex-col items-center gap-2 min-w-[52px] flex-none ${
                  active
                    ? "text-white"
                    : done
                      ? "text-gray-200"
                      : "text-gray-500"
                }`}
              >
                <span
                  className={`h-8 w-8 rounded-full inline-flex items-center justify-center text-sm font-semibold border transition ${
                    active || done
                      ? "bg-[#1976d2] border-[#1976d2] text-white"
                      : "bg-white/5 border-white/20 text-gray-400"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </span>
                <span
                  className={`text-base sm:text-sm text-center leading-tight ${
                    active ? "font-semibold" : "font-medium"
                  }`}
                >
                  {step.label}
                </span>
              </li>
              {i < STEPS.length - 1 && (
                <li
                  aria-hidden="true"
                    className={`flex-1 h-[1.5px] mt-[15px] mx-2 min-w-[12px] ${
                    i < activeIndex ? "bg-[#1976d2]" : "bg-white/15"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
