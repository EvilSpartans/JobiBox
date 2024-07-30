import React from "react";
import GoBack from "../../components/core/GoBack";
import Logout from "../../components/core/Logout"
import QuestionVideo from "../../components/train-exam/QuestionVideo";

export default function QuestionVideos() {
  return (
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
      <GoBack itemsToRemove={["textStyle"]} />
      <Logout />
      {/*Container*/}
      <div className="flex w-full mx-auto h-full">
        {/*Login Form */}
        <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
          {/* Container */}
          <QuestionVideo />
        </div>
      </div>
    </div>
  );
}
