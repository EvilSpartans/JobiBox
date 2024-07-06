import React, { useState } from "react";
import GoBack from "../../components/core/GoBack";
import LogoutBtn from "../../components/core/LogoutBtn";
import { useNavigate } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import CvVideoImage from "../../../assets/images/cvvideo.png";

export default function CvVideo() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleContinueClick = async () => {
    setLoading(true);
    navigate("/questions");
  };

  return (
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
      <GoBack itemToRemove={"textStyle"} />
      <LogoutBtn />
      <div className="flex w-full mx-auto h-full">
        <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
          {/* Container */}
          <div className="flex flex-col justify-center min-h-[60%] h-fit tall:h-[90%] w-fit min-w-[60%] tall:w-[90%] space-y-8 tall:space-y-20 p-10 dark:bg-dark_bg_2 rounded-xl">
            {/* Heading */}
            <div className="text-center dark:text-dark_text_1">
              <h2 className="text-3xl font-bold">CV Vidéo</h2>

              <img
                src={CvVideoImage}
                alt="CVVideo"
                className="mx-auto mt-10"
                style={{ maxHeight: "350px", width: "auto", height: "auto" }}
              />

              <p className="mt-6 text-base">
                {" "}
                Ton <span className="text-blue-400">CV Vidéo</span> va se
                réaliser en plusieurs étapes :
              </p>

              <p className="mt-6 text-base">
                Dans un premier temps, tu vas définir les questions qui te
                serviront de{" "}
                <span className="text-blue-400">fil conducteur.</span>
              </p>

              <p className="mt-6 text-base">
                Tu pourras ensuite choisir{" "}
                <span className="text-blue-400">le thème et la musique</span>{" "}
                qui te correspondent le mieux.
              </p>

              <p className="mt-6 text-base">
                À la fin, une vue d'ensemble contenant l'ensemble de tes
                séquences te sera proposée afin que tu puisses apporter des{" "}
                <span className="text-blue-400">modifications</span> si tu le
                souhaites.
              </p>

              <p className="mt-6 text-base">
                La dernière étape te permettra de{" "}
                <span className="text-blue-400">référencer</span> ta création,
                afin de la diffuser auprès de tous nos partenaires. Tu recevras
                également une copie dans ta boite mail.
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
