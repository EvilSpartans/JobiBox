import React from "react";
import Clip from "../../components/train-exam/Clip";
import LogoutBtn from "../../components/core/LogoutBtn";

export default function Review() {

  return (
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
      <LogoutBtn />
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
