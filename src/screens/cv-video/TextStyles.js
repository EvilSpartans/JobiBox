import React from "react";
import TextStyle from "../../components/cv-video/TextStyle";
import GoBack from "../../components/core/GoBack";
import Logout from "../../components/core/Logout";

export default function TextStyles() {
  return (
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
      <Logout />
      <GoBack itemsToRemove={['selectedTheme', 'selectedAnimation']} />
      {/*Container*/}
      <div className="flex w-full mx-auto h-full">
        {/* */}
        <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
          {/* Container */}
          <TextStyle />
        </div>
      </div>
    </div>
  );
}
