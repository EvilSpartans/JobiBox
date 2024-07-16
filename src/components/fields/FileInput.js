import React from "react";

const FileInput = ({ name, accept, onChange }) => {

    return (
        <div className="mt-8 content-center dark:text-dark_text_1 space-y-1">
            <label htmlFor={name} className="text-base font-bold tracking-wide">
                {name === "video" ? "Vidéo" : "Image"}
            </label>
            <input
                name={name}
                className="w-full dark:bg-dark_bg_3 text-lg py-2 px-4 rounded-lg outline-none"
                type="file"
                accept={accept}
                onChange={onChange}
            />
        </div>
    );
};

export default FileInput;
