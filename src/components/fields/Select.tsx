import React from "react";
import { SelectProps } from "../../models/Field";

export default function Select({
  name,
  placeholder,
  register,
  error,
  options,
  className = "",
}: SelectProps) {
  const handleSelectClick = (event: React.MouseEvent<HTMLSelectElement>) => {
    const target = event.target as HTMLSelectElement;
    if (target.name === name) {
      event.preventDefault();
    }
  };

  return (
    <div className={`mt-8 content-center dark:text-dark_text_1 space-y-1 ${className}`}>
      <label htmlFor={name} className="text-base font-bold tracking-wide">
        {placeholder}
      </label>
      <select
        onClick={handleSelectClick}
        className="w-full dark:bg-dark_bg_3 text-xl py-2 px-4 rounded-lg h-10 outline-none"
        placeholder={placeholder}
        {...register(name)} // contient déjà `ref`
        defaultValue="Choisir"
      >
        <option className="dark:text-dark_text_1" value="" disabled></option>
        <option value="" hidden>
          Choisir
        </option>
        {options.map((option, index) => (
          <option key={index} value={option.value} style={{ fontSize: "x-large" }}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-400">{error}</p>}
    </div>
  );
}
