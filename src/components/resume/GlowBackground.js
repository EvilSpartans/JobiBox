import React from "react";

export default function GlowBackground() {
 return (
  <>
   <div className="pointer-events-none absolute -top-40 -right-40 w-[600px] h-[600px] bg-emerald-600/20 blur-3xl" />
   <div className="pointer-events-none absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-emerald-800/20 blur-3xl" />
  </>
 );
}
