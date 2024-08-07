import React from "react";
import Music from "../../components/cv-video/Music";
import GoBack from "../../components/core/GoBack";
import Logout from "../../components/core/Logout"

export default function Musics() {
  return (
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
      <GoBack itemsToRemove={["textStyle"]} />
      <Logout />
      {/*Container*/}
      <div className="flex w-full mx-auto h-full">
        {/*Login Form */}
        <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
          {/* Container */}
          <Music />
        </div>
      </div>
    </div>
  );
}
