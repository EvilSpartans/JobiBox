import React from "react";
import PulseLoader from "react-spinners/PulseLoader";

export default function Footer({
 onClick,
 disabled = false,
 loading = false,
 text = "Suivant",
}) {
 const isEnabled = !disabled && !loading;

 return (
  <div className="pt-10 flex justify-end">
   <button
    onClick={onClick}
    disabled={!isEnabled}
    className={`px-10 py-4 rounded-full text-lg font-semibold transition flex items-center justify-center
          ${
           isEnabled
            ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-xl hover:from-emerald-700 hover:to-emerald-800"
            : "bg-white/10 text-gray-500 cursor-not-allowed"
          }`}
   >
    {loading ? <PulseLoader color="#fff" size={12} /> : text}
   </button>
  </div>
 );
}
