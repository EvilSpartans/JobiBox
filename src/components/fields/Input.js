import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function Input({
 name,
 type,
 label,
 placeholder,
 register,
 error,
 selected,
 onChange,
 style,
 toggleVisibility,
 isPasswordVisible,
 className,
 cityValue,
 setCityValue,
 cities,
 cityLoading,
 onCitySelect,
}) {
 const [showSuggestions, setShowSuggestions] = useState(false);
 const wrapperRef = useRef(null);

 useEffect(() => {
  function handleClickOutside(event) {
   if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
    setShowSuggestions(false);
   }
  }
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
 }, []);

 if (name === "date") {
  return (
   <div
    className={`mt-8 content-center dark:text-dark_text_1 space-y-1 ${className}`}
   >
    <div className="flex flex-col">
     <label htmlFor={name} className="text-base font-bold tracking-wide py-1">
      {label}
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
 } else if (name === "city") {
  return (
   <div
    className={`mt-8 content-center dark:text-dark_text_1 space-y-1 ${className}`}
    style={style}
    ref={wrapperRef}
   >
    <label htmlFor={name} className="text-base font-bold tracking-wide text-white">
     {label}
    </label>
    <div className="relative">
     <input
      className="w-full dark:bg-dark_bg_3 text-xl py-2 px-4 rounded-lg outline-none"
      type="text"
      placeholder={placeholder}
      value={cityValue}
      onChange={(e) => {
       setCityValue(e.target.value);
       setShowSuggestions(true);
      }}
      onFocus={() => {
       if (cities.length > 0) setShowSuggestions(true);
      }}
     />
     {showSuggestions && (
      <ul className="absolute z-10 w-full bg-white dark:bg-dark_bg_3 border rounded-lg mt-1 max-h-60 overflow-y-auto">
       {cityLoading ? (
        <li className="px-4 py-2 text-gray-500">Chargement...</li>
       ) : cities.length > 0 ? (
        cities.map((city, index) => (
         <li
          key={city.id || index}
          className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-dark_bg_2 cursor-pointer text-gray-500"
          onClick={() => {
           setCityValue(city.name || city);
           setShowSuggestions(false);
           if (onCitySelect) onCitySelect(city);
          }}
         >
          {city.name} {city.postalCode && `(${city.postalCode})`}
         </li>
        ))
       ) : (
        <li className="px-4 py-2 text-gray-500">Aucune ville trouvée</li>
       )}
      </ul>
     )}
    </div>
    {error && <p className="text-red-400">{error}</p>}
   </div>
  );
 } else {
  return (
   <div
    className={`mt-8 content-center dark:text-dark_text_1 space-y-1 ${className}`}
    style={style}
   >
    <label htmlFor={name} className="text-base font-bold tracking-wide">
     {label}
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
