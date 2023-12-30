import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

export default function Info({ text }) {

    return (
        <div className="fixed top-5 left-0 w-screen flex items-center justify-center overflow-hidden">
            {/* Container */}
            <div className="flex flex-col justify-center w-fit min-w-[60%] tall:w-[90%] space-y-8 tall:space-y-20 p-5 dark:bg-dark_bg_2 rounded-xl">
                {/* Heading */}
                <div className="text-center dark:text-dark_text_1">
                    <h2 className="text-3xl font-bold">
                        <FontAwesomeIcon icon={faInfoCircle} className="mr-3 text-blue-500" />
                        Bon à savoir
                    </h2>
                    <p className="mt-2 text-sm">{text && <p>{text}</p>}</p>
                </div>
            </div>
        </div>
    );
}
