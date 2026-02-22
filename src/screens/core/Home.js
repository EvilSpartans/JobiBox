import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logout from "../../components/core/Logout";
import { useDispatch, useSelector } from "react-redux";
import PulseLoader from "react-spinners/PulseLoader";
import {
  getJobiboxPortals,
  updateJobibox,
} from "../../store/slices/jobiboxSlice";
import { AppVersion } from "../../components/core/AppVersion";

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const training = localStorage.getItem("trainingActivated");
  const exam = localStorage.getItem("examActivated");
  const resume = localStorage.getItem("resumeActivated");
  const offers = localStorage.getItem("offersActivated");
  const careerGuide = localStorage.getItem("careerGuideActivated");
  const examenInProgress = localStorage.getItem("examenInProgress");
  const beginnerInProgress = localStorage.getItem("beginnerInProgress");
  const intermediateInProgress = localStorage.getItem("intermediateInProgress");
  const expertInProgress = localStorage.getItem("expertInProgress");
  const existingSelectedGreenFilter = localStorage.getItem(
    "selectedGreenFilter",
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobibox = async () => {
      try {
        const jobiboxId = localStorage.getItem("jobiboxId");
        const response = await dispatch(getJobiboxPortals({ id: jobiboxId }));
        const portalsData = response.payload;

        localStorage.setItem("trainingActivated", portalsData.training);
        localStorage.setItem("examActivated", portalsData.exam);
        localStorage.setItem("resumeActivated", portalsData.resume);
        localStorage.setItem("offersActivated", portalsData.offers);
        if (portalsData.career !== undefined) {
          localStorage.setItem("careerGuideActivated", String(portalsData.career));
        } else if (portalsData.careerGuide !== undefined) {
          localStorage.setItem("careerGuideActivated", String(portalsData.careerGuide));
        }

        // ---- Version + AnyDesk Sync ----
        const appVersion = await AppVersion();
        let anydeskId = null;

        if (
          typeof window !== "undefined" &&
          window.electron &&
          window.electron.anydeskApi &&
          typeof window.electron.anydeskApi.getFreshId === "function"
        ) {
          try {
            anydeskId = await window.electron.anydeskApi.getFreshId();
          } catch (error) {
            console.warn("RustDesk/AnyDesk indisponible :", error);
          }
        }

        const updatePayload = {
          id: jobiboxId,
          version:
            portalsData.version !== appVersion
              ? appVersion
              : portalsData.version,
        };

        // Ajout conditionnel sécurisé
        if (anydeskId) {
          updatePayload.rustdeskId = anydeskId;
        }

        console.log("📡 Payload envoyé à updateJobibox:", updatePayload);

        // 👉 Une seule requête clean
        await dispatch(updateJobibox(updatePayload));

        if (!portalsData.training && !portalsData.offers) {
          navigate("/cvVideo");
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des portails :", error);
      }
    };

    fetchJobibox();

    if (examenInProgress === "true") {
      localStorage.removeItem("examenInProgress");
    }

    if (beginnerInProgress) {
      localStorage.removeItem("beginnerInProgress");
    }

    if (intermediateInProgress) {
      localStorage.removeItem("intermediateInProgress");
    }

    if (expertInProgress) {
      localStorage.removeItem("expertInProgress");
    }

    if (existingSelectedGreenFilter) {
      localStorage.removeItem("selectedGreenFilter");
    }
  }, [
    navigate,
    dispatch,
    examenInProgress,
    existingSelectedGreenFilter,
    expertInProgress,
    intermediateInProgress,
    beginnerInProgress,
  ]);

  if (loading) {
    return (
      <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center">
        <PulseLoader color="#fff" size={16} />
      </div>
    );
  }

  return (
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
      <Logout />
      {/*Container*/}
      <div className="flex w-full mx-auto h-full">
        {/*Login Form */}
        <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
          {/* Container */}
          <div className="flex flex-col justify-center min-h-[60%] h-fit tall:h-[90%] w-fit min-w-[60%] tall:w-[90%] space-y-8 tall:space-y-10 p-6 tall:p-10 dark:bg-dark_bg_2 rounded-xl overflow-y-auto max-h-[90vh]">
            {/*Heading*/}
            <div className="text-center dark:text-dark_text_1">
              <h2 className="mt-6 text-4xl font-bold">
                <span className="text-blue_3">J</span>obiBox
              </h2>
              <p className="mt-12 text-xl">
                Bonjour <span className="text-blue-400">{user.username}</span>
              </p>
            </div>
            {/*Buttons*/}
            <button
              className="text-lg sm:text-xl w-full flex justify-center bg-blue_4 text-gray-100 p-4 sm:p-5 rounded-full tracking-wide font-semibold focus:outline-none hover:bg-blue-500 shadow-lg cursor-pointer transition ease-in duration-300"
              onClick={() => navigate("/cvVideo")}
            >
              CV Vidéo
            </button>
            {training === "true" && (
              <button
                className="text-lg sm:text-xl w-full flex justify-center bg-blue_3 text-gray-100 p-4 sm:p-5 rounded-full tracking-wide font-semibold focus:outline-none hover:bg-pink-500 shadow-lg cursor-pointer transition ease-in duration-300"
                onClick={() => navigate("/train")}
              >
                Simulation d'entretien
              </button>
            )}
            {resume === "true" && (
              <button
                className="text-lg sm:text-xl w-full flex justify-center bg-emerald-600 text-gray-100 p-4 sm:p-5 rounded-full tracking-wide font-semibold focus:outline-none hover:bg-emerald-700 shadow-lg cursor-pointer transition ease-in duration-300"
                onClick={() => navigate("/resume")}
              >
                CV papier
              </button>
            )}
            {careerGuide === "true" && (
              <button
                className="text-lg sm:text-xl w-full flex justify-center bg-amber-600 text-white p-4 sm:p-5 rounded-full tracking-wide font-semibold focus:outline-none hover:bg-amber-500 shadow-lg cursor-pointer transition ease-in duration-300 active:bg-amber-500 border border-amber-500/50"
                onClick={() => navigate("/career")}
              >
                Guide de carrière
              </button>
            )}
            {offers === "true" && (
              <button
                className="text-lg sm:text-xl w-full flex justify-center bg-gray-300 text-gray-700 p-4 sm:p-5 rounded-full tracking-wide font-semibold focus:outline-none hover:bg-gray-400 shadow-lg cursor-pointer transition ease-in duration-300"
                onClick={() => navigate("/offers")}
              >
                Offres d'emploi
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
