import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import { useDispatch, useSelector } from "react-redux";
import {
  getTranscription,
  changeStatus,
  createTranscription,
} from "../store/features/transcriptSlice";
import Tuto from "../components/Tuto";
import LogoutBtn from "../components/LogoutBtn";
import GoBack from "../components/GoBack";

export default function Transcription() {
  const { status, error } = useSelector((state) => state.transcription);
  const user = useSelector((state) => state.user.user);
  const [transcription, setTranscription] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [generated, setGenerated] = useState(false);
  const [applied, setApplied] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const videoPath = localStorage.getItem("videoPath");
  const BASE_URL = "https://test.jobissim.com";
  const { token } = user;

  const handleMetadata = (e) => {
    e.preventDefault();
    e.target.currentTime = 0;
  };

  const fetchTranscription = async () => {
    try {
      dispatch(changeStatus("loading"));
      const response = await dispatch(getTranscription(token));
      const data = response.payload;
      setTranscription(data.transcription);
      setGenerated(true);
    } catch (error) {
      console.error("Erreur lors de la récupération des sous-titres :", error);
    } finally {
      dispatch(changeStatus(""));
    }
  };

  const handleCreateTranscription = async () => {
    let response;
    try {
      dispatch(changeStatus("loading"));

      const formattedTranscription = {
        transcription: transcription.map((item) => ({
          phrase: item.phrase,
          start_time: item.start_time,
          end_time: item.end_time,
        })),
      };

      response = await dispatch(
        createTranscription({
          token: token,
          transcription: JSON.stringify(formattedTranscription),
        })
      );
      console.log(response);
    } catch (error) {
      console.error("Erreur lors de l'application des sous-titres:", error);
    } finally {
      if (response.meta.requestStatus === "fulfilled") {
        localStorage.removeItem("videoPath");
        localStorage.setItem(
          "videoPath",
          "uploads/videoProcess/" + response.payload.video
        );
        dispatch(changeStatus(""));
        setApplied(true);
      }
    }
  };

  return (
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
      {/* Container */}
      <GoBack />
      <LogoutBtn />
      <div className="flex w-full mx-auto h-full">
        {/* Login Form */}
        <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
          {/* Container */}
          <div className="flex flex-col justify-center min-h-[60%] h-fit tall:h-[90%] w-fit min-w-[60%] tall:w-[90%] space-y-8 tall:space-y-16 p-10 dark:bg-dark_bg_2 rounded-xl">
            {/* Heading */}
            <div className="text-center dark:text-dark_text_1">
              <h2 className="mt-6 text-3xl font-bold">Sous-titres</h2>
              <p className="mt-2 text-sm">
                Générer les sous-titres de la vidéo
              </p>
            </div>

            {/* Video */}
            {status === "loading" ? (
              <div className="flex items-center justify-center h-48 md:h-64 lg:h-96 xl:h-120 bg-gray-300 dark:bg-dark_bg_2">
                <PulseLoader color="#fff" size={10} />
              </div>
            ) : (
              videoPath && (
                <video
                  controls
                  disablePictureInPicture
                  controlsList="nodownload"
                  width="100%"
                  className="mb-4 h-48 md:h-64 lg:h-96 xl:h-120"
                  poster={thumbnail}
                  onLoadedMetadata={handleMetadata}
                >
                  <source src={`${BASE_URL}/${videoPath}`} type="video/mp4" />
                  Votre navigateur ne prend pas en charge la balise vidéo.
                </video>
              )
            )}

            {/* Textarea pour éditer les phrases */}
            {generated && (
              <div className="dark:text-dark_text_1">
                <p className="mt-2 mb-2 text-sm">Transcription :</p>
                <textarea
                  className="w-full h-20 px-3 py-2 border rounded mb-2"
                  value={transcription
                    .map((phraseData) => phraseData.phrase)
                    .join(", ")}
                  onChange={(e) => {
                    const newText = e.target.value;
                    const newPhrases = newText
                      .split(",")
                      .map((phrase, index) => ({
                        ...transcription[index],
                        phrase: phrase.trim(),
                      }));
                    setTranscription(newPhrases);
                  }}
                />
              </div>
            )}

            {/* Boutons */}
            <div className="flex space-x-2">
              {/* Bouton "Générer les sous-titres" */}
              {!generated && (
                <button
                  onClick={fetchTranscription}
                  className={`flex-1 bg-green_2 text-white px-4 py-2 rounded-lg hover:bg-green_1 ${
                    status ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={status}
                >
                  {status ? (
                    <PulseLoader color="#fff" size={8} />
                  ) : (
                    "Générer les sous-titres"
                  )}
                </button>
              )}

              {/* Bouton "Appliquer les sous-titres" */}
              {generated && !applied && (
                <button
                  onClick={handleCreateTranscription}
                  className={`flex-1 bg-green_2 text-white px-4 py-2 rounded-lg hover:bg-green_1 ${
                    status ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={status}
                >
                  {status ? (
                    <PulseLoader color="#fff" size={16} />
                  ) : (
                    "Appliquer les sous-titres"
                  )}
                </button>
              )}

              {/* Bouton "Continuer" */}
              <button
                className={`flex-1 bg-blue_3 text-gray-100 p-4 rounded-full tracking-wide font-semibold focus:outline-none hover:bg-blue_4 shadow-lg cursor-pointer transition ease-in duration-300 ${
                  status ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => navigate("/post")}
                disabled={status}
              >
                {status ? <PulseLoader color="#fff" size={16} /> : "Continuer"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Tuto
        steps={[
          {
            intro:
              "Si tu le souhaites, tu peux ajouter les sous-titres automatiques afin de rendre ton CV vidéo dynamique et plus compréhensible.",
          },
        ]}
        tutorialKey="transcriptionTuto"
      />
    </div>
  );
}
