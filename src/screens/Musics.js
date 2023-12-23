import React from "react";
import Music from "../components/video/Music";

export default function Musics() {

    return (
        <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center py-[19px] overflow-hidden">
            {/*Container*/}
            <div className="flex w-[1600px] mx-auto h-full">
                {/*Login Form */}
                <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
                    {/* Container */}
                    <Music />
                </div>
            </div>
        </div>
    );
}