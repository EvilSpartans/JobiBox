import React, { useEffect, useCallback  } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Logout from "../components/Logout";

export default function Home() {

  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const existingBusiness = localStorage.getItem("businessId");

  // Hidden cmd to reset config
  const handleKeyDown = useCallback((e) => {
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "b") {
      localStorage.removeItem("businessId");
      alert("Configuration réinitialisée");
      navigate("/config");
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);
  // ----------------------------

  useEffect(() => {
    if (!existingBusiness) {
      navigate("/config");
    }
  }, []);

  return (
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
      {/*Container*/}
      <div className="flex w-full mx-auto h-full">
        {/*Login Form */}
        <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
          {/* Container */}
          <div className="flex flex-col justify-center min-h-[60%] h-fit tall:h-[90%] w-fit min-w-[60%] tall:w-[90%] space-y-8 tall:space-y-20 p-10 dark:bg-dark_bg_2 rounded-xl">
            {/*Heading*/}
            <div className="text-center dark:text-dark_text_1">
              <h2 className="mt-6 text-3xl font-bold">JobiBox</h2>
              <p className="mt-2 text-sm">{user.username}</p>
            </div>
            {/*Buttons*/}
            <button
              className="w-full flex justify-center bg-blue_3 text-gray-100 p-4 rounded-full tracking-wide
          font-semibold focus:outline-none hover:bg-blue_4 shadow-lg cursor-pointer transition ease-in duration-300
          "
              onClick={() => navigate("/questions")}
            >
              Création vidéo
            </button>
            <Logout />
          </div>
        </div>
      </div>
    </div>
  );
}
