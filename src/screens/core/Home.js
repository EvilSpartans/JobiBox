import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logout from "../../components/core/Logout";
import { useDispatch, useSelector } from "react-redux";
import PulseLoader from "react-spinners/PulseLoader";
import { getJobiboxPortals, updateJobibox } from "../../store/slices/jobiboxSlice";
import { AppVersion } from "../../components/core/AppVersion";

export default function Home() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const training = localStorage.getItem("trainingActivated");
  const exam = localStorage.getItem("examActivated");
  const examenInProgress = localStorage.getItem('examenInProgress');
  const beginnerInProgress = localStorage.getItem('beginnerInProgress');
  const intermediateInProgress = localStorage.getItem('intermediateInProgress');
  const expertInProgress = localStorage.getItem('expertInProgress');
  const existingSelectedGreenFilter = localStorage.getItem("selectedGreenFilter");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const fetchJobibox = async () => {
      try {
        const jobiboxId = localStorage.getItem('jobiboxId');
        const response = await dispatch(getJobiboxPortals({ id: jobiboxId }));
        const portalsData = response.payload;
  
        localStorage.setItem("trainingActivated", portalsData.training);
        localStorage.setItem("examActivated", portalsData.exam);

        const appVersion = await AppVersion();
        if (portalsData.version !== appVersion) {
          await dispatch(updateJobibox({ id: jobiboxId, version: appVersion }));
        }
  
        if (!portalsData.training && !portalsData.exam) {
          navigate("/cvVideo");
        } else {
          setLoading(false); 
        }
  
      } catch (error) {
        console.error("Erreur lors de la récupération des portails :", error);
      }
    };
  
    fetchJobibox();
  
    if (examenInProgress === 'true') {
      localStorage.removeItem('examenInProgress');
    }

    if (beginnerInProgress) {
      localStorage.removeItem('beginnerInProgress');
    }

    if (intermediateInProgress) {
      localStorage.removeItem('intermediateInProgress');
    }

    if (expertInProgress) {
      localStorage.removeItem('expertInProgress');
    }
  
    if (existingSelectedGreenFilter) {
      localStorage.removeItem('selectedGreenFilter');
    }
  
  }, [navigate, dispatch, examenInProgress, existingSelectedGreenFilter, expertInProgress, intermediateInProgress, beginnerInProgress]);

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
          <div className="flex flex-col justify-center min-h-[60%] h-fit tall:h-[90%] w-fit min-w-[60%] tall:w-[90%] space-y-8 tall:space-y-20 p-10 dark:bg-dark_bg_2 rounded-xl">
            {/*Heading*/}
            <div className="text-center dark:text-dark_text_1">
            <h2 className="mt-6 text-3xl font-bold"><span className="text-blue_3">J</span>obiBox</h2>
            <p className="mt-12 text-lg">Bonjour <span className="text-blue-400">{user.username}</span>.</p>
            </div>
            {/*Buttons*/}
            <button
              className="w-full flex justify-center bg-blue_4 text-gray-100 p-6 rounded-full tracking-wide font-semibold focus:outline-none hover:bg-blue-500 shadow-lg cursor-pointer transition ease-in duration-300"
              onClick={() => navigate("/cvVideo")}
            >
              CV Vidéo
            </button>
            {training === "true" && (
            <button
              className="w-full flex justify-center bg-blue_3 text-gray-100 p-6 rounded-full tracking-wide font-semibold focus:outline-none hover:bg-pink-500 shadow-lg cursor-pointer transition ease-in duration-300"
              onClick={() => navigate("/train")}
            >
              Simulation d'entretien
            </button>
            )}
            {exam === "true" && (
            <button
              className="w-full flex justify-center bg-gray-300 text-gray-700 p-6 rounded-full tracking-wide font-semibold focus:outline-none hover:bg-gray-400 shadow-lg cursor-pointer transition ease-in duration-300"
              onClick={() => navigate("/exam")}
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