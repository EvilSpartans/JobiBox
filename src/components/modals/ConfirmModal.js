import React from "react";
export default function ConfirmModal({
 isOpen,
 title,
 message,
 onConfirm,
 onCancel,
 confirmText = "Oui",
 confirmClass = "bg-red-600",
}) {
 if (!isOpen) return null;

 return (
  <div className="fixed inset-0 flex items-center justify-center z-50">
   <div className="absolute inset-0 bg-black bg-opacity-75" />
   <div className="bg-white w-full max-w-md p-6 rounded-lg text-center z-50 relative">
    <p className="text-gray-800 text-lg font-semibold">{title}</p>
    <p className="text-gray-600 mt-2">{message}</p>
    <div className="mt-6 flex justify-center gap-4">
     <button
      className={`${confirmClass} text-white px-6 py-2 rounded-md`}
      onClick={onConfirm}
     >
      {confirmText}
     </button>
     <button
      className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md"
      onClick={onCancel}
     >
      Annuler
     </button>
    </div>
   </div>
  </div>
 );
}
