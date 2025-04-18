import React from "react";
import { useNavigate } from "react-router-dom";
import Logout from "../../components/core/Logout";

export default function Offline() {
  const navigate = useNavigate();

  return (
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
      <Logout />
      {/*Container*/}
      <div className="flex w-full mx-auto h-full">
        {/*Login Form */}
        <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
          {/* Container */}
          <div className="flex flex-col justify-center min-h-[60%] h-fit tall:h-[90%] w-fit min-w-[60%] tall:w-[90%] space-y-8 tall:space-y-20 p-10 dark:bg-dark_bg_2 rounded-xl">
            {/*Heading*/}
            <div className="text-center dark:text-dark_text_1">
              <h2 className="mt-6 text-4xl font-bold">Pas de connexion</h2>
              <p className="mt-6 text-xl">Il semble que tu n'es pas connecté à internet.</p>
            </div>
            {/*Buttons*/}
            <button className="text-xl w-full flex justify-center bg-blue_3 text-gray-100 p-4 rounded-full tracking-wide font-semibold focus:outline-none hover:bg-blue_4 shadow-lg cursor-pointer transition ease-in duration-300"
              onClick={() => navigate(-1)}
            >
              Actualiser
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
