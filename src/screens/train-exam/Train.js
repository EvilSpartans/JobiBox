import React, { useState } from "react";
import GoBack from "../../components/core/GoBack";
import Logout from "../../components/core/Logout";
import { useNavigate } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import TrainImage from "../../../assets/images/train.png";

export default function Train() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleContinueClick = async () => {
    setLoading(true);
    navigate("/questionVideo");
  };

  return (
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
      <GoBack itemsToRemove={["textStyle"]} />
      <Logout />
      <div className="flex w-full mx-auto h-full">
        <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
          {/* Container */}
          <div className="flex flex-col justify-center min-h-[60%] h-fit tall:h-[90%] w-fit min-w-[60%] tall:w-[90%] space-y-8 tall:space-y-20 p-10 dark:bg-dark_bg_2 rounded-xl">
            {/* Heading */}
            <div className="text-center dark:text-dark_text_1">
              <h2 className="text-3xl font-bold">Entraînement</h2>

              <img
                src={TrainImage}
                alt="Examen"
                className="mx-auto mt-10"
                style={{ maxHeight: "350px", width: "auto", height: "auto" }}
              />

              <p className="mt-6 text-lg">
                Tu vas pouvoir simuler un entretien à l'oral en toute{" "}
                <span className="text-blue-400">liberté.</span>
              </p>

              <p className="mt-6 text-lg">
                Dans un premier temps, tu vas définir les questions qui te
                seront adressées, puis tu devras y répondre, le tout en
                <span className="text-blue-400"> format vidéo.</span>
              </p>

              <p className="mt-6 text-lg">
                Tu auras ensuite{" "}
                <span className="text-blue-400">une vue d'ensemble</span> de tes
                différentes séquences et tu pourras envoyer ta vidéo à ton
                référent.
              </p>
            </div>
            <button
              className={`w-full flex justify-center bg-blue_3 text-gray-100 p-4 rounded-full tracking-wide font-semibold focus:outline-none hover-bg-blue_4 shadow-lg cursor-pointer transition ease-in duration-300 ${
                loading ? "opacity-50 pointer-events-none" : ""
              }`}
              onClick={handleContinueClick}
            >
              {loading ? <PulseLoader color="#fff" size={16} /> : "Commencer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
