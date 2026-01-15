import React from "react";
import DateSelect from "./DateSelect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function ExperienceForm({ data, onChange, onDelete }) {
 return (
  <div className="relative bg-white/5 p-6 pt-12 rounded-2xl space-y-6 border border-white/10">
   {/* SUPPRIMER */}
   <button
    type="button"
    onClick={() => onDelete(data.__index)}
    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/10 text-red-400 hover:bg-red-500/20 transition"
   >
    <FontAwesomeIcon icon={faTrash} />
   </button>

   {/* POSTE / ENTREPRISE */}
   <div className="grid grid-cols-2 gap-4">
    <div>
     <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">
      Poste
     </label>
     <input
      value={data.title || ""}
      onChange={(e) => onChange({ ...data, title: e.target.value })}
      className="w-full bg-dark_bg_1/80 text-white rounded-xl px-4 py-2"
     />
    </div>

    <div className="flex items-end gap-3">
     <div className="flex-1">
      <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">
       Entreprise
      </label>
      <input
       value={data.company || ""}
       onChange={(e) => onChange({ ...data, company: e.target.value })}
       className="w-full bg-dark_bg_1/80 text-white rounded-xl px-4 py-2"
      />
     </div>

     <button
      type="button"
      onClick={() =>
       onChange({
        ...data,
        endDate: data.endDate === "En cours" ? {} : "En cours",
       })
      }
      className={`h-[42px] px-4 rounded-xl text-sm whitespace-nowrap transition ${
       data.endDate === "En cours"
        ? "bg-emerald-600 text-white"
        : "bg-white/10 text-gray-300 hover:bg-white/20"
      }`}
     >
      En cours
     </button>
    </div>
   </div>

   {/* DATES */}
   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <DateSelect
     label="Date de début"
     value={data.startDate}
     onChange={(v) => onChange({ ...data, startDate: v })}
    />

    <DateSelect
     label="Date de fin"
     value={data.endDate}
     allowOngoing
     onChange={(v) => onChange({ ...data, endDate: v })}
    />
   </div>

   {/* DESCRIPTION */}
   <div>
    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">
     Description
    </label>
    <textarea
     value={data.description || ""}
     onChange={(e) => onChange({ ...data, description: e.target.value })}
     className="w-full bg-dark_bg_1/80 text-white rounded-xl px-4 py-3 min-h-[100px]"
    />
   </div>
  </div>
 );
}
