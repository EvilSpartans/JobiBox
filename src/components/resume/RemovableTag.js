import React from "react";

export default function RemovableTag({ label, onRemove }) {
 return (
  <span
   onClick={onRemove}
   className="px-4 py-2 bg-emerald-600/20 text-white rounded-full cursor-pointer"
  >
   {label} ✕
  </span>
 );
}
