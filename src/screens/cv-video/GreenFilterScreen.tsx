import React from "react";
import GoBack from "../../components/core/GoBack";
import Logout from "../../components/core/Logout";
import GreenFilters from "../../components/cv-video/GreenFilters";

export default function GreenFilterScreen(): React.JSX.Element  {
  return (
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
      <Logout />
      <GoBack itemsToRemove={["selectedMusic"]} />
      {/*Container*/}
      <div className="flex w-full mx-auto h-full">
        {/*Login Form */}
        <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
          {/* Container */}
          <GreenFilters />
        </div>
      </div>
    </div>
  );
}
