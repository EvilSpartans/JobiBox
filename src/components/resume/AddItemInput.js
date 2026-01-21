import React from "react";

export default function AddItemInput({
 value,
 onChange,
 onAdd,
 placeholder,
 maxItems = null,
 currentCount = 0,
}) {
 const isMaxReached = maxItems && currentCount >= maxItems;

 const handleAdd = () => {
  const trimmed = value.trim();
  if (!trimmed) return;
  if (isMaxReached) return;
  onAdd(trimmed);
 };

 return (
  <div className="flex flex-col gap-2">
   <div className="flex items-stretch gap-3">
    <input
     value={value}
     onChange={(e) => onChange(e.target.value)}
     placeholder={placeholder}
     disabled={isMaxReached}
     className={`
            flex-1 px-4 py-3 border rounded-xl
            focus:outline-none focus:ring-2 focus:ring-emerald-500/40
            ${
             isMaxReached
              ? "bg-white/5 border-white/5 text-gray-500 cursor-not-allowed"
              : "bg-white/5 border-white/10 text-white"
            }
          `}
     onKeyDown={(e) => e.key === "Enter" && handleAdd()}
    />
    <button
     onClick={handleAdd}
     disabled={isMaxReached}
     className={`
            px-4 py-3 rounded-xl font-semibold transition
            ${
             isMaxReached
              ? "bg-gray-600 text-gray-400 cursor-not-allowed opacity-50"
              : "bg-emerald-600 text-white hover:bg-emerald-700"
            }
          `}
    >
     +
    </button>
   </div>

   {isMaxReached && (
    <span className="text-sm text-amber-400">
     Limite atteint ({maxItems}/{maxItems})
    </span>
   )}
  </div>
 );
}
