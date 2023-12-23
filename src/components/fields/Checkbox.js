import React from "react";

export default function Checkbox({
    name,
    label,
    register,
    error,
}) {
    return (
        <div className="mt-8 flex items-center dark:text-dark_text_1">
            <input
                type="checkbox"
                id={name}
                {...register(name)}
                className="mr-2 dark:bg-dark_bg_3 text-base rounded-lg outline-none"
            />
            <label htmlFor={name} className="text-sm font-bold tracking-wide">
                {label}
            </label>
            {error && <p className="text-red-400">{error}</p>}
        </div>
    );
}
