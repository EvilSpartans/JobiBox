import React, { useEffect, useState } from "react";
import GoBack from "../../components/core/GoBack";
import Logout from "../../components/core/Logout"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getQuestionVideos } from "../../store/slices/questionVideoSlice";
import expertImg from "../../../assets/images/expert.png";

export default function Expert() {

    const user = useSelector((state) => state.user.user);
    const { token } = user;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    sessionStorage.removeItem('hasReloaded');
    }, []);

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
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

    const handleContinueClick = async () => {
    setLoading(true);
    const existingSelectedQuestions = localStorage.getItem(
        "selectedQuestionsVideos"
    );
    if (existingSelectedQuestions) {
        localStorage.removeItem("selectedQuestionsVideos");
    }
    const fetchedQuestions = await fetchQuestionVideos();
    const simulationQuestions = fetchedQuestions.filter(
      (question) => question.training && question.questionList.title !== "Débutant"
    );
    const shuffledQuestions = shuffleArray([...simulationQuestions]).slice(0, 5);
    localStorage.setItem(
        "selectedQuestionsVideos",
        JSON.stringify(shuffledQuestions)
    );
    localStorage.setItem("expertInProgress", "true");
    // navigate("/greenFiltersS");
    navigate("/recordS");
    };

  return (
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
      <GoBack />
      <Logout />
      {/*Container*/}
      <div className="flex w-full mx-auto h-full">
        {/*Login Form */}
        <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
          {/* Container */}
          <div className="flex flex-col justify-center min-h-[60%] h-fit tall:h-[90%] w-fit min-w-[60%] tall:w-[90%] space-y-8 tall:space-y-20 p-10 dark:bg-dark_bg_2 rounded-xl">
            {/* Heading */}
            <div className="text-center dark:text-dark_text_1">
                <h2 className="text-3xl font-bold">Niveau expert</h2>
                <img
                src={expertImg}
                alt="Welcome"
                className="mx-auto mt-10"
                style={{ maxHeight: "350px", width: "auto", height: "auto" }}
                />
                <p className="mt-12 text-lg">
                Un seul scénario te sera proposé, regroupant toutes les thématiques avec des questions de <span className="text-blue-400">niveau intermédiaire ou difficile</span>.  
                Tu devras enchaîner <span className="text-blue-400">sans répit</span> et il ne sera <span className="text-blue-400">pas possible</span> de recommencer.
                </p>
            </div>

            <button
                className={`w-full flex justify-center bg-blue_3 text-gray-100 p-4 rounded-full tracking-wide font-semibold focus:outline-none hover-bg-blue_4 shadow-lg cursor-pointer transition ease-in duration-300`}
                onClick={handleContinueClick}
            >
                Continuer
            </button>
            </div>
        </div>
      </div>
    </div>
  );
}
