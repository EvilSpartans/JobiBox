import React from "react";

export default function Header({ step, title, description, hint }) {
 return (
  <div className="text-center space-y-5">
   <span className="inline-block px-4 py-1 rounded-full text-sm font-semibold bg-emerald-900/40 text-emerald-300">
    {step}
   </span>

   <h2 className="text-4xl font-extrabold text-white">{title}</h2>

   <p className=" text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
    {description}{" "}
    {hint && <span className="text-emerald-400 font-semibold">{hint}</span>}
   </p>
  </div>
 );
}
