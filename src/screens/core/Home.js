import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LogoutBtn from "../../components/core/LogoutBtn";
import { getQuestionVideos } from "../../store/slices/questionVideoSlice";

export default function Home() {

  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const { token } = user;
  const dispatch = useDispatch();

  const [questions, setQuestions] = useState([]);
  const training = localStorage.getItem("trainingActivated");
  const exam = localStorage.getItem("examActivated");

  useEffect(() => {
    if (training !== "true" && exam !== "true") {
      navigate("/questions");
    }
  }, [training, exam, navigate]);

  useEffect(() => {
    const isTrainExam = localStorage.getItem('isTrainExam');
    const examenInProgress = localStorage.getItem('examenInProgress');

    if (isTrainExam === 'true') {
      localStorage.removeItem('isTrainExam');
    }

    if (examenInProgress === 'true') {
      localStorage.removeItem('examenInProgress');
    }
  }, []);

  // Random questions
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleExamen = async () => {
    const existingSelectedQuestions = localStorage.getItem("selectedQuestionsVideos");
    if (existingSelectedQuestions) {
      localStorage.removeItem("selectedQuestionsVideos");
    }
    const fetchedQuestions = await fetchQuestionVideos();
    const examQuestions = fetchedQuestions.filter(question => question.exam);
    const shuffledQuestions = shuffleArray([...examQuestions]);
    localStorage.setItem('selectedQuestionsVideos', JSON.stringify(shuffledQuestions));
    localStorage.setItem('examenInProgress', 'true');
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
              className="w-full flex justify-center bg-blue_4 text-gray-100 p-6 rounded-full tracking-wide font-semibold focus:outline-none hover:bg-blue-500 shadow-lg cursor-pointer transition ease-in duration-300"
              onClick={() => navigate("/questions")}
            >
              Création vidéo
            </button>
            {training === "true" && (
            <button
              className="w-full flex justify-center bg-blue_3 text-gray-100 p-6 rounded-full tracking-wide font-semibold focus:outline-none hover:bg-pink-500 shadow-lg cursor-pointer transition ease-in duration-300"
              onClick={() => navigate("/questionVideo")}
            >
              Entrainement
            </button>
            )}
            {exam === "true" && (
            <button
              className="w-full flex justify-center bg-gray-300 text-gray-700 p-6 rounded-full tracking-wide font-semibold focus:outline-none hover:bg-gray-400 shadow-lg cursor-pointer transition ease-in duration-300"
              onClick={handleExamen}
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