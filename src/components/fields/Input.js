import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Input({
  name,
  type,
  placeholder,
  register,
  error,
  selected,
  onChange
}) {

  if (name === "date") {
    return (
      <div className="mt-8 content-center dark:text-dark_text_1 space-y-1">
        <div className="flex flex-col"> 
          <label htmlFor={name} className="text-sm font-bold tracking-wide py-1">
            {placeholder}
          </label>
          <DatePicker
            className="w-full dark:bg-dark_bg_3 text-base py-2 px-4 rounded-lg outline-none"
            selected={selected}
            onChange={onChange}
            placeholderText={placeholder}
            dateFormat="dd/MM/yyyy"
          />
        </div>
        {error && <p className="text-red-400">{error}</p>}
      </div>
    );
  } else {
    return (
      <div className="mt-8 content-center dark:text-dark_text_1 space-y-1">
        <label htmlFor={name} className="text-sm font-bold tracking-wide">
          {placeholder}
        </label>
        <input
          className="w-full dark:bg-dark_bg_3 text-base py-2 px-4 rounded-lg outline-none"
          type={type}
          placeholder={placeholder}
          {...register(name)}
        />
        {error && <p className="text-red-400">{error}</p>}
      </div>
    );
  }
}
