import React from "react";
import Select from "react-select";

export default function SelectMultiple({
    name,
    label,
    placeholder,
    options,
    value,
    onChange,
    register,
    error,
    style,
    className
}) {
    const customStyles = {
        control: (styles) => ({
            ...styles,
            backgroundColor: "#182229",
            borderColor: "transparent", 
            '&:hover': {
                borderColor: "transparent", 
            },
        }),
        option: (styles, { isSelected, isFocused }) => ({
            ...styles,
            backgroundColor: isSelected ? "#5287ef" : isFocused ? "#233138" : "#182229",
            color: isSelected ? "white" : "#E9EDEF",
        }),
        multiValue: (styles) => ({
            ...styles,
            backgroundColor: "#5287ef",
        }),
        multiValueLabel: (styles) => ({
            ...styles,
            color: "white",
        }),
        multiValueRemove: (styles) => ({
            ...styles,
            color: "white",
            ':hover': {
                backgroundColor: "#5287ef",
            },
        }),
    };

    return (
        <div className={`mt-8 content-center dark:text-dark_text_1 space-y-1 ${className}`} style={style}>
            <label htmlFor={name} className="text-base font-bold tracking-wide">
                {label}
            </label>
            <Select
                name={name}
                options={options}
                isMulti
                value={value}
                onChange={onChange}
                className="w-full h-10"
                styles={customStyles}
                placeholder={placeholder}
                isSearchable={false}
            />
            {/* Hidden fields for each selected value */}
            {value.map((selectedOption, index) => (
                <input
                    key={index}
                    type="hidden"
                    {...register(`${name}.${index}`)}
                    value={selectedOption.value}
                />
            ))}
            {/* Display error message */}
            {error && <p className="text-red-400">{error}</p>}
        </div>
    );
}
