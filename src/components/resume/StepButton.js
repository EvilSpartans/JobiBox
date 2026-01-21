import React from "react";
export default function StepButton({ step, label, desc, onClick }) {
 return (
  <button
   onClick={onClick}
   className="
        w-full flex items-center gap-5
        px-6 py-3
        rounded-2xl
        bg-white/5 border border-white/10
        active:scale-[0.99]
        transition
      "
  >
   <div
    className="
          w-12 h-12 flex items-center justify-center
          rounded-xl
          bg-emerald-600 text-white
          font-bold
        "
   >
    {step}
   </div>

   <div className="flex-1 text-left">
    <div className="text-white font-semibold text-lg">{label}</div>
    <div className="text-sm text-gray-400">{desc}</div>
   </div>

   <div
    className="
          w-10 h-10 flex items-center justify-center
          rounded-full
          bg-white/10 text-emerald-400
          text-lg
        "
   >
    →
   </div>
  </button>
 );
}
