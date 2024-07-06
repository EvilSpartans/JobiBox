import React, { useState } from "react";
import GoBack from "../../components/core/GoBack";
import LogoutBtn from "../../components/core/LogoutBtn";
import { getQuestionVideos } from "../../store/slices/questionVideoSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import ExamImage from "../../../assets/images/exam.png";

export default function Exam() {
  const user = useSelector((state) => state.user.user);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { token } = user;
  const navigate = useNavigate();

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleContinueClick = async () => {
    setLoading(true);
    const existingSelectedQuestions = localStorage.getItem(
      "selectedQuestionsVideos"
    );
    if (existingSelectedQuestions) {
      localStorage.removeItem("selectedQuestionsVideos");
    }
    const fetchedQuestions = await fetchQuestionVideos();
    const examQuestions = fetchedQuestions.filter((question) => question.exam);
    const shuffledQuestions = shuffleArray([...examQuestions]);
    localStorage.setItem(
      "selectedQuestionsVideos",
      JSON.stringify(shuffledQuestions)
    );
    localStorage.setItem("examenInProgress", "true");
    navigate("/recordTE");
  };

  const fetchQuestionVideos = async () => {
    try {
      const response = await dispatch(getQuestionVideos(token));
      const payload = response.payload;
      setQuestions(payload);
      return payload;
    } catch (error) {
      console.error("Erreur lors de la récupération des questions :", error);
      return [];
    }
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
              <h2 className="text-3xl font-bold">Examen</h2>

              <img
                src={ExamImage}
                alt="Examen"
                className="mx-auto mt-10"
                style={{ maxHeight: "350px", width: "auto", height: "auto" }}
              />

              <p className="mt-6 text-base">
                {" "}
                Voici le déroulement de ton{" "}
                <span className="text-blue-400">épreuve :</span>
              </p>

              <p className="mt-6 text-base">
                Ton référent t'a préparé une{" "}
                <span className="text-blue-400">série de questions</span>{" "}
                auxquelles tu devras répondre dans un format vidéo.
              </p>

              <p className="mt-6 text-base">
                Pour chacune d'entre elles, tu auras la possibilité de{" "}
                <span className="text-blue-400">visionner plusieurs fois</span>{" "}
                la séquence de la question, avant de te lancer dans l'enregistrement
                de ta réponse.
              </p>

              <p className="mt-6 text-base">
                Une fois cette étape terminée, le montage se fera{" "}
                <span className="text-blue-400">automatiquement</span> et tu
                arriveras sur l'écran de publication.
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
