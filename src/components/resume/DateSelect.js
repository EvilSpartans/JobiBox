import React from "react";
import { RESUME_DAYS, RESUME_MONTHS, RESUME_YEARS } from "../../utils/IAResume";

export default function DateSelect({
 label,
 value = {},
 onChange,
 allowOngoing = false,
}) {
 const DAYS = RESUME_DAYS;
 const MONTHS = RESUME_MONTHS;
 const YEARS = RESUME_YEARS;
 const isOngoing = value === "En cours";

 const selectClass =
  "bg-dark_bg_1/80 border border-white/10 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 disabled:opacity-50";

 const optionClass = "bg-dark_bg_2 text-white text-lg";
 const optionPlaceholderClass = "bg-dark_bg_2 text-gray-400 text-lg";

 return (
  <div className="space-y-2">
   {label && (
    <div className="text-xs uppercase tracking-wider text-gray-400">
     {label}
    </div>
   )}

   <div className="flex flex-wrap gap-2">
    {/* JOUR */}
    <select
     disabled={isOngoing}
     value={!isOngoing && typeof value === "object" ? value.day || "" : ""}
     onChange={(e) =>
      onChange({
       ...(typeof value === "object" && !isOngoing ? value : {}),
       day: e.target.value,
      })
     }
     className={`${selectClass} w-[72px]`}
    >
     <option value="" className={optionPlaceholderClass}>
      Jour
     </option>
     {DAYS.map((d) => (
      <option key={d} value={d} className={optionClass}>
       {d}
      </option>
     ))}
    </select>

    {/* MOIS */}
    <select
     disabled={isOngoing}
     value={!isOngoing && typeof value === "object" ? value.month || "" : ""}
     onChange={(e) =>
      onChange({
       ...(typeof value === "object" && !isOngoing ? value : {}),
       month: e.target.value,
      })
     }
     className={`${selectClass} w-[130px]`}
    >
     <option value="" className={optionPlaceholderClass}>
      Mois
     </option>
     {MONTHS.map((m) => (
      <option key={m.value} value={m.value} className={optionClass}>
       {m.label}
      </option>
     ))}
    </select>

    {/* ANNÉE */}
    <select
     disabled={isOngoing}
     value={!isOngoing && typeof value === "object" ? value.year || "" : ""}
     onChange={(e) =>
      onChange({
       ...(typeof value === "object" && !isOngoing ? value : {}),
       year: e.target.value,
      })
     }
     className={`${selectClass} w-[96px]`}
    >
     <option value="" className={optionPlaceholderClass}>
      Année
     </option>
     {YEARS.map((y) => (
      <option key={y} value={y} className={optionClass}>
       {y}
      </option>
     ))}
    </select>
   </div>
  </div>
 );
}
