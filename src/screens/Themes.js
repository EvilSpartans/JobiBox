import React from "react";
import Theme from "../components/video/Theme";
import GoBack from "../components/GoBack";

export default function Themes() {
  return (
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
      <GoBack />
      {/*Container*/}
      <div className="flex w-full mx-auto h-full">
        {/*Login Form */}
        <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
          {/* Container */}
          <Theme />
        </div>
      </div>
    </div>
  );
}
