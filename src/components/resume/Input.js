import React from "react";

export default function Input({
 label,
 name,
 value,
 onChange,
 type = "text",
 placeholder = "",
 full = false,
 required = false,
}) {
 return (
  <div className={full ? "md:col-span-2" : ""}>
   <label className="block text-sm text-gray-300 mb-2">{label}</label>
   <input
    type={type}
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full rounded-xl bg-white/5 border px-4 py-3 outline-none transition
          ${
           required && !value
            ? "border-red-500/50 focus:border-red-500"
            : "border-white/10 focus:border-emerald-500"
          }
          text-white`}
   />
  </div>
 );
}
