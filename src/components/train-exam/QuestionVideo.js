import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PulseLoader from "react-spinners/PulseLoader";
import { useNavigate } from "react-router-dom";
import { getQuestionVideos } from "../../store/slices/questionVideoSlice";
import ModalQuestionVideo from "../modals/ModalQuestionVideo";

export default function QuestionVideo() {
  const user = useSelector((state) => state.user.user);
  const { token } = user;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchQuestionVideos = async () => {
    try {
      const response = await dispatch(getQuestionVideos(token));
      const payload = response.payload;
      setQuestions(payload);
    } catch (error) {
      console.error("Erreur lors de la récupération des questions :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestionVideos();
  }, [dispatch, token]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle question selection
  const handleQuestionSelection = (question) => {
    setSelectedQuestions((prevSelected) => {
      if (prevSelected.includes(question)) {
        return prevSelected.filter((q) => q !== question);
      } else {
        return [...prevSelected, question];
      }
    });
  };

  // Random questions
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Save to localStorage
  const handleContinueClick = () => {
    const existingSelectedQuestions = localStorage.getItem(
      "selectedQuestionsVideos"
    );
    if (existingSelectedQuestions) {
      localStorage.removeItem("selectedQuestionsVideos");
    }
    const shuffledQuestions = shuffleArray([...selectedQuestions]);
    localStorage.setItem(
      "selectedQuestionsVideos",
      JSON.stringify(shuffledQuestions)
    );
    navigate("/greenFiltersTE");
  };

  return (
    <div className="flex flex-col justify-center min-h-[60%] h-fit tall:h-[90%] w-fit min-w-[60%] tall:w-[90%] space-y-8 tall:space-y-20 p-10 dark:bg-dark_bg_2 rounded-xl">
      {/* Heading */}
      <div className="text-center dark:text-dark_text_1">
        <h2 className="text-3xl font-bold">Liste des questions</h2>
        <p className="mt-6 text-base">
          Tu vas pouvoir <span className="text-blue-400">sélectionner</span> les
          questions auxquelles tu vas répondre (entre 2 et 4 maximum) dans un
          format de type question / réponse en vidéo. L'objectif sera de{" "}
          <span className="text-blue-400">préparer</span> ton examen à l'oral.
        </p>
      </div>
      
      <div className="dark:text-dark_text_1">
        <div className="mb-2">
          {loading ? null : (
            <div className="mb-4">
              <button
                onClick={openModal}
                className=" addButton bg-gray-200 hover-bg-gray-300 text-gray-500 font-semibold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
              >
                + Ajouter une question
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center">
            <PulseLoader color="#fff" size={16} />
          </div>
        ) : (
          <>
            {questions && questions.length > 0 ? (
              <div className="max-h-56 tall:max-h-96 overflow-y-auto">
                {questions.map((question, index) => (
                  <div key={index} className="mb-3">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox text-primary border-primary"
                        onChange={() => handleQuestionSelection(question)}
                        checked={selectedQuestions.includes(question)}
                      />
                      <span className="ml-2"> &nbsp; {question.title}</span>
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center mt-4">Aucune question pour le moment</p>
            )}
          </>
        )}

        <ModalQuestionVideo
          isOpen={isModalOpen}
          onClose={closeModal}
          fetchQuestions={fetchQuestionVideos}
          setSelectedQuestions={setSelectedQuestions}
        />
      </div>
      <button
        className={`w-full flex justify-center bg-blue_3 text-gray-100 p-4 rounded-full tracking-wide font-semibold focus:outline-none hover-bg-blue_4 shadow-lg cursor-pointer transition ease-in duration-300 ${
          selectedQuestions.length === 0 ? "opacity-50 pointer-events-none" : ""
        }`}
        onClick={handleContinueClick}
        disabled={selectedQuestions.length === 0}
      >
        Continuer
      </button>
    </div>
  );
}
