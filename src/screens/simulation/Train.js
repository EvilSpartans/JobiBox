import React, { useState } from "react";
import GoBack from "../../components/core/GoBack";
import Logout from "../../components/core/Logout";
import { useNavigate } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import TrainImage from "../../../assets/images/train.png";

export default function Train() {

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
      <GoBack />
      <Logout />
      <div className="flex w-full mx-auto h-full">
        <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
          {/* Container */}
          <div className="flex flex-col justify-center min-h-[60%] h-fit tall:h-[90%] w-fit min-w-[60%] tall:w-[90%] space-y-8 tall:space-y-20 p-10 dark:bg-dark_bg_2 rounded-xl">
            {/* Heading */}
            <div className="text-center dark:text-dark_text_1">
              <h2 className="text-3xl font-bold">Simulation d'entretien</h2>

              <img
                src={TrainImage}
                alt="Examen"
                className="mx-auto mt-10"
                style={{ maxHeight: "350px", width: "auto", height: "auto" }}
              />

              <p className="mt-6 text-lg">
                Dans la simulation d'entretien, choisis l'un des <span className="text-blue-400">trois niveaux de difficulté</span>, puis laisse-toi guider jusqu'à l'auto-évaluation finale pour <span className="text-blue-400">analyser ta performance</span> et identifier des axes d'amélioration.
              </p>

            </div>
             {/* Boutons */}
             <button
                className={`w-full flex justify-center bg-blue_4 text-gray-100 p-6 rounded-full tracking-wide font-semibold focus:outline-none hover:bg-blue-500 shadow-lg cursor-pointer transition ease-in duration-300 ${
                  loading ? "opacity-50 pointer-events-none" : ""
                }`}
                onClick={() => navigate("/beginner")}
              >
                {loading ? <PulseLoader color="#fff" size={16} /> : "Débutant"}
              </button>

              <button
                className={`w-full flex justify-center bg-blue_3 text-gray-100 p-6 rounded-full tracking-wide font-semibold focus:outline-none hover:bg-pink-500 shadow-lg cursor-pointer transition ease-in duration-300 ${
                  loading ? "opacity-50 pointer-events-none" : ""
                }`}
                onClick={() => navigate("/intermediate")}
              >
                {loading ? <PulseLoader color="#fff" size={16} /> : "Intermédiaire"}
              </button>

              <button
                className={`w-full flex justify-center bg-gray-300 text-gray-700 p-6 rounded-full tracking-wide font-semibold focus:outline-none hover:bg-gray-400 shadow-lg cursor-pointer transition ease-in duration-300 ${
                  loading ? "opacity-50 pointer-events-none" : ""
                }`}
                onClick={() => navigate("/expert")}
              >
                {loading ? <PulseLoader color="#333" size={16} /> : "Expert"}
              </button>

          </div>
        </div>
      </div>
    </div>
  );
}
