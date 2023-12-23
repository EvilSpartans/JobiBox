import React from "react";
import Clip from "../components/video/Clip";

export default function Review() {

    return (
        <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center py-[19px] overflow-hidden">
            {/*Container*/}
            <div className="flex w-[1600px] mx-auto h-full">
                {/*Login Form */}
                <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
                    {/* Container */}
                    <Clip />
                </div>
            </div>
        </div>
    );
}