import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { updateQuestionLists } from "../../store/slices/userSlice";
import { getJobiboxPortals } from "../../services/jobibox.service";
import { changeStatus } from "../../store/slices/postSlice";
import { createPost } from "../../services/post.service";
import PulseLoader from "react-spinners/PulseLoader";
import { AppDispatch, RootState } from "../../store/Store";
import { QuestionVideo } from "../../models/QuestionVideo";

export default function EvaluationScreen(): React.JSX.Element {

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);
  const { token } = user;
  const { status, error } = useSelector((state: RootState) => state.post);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const AWS_BASE_URL = process.env.REACT_APP_WEB_BASE_URL;

  const [questions, setQuestions] = useState<QuestionVideo[]>([]);
  const [responses, setResponses] = useState({});
  const [score, setScore] = useState<number | null>(null);
  const [portals, setPortals] = useState<any>([]);

  const businessId = localStorage.getItem("businessId") || null;
  const selectedActivity = localStorage.getItem("selectedActivity");

  // Video properties
  const videoPath = localStorage.getItem("videoPath");
  const handleMetadata = (e) => {
    e.preventDefault();
    e.target.currentTime = 0;
  };

  const generateImageFromVideo = async () => {
    const videoElement = document.createElement("video");
    videoElement.src = `${AWS_BASE_URL}/${videoPath}`;
    videoElement.currentTime = 4;

    return new Promise((resolve) => {
      videoElement.addEventListener("loadeddata", () => {
        const canvas = document.createElement("canvas");
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) { ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height); }
        canvas.toBlob((blob) => {
          resolve(blob);

          URL.revokeObjectURL(videoElement.src);
          videoElement.remove();
          canvas.remove();
        }, "image/jpeg");
      });
      videoElement.load();
    });
  };

  const handlePublish = async () => {
    dispatch(changeStatus("loading"));

    const imageBlob = await generateImageFromVideo();

    const imageFile = new File([imageBlob as Blob], "thumbnail.jpg", {
      type: "image/jpeg",
    });

    // Générer un titre court et unique
    const generateUniqueTitle = () => {
      const timestamp = Date.now(); 
      const baseTitle = selectedActivity || "Uncategorized";
      return `${baseTitle}-${timestamp}`;
    };

    const uniqueTitle = generateUniqueTitle();

    const postData = {
      token: token,
      title: uniqueTitle,
      category: selectedActivity,
      subCategory: "Portail",
      createdFrom: "jobibox",
      video: videoPath,
      image: imageFile,
      businessId: businessId,
      portal: portals.length > 0 ? portals.map((portal) => portal.id) : [],
      date: "",
    };

    console.log("Données envoyées à l'API :", postData);

    try {
      // @ts-ignore
      const res = await dispatch(createPost(postData));
      console.log(res);
    } catch (error) {
      console.error("Erreur lors de la création de la publication :", error);
    } finally {
      dispatch(changeStatus(""));
    }
  };

  useEffect(() => {
    // Récupérer les questions depuis localStorage
    const selectedQuestions =
      JSON.parse(localStorage.getItem("beginnerInProgress") ?? "null") ||
      JSON.parse(localStorage.getItem("intermediateInProgress") ?? "null") ||
      JSON.parse(localStorage.getItem("expertInProgress") ?? "null");

    console.log("Questions récupérées :", selectedQuestions);

    if (Array.isArray(selectedQuestions) && selectedQuestions.length > 0) {
      setQuestions(selectedQuestions);
    } else {
      console.error("Aucune question trouvée dans le localStorage.");
    }
  }, []);

  useEffect(() => {
    const allResponsesGiven =
      questions.length > 0 &&
      Object.keys(responses).length === questions.length;
  
    if (allResponsesGiven) {
      calculateScore();
      fetchPortals();
    }
  }, [responses, questions]);
  

  const fetchPortals = async () => {
    try {
      const jobiboxId = localStorage.getItem("jobiboxId");
      if (!jobiboxId) {
        console.error("Aucun jobiboxId trouvé dans le localStorage !");
        return;
      }
      const response = await dispatch(getJobiboxPortals({ id: jobiboxId }));
      const portalsData = response.payload;

      // Filtrer pour ne garder que les portails contenant "simulation" dans leur titre
      if (portalsData && "portals" in portalsData && Array.isArray(portalsData.portals)) {
        const simulationPortal = portalsData.portals.find((portal) =>
          portal.title.toLowerCase().includes("simulation")
        );
        if (simulationPortal) {
          // Stocker le portail trouvé dans un état
          setPortals([simulationPortal]);
        } else {
          console.warn("Aucun portail avec 'simulation' trouvé !");
        }
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des portails :", error);
    }
  };

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
      // Publication
      await handlePublish();
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour de la liste des questions :",
        error
      );
    } finally {
      localStorage.removeItem("beginnerInProgress");
      localStorage.removeItem("intermediateInProgress");
      localStorage.removeItem("expertInProgress");
      localStorage.removeItem("selectedQuestions");
      localStorage.removeItem("selectedTheme");
      localStorage.removeItem("selectedMusic");
      localStorage.removeItem("videoPath");
      localStorage.removeItem("videoId");
      localStorage.removeItem("textStyle");
      localStorage.removeItem("examenInProgress");
      localStorage.removeItem("isTrainExam");
      localStorage.removeItem("selectedGreenFilter");
      localStorage.removeItem("selectedAnimation");
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
              <h2 className="text-4xl font-bold">Evaluation</h2>
              <p className="mt-12 mb-12 text-xl">
                Voici la liste des questions et leurs{" "}
                <span className="text-blue-400">réponses attendues</span>.
                Indique si tu as bien répondu à chaque question pour voir ton
                score final.
              </p>

              {/* Video */}
              {videoPath && (
                <video
                  key={videoPath}
                  controls
                  disablePictureInPicture
                  controlsList="nodownload"
                  width="100%"
                  className="h-48 md:h-64 lg:h-96 xl:h-120"
                  preload={"auto"}
                  onLoadedMetadata={handleMetadata}
                >
                  <source
                    src={`${AWS_BASE_URL}/${videoPath}`}
                    type="video/mp4"
                  />
                  Votre navigateur ne prend pas en charge la balise vidéo.
                </video>
              )}

              {/* Liste des questions avec défilement */}
              <div className="mt-6 max-h-56 tall:max-h-96 overflow-y-auto space-y-6 p-6 bg-gray-100 dark:bg-dark_bg_1 rounded-lg shadow-inner">
                {questions.map((question) => (
                  <div
                    key={question.id}
                    className="flex flex-col space-y-4 p-6 bg-white dark:bg-dark_bg_2 rounded-lg shadow-lg"
                  >
                    <p className="text-xl font-semibold text-left text-gray-800 dark:text-gray-200">
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
                <p className="text-xl font-medium text-gray-500 dark:text-gray-300">
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
                className={`text-xl w-full flex justify-center p-4 rounded-full tracking-wide font-semibold focus:outline-none shadow-lg transition ease-in duration-300 ${
                  status
                    ? "bg-gray-400 text-gray-500 opacity-50 pointer-events-none"
                    : "bg-gray-300 text-gray-700 hover:bg-gray-400 cursor-pointer"
                }`}
                onClick={handleReturnToHome}
                disabled={!!status}
              >
                {status ? (
                  <PulseLoader color="#fff" size={10} />
                ) : (
                  "Retour à l'accueil"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
