import React from "react";

import { useRef } from "react";

export default function Modal({ isOpen, onClose, title, children, onSave }) {
 const overlayRef = useRef(null);

 if (!isOpen) return null;

 return (
  <div
   ref={overlayRef}
   onClick={(e) => e.target === overlayRef.current && onClose()}
   className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4"
  >
   <div className="relative w-full max-w-3xl h-[75vh] bg-dark_bg_2 rounded-2xl shadow-2xl ring-1 ring-white/10 flex flex-col">
    {/* Header */}
    <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
     <h3 className="text-lg font-bold text-white">{title}</h3>
     <button
      onClick={onClose}
      className="text-white text-xl hover:text-emerald-400"
     >
      ✕
     </button>
    </div>

    {/* Content */}
    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">{children}</div>

    {/* Footer */}
    <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-4">
     <button onClick={onClose} className="text-gray-300">
      Annuler
     </button>
     <button
      onClick={onSave}
      className="px-6 py-2 bg-emerald-600 text-white rounded-full"
     >
      Enregistrer
     </button>
    </div>
   </div>
  </div>
 );
}
