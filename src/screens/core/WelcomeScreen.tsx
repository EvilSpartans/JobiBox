import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function WelcomeScreen(): React.JSX.Element {

  const navigate = useNavigate();
  const existingBusiness = localStorage.getItem("businessId");

  // Hidden cmd to reset config
  const handleKeyDown = useCallback((e) => {
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "b") {
      localStorage.removeItem("businessId");
      localStorage.removeItem('jobiboxId')
      alert("Configuration réinitialisée");
      navigate("/config");
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("urlQrcode")) {
      localStorage.removeItem("urlQrcode");
    }
  
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
            <h2 className="mt-6 text-4xl font-bold"><span className="text-blue_3">J</span>obiBox</h2>
            <img
            src="./public/images/cabin.png"
            alt="Welcome"
            className="mx-auto mt-10"
            style={{ maxHeight: "350px", width: "auto", height: "auto" }}
            />
            <p className="mt-12 text-xl">Bonjour à toi et bienvenue dans la Jobibox. Nous allons créer ensemble <span className="text-blue-400">ton CV vidéo</span> afin que tu te démarques dans ta recherche de stage, d’alternance ou d’emploi.</p>
            <p className="mt-6 text-xl">Ton CV vidéo sera ensuite <span className="text-blue-400">référencé sur la plateforme d’emploi Jobissim</span> afin que de nombreux recruteurs le voient et te contactent. Il te sera également envoyé par mail pour que tu le diffuses où tu le souhaites.</p>
            </div>
            {/*Buttons*/}
            <button
              className="text-xl w-full flex justify-center bg-blue_3 text-gray-100 p-4 rounded-full tracking-wide
          font-semibold focus:outline-none hover:bg-blue_4 shadow-lg cursor-pointer transition ease-in duration-300
          "
              onClick={() => navigate("/register")}
            >
              Inscription
            </button>
            <button
                className="text-xl w-full flex justify-center bg-gray-300 text-gray-700 p-4 rounded-full tracking-wide
                    font-semibold focus:outline-none hover:bg-gray-400 shadow-lg cursor-pointer transition ease-in duration-300"
                    onClick={() => navigate("/login")}
            >
                Connexion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
