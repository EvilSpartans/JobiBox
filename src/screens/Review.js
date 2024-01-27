import React, { useEffect } from "react";
import Clip from "../components/video/Clip";
import LogoutBtn from "../components/LogoutBtn";

export default function Review() {

  // Mettre en pause la vidéo lorsque le composant est démonté
  const videoElement = document.querySelector('video');
  useEffect(() => {
    return () => {
      if (videoElement) {
        videoElement.pause();
      }
    };
  }, []);

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
