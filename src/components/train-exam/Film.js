import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createVideoProcess,
  changeStatus,
  deleteVideoProcess,
  updateVideoProcess,
} from "../../store/slices/videoProcessSlice";
import PulseLoader from "react-spinners/PulseLoader";
import { getGreenFilters } from "../../store/slices/greenFilterSlice";
import ModalGreenFilter from "../modals/ModalGreenFilter";
import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Tuto from "../core/Tuto";

export default function Film() {
  
  const BASE_URL = process.env.REACT_APP_WEB_BASE_URL;
  const BASE_URL_AWS = process.env.REACT_APP_AWS_BASE_URL;

  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const { status, error } = useSelector((state) => state.videoProcess);
  const { token } = user;
  const dispatch = useDispatch();

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const selectedQuestionRef = useRef(null);
  const [videoBase64, setVideoBase64] = useState(null);
  const [recording, setRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [countDown, setCountdown] = useState(0);
  const [timerIntervalId, setTimerIntervalId] = useState(null);
  const videoCameraRef = useRef(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [createdVideoId, setCreatedVideoId] = useState(null);
  const [createdVideoPath, setCreatedVideoPath] = useState(null);
  const [greenFilters, setGreenFilters] = useState([]);
  const [selectedGreenFilterIndex, setSelectedGreenFilterIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAddOpen, setModalAddOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cameraLoading, setCameraLoading] = useState(true);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  const refVideoRecord = useRef();
  const canvasRef = useRef();
  const contextRef = useRef();
  const currentQuestionIdRef = useRef();
  const isKeyPressed = useRef(false);
  const isCountdownActive = useRef(false);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("keyup", handleKeyRelease);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("keyup", handleKeyRelease);
    };
  }, [recording, videoBase64, countDown, isFilterApplied, showIntro]);

  useEffect(() => {
    currentQuestionIdRef.current = questions[currentQuestionIndex]?.id;
    selectedQuestionRef.current = questions[currentQuestionIndex];
  }, [currentQuestionIndex, questions]);

  useEffect(() => {
    const selectedQuestions = JSON.parse(
      localStorage.getItem("selectedQuestionsVideos")
    );
    if (selectedQuestions) {
      setQuestions(selectedQuestions);
    }
  }, []);

  useEffect(() => {
    if (!mediaStream && !showIntro) {
      initializeCamera();
    }
  }, [mediaStream, showIntro]);

  // Make Pad working
  const handleKeyPress = (event) => {
    if (
      !showIntro &&
      !isKeyPressed.current &&
      /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/.test(event.key)
    ) {
      isKeyPressed.current = true;
      if (!videoBase64 && !countDown && !isCountdownActive.current) {
        toggleRecording();
      }
    }
  };

  const handleKeyRelease = () => {
    isKeyPressed.current = false;
  };

  const openModal = () => {
    setIsModalOpen(true);
    fetchGreenFilters();
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const initializeCamera = async () => {
    try {
      setCameraLoading(true);
      const stream = await navigator.mediaDevices
        .getUserMedia({
          video: {
            facingMode: "portrait",
            width: { ideal: 640 }, // Largeur souhaitée
            height: { ideal: 1136 }, // Hauteur souhaitée
          },
          audio: true,
        })
        .then((stream) => (videoCameraRef.current.srcObject = stream));
      setMediaStream(stream);
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          const chunks = videoBase64 ? [...videoBase64, e.data] : [e.data];
          setVideoBase64(chunks);
        }
      };

      if (isFilterApplied) {
        handleApplyBackground();
      }

    } catch (error) {
      console.error("Erreur lors de l'accès à la caméra : ", error);
      navigate("/malfunction");
    } finally {
      setCameraLoading(false);
    }
  };

  const startCountdown = async () => {
    isCountdownActive.current = true;
    for (let count = 3; count > 0; count--) {
      setTimer(count);
      setCountdown(count);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    setCountdown(0);
    isCountdownActive.current = false;
  };

  const toggleRecording = async () => {
    const questionId = currentQuestionIdRef.current;
    const selectedQuestion = selectedQuestionRef.current;

    if (!recording) {
      try {
        dispatch(changeStatus("loading"));

        // Début du décompte
        await startCountdown();
        setCountdown(0);

        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        const stream = isFilterApplied
          ? canvasRef.current.captureStream()
          : await navigator.mediaDevices.getUserMedia({
              video: {
                facingMode: "portrait",
                width: { ideal: 640 }, // Largeur souhaitée
                height: { ideal: 1136 }, // Hauteur souhaitée
              },
            });

        audioStream.getTracks().map((track) => stream.addTrack(track));

        refVideoRecord.current.srcObject = stream;
        setMediaStream(stream);

        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);

        const chunks = [];
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunks.push(e.data);
          }
        };

        recorder.onstop = async () => {
          const blob = new Blob(chunks, { type: "video/webm" });
          const videoFile = new File([blob], "video.mp4", {
            type: "video/mp4",
          });

          setVideoBase64(blob);
          stream.getTracks().forEach((track) => track.stop());
          setRecording(false);
          setTimer(0);
          clearInterval(timerIntervalId);

          await saveVideoToDatabase(
            videoFile,
            questionId,
            selectedQuestion,
            token
          );
          handleNextQuestion();
        };

        recorder.start();
        setRecording(true);

        const intervalId = setInterval(() => {
          setTimer((prevTimer) => prevTimer + 1);
        }, 1000);

        setTimerIntervalId(intervalId);
      } catch (error) {
        console.error("Erreur lors de l'accès à la caméra : ", error);
        navigate("/malfunction");
      }
    } else {
      if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
        clearInterval(timerIntervalId);
      }
    }
  };

  const saveVideoToDatabase = async (
    videoFile,
    questionId,
    selectedQuestion,
    token
  ) => {
    let res;
    let success = false;
    let attempts = 0;
    const maxAttempts = 5;
    const retryDelay = 2000;
  
    while (attempts < maxAttempts) {
      try {
        let values;
        if (selectedQuestion.updateState) {
          values = {
            token,
            video: videoFile,
            startValue: null,
            endValue: null,
            id: selectedQuestion.id,
            questionVideo: selectedQuestion.questionVideoId
          };
        } else {
          values = {
            token,
            video: videoFile,
            questionId: null,
            themeId: null,
            musicId: null,
            fontSize: null,
            fontColor: null,
            questionVideo: questionId
          };
        }
  
        if (selectedQuestion.updateState) {
          res = await dispatch(updateVideoProcess(values));
        } else {
          res = await dispatch(createVideoProcess(values));
        }
  
        if (res.meta.requestStatus === "fulfilled") {
          success = true;
          setCreatedVideoId(res.payload.id);
          setCreatedVideoPath(res.payload.video);
          dispatch(changeStatus(""));
  
          if (canvasRef.current) {
            const context = canvasRef.current.getContext("2d");
            context.clearRect(
              0,
              0,
              canvasRef.current.width,
              canvasRef.current.height
            );
          }
          break;
        }
      } catch (error) {
        console.error("Erreur lors de la sauvegarde du clip, réessayer...", error);
      }
  
      attempts++;
      if (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  
    if (!success) {
      console.error("Échec de la sauvegarde du clip après plusieurs tentatives.");
      alert("Échec de la sauvegarde du clip après plusieurs tentatives.")
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setVideoBase64(null);
      setCreatedVideoPath(null);
      setRecording(false);
      setMediaStream(null);
      setShowIntro(true);
    } else {
      localStorage.removeItem("selectedQuestionsVideos");
      navigate("/reviewTE");
    }
  };

  const deleteLastVideo = async () => {
    try {
      await dispatch(
        deleteVideoProcess({
          token: token,
          id: createdVideoId,
        })
      );
    } catch (error) {
      console.error("Error :", error);
    } finally {
    }
  };

  const handleRedoRecording = () => {
    deleteLastVideo();
    setVideoBase64(null);
    setCreatedVideoPath(null);
    setTimer(0);
    clearInterval(timerIntervalId);
    setMediaStream(null);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const remainingSeconds = (seconds % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}:${remainingSeconds}`;
  };

  // GREEN FILTER
  const selfieSegmentation = new SelfieSegmentation({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
  });

  let backgroundImage;
  
  const fetchGreenFilters = async () => {
    try {
      const response = await dispatch(getGreenFilters(token));
      const greenFiltersData = response.payload;
      setGreenFilters(greenFiltersData);
    } catch (error) {
      console.error("Erreur lors de la récupération des filtres :", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyBackground = async () => {
    if (
      selectedGreenFilterIndex >= 0 &&
      greenFilters[selectedGreenFilterIndex]
    ) {
      if (canvasRef.current && videoCameraRef.current) {
        backgroundImage = new Image();
        backgroundImage.src = `${BASE_URL}/uploads/greenFilters/${greenFilters[selectedGreenFilterIndex].image}`;
  
        const checkVideoDimensions = () => {
          const videoWidth = videoCameraRef.current.videoWidth;
          const videoHeight = videoCameraRef.current.videoHeight;
  
          if (videoWidth > 0 && videoHeight > 0) {
            canvasRef.current.width = videoWidth;
            canvasRef.current.height = videoHeight;
            
            selfieSegmentation.setOptions({
              modelSelection: 0,
              selfieMode: false,
              effect: 'mask',
            });
            selfieSegmentation.onResults(onResults);
  
            sendToMediaPipe();
  
            setIsFilterApplied(true);
            closeModal();
          } else {
            console.error("Video dimensions are not valid. Retrying...");
            setTimeout(checkVideoDimensions, 100);
          }
        };
  
        checkVideoDimensions();
      } else {
        console.error("canvasRef is not defined.");
      }
    }
  };

  const onResults = (results) => {
    contextRef.current = canvasRef.current.getContext("2d");
    contextRef.current.save();
    contextRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    const wRatio = canvasRef.current.width / results.image.width;
    const hRatio = canvasRef.current.height / results.image.height;
    const ratio = Math.max(wRatio, hRatio);
    const offsetX = (canvasRef.current.width - results.image.width * ratio) / 2;
    const offsetY = (canvasRef.current.height - results.image.height * ratio) / 2;

    contextRef.current.drawImage(
      results.segmentationMask,
      offsetX,
      offsetY,
      results.image.width * ratio,
      results.image.height * ratio
    );

    contextRef.current.globalCompositeOperation = "source-out";

    if (
      selectedGreenFilterIndex >= 0 &&
      greenFilters[selectedGreenFilterIndex]
    ) {
      // Inverser l'image sur l'axe X
      contextRef.current.save();
      contextRef.current.scale(-1, 1);
      contextRef.current.drawImage(
        backgroundImage,
        -canvasRef.current.width,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      contextRef.current.restore();
    }

    contextRef.current.globalCompositeOperation = "destination-atop";
    contextRef.current.drawImage(
      results.image,
      offsetX,
      offsetY,
      results.image.width * ratio,
      results.image.height * ratio
    );

    contextRef.current.restore();
  };

  async function sendToMediaPipe() {
      if (!selfieSegmentation || !videoCameraRef.current.videoWidth) {
        requestAnimationFrame(sendToMediaPipe);
      } else {
        await selfieSegmentation.send({ image: videoCameraRef.current });
        requestAnimationFrame(sendToMediaPipe);
      }
  }

  const handleRemoveBackground = () => {
    setIsFilterApplied(false);
    setMediaStream(null);
  };

  return (
    <div className="flex flex-col justify-center min-h-[60%] h-fit tall:h-[90%] w-fit min-w-[60%] tall:w-[90%] space-y-8 tall:space-y-8 p-10 dark:bg-dark_bg_2 rounded-xl">
      <div className="text-center dark:text-dark_text_1">
        <div className="mt-6 text-base">
          <p>
            C'est le moment de <span className="text-blue-400">filmer</span> ta
            séquence.
          </p>
        </div>
        {currentQuestionIndex < questions.length && (
          <h2 className="mt-6 text-3xl font-bold">
            {questions[currentQuestionIndex].title}
          </h2>
        )}
      </div>

      <div className="dark:text-dark_text_1">
        {cameraLoading && !showIntro ? (
          <div className="flex items-center justify-center h-screen w-screen fixed top-0 left-0 bg-black bg-opacity-75">
            <div className="text-center">
              <PulseLoader color="#808080" size={16} />
            </div>
          </div>
        ) : null}

        <div className="relative w-full md:w-[60%] tall:w-full h-96 tall:h-[68rem] mx-auto flex items-center justify-center">
          {videoBase64 && (
            <video
              src={
                createdVideoPath
                  ? `${BASE_URL}/uploads/videoProcess/${createdVideoPath}`
                  : null
              }
              controls
              disablePictureInPicture
              controlsList="nodownload"
              preload="true"
              className="w-full h-full object-contain tall:object-cover"
            />
          )}

          {showIntro && (
            <video
              src={`${BASE_URL_AWS}/${questions[currentQuestionIndex]?.video}`}
              controls
              disablePictureInPicture
              controlsList="nodownload"
              preload="true"
              className="w-full h-full object-contain tall:object-cover"
              onEnded={() => setShowIntro(false)}
            />
          )}

          {!recording && timer > 0 && (
            <div className="countdown-overlay">
              {timer}
              <p className="text-sm mt-3 text-center text-white">
                Souris et regarde la caméra 😉 !{" "}
              </p>
            </div>
          )}

          {!videoBase64 && !showIntro && (
            <>
              <video
                ref={videoCameraRef}
                className={`w-full h-full object-contain tall:object-cover ${
                  videoBase64 ? "hidden" : ""
                }`}
                style={{ transform: "scaleX(-1)" }}
                autoPlay
                disablePictureInPicture
                controlsList="nodownload"
                muted
              />

              <canvas
                ref={canvasRef}
                className={`w-full h-full object-contain tall:object-cover ${
                  videoBase64 ? "hidden" : ""
                } ${isFilterApplied ? "" : "hidden"}`}
                style={{
                  position: "absolute",
                  transform: "scaleX(-1)",
                }}
              />
              <video
                ref={refVideoRecord}
                className={`w-full h-full object-contain tall:object-cover ${
                  videoBase64 ? "hidden" : ""
                } ${recording ? "" : "hidden"}`}
                style={{
                  position: "absolute",
                  transform: isFilterApplied ? "scaleX(-1)" : "scaleX(-1)",
                }}
                autoPlay
                disablePictureInPicture
                controlsList="nodownload"
                muted
              />
            </>
          )}

          {recording && (
            <div
              className="absolute bottom-2 left-0 right-0 text-center text-white"
              style={{ opacity: 0.85 }}
            >
              {formatTime(timer)}
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-center">
          {!showIntro && (
            <>
              {videoBase64 ? null : (
                <button
                  onClick={toggleRecording}
                  className={`${
                    recording
                      ? "bg-red-500 hover:bg-red-700"
                      : "bg-green_2 hover:bg-green_1"
                  } text-white px-4 py-2 rounded-lg actionBtn ${
                    timer > 0 && !recording ? "opacity-50 pointer-events-none" : ""
                  }`}
                  disabled={timer > 0 && !recording}
                >
                  {recording
                    ? "Arrêter l'enregistrement"
                    : "Démarrer l'enregistrement"}
                </button>
              )}

              {!videoBase64 && (
                isFilterApplied ? (
                  <button
                    onClick={handleRemoveBackground}
                    className={`ml-4 bg-orange-500 hover:bg-orange-700 text-white px-4 py-2 rounded-lg ${
                      status === "loading" ? "opacity-50 pointer-events-none" : ""
                    }`}
                    disabled={status === "loading"}
                  >
                    <FontAwesomeIcon icon={faTrash} className="" /> Ecran vert
                  </button>
                ) : (
                  <button
                    onClick={openModal}
                    className={`greenFilter ml-4 bg-yellow-500 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg ${
                      status === "loading" ? "opacity-50 pointer-events-none" : ""
                    }`}
                    disabled={status === "loading"}
                  >
                    Ecran vert
                  </button>
                )
              )}
            </>
          )}
        </div>

      </div>

      {!showIntro && (
        <button
          className={`w-full flex justify-center bg-blue_3 text-gray-100 p-4 rounded-full tracking-wide font-semibold focus:outline-none hover:bg-blue-4 shadow-lg cursor-pointer transition ease-in duration-300 ${
            !videoBase64 || status === "loading"
              ? "opacity-50 pointer-events-none"
              : ""
          }`}
          onClick={handleNextQuestion}
          disabled={!videoBase64 || status === "loading"}
          style={{ marginTop: 20 }}
        >
          {status === "loading" ? (
            <PulseLoader color="#fff" size={16} />
          ) : (
            "Continuer"
          )}
        </button>
      )}

      {/* GreenFilter Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="modal bg-black bg-opacity-75 w-full h-full absolute"></div>
          {loading ? (
            <div className="text-center">
              <PulseLoader color="#808080" size={16} />
            </div>
          ) : (
            <div className="modal-content bg-white w-1/2 p-4 rounded-lg text-center z-50 relative">
              <p className="text-gray-800 text-lg">Liste des écrans verts</p>
              <div className="grid grid-cols-3 gap-4 mt-4">
                {greenFilters.map((filter, index) => (
                  <div
                    key={filter.id}
                    className={`card cursor-pointer mb-2 mx-2 relative ${
                      selectedGreenFilterIndex === index
                        ? "filter-selected"
                        : ""
                    }`}
                    onClick={() => setSelectedGreenFilterIndex(index)}
                  >
                    <img
                      src={`${BASE_URL}/uploads/greenFilters/${filter.image}`}
                      alt={filter.title}
                      className="w-full h-32 object-cover rounded-md mb-2"
                    />
                    {selectedGreenFilterIndex === index && (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <p className="text-blue-500 text-3xl">&hearts;</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button
                className="mt-4 mr-4 bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                onClick={handleApplyBackground}
              >
                Appliquer
              </button>
              <button
                className="mt-4 bg-yellow-500 hover:bg-yellow-700 text-white px-4 py-2 rounded-md"
                onClick={closeModal}
              >
                Fermer
              </button>
            </div>
          )}
        </div>
      )}
      {/* ---- */}

      <ModalGreenFilter
        isOpen={modalAddOpen}
        onClose={() => setModalAddOpen(false)}
        fetchGreenFilters={fetchGreenFilters}
      />

      <Tuto
        steps={[
          {
            element: ".currentQuestion",
            intro: "Le titre de la question en cours s'affichera ici.",
          },
          {
            element: ".actionBtn",
            intro:
              "Démarre, recommence ou arrête un enregistrement depuis ce bouton.",
          },
          {
            element: ".greenFilter",
            intro:
              "Tu peux aussi appliquer un écran vert pour changer le décor derrière toi.",
          },
        ]}
        tutorialKey="filmTuto"
      />
    </div>
  );
}
