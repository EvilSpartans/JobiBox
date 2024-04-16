import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getQuestions } from "../../store/features/questionSlice";
import PulseLoader from "react-spinners/PulseLoader";
import ModalQuestion from "../modals/ModalQuestion";
import { useNavigate } from "react-router-dom";

export default function Question() {
  const user = useSelector((state) => state.user.user);
  const { token } = user;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("Candidat");

  // Create separate arrays for selected questions in each tab
  const [selectedQuestionsCandidat, setSelectedQuestionsCandidat] = useState(
    []
  );
  const [selectedQuestionsRecruteur, setSelectedQuestionsRecruteur] = useState(
    []
  );

  const fetchQuestions = async () => {
    try {
      const response = await dispatch(getQuestions(token));
      const payload = response.payload;
      setQuestions(payload);
    } catch (error) {
      console.error("Erreur lors de la récupération des questions :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [dispatch, token]);

  // Modal related code
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle question selection
  const handleQuestionSelection = (question) => {
    if (currentTab === "Candidat") {
      if (selectedQuestionsCandidat.includes(question)) {
        setSelectedQuestionsCandidat(
          selectedQuestionsCandidat.filter((q) => q !== question)
        );
      } else {
        setSelectedQuestionsCandidat([...selectedQuestionsCandidat, question]);
        setSelectedQuestionsRecruteur([]);
      }
    } else if (currentTab === "Recruteur") {
      if (selectedQuestionsRecruteur.includes(question)) {
        setSelectedQuestionsRecruteur(
          selectedQuestionsRecruteur.filter((q) => q !== question)
        );
      } else {
        setSelectedQuestionsRecruteur([
          ...selectedQuestionsRecruteur,
          question,
        ]);
        setSelectedQuestionsCandidat([]);
      }
    }
  };

  // Determine the selected questions based on the current tab
  const selectedQuestions =
    currentTab === "Candidat"
      ? selectedQuestionsCandidat
      : selectedQuestionsRecruteur;

  // Save to localStorage
  const handleContinueClick = () => {
    const allSelectedQuestions = [
      ...selectedQuestionsCandidat,
      ...selectedQuestionsRecruteur,
    ];
    const existingSelectedQuestions = localStorage.getItem("selectedQuestions");
    if (existingSelectedQuestions) {
      localStorage.removeItem("selectedQuestions");
    }
    localStorage.setItem(
      "selectedQuestions",
      JSON.stringify(allSelectedQuestions)
    );
    navigate("/themes");
  };

  return (
    <div className="flex flex-col justify-center min-h-[60%] h-fit tall:h-[90%] w-fit min-w-[60%] tall:w-[90%] space-y-8 tall:space-y-20 p-10 dark:bg-dark_bg_2 rounded-xl">

      {/* Heading */}
      <div className="text-center dark:text-dark_text_1">
        <h2 className="text-3xl font-bold">Liste des questions</h2>
        <p className="mt-6 text-sm">
        Tu vas pouvoir <span className="text-blue-400">sélectionner</span> les questions auxquelles tu vas répondre
          dans un format de type question / réponse en vidéo. Si tu le
          souhaites, tu pourras également <span className="text-blue-400">créer</span> des questions afin de
          personnaliser ton CV vidéo du mieux possible.
        </p>
      </div>
      <div className="dark:text-dark_text_1">
        <div className="mb-6 flex justify-center">
          <button
            onClick={() => setCurrentTab("Candidat")}
            className={`px-4 py-2 border-b-2 ${
              currentTab === "Candidat"
                ? "border-primary bg-primary text-white"
                : "border-transparent bg-transparent text-gray-500"
            }`}
          >
            Candidat
          </button>
          <button
            onClick={() => setCurrentTab("Recruteur")}
            className={`px-4 py-2 border-b-2 ${
              currentTab === "Recruteur"
                ? "border-primary bg-primary text-white"
                : "border-transparent bg-transparent text-gray-500"
            }`}
          >
            Recruteur
          </button>
        </div>

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
          <div className="max-h-56 tall:max-h-96 overflow-y-auto">
            {questions
              .filter((question) => question.type === currentTab)
              .map((question, index) => (
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
        )}

        <ModalQuestion
          isOpen={isModalOpen}
          onClose={closeModal}
          fetchQuestions={fetchQuestions}
          currentTab={currentTab}
          setSelectedQuestionsCandidat={setSelectedQuestionsCandidat}
          setSelectedQuestionsRecruteur={setSelectedQuestionsRecruteur}
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

      {/* <Tuto
        steps={[
          {
            element: ".form-checkbox",
            intro:
              "Tu vas pouvoir sélectionner les questions auxquelles tu vas répondre dans un format de type question / réponse en vidéo.",
          },
          {
            element: ".addButton",
            intro:
              "Si tu le souhaites, tu pourras également créer des questions afin de personnaliser ton CV vidéo du mieux possible.",
          },
        ]}
        tutorialKey="questionTuto"
      /> */}
    </div>
  );
}
