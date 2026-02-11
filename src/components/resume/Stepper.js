import React from "react";
import { useNavigate } from "react-router-dom";
import { CV_STEPS_STEPPER } from "../../utils/IAResume";

const steps = CV_STEPS_STEPPER;

const StepIcon = ({ type, className }) => {
 const icons = {
  palette: (
   <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
   >
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.5-.67 1.5-1.5 0-.39-.14-.77-.38-1.06-.25-.3-.38-.69-.38-1.09 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8z" />
    <circle cx="7.5" cy="11.5" r="1.5" fill="currentColor" />
    <circle cx="12" cy="7.5" r="1.5" fill="currentColor" />
    <circle cx="16.5" cy="11.5" r="1.5" fill="currentColor" />
   </svg>
  ),
  user: (
   <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
   >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
   </svg>
  ),
  skills: (
   <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
   >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
   </svg>
  ),
  sparkles: (
   <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
   >
    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
    <circle cx="12" cy="12" r="4" />
   </svg>
  ),
  check: (
   <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
   >
    <polyline points="20 6 9 17 4 12" />
   </svg>
  ),
 };
 return icons[type] || null;
};

export default function CVStepper({
 currentStep = 1,
 completedSteps = [],
 disabled = false,
 loading = false,
 onNavigate,
}) {
 const navigate = useNavigate();

 const handleStepClick = (step) => {
  if (loading) return;

  const direction = step.id > currentStep ? "forward" : "backward";

  if (direction === "forward" && disabled) return;

  if (step.id === currentStep) return;

  if (onNavigate) {
   onNavigate(step, direction);
  } else {
   navigate(step.path);
  }
 };

 const getStepStatus = (step) => {
  if (completedSteps.includes(step.id)) return "completed";
  if (step.id === currentStep) return "current";
  if (step.id < currentStep) return "completed";
  return "upcoming";
 };

 const isStepClickable = (step) => {
  if (loading) return false;
  if (step.id === currentStep) return false;

  if (step.id < currentStep) return true;

  return !disabled;
 };

 return (
  <div className="w-full px-4 py-4">
   <div
    className="relative flex items-center justify-between
                   p-3 sm:p-4
                   rounded-2xl
                   bg-dark_bg_2/60
                   backdrop-blur-md
                   ring-1 ring-white/10
                   shadow-lg"
   >
    <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-white/10 -translate-y-1/2 hidden sm:block" />

    <div
     className="absolute top-1/2 left-8 h-0.5 bg-gradient-to-r from-emerald-500 to-emerald-400 -translate-y-1/2 transition-all duration-500 hidden sm:block"
     style={{
      width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% - 4rem)`,
     }}
    />

    {steps.map((step) => {
     const status = getStepStatus(step);
     const clickable = isStepClickable(step);

     return (
      <button
       key={step.id}
       onClick={() => handleStepClick(step)}
       disabled={!clickable}
       className={`
                relative z-10 flex flex-col items-center
                px-2 sm:px-4 py-2
                rounded-xl
                transition-all duration-300 ease-out
                group
                ${clickable ? "cursor-pointer hover:bg-white/5" : "cursor-not-allowed opacity-60"}
                ${status === "current" ? "bg-emerald-500/20 ring-1 ring-emerald-500/50 !opacity-100" : ""}
              `}
      >
       <div
        className={`
                  relative flex items-center justify-center
                  w-10 h-10 sm:w-12 sm:h-12
                  rounded-full
                  transition-all duration-300
                  ${
                   status === "completed"
                    ? "bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                    : status === "current"
                      ? "bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500"
                      : "bg-white/5 text-gray-500 ring-1 ring-white/10"
                  }
                `}
       >
        {status === "completed" ? (
         <svg
          className="w-5 h-5 sm:w-6 sm:h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
         >
          <polyline points="20 6 9 17 4 12" />
         </svg>
        ) : (
         <StepIcon type={step.icon} className="w-5 h-5 sm:w-6 sm:h-6" />
        )}

        {status === "current" && (
         <span className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping" />
        )}

        {/* Loading indicator */}
        {loading && status === "current" && (
         <span className="absolute inset-0 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
        )}
       </div>

       <div className="mt-2 text-center hidden sm:block">
        <p
         className={`
                    text-[10px] sm:text-xs font-semibold tracking-wider
                    transition-colors duration-300
                    ${
                     status === "completed"
                      ? "text-emerald-400"
                      : status === "current"
                        ? "text-emerald-300"
                        : "text-gray-500"
                    }
                  `}
        >
         {step.label}
        </p>
       </div>

       <span
        className={`
                  mt-1 text-[10px] font-medium sm:hidden
                  ${
                   status === "completed" || status === "current"
                    ? "text-emerald-400"
                    : "text-gray-600"
                  }
                `}
       >
        {step.id}
       </span>
      </button>
     );
    })}
   </div>
  </div>
 );
}