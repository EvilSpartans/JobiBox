import React, { useEffect, useState } from "react";
import GoBack from "../../components/core/GoBack";
import Logout from "../../components/core/Logout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getQuestionVideos } from "../../store/slices/questionVideoSlice";
import intermediateImg from "../../../assets/images/intermediate.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { getCategories } from "../../store/slices/categorySlice";

export default function Intermediate() {
  const user = useSelector((state) => state.user.user);
  const { token } = user;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [mainQuestion, setMainQuestion] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedNewCategory, setSelectedNewCategory] = useState("");

  useEffect(() => {
    sessionStorage.removeItem("hasReloaded");
    fetchQuestionTypes();
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
    setSelectedNewCategory(selectedValue);

    // Sauvegarde dans le localStorage
    localStorage.setItem("selectedActivity", selectedValue);
    console.log("Nouvelle catégorie sélectionnée :", selectedValue);
  };

  const fetchQuestionTypes = async () => {
    try {
      const response = await fetch(`${BASE_URL}/questionLists`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Données avant filtrage :", data);

        // Filtrer pour retirer "Débutant"
        const filteredData = data.items.filter(
          (category) => category.title.trim().toLowerCase() !== "débutant"
        );

        console.log("Données après filtrage :", filteredData);
        setCategories(filteredData);
      } else {
        console.error(
          "Erreur lors de la récupération des catégories :",
          response.status
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'appel API pour les catégories :", error);
    }
  };

  const handleCategoryClick = async (categoryId) => {
    setSelectedCategory(categoryId);

    // Trouver le thème correspondant au `categoryId`
    const selectedCategoryObject = categories.find(
      (category) => category.id === categoryId
    );
    if (!selectedCategoryObject) {
      console.error("Thème sélectionné introuvable !");
      return;
    }

    // Trouver et sauvegarder la `mainQuestion`
    const mainQuestion = selectedCategoryObject.mainQuestionVideo;
    if (!mainQuestion) {
      console.error(
        "Question principale introuvable pour le thème sélectionné !"
      );
      return;
    }

    // Met à jour l'état immédiatement
    setMainQuestion(mainQuestion);
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
    const existingSelectedQuestions = localStorage.getItem(
      "selectedQuestionsVideos"
    );
    if (existingSelectedQuestions) {
      localStorage.removeItem("selectedQuestionsVideos");
    }

    if (!selectedCategory || !mainQuestion) {
      console.error("Catégorie ou question principale manquante !");
      return;
    }

    setLoading(true);

    const fetchedQuestions = await fetchQuestionVideos();
    // console.log("Questions récupérées :", fetchedQuestions);

    // Trouver le thème sélectionné
    const selectedCategoryObject = categories.find(
      (category) => category.id === selectedCategory
    );
    if (!selectedCategoryObject) {
      console.error("Thème sélectionné introuvable !");
      setLoading(false);
      return;
    }

    // Filtrer les autres questions liées au thème, excluant la `mainQuestion`
    const simulationQuestions = fetchedQuestions.filter((question) => {
      // Vérifie si la question appartient au thème et n'est pas la `mainQuestion`
      const isFromSelectedCategory =
        question.questionList &&
        question.questionList.id === selectedCategoryObject.id;
      const hasMatchingActivity = question.categories.some(
        (cat) => cat.name === selectedNewCategory
      );
      return (
        isFromSelectedCategory &&
        question.id !== mainQuestion.id &&
        hasMatchingActivity
      );
    });

    // Mélanger les autres questions
    const shuffledQuestions = shuffleArray([...simulationQuestions]).slice(
      0,
      3
    );

    // Construire la liste finale avec la mainQuestion en premier
    const finalQuestions = [mainQuestion, ...shuffledQuestions];

    // Sauvegarder les questions sélectionnées
    localStorage.setItem(
      "selectedQuestionsVideos",
      JSON.stringify(finalQuestions)
    );
    localStorage.setItem(
      "intermediateInProgress",
      JSON.stringify(finalQuestions)
    );

    // console.log("Liste finale des questions :", finalQuestions);

    // Naviguer vers la page suivante
    navigate("/recordS");
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
              <h2 className="text-4xl font-bold">Niveau Intermédiaire</h2>
              <img
                src={intermediateImg}
                alt="Welcome"
                className="mx-auto mt-10"
                style={{ maxHeight: "350px", width: "auto", height: "auto" }}
              />
              <p className="mt-12 text-xl">
                Choisis un domaine d'activité et une thématique parmi celles
                proposées : les questions apparaîtront{" "}
                <span className="text-blue-400">aléatoirement</span>. Tu pourras
                te filmer à ton rythme, mais il ne sera{" "}
                <span className="text-blue-400">pas possible</span> de{" "}
                <span className="text-blue-400">recommencer</span> une séquence.
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
                value={selectedNewCategory}
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

            <div
              className="dark:text-dark_text_1"
              style={{ marginTop: "2rem" }}
            >
              <h1 className="block text-xl dark:text-dark_text_1 mb-2">
                Thématique :
              </h1>
              <div className="flex justify-around space-x-4">
                {categories.map((category) => {
                  // Vérifie si la catégorie est terminée
                  const completed = user.questionLists.some(
                    (list) => list.id === category.id
                  );

                  return (
                    <div
                      key={category.id}
                      className={`cursor-pointer p-6 w-1/3 text-center rounded-lg shadow-lg transform transition-all duration-300 ${
                        selectedCategory === category.id
                          ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white scale-105 shadow-2xl" // Style bleu si sélectionné
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700 hover:scale-105 hover:shadow-md" // Style gris sinon
                      }`}
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      <div className="flex flex-col items-center">
                        <span className="font-semibold tracking-wide mb-2">
                          {category.title}
                        </span>
                        {completed && (
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            className={`${
                              selectedCategory === category.id
                                ? "text-yellow-400"
                                : "text-gray-500"
                            }`}
                            size="lg"
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              className={`text-xl w-full flex justify-center bg-blue_3 text-gray-100 p-4 rounded-full tracking-wide font-semibold focus:outline-none shadow-lg cursor-pointer transition ease-in duration-300 ${
                !selectedCategory || !selectedNewCategory
                  ? "opacity-50 pointer-events-none"
                  : ""
              }`}
              onClick={handleContinueClick}
              disabled={!selectedCategory || !selectedNewCategory}
            >
              Continuer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
