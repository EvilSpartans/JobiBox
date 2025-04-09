import React from "react";
import Clip from "../../components/cv-video/Clip";
import Logout from "../../components/core/Logout";

export default function ReviewScreen(): React.JSX.Element {

  return (
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
      <Logout />
      {/*Container*/}
      <div className="flex w-full mx-auto h-full">
        {/*Login Form */}
        <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
          {/* Container */}
          <Clip />
        </div>
      </div>
    </div>
  );
}
