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
        <p className="text-gray-800 text-lg">Ajouter une question</p>
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
