import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changeStatus } from "../../store/slices/videoProcessSlice";
import { createVideoProcess, updateVideoProcess } from "../../services/videoProcess.service";
import PulseLoader from "react-spinners/PulseLoader";
import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";
import IntroQuestion from "./IntroQuestion";
import { AppDispatch, RootState } from "../../store/Store";
import { Question } from "../../models/Question";

export default function Film(): React.JSX.Element {
  
  const BASE_URL = process.env.REACT_APP_WEB_BASE_URL;

  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);
  const status = useSelector((state: RootState) => state.videoProcess.status);
  const { token } = user;
  const dispatch = useDispatch<AppDispatch>();

  const selectedTheme = JSON.parse(localStorage.getItem("selectedTheme") ?? "null");
  const selectedMusic = JSON.parse(localStorage.getItem("selectedMusic") ?? "null");
  const textStyle = JSON.parse(localStorage.getItem("textStyle") ?? "null");
  const selectedGreenFilter = JSON.parse(localStorage.getItem("selectedGreenFilter") ?? "null");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const selectedQuestionRef = useRef<Question | undefined>(undefined);

  const [videoBase64, setVideoBase64] = useState<Blob[] | null>(null);
  const [recording, setRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [countDown, setCountdown] = useState(0);
  const [timerIntervalId, setTimerIntervalId] = useState<number | null>(null);


  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
    
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const [createdVideoPath, setCreatedVideoPath] = useState(null);
  const [cameraLoading, setCameraLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [lostConnexion, setLostConnexion] = useState<boolean | null>(null);
  const [isSavingVideo, setIsSavingVideo] = useState(false);

  const refVideoRecord = useRef<HTMLVideoElement | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const currentQuestionIdRef = useRef<string | undefined>(undefined);
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
    sessionStorage.removeItem('hasReloaded');
    const selectedQuestions = JSON.parse(localStorage.getItem("selectedQuestions") ?? "null");
    const questionOrder = JSON.parse(localStorage.getItem("questionOrder") ?? "null");

    if (selectedQuestions) {
      if (questionOrder) {
        const orderedQuestions = questionOrder.map(order => selectedQuestions.find(q => q.id === order.id));
        setQuestions(orderedQuestions);
      } else {
        setQuestions(selectedQuestions);
      }
    }
  }, []);

  useEffect(() => {
    if (!mediaStream && !showIntro && !lostConnexion) {
      initializeCamera();
    }
  }, [mediaStream, showIntro, lostConnexion]);

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

  // const handleNewGreenFilter = () => {
  //     setModalAddOpen(true);
  // };

  const initializeCamera = async () => {
    try {
      setCameraLoading(true);
      const stream = await navigator.mediaDevices
        .getUserMedia({
          video: {
            facingMode: "portrait",
            width: { ideal: 640 }, 
            height: { ideal: 1136 }, 
          },
          audio: true,
        })
        .then((stream) => (videoRef.current!.srcObject = stream));
      setMediaStream(stream);
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          const chunks = videoBase64 ? [...videoBase64, e.data] : [e.data];
          setVideoBase64(chunks);
        }
      };

      if (selectedGreenFilter) {
        handleApplyBackground(selectedGreenFilter);
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
    if (!recording) {
      try {
        dispatch(changeStatus("loading"));
        await startCountdown();
        setCountdown(0);
  
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  
        const stream = isFilterApplied
          ? canvasRef.current?.captureStream()
          : await navigator.mediaDevices.getUserMedia({
              video: {
                facingMode: "portrait",
                width: { ideal: 640 },
                height: { ideal: 1136 },
              },
            });
  
        if (!stream) throw new Error("Échec de la capture du flux vidéo");
  
        audioStream.getTracks().forEach((track) => stream.addTrack(track));
  
        if (refVideoRecord.current) {
          refVideoRecord.current.srcObject = stream;
        }
  
        setMediaStream(stream);
  
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);
  
        const chunks: Blob[] = [];
  
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunks.push(e.data);
          }
        };
  
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: "video/webm" });
          setVideoBase64([blob]);
          stream.getTracks().forEach((track) => track.stop());
          setRecording(false);
          setTimer(0);
          if (timerIntervalId !== null) {
            clearInterval(timerIntervalId);
          }
          dispatch(changeStatus(""));
        };
  
        recorder.start();
        setRecording(true);
  
        const intervalId = setInterval(() => {
          setTimer((prevTimer) => prevTimer + 1);
        }, 1000) as unknown as number;
        setTimerIntervalId(intervalId);
      } catch (error) {
        console.error("Erreur lors de l'accès à la caméra : ", error);
        navigate("/malfunction");
      }
    } else {
      if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
        if (timerIntervalId !== null) {
          clearInterval(timerIntervalId);
        }
      }
    }
  };

  const saveVideoToDatabase = async (
    videoFile,
    questionId,
    selectedQuestion,
    token
  ) => {

    setIsSavingVideo(true);

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
            animation: localStorage.getItem("selectedAnimation")
          };
        } else {
          values = {
            token,
            video: videoFile,
            questionId: questionId,
            themeId: selectedTheme.id,
            musicId: selectedMusic.id,
            fontSize: textStyle.fontSize,
            fontColor: textStyle.textColor,
            fontFamily: textStyle.fontFamily,
            animation: localStorage.getItem("selectedAnimation")
          };
        }
  
        if (selectedQuestion.updateState) {
          res = await dispatch(updateVideoProcess(values));
        } else {
          res = await dispatch(createVideoProcess(values));
        }
  
        if (res.meta.requestStatus === "fulfilled") {
          success = true;
          setCreatedVideoPath(res.payload.video);
          dispatch(changeStatus(""));
  
          if (canvasRef.current) {
            const context = canvasRef.current.getContext("2d");
            if (context) {
              context.clearRect(
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height
              );              
            }
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
      setLostConnexion(true);
      return false;
    }

    setIsSavingVideo(false);
    return true;
  };

  const handleNextQuestion = async () => {

    if (videoBase64 && !createdVideoPath) {
      const questionId = currentQuestionIdRef.current;
      const selectedQuestion = selectedQuestionRef.current;
  
      const videoFile = new File([...videoBase64], `video-${user.id}.mp4`, {
        type: "video/mp4",
      });
  
      const success = await saveVideoToDatabase(
        videoFile,
        questionId,
        selectedQuestion,
        token
      );

      if (!success) {
        return; 
      }

    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setVideoBase64(null);
      setCreatedVideoPath(null);
      setRecording(false);
      setMediaStream(null);
      setShowIntro(true);
      setLostConnexion(null);
    } else {
      localStorage.removeItem("selectedQuestions");
      navigate("/review");      
    }
  };

  const handleRedoRecording = () => {
    setIsSavingVideo(false);
    setLostConnexion(null);
    setVideoBase64(null);
    setCreatedVideoPath(null);
    setTimer(0);
    if (timerIntervalId !== null) {
      clearInterval(timerIntervalId);
    }
    setMediaStream(null);
  };

  const resetLostConnexion = () => {
    setIsSavingVideo(false);
    setLostConnexion(null);
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

  let backgroundImage: any;

  const handleApplyBackground = async (filter: any) => {
    if (!filter) return;
  
    const canvas = canvasRef.current;
    const video = videoRef.current;
  
    if (!canvas || !video) {
      console.error("canvasRef or videoRef is not defined.");
      return;
    }
  
    backgroundImage = new Image();
    backgroundImage.crossOrigin = "anonymous";
    backgroundImage.src = `${BASE_URL}/uploads/greenFilters/${filter.image}`;
  
    const checkVideoDimensions = () => {
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
  
      if (videoWidth > 0 && videoHeight > 0) {
        canvas.width = videoWidth;
        canvas.height = videoHeight;
  
        selfieSegmentation.setOptions({
          modelSelection: 0,
          selfieMode: false
        });
  
        selfieSegmentation.onResults(onResults);
        sendToMediaPipe();
        setIsFilterApplied(true);
      } else {
        setTimeout(checkVideoDimensions, 100);
      }
    };
  
    checkVideoDimensions();
  };

  const onResults = (results: any) => {
    if (!canvasRef.current || !videoRef.current) return;
  
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
  
    contextRef.current = ctx;
  
    contextRef.current.save();
    contextRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
  
    const videoWidth = videoRef.current.videoWidth;
    const videoHeight = videoRef.current.videoHeight;
  
    const canvasWidth = canvasRef.current.width;
    const canvasHeight = canvasRef.current.height;
  
    const wRatio = canvasWidth / videoWidth;
    const hRatio = canvasHeight / videoHeight;
    const ratio = Math.max(wRatio, hRatio);
  
    const newWidth = videoWidth * ratio;
    const newHeight = videoHeight * ratio;
    const offsetX = (canvasWidth - newWidth) / 2;
    const offsetY = (canvasHeight - newHeight) / 2;
  
    contextRef.current.drawImage(
      results.segmentationMask,
      offsetX,
      offsetY,
      newWidth,
      newHeight
    );
  
    contextRef.current.globalCompositeOperation = "source-out";
  
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
  
    contextRef.current.globalCompositeOperation = "destination-atop";
    contextRef.current.drawImage(
      results.image,
      offsetX,
      offsetY,
      newWidth,
      newHeight
    );
  
    contextRef.current.restore();
  };
  
  async function sendToMediaPipe() {
    const video = videoRef.current;
  
    if (!selfieSegmentation || !video || !video.videoWidth) {
      requestAnimationFrame(sendToMediaPipe);
      return;
    }
  
    await selfieSegmentation.send({ image: video });
    requestAnimationFrame(sendToMediaPipe);
  }

return showIntro ? (
    <div>
      {showIntro && questions.length > 0 && (
        <IntroQuestion
          question={questions[currentQuestionIndex]}
          textStyle={textStyle}
          selectedTheme={selectedTheme}
          setShowIntro={setShowIntro}
        />
      )}
    </div>
    ) : lostConnexion ? (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-red-500 font-bold">
          Échec de la sauvegarde du clip après plusieurs tentatives.
        </p>
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          onClick={resetLostConnexion}
        >
          Réessayer l'enregistrement
        </button>
      </div>
  ) : (
    <div className="flex flex-col justify-center min-h-[60%] h-fit tall:h-[90%] w-fit min-w-[60%] tall:w-[90%] space-y-8 tall:space-y-8 p-10 dark:bg-dark_bg_2 rounded-xl">
      <div className="text-center dark:text-dark_text_1">
        <div className="mt-6 text-xl">
          <p>
            C'est le moment de <span className="text-blue-400">filmer</span> ta
            séquence.
          </p>
        </div>
        {currentQuestionIndex < questions.length && (
          <h2 className="mt-6 text-4xl font-bold">
            {questions[currentQuestionIndex].title}
          </h2>
        )}
      </div>

      <div className="dark:text-dark_text_1">
        {cameraLoading ? (
          <div className="flex items-center justify-center h-screen w-screen fixed top-0 left-0 bg-black bg-opacity-75">
            <div className="text-center">
              <PulseLoader color="#808080" size={16} />
            </div>
          </div>
        ) : null}

        <div className="relative w-full md:w-[60%] tall:w-full h-96 tall:h-[68rem] mx-auto flex items-center justify-center">
          {videoBase64 && (
            <video
              src={URL.createObjectURL(new Blob(videoBase64, { type: "video/webm" }))}
              controls
              disablePictureInPicture
              controlsList="nodownload"
              preload="true"
              className="w-full h-full object-contain tall:object-cover mirror"
              autoPlay
            />
          )}

          {!recording && timer > 0 && (
            <div className="countdown-overlay">
              {timer}
              <p className="text-sm mt-3 text-center text-white">
                Souris et regarde la caméra 😉 !
              </p>
            </div>
          )}

          {!videoBase64 && (
            <>
              <video
                ref={videoRef}
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
          {videoBase64 ? (
            <button
              onClick={handleRedoRecording}
              className={`text-xl bg-green_2 text-white px-4 py-2 rounded-lg hover:bg-green_1 ${
                status === "loading" ? "opacity-50 pointer-events-none" : ""
              }`}
              disabled={status === "loading"}
            >
              Recommencer
            </button>
          ) : (
            <button
              onClick={toggleRecording}
              className={`text-xl ${
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
        </div>
      </div>

      <button
        className={`text-xl w-full flex justify-center bg-blue_3 text-gray-100 p-4 rounded-full tracking-wide font-semibold focus:outline-none hover:bg-blue-4 shadow-lg cursor-pointer transition ease-in duration-300 ${
          !videoBase64 || status === "loading" || isSavingVideo
            ? "opacity-50 pointer-events-none"
            : ""
        }`}
        onClick={handleNextQuestion}
        disabled={!videoBase64 || status === "loading" || isSavingVideo}
        style={{ marginTop: 20 }}
      >
        {isSavingVideo ? (
          <div className="flex items-center justify-center">
            <PulseLoader color="#fff" size={16} />
            <span className="ml-2">Sauvegarde en cours</span>
          </div>
        ) : status === "loading" ? (
          <PulseLoader color="#fff" size={16} />
        ) : (
          "Continuer"
        )}
      </button>
    </div>
  );
}