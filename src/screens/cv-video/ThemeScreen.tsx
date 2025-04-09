import React from "react";
import Themes from "../../components/cv-video/Themes";
import GoBack from "../../components/core/GoBack";
import Logout from "../../components/core/Logout";

export default function ThemeScreen(): React.JSX.Element {
  return (
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
      <Logout />
      <GoBack />
      {/*Container*/}
      <div className="flex w-full mx-auto h-full">
        {/*Login Form */}
        <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
          {/* Container */}
          <Themes />
        </div>
      </div>
    </div>
  );
}
