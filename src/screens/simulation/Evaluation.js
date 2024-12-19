import React, { useEffect, useState } from "react";
import Logout from "../../components/core/Logout";
import { useSelector } from "react-redux";

export default function Evaluation() {

  const BASE_URL = process.env.REACT_APP_WEB_BASE_URL;
  const user = useSelector((state) => state.user.user);
  const { token } = user;

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
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
  
        // Récupérer la valeur `intermediateInProgress` ou `beginnerInProgress`, ou fallback à `expertInProgress`
        const simulationInProgress =
          localStorage.getItem("beginnerInProgress") ||
          localStorage.getItem("intermediateInProgress") ||
          "expertInProgress";
  
        if (simulationInProgress === "expertInProgress") {
          // Définir directement le chemin pour le guide expert
          setSelectedCategory({
            document: "guide-expert.pdf",
          });
        } else {
          // Filtrer la catégorie correspondant à `simulationInProgress`
          const matchedCategory = data.find(
            (category) => category.title === simulationInProgress
          );
  
          console.log("Catégorie correspondante :", matchedCategory);
  
          setSelectedCategory(matchedCategory);
        }
  
        setCategories(data);
      } else {
        console.error("Erreur lors de la récupération des catégories :", response.status);
      }
    } catch (error) {
      console.error("Erreur lors de l'appel API pour les catégories :", error);
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
                Nous te remercions d’avoir utilisé la Jobibox. <span className="text-blue-400">L’équipe de
                JOBISSIM</span> espère que cette expérience t’a plu et te souhaite
                bonne chance dans tes recherches.
                <br /> <br />
                PS : Comme convenu, voici ton <span className="text-blue-400">guide d'auto-évaluation</span>, Tu pourras suivre ta progression et t'améliorer à chaque étape.
              </p>

              <div className="flex justify-center items-center mt-10 mb-5">
                {selectedCategory ? (
                   <iframe
                   src={`${BASE_URL}/json/${selectedCategory.document}#toolbar=0`}
                   type="application/pdf"
                   width="100%"
                   height="500px"
                   style={{ border: 'none' }}
                 ></iframe>
                ) : (
                    <p>Chargement du guide...</p>
                )}
              </div>

            </div>
            {/*Buttons*/}
            <Logout position="static" />
          </div>
        </div>
      </div>
    </div>
  );
}
