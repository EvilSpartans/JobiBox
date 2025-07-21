import React from "react";

export default function Textarea({
    name,
    type,
    label,
    placeholder,
    register,
    error,
}) {
    return (
        <div className="mt-8 content-center dark:text-dark_text_1 space-y-1">
            <label htmlFor={name} className="text-base font-bold tracking-wide">
                {label}
            </label>
            <textarea
                className="w-full dark:bg-dark_bg_3 text-xl py-2 px-4 rounded-lg outline-none"
                type={type}
                placeholder={placeholder}
                {...register(name)}
            />
            {error && <p className="text-red-400">{error}</p>}
        </div>
    );
}
