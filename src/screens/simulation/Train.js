import React, { useEffect, useState } from "react";
import GoBack from "../../components/core/GoBack";
import Logout from "../../components/core/Logout";
import { useNavigate } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import TrainImage from "../../../assets/images/train.png";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

export default function Train() {

  const [loading, setLoading] = useState(false);
  const [isIntermediateLocked, setIsIntermediateLocked] = useState(true);
  const [isExpertLocked, setIsExpertLocked] = useState(true);

  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    console.log(user);

    if (!user || !user.questionLists) {
      console.warn("L'objet 'user' ou 'user.questionLists' est indéfini");
      return;
    }

    const beginnerExists = user?.questionLists.some(
      (questionList) => questionList.title === "Débutant"
    );

    // Débloque Intermédiaire si "Débutant" existe
    if (beginnerExists) {
      setIsIntermediateLocked(false);
    }

    // Débloque Expert si "Intermédiaire" est atteint (ajuster cette logique si nécessaire)
    const requiredExpertTitles = ["Motivation", "Technique", "Comportemental"];
    const hasAllExpertTitles = requiredExpertTitles.every((title) =>
      user?.questionLists.some((questionList) => questionList.title === title)
    );

    if (hasAllExpertTitles) {
      setIsExpertLocked(false);
    }

    const beginnerInProgress = localStorage.getItem('beginnerInProgress');
    const intermediateInProgress = localStorage.getItem('intermediateInProgress');
    const expertInProgress = localStorage.getItem('expertInProgress');

    if (beginnerInProgress) {
      localStorage.removeItem('beginnerInProgress');
    }

    if (intermediateInProgress) {
      localStorage.removeItem('intermediateInProgress');
    }

    if (expertInProgress) {
      localStorage.removeItem('expertInProgress');
    }
  }, [user]);

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
              <h2 className="text-4xl font-bold">Simulation d'entretien</h2>

              <img
                src={TrainImage}
                alt="Examen"
                className="mx-auto mt-10"
                style={{ maxHeight: "350px", width: "auto", height: "auto" }}
              />

              <p className="mt-6 text-xl">
                Dans la simulation d'entretien, choisis l'un des <span className="text-blue-400">trois niveaux de difficulté</span>, puis laisse-toi guider jusqu'à l'auto-évaluation finale pour <span className="text-blue-400">analyser ta performance</span> et identifier des axes d'amélioration.
              </p>

            </div>
             {/* Boutons */}
             <button
                className={`text-xl w-full flex justify-center bg-blue_4 text-gray-100 p-6 rounded-full tracking-wide font-semibold focus:outline-none hover:bg-blue-500 shadow-lg cursor-pointer transition ease-in duration-300 ${
                  loading ? "opacity-50 pointer-events-none" : ""
                }`}
                onClick={() => navigate("/beginner")}
              >
                {loading ? <PulseLoader color="#fff" size={16} /> : "Débutant"}
              </button>

              <button
                className={`text-xl w-full flex items-center justify-center bg-blue_3 text-gray-100 p-6 rounded-full tracking-wide font-semibold focus:outline-none hover:bg-pink-500 shadow-lg cursor-pointer transition ease-in duration-300 ${
                  isIntermediateLocked ? "opacity-50 pointer-events-none" : ""
                }`}
                onClick={() => navigate("/intermediate")}
                disabled={isIntermediateLocked}
              >
                 {loading ? (
                <PulseLoader color="#fff" size={16} />
              ) : (
                <>
                  Intermédiaire
                  {isIntermediateLocked && (
                    <FontAwesomeIcon icon={faLock} className="ml-3" />
                  )}
                </>
              )}
              </button>

              <button
                className={`text-xl w-full flex items-center justify-center bg-gray-300 text-gray-700 p-6 rounded-full tracking-wide font-semibold focus:outline-none hover:bg-gray-400 shadow-lg cursor-pointer transition ease-in duration-300 ${
                  isExpertLocked ? "opacity-50 pointer-events-none" : ""
                }`}
                onClick={() => navigate("/expert")}
                disabled={isExpertLocked}
              >
                 {loading ? (
                <PulseLoader color="#333" size={16} />
              ) : (
                <>
                  Expert
                  {isExpertLocked && (
                    <FontAwesomeIcon icon={faLock} className="ml-3" />
                  )}
                </>
              )}
              </button>

          </div>
        </div>
      </div>
    </div>
  );
}
