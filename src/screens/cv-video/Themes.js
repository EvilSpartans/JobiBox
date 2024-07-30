import React from "react";
import Theme from "../../components/cv-video/Theme";
import GoBack from "../../components/core/GoBack";
import Logout from "../../components/core/Logout";

export default function Themes() {
  return (
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
      <Logout />
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
