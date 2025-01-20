import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";


export default function Input({
  name,
  type,
  placeholder,
  register,
  error,
  selected,
  onChange,
  style,
  toggleVisibility,
  isPasswordVisible,
  className
}) {

  if (name === "date") {
    return (
      <div className={`mt-8 content-center dark:text-dark_text_1 space-y-1 ${className}`}>
        <div className="flex flex-col"> 
          <label htmlFor={name} className="text-base font-bold tracking-wide py-1">
            {placeholder}
          </label>
          <DatePicker
            className="w-full dark:bg-dark_bg_3 text-xl py-2 px-4 rounded-lg outline-none"
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
      <div className={`mt-8 content-center dark:text-dark_text_1 space-y-1 ${className}`} style={style}>
        <label htmlFor={name} className="text-base font-bold tracking-wide">
          {placeholder}
        </label>
        <div className="relative">
          <input
            className="w-full dark:bg-dark_bg_3 text-xl py-2 px-4 rounded-lg outline-none"
            type={isPasswordVisible ? "text" : type}
            placeholder={placeholder}
            {...register(name)}
          />
          {toggleVisibility && (
            <button
              type="button"
              onClick={toggleVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <FontAwesomeIcon icon={isPasswordVisible ? faEyeSlash : faEye} />
            </button>
          )}          
        </div>
        {error && <p className="text-red-400">{error}</p>}
      </div>
    );
  }
}
