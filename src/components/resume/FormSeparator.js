import React from "react";

export default function FormSeparator() {
  return (
    <div className="relative flex items-center justify-center my-10">
      <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
      <div className="relative z-10 w-4 h-4 rounded-full bg-emerald-500/30 ring-1 ring-emerald-400/40 shadow-[0_0_12px_rgba(16,185,129,0.35)]" />
    </div>
  );
}