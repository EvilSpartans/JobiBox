import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createQuestionVideo } from "../../store/slices/questionVideoSlice";
import PulseLoader from "react-spinners/PulseLoader";

export default function ModalQuestionVideo({
  isOpen,
  onClose,
  fetchQuestions,
  setSelectedQuestions,
}) {
  const user = useSelector((state) => state.user.user);
  const { token } = user;
  const [newQuestionTitle, setNewQuestionTitle] = useState("");
  const [selectedModel, setSelectedModel] = useState("model1");
  const dispatch = useDispatch();
  const businessId = localStorage.getItem("businessId");
  const [loading, setLoading] = useState(false);

  const handleAddQuestion = async () => {
    if (newQuestionTitle) {
      setLoading(true);
      try {
        const values = {
          token,
          title: newQuestionTitle,
          model: `${selectedModel}.mp4`,
          userId: user.id,
          training: true,
          businessId,
        };

        await dispatch(createQuestionVideo(values));
        fetchQuestions();
        onClose();
        setNewQuestionTitle("");
        setSelectedQuestions([]);
      } catch (error) {
        console.error("Erreur lors de la création de la question :", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const isFormValid = newQuestionTitle !== "";

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="modal bg-black bg-opacity-75 w-full h-full absolute"></div>
      <div className="modal-content bg-white w-1/2 p-4 rounded-lg text-center z-50 relative">
        <p className="text-gray-800 text-xl">Ajouter une question</p>

        <div className="mt-3">
          <div className="flex justify-center mt-2">
            <label className="mr-4">
              <input
                type="radio"
                name="model"
                value="model1"
                checked={selectedModel === "model1"}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="hidden"
              />
              <img
                src="https://jobissim.com/assets/images/model1.png"
                alt="Model 1"
                className={`cursor-pointer ${
                  selectedModel === "model1" ? "border-2 border-blue-500" : ""
                }`}
                onClick={() => setSelectedModel("model1")}
              />
            </label>
            <label className="mr-4">
              <input
                type="radio"
                name="model"
                value="model2"
                checked={selectedModel === "model2"}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="hidden"
              />
              <img
                src="https://jobissim.com/assets/images/model2.png"
                alt="Model 2"
                className={`cursor-pointer ${
                  selectedModel === "model2" ? "border-2 border-blue-500" : ""
                }`}
                onClick={() => setSelectedModel("model2")}
              />
            </label>
            <label>
              <input
                type="radio"
                name="model"
                value="model3"
                checked={selectedModel === "model3"}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="hidden"
              />
              <img
                src="https://jobissim.com/assets/images/model3.png"
                alt="Model 3"
                className={`cursor-pointer ${
                  selectedModel === "model3" ? "border-2 border-blue-500" : ""
                }`}
                onClick={() => setSelectedModel("model3")}
              />
            </label>
          </div>
        </div>

        <input
          className="border p-1 mt-3 text-gray-800 w-full md:w-4/5 sm:w-4/5"
          type="text"
          placeholder="Titre de la question"
          value={newQuestionTitle}
          onChange={(e) => setNewQuestionTitle(e.target.value)}
        />
        {loading ? (
          <div className="text-center mt-4">
            <PulseLoader color="#808080" size={16} />
          </div>
        ) : (
          <div className="mt-4">
            <button
              className={`${
                isFormValid
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              } px-4 py-2 rounded-md mr-2`}
              onClick={handleAddQuestion}
              disabled={!isFormValid}
            >
              Valider
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md"
              onClick={onClose}
            >
              Annuler
            </button>
          </div>
        )}
      </div>
    </div>
  ) : null;
}
