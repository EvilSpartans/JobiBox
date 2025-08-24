import React, { useEffect, useState } from "react";
import GoBack from "../../components/core/GoBack";
import Logout from "../../components/core/Logout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getQuestionVideos } from "../../store/slices/questionVideoSlice";
import expertImg from "../../../assets/images/expert.png";
import { getCategories } from "../../store/slices/categorySlice";

export default function Expert() {
  const user = useSelector((state) => state.user.user);
  const { token } = user;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    sessionStorage.removeItem("hasReloaded");
    fetchCategories();
  }, []);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await dispatch(getCategories(token));
      const categoriesData = response.payload.items;
      const updatedCategoryOptions = categoriesData.map((category) => ({
        value: category.name,
        label: category.name,
      }));
      setCategoryOptions(updatedCategoryOptions);
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories :", error);
    }
  };

  const handleNewCategoryChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedCategory(selectedValue);

    // Sauvegarde dans le localStorage
    localStorage.setItem("selectedActivity", selectedValue);
    // console.log("Nouvelle catégorie sélectionnée :", selectedValue);
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
      const payload = response.payload.items;
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

    // Identifier la question principale (celle avec `questionType` à `null`)
    const mainQuestion = fetchedQuestions.find(
      (question) => question.questionList === null
    );

    if (!mainQuestion) {
      console.error("Main Question introuvable !");
      setLoading(false);
      return;
    }

    // Filtrer les autres questions
    const simulationQuestions = fetchedQuestions.filter((question) => {
      const isIntermediateOrDifficult =
        question.training &&
        question.questionList !== null &&
        question.questionList.title !== "Débutant";
  
      const isNotMainQuestion = question.id !== mainQuestion.id;
  
      const hasMatchingCategory = question.categories.some(
        (cat) => cat.name === selectedCategory
      );
  
      return isIntermediateOrDifficult && isNotMainQuestion && hasMatchingCategory;
    });

    // Mélanger les autres questions
    const shuffledQuestions = shuffleArray([...simulationQuestions]).slice(
      0,
      4
    );

    // Construire la liste finale avec la `mainQuestion` en premier
    const finalQuestions = [mainQuestion, ...shuffledQuestions];

    localStorage.setItem(
      "selectedQuestionsVideos",
      JSON.stringify(finalQuestions)
    );
    localStorage.setItem("expertInProgress", JSON.stringify(finalQuestions));
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
              <h2 className="text-4xl font-bold">Niveau expert</h2>
              <img
                src={expertImg}
                alt="Welcome"
                className="mx-auto mt-10"
                style={{ maxHeight: "350px", width: "auto", height: "auto" }}
              />
              <p className="mt-12 text-xl">
                Un seul scénario te sera proposé, regroupant toutes les
                thématiques avec des questions de{" "}
                <span className="text-blue-400">
                  niveau intermédiaire ou difficile
                </span>
                . Tu devras enchaîner{" "}
                <span className="text-blue-400">sans répit</span> et il ne sera{" "}
                <span className="text-blue-400">pas possible</span> de
                recommencer.
              </p>
            </div>

            <div className="mt-8">
              <label
                htmlFor="new-category-select"
                className="block text-xl dark:text-dark_text_1 mb-2"
              >
                Domaine d’activité :
              </label>
              <select
                id="new-category-select"
                className="w-full p-4 bg-white border border-gray-300 rounded-lg shadow-md focus:outline-none"
                value={selectedCategory}
                onChange={handleNewCategoryChange}
              >
                <option value="">-- Sélectionne un domaine --</option>
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              className={`text-xl w-full flex justify-center bg-blue_3 text-gray-100 p-4 rounded-full tracking-wide font-semibold focus:outline-none shadow-lg cursor-pointer transition ease-in duration-300 ${
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
