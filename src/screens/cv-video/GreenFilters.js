import React from "react";
import GoBack from "../../components/core/GoBack";
import LogoutBtn from "../../components/core/LogoutBtn";
import GreenFilter from "../../components/cv-video/GreenFilter";

export default function GreenFilters() {
  return (
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
      <LogoutBtn />
      <GoBack itemsToRemove={["selectedMusic"]} />
      {/*Container*/}
      <div className="flex w-full mx-auto h-full">
        {/*Login Form */}
        <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
          {/* Container */}
          <GreenFilter />
        </div>
      </div>
    </div>
  );
}
