import React, { useEffect, useState } from "react";
import GoBack from "../../components/core/GoBack";
import Logout from "../../components/core/Logout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getQuestionVideos } from "../../store/slices/questionVideoSlice";
import PulseLoader from "react-spinners/PulseLoader";
import intermediateImg from "../../../assets/images/intermediate.png";

export default function Intermediate() {

  const user = useSelector((state) => state.user.user);
  const { token } = user;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sessionStorage.removeItem("hasReloaded");
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("https://jobissim.com/api/questionLists", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setCategories(data);
      } else {
        console.error("Erreur lors de la récupération des catégories :", response.status);
      }
    } catch (error) {
      console.error("Erreur lors de l'appel API pour les catégories :", error);
    }
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };

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
    const existingSelectedQuestions = localStorage.getItem("selectedQuestionsVideos");
    if (existingSelectedQuestions) {
      localStorage.removeItem("selectedQuestionsVideos");
    }
  
    if (!selectedCategory) return;
  
    setLoading(true);
  
    const fetchedQuestions = await fetchQuestionVideos();

    console.log(fetchedQuestions);
  
    const selectedCategoryObject = categories.find((category) => category.id === selectedCategory);
    if (!selectedCategoryObject) {
      console.error("Thème sélectionné introuvable !");
      setLoading(false);
      return;
    }
  
    const simulationQuestions = fetchedQuestions.filter(
      (question) =>
        question.training &&
        question.difficulty === "Intermédiaire" &&
        question.questionList.id === selectedCategoryObject.id
    );
  
    const shuffledQuestions = shuffleArray([...simulationQuestions]).slice(0, 5);
  
    localStorage.setItem("selectedQuestionsVideos", JSON.stringify(shuffledQuestions));
    localStorage.setItem("intermediateInProgress", "true");
  
    navigate("/greenFiltersE");
  };

  return (
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
      <GoBack />
      <Logout />
      {/* Container */}
      <div className="flex w-full mx-auto h-full">
        <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
          <div className="flex flex-col justify-center min-h-[60%] h-fit tall:h-[90%] w-fit min-w-[60%] tall:w-[90%] space-y-8 tall:space-y-20 p-10 dark:bg-dark_bg_2 rounded-xl">
            {/* Heading */}
            <div className="text-center dark:text-dark_text_1">
              <h2 className="text-3xl font-bold">Niveau Intermédiaire</h2>
              <img
              src={intermediateImg}
              alt="Welcome"
              className="mx-auto mt-10"
              style={{ maxHeight: "350px", width: "auto", height: "auto" }}
              />
              <p className="mt-12 text-lg">
                Choisis une thématique parmi celles proposées : les questions
                apparaîtront <span className="text-blue-400">aléatoirement</span>. Tu pourras te filmer à ton rythme, mais il ne sera{" "}
                <span className="text-blue-400">pas possible</span> de{" "}
                <span className="text-blue-400">recommencer</span> une séquence.
              </p>
            </div>

            <div className="dark:text-dark_text_1">
              {/* {loading ? (
                <div className="text-center">
                  <PulseLoader color="#fff" size={16} />
                </div>
              ) : ( */}
                <div className="flex justify-around space-x-4">
                  {categories.map(
                    (category) => (
                    <div
                      key={category.id}
                      className={`cursor-pointer p-6 w-1/3 text-center rounded-lg shadow-lg transform transition-all duration-300 ${
                        selectedCategory === category.id
                          ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white scale-105 shadow-2xl"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700 hover:scale-105 hover:shadow-md"
                      }`}
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      <span className="font-semibold tracking-wide">{category.title}</span>
                    </div>
                    )
                  )}
                </div>
              {/* )} */}
            </div>

            <button
              className={`w-full flex justify-center bg-blue_3 text-gray-100 p-4 rounded-full tracking-wide font-semibold focus:outline-none shadow-lg cursor-pointer transition ease-in duration-300 ${
                !selectedCategory ? "opacity-50 pointer-events-none" : ""
              }`}
              onClick={handleContinueClick}
              disabled={!selectedCategory}
            >
              Continuer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
