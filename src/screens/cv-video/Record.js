import React, { useState } from "react";
import Film2 from "../../components/cv-video/Film2";
import GoBack from "../../components/core/GoBack";
import Logout from "../../components/core/Logout";

export default function Record() {
  const [hasStarted, setHasStarted] = useState(false);

  const handleStartSequence = () => {
    setHasStarted(true);
  };

  return (
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
      {!hasStarted && <GoBack itemsToRemove={["selectedGreenFilter"]} />}
      <Logout />
      {/*Container*/}
      <div className="flex w-full mx-auto h-full">
        {/*Login Form */}
        <div className="w-full flex items-center justify-center overflow-hidden">
          {/* Container */}
          <Film2 onStartSequence={handleStartSequence} />
        </div>
      </div>
    </div>
  );
}
