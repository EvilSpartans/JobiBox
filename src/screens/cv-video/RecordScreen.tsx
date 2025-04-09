import React from "react";
import Film from "../../components/cv-video/Film";
import GoBack from "../../components/core/GoBack";
import Logout from "../../components/core/Logout";

export default function RecordScreen(): React.JSX.Element {
  return (
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
      <GoBack itemsToRemove={["selectedGreenFilter"]} />
      <Logout />
      {/*Container*/}
      <div className="flex w-full mx-auto h-full">
        {/*Login Form */}
        <div className="w-full flex items-center justify-center overflow-hidden">
          {/* Container */}
          <Film />
        </div>
      </div>
    </div>
  );
}
