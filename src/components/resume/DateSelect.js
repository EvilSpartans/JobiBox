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

 const day = isOngoing ? "" : value?.day || "";
 const month = isOngoing ? "" : value?.month || "";
 const year = isOngoing ? "" : value?.year || "";

 const handleChange = (field, newValue) => {
  if (isOngoing) {
   onChange({ day: "", month: "", year: "", [field]: newValue });
  } else {
   onChange({ ...value, [field]: newValue });
  }
 };

 return (
  <div>
   {label && (
    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">
     {label}
    </label>
   )}

   <div className="flex gap-2">
    {/* Jour */}
    <select
     value={day}
     onChange={(e) => handleChange("day", e.target.value)}
     disabled={isOngoing}
     className={`flex-1 bg-dark_bg_1/80 text-white rounded-xl px-3 py-2 border border-white/10 focus:border-emerald-500 focus:outline-none ${
      isOngoing ? "opacity-50 cursor-not-allowed" : ""
     }`}
    >
     <option value="">Jour</option>
     {DAYS.filter((d) => d).map((d) => (
      <option key={d} value={d}>
       {d}
      </option>
     ))}
    </select>

    {/* Mois */}
    <select
     value={month}
     onChange={(e) => handleChange("month", e.target.value)}
     disabled={isOngoing}
     className={`flex-1 bg-dark_bg_1/80 text-white rounded-xl px-3 py-2 border border-white/10 focus:border-emerald-500 focus:outline-none ${
      isOngoing ? "opacity-50 cursor-not-allowed" : ""
     }`}
    >
     {MONTHS.map((m) => (
      <option key={m.value} value={m.value}>
       {m.label}
      </option>
     ))}
    </select>

    {/* Année */}
    <select
     value={year}
     onChange={(e) => handleChange("year", e.target.value)}
     disabled={isOngoing}
     className={`flex-1 bg-dark_bg_1/80 text-white rounded-xl px-3 py-2 border border-white/10 focus:border-emerald-500 focus:outline-none ${
      isOngoing ? "opacity-50 cursor-not-allowed" : ""
     }`}
    >
     <option value="">Année</option>
     {YEARS.filter((y) => y).map((y) => (
      <option key={y} value={y}>
       {y}
      </option>
     ))}
    </select>
   </div>

   {isOngoing && <p className="text-xs text-emerald-400 mt-1">En cours</p>}
  </div>
 );
}
