import React, { useMemo } from "react";
import { RESUME_DAYS, RESUME_MONTHS, RESUME_YEARS } from "../../utils/IAResume";
import { toDateSelectParts, datePartsToStorableObject } from "../../utils/DateUtils";

export default function DateSelect({
 label,
 value = {},
 onChange,
 allowOngoing = false,
}) {
 const DAYS = RESUME_DAYS;
 const MONTHS = RESUME_MONTHS;
 const YEARS = RESUME_YEARS;

 const parts = useMemo(() => toDateSelectParts(value), [value]);
 const isOngoing = parts === "En cours";

 const day = isOngoing ? "" : parts.day;
 const month = isOngoing ? "" : parts.month;
 const year = isOngoing ? "" : parts.year;

 const handleChange = (field, newValue) => {
  if (isOngoing) return;

  const base =
   typeof parts === "object" && parts
    ? { day: parts.day || "", month: parts.month || "", year: parts.year || "" }
    : { day: "", month: "", year: "" };

  const merged = { ...base, [field]: newValue };
  onChange(datePartsToStorableObject(merged));
 };

 return (
  <div>
   {label && (
    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">
     {label}
    </label>
   )}

   <div className="flex gap-2">
    {/* Jour — seulement si présent dans les données (jour + mois + année) */}
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

    <select
     value={month}
     onChange={(e) => handleChange("month", e.target.value)}
     disabled={isOngoing}
     className={`flex-1 bg-dark_bg_1/80 text-white rounded-xl px-3 py-2 border border-white/10 focus:border-emerald-500 focus:outline-none ${
      isOngoing ? "opacity-50 cursor-not-allowed" : ""
     }`}
    >
     <option value="">Mois</option>
     {MONTHS.map((m) => (
      <option key={m.value} value={m.value}>
       {m.label}
      </option>
     ))}
    </select>

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
      <option key={y} value={String(y)}>
       {y}
      </option>
     ))}
    </select>
   </div>

   {isOngoing && <p className="text-xs text-emerald-400 mt-1">En cours</p>}
  </div>
 );
}
