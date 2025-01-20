import React from "react";

export default function Checkbox({
    name,
    label,
    register,
    error,
    style
}) {
    return (
        <div className="mt-8 flex items-center dark:text-dark_text_1" style={style}>
            <input
                type="checkbox"
                id={name}
                {...register(name)}
                className="mr-2 dark:bg-dark_bg_3 text-xl rounded-lg outline-none"
            />
            <label htmlFor={name} className="text-base font-bold tracking-wide">
                {label}
            </label>
            {error && <p className="text-red-400">{error}</p>}
        </div>
    );
}
