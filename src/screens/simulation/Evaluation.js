import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { updateQuestionLists } from "../../store/slices/userSlice";

export default function Evaluation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const { token } = user;
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [score, setScore] = useState(null);

  useEffect(() => {
    // Récupérer les questions depuis localStorage
    const selectedQuestions =
      JSON.parse(localStorage.getItem("beginnerInProgress")) ||
      JSON.parse(localStorage.getItem("intermediateInProgress")) ||
      JSON.parse(localStorage.getItem("expertInProgress"));

    console.log("Questions récupérées :", selectedQuestions);

    if (Array.isArray(selectedQuestions) && selectedQuestions.length > 0) {
      setQuestions(selectedQuestions);
    } else {
      console.error("Aucune question trouvée dans le localStorage.");
    }
  }, []);

  useEffect(() => {
    if (allResponsesGiven) {
      calculateScore();
    }
  }, [responses, allResponsesGiven]);

  const handleResponseChange = (questionId, value) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  const calculateScore = () => {
    const correctAnswers = questions.filter(
      (question) => responses[question.id] === "good"
    );
    // Calcul du score : 2 points par bonne réponse
    setScore(correctAnswers.length * 2);
  };

  const allResponsesGiven =
    questions.length > 0 && Object.keys(responses).length === questions.length;

  const handleReturnToHome = async () => {
    try {
      const listId = questions[1]?.questionList?.title;
      if (score !== null && score >= questions.length) {
        // Effectuer la mise à jour si le score est suffisant
        const updateResponse = await axios.put(
          `${BASE_URL}/questionList/${listId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (updateResponse.status === 201) {
          console.log(
            "Liste des questions mise à jour avec succès :",
            updateResponse.data
          );
          dispatch(updateQuestionLists(updateResponse.data));
        }
      }
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour de la liste des questions :",
        error
      );
    } finally {
      localStorage.removeItem("beginnerInProgress");
      localStorage.removeItem("intermediateInProgress");
      localStorage.removeItem("expertInProgress");
      navigate("/train");
    }
  };

  return (
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
      {/*Container*/}
      <div className="flex w-full mx-auto h-full">
        {/*Login Form */}
        <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
          {/* Container */}
          <div className="flex flex-col justify-center min-h-[60%] h-fit tall:h-[90%] w-fit min-w-[60%] tall:w-[90%] space-y-8 tall:space-y-16 p-10 dark:bg-dark_bg_2 rounded-xl">
            {/*Heading*/}
            <div className="text-center dark:text-dark_text_1">
              <h2 className="text-3xl font-bold">Evaluation</h2>
              <p className="mt-12 text-lg">
                Voici la liste des questions et leurs{" "}
                <span className="text-blue-400">réponses attendues</span>.
                Indique si tu as bien répondu à chaque question pour voir ton
                score final.
              </p>

              {/* Liste des questions avec défilement */}
              <div className="mt-6 max-h-96 tall:max-h-[50rem] overflow-y-auto space-y-6 p-6 bg-gray-100 dark:bg-dark_bg_1 rounded-lg shadow-inner">
                {questions.map((question) => (
                  <div
                    key={question.id}
                    className="flex flex-col space-y-4 p-6 bg-white dark:bg-dark_bg_2 rounded-lg shadow-lg"
                  >
                    <p className="text-lg font-semibold text-left text-gray-800 dark:text-gray-200">
                      <span className="text-blue-500">Question : </span>{" "}
                      {question.title || "Titre non disponible"}
                    </p>
                    <p className="text-md text-left text-gray-600 dark:text-gray-400">
                      <span className="text-pink-400 font-semibold">
                        Réponse attendue :{" "}
                      </span>{" "}
                      {question.response ||
                        "Aucune réponse attendue spécifiée."}
                    </p>
                    <div className="flex space-x-6">
                      <label className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name={`response-${question.id}`}
                          value="good"
                          onChange={() =>
                            handleResponseChange(question.id, "good")
                          }
                          checked={responses[question.id] === "good"}
                          className="h-5 w-5 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
                        />
                        <span className="text-md text-gray-700 dark:text-gray-300">
                          J'ai bien répondu
                        </span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name={`response-${question.id}`}
                          value="bad"
                          onChange={() =>
                            handleResponseChange(question.id, "bad")
                          }
                          checked={responses[question.id] === "bad"}
                          className="h-5 w-5 text-red-500 focus:ring-red-400 border-gray-300 rounded"
                        />
                        <span className="text-md text-gray-700 dark:text-gray-300">
                          J'ai mal répondu
                        </span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Affichage du score */}
            <div className="text-center">
              {score === null ? (
                <p className="text-lg font-medium text-gray-500 dark:text-gray-300">
                  Ton score apparaîtra ici
                </p>
              ) : (
                <p className="text-xl font-bold text-green-400">
                  Ton score : {score} / {questions.length * 2}
                </p>
              )}
            </div>

            {/* Bouton pour revenir à l'accueil */}
            {score === null ? (
              <div className="w-full flex justify-center p-4 rounded-full tracking-wide font-semibold focus:outline-none shadow-lg bg-gray-100 dark:bg-dark_bg_1 text-gray-600 dark:text-gray-300">
                Cocher les cases
              </div>
            ) : (
              <button
                className="w-full flex justify-center p-4 rounded-full tracking-wide font-semibold focus:outline-none shadow-lg transition ease-in duration-300 bg-gray-300 text-gray-700 hover:bg-gray-400 cursor-pointer"
                onClick={handleReturnToHome}
              >
                Retour à l'accueil
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
