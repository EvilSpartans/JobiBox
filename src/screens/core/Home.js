import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LogoutBtn from "../../components/core/LogoutBtn";

export default function Home() {

  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const training = localStorage.getItem("trainingActivated");
  const exam = localStorage.getItem("examActivated");

  useEffect(() => {
    if (training !== "true" && exam !== "true") {
      navigate("/questions");
    }
  }, [training, exam, navigate]);

  return (
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
        <LogoutBtn />
      {/*Container*/}
      <div className="flex w-full mx-auto h-full">
        {/*Login Form */}
        <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
          {/* Container */}
          <div className="flex flex-col justify-center min-h-[60%] h-fit tall:h-[90%] w-fit min-w-[60%] tall:w-[90%] space-y-8 tall:space-y-20 p-10 dark:bg-dark_bg_2 rounded-xl">
            {/*Heading*/}
            <div className="text-center dark:text-dark_text_1">
            <h2 className="mt-6 text-3xl font-bold"><span className="text-blue_3">J</span>obiBox</h2>
            <p className="mt-12 text-base">Bonjour <span className="text-blue-400">{user.username}</span>.</p>
            </div>
            {/*Buttons*/}
            <button
              className="w-full flex justify-center bg-blue_4 text-gray-100 p-6 rounded-full tracking-wide font-semibold focus:outline-none hover:bg-blue_3 shadow-lg cursor-pointer transition ease-in duration-300"
              onClick={() => navigate("/questions")}
            >
              Création vidéo
            </button>
            {training === "true" && (
            <button
              className="w-full flex justify-center bg-blue_3 text-gray-100 p-6 rounded-full tracking-wide font-semibold focus:outline-none hover:bg-blue_4 shadow-lg cursor-pointer transition ease-in duration-300"
              onClick={() => navigate("/questions")}
            >
              Entrainement
            </button>
            )}
            {exam === "true" && (
            <button
              className="w-full flex justify-center bg-gray-300 text-gray-700 p-6 rounded-full tracking-wide font-semibold focus:outline-none hover:bg-gray-400 shadow-lg cursor-pointer transition ease-in duration-300"
              onClick={() => navigate("/questions")}
            >
              Examen
            </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}