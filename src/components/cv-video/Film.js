import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createVideoProcess,
  changeStatus,
  updateVideoProcess,
} from "../../store/slices/videoProcessSlice";
import PulseLoader from "react-spinners/PulseLoader";
import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";
import IntroQuestion from "./IntroQuestion";

export default function Film({ onStartSequence }) {
  const BASE_URL = process.env.REACT_APP_WEB_BASE_URL;

  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const { status, error } = useSelector((state) => state.videoProcess);
  const { token } = user;
  const dispatch = useDispatch();

  const selectedTheme = JSON.parse(localStorage.getItem("selectedTheme"));
  const selectedMusic = JSON.parse(localStorage.getItem("selectedMusic"));
  const textStyle = JSON.parse(localStorage.getItem("textStyle"));
  const selectedGreenFilter = JSON.parse(
    localStorage.getItem("selectedGreenFilter"),
  );

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const selectedQuestionRef = useRef(null);
  const [videoBase64, setVideoBase64] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [recording, setRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [countDown, setCountdown] = useState(0);
  const [timerIntervalId, setTimerIntervalId] = useState(null);
  const videoCameraRef = useRef(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [createdVideoPath, setCreatedVideoPath] = useState(null);
  const [cameraLoading, setCameraLoading] = useState(true);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [lostConnexion, setLostConnexion] = useState(null);
  const [isSavingVideo, setIsSavingVideo] = useState(false);

  const refVideoRecord = useRef();
  const canvasRef = useRef();
  const contextRef = useRef();
  const currentQuestionIdRef = useRef();
  const isKeyPressed = useRef(false);
  const isCountdownActive = useRef(false);
  const selfieSegmentationRef = useRef(null);
  const backgroundImageRef = useRef(null);
  const animFrameRef = useRef(null);
  const lastFrameTimeRef = useRef(0);
  const isProcessingRef = useRef(false);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("keyup", handleKeyRelease);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("keyup", handleKeyRelease);
    };
  }, [recording, videoBase64, countDown, isFilterApplied, showIntro, mediaStream]);

  useEffect(() => {
    if (selectedGreenFilter) {
      selfieSegmentationRef.current = new SelfieSegmentation({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
      });
    }
  }, []);

  useEffect(() => {
    if (videoBase64) {
      const url = URL.createObjectURL(videoBase64);
      setVideoUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setVideoUrl(null);
    }
  }, [videoBase64]);

  useEffect(() => {
    currentQuestionIdRef.current = questions[currentQuestionIndex]?.id;
    selectedQuestionRef.current = questions[currentQuestionIndex];
  }, [currentQuestionIndex, questions]);

  useEffect(() => {
    sessionStorage.removeItem("hasReloaded");
    const selectedQuestions = JSON.parse(
      localStorage.getItem("selectedQuestions"),
    );
    const questionOrder = JSON.parse(localStorage.getItem("questionOrder"));

    if (selectedQuestions) {
      if (questionOrder) {
        const orderedQuestions = questionOrder.map((order) =>
          selectedQuestions.find((q) => q.id === order.id),
        );
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

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
      if (selfieSegmentationRef.current) {
        selfieSegmentationRef.current.close?.();
      }
    };
  }, []);

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

  // Boucle de dessin simple (sans MediaPipe) : cover-crop caméra → canvas 640×1088
  function startPassthroughLoop(timestamp) {
    const video = videoCameraRef.current;
    const canvas = canvasRef.current;
    if (video?.videoWidth && canvas) {
      if (timestamp - lastFrameTimeRef.current >= 33) {
        lastFrameTimeRef.current = timestamp;
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        const vw = video.videoWidth;
        const vh = video.videoHeight;
        const cw = canvas.width;
        const ch = canvas.height;
        const ratio = Math.max(cw / vw, ch / vh);
        const offsetX = (cw - vw * ratio) / 2;
        const offsetY = (ch - vh * ratio) / 2;
        ctx.drawImage(video, offsetX, offsetY, vw * ratio, vh * ratio);
      }
    }
    animFrameRef.current = requestAnimationFrame(startPassthroughLoop);
  }

  const initializeCamera = async () => {
    try {
      setCameraLoading(true);

      const videoConstraints = {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { min: 30, ideal: 60 },
      };

      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints,
        audio: true,
      });

      videoCameraRef.current.srcObject = stream;
      setMediaStream(stream);

      if (selectedGreenFilter) {
        handleApplyBackground(selectedGreenFilter);
      } else {
        // Pas de filtre : démarrer la boucle passthrough dès que la vidéo est prête
        const waitAndStart = () => {
          if (videoCameraRef.current?.videoWidth > 0 && canvasRef.current) {
            canvasRef.current.width = 640;
            canvasRef.current.height = 1088;
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
            animFrameRef.current = requestAnimationFrame(startPassthroughLoop);
          } else {
            setTimeout(waitAndStart, 100);
          }
        };
        waitAndStart();
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

        // Toujours enregistrer depuis le canvas (cover-crop 640×1088 garanti)
        const stream = canvasRef.current.captureStream(30);
        mediaStream.getAudioTracks().forEach((track) => stream.addTrack(track));

        const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
          ? "video/webm;codecs=vp9,opus"
          : MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus")
          ? "video/webm;codecs=vp8,opus"
          : "video/webm";
        const recorder = new MediaRecorder(stream, {
          mimeType,
          videoBitsPerSecond: 5_000_000,
          audioBitsPerSecond: 128_000,
        });
        setMediaRecorder(recorder);

        const chunks = [];
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunks.push(e.data);
          }
        };

        recorder.onstop = async () => {
          if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
          const blob = new Blob(chunks, { type: "video/webm" });
          setVideoBase64(blob);
          stream.getTracks().forEach((track) => track.stop());
          setRecording(false);
          setTimer(0);
          clearInterval(timerIntervalId);
          dispatch(changeStatus(""));
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
    token,
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
            animation: localStorage.getItem("selectedAnimation"),
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
            animation: localStorage.getItem("selectedAnimation"),
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
            context.clearRect(
              0,
              0,
              canvasRef.current.width,
              canvasRef.current.height,
            );
          }
          break;
        }
      } catch (error) {
        console.error(
          "Erreur lors de la sauvegarde du clip, réessayer...",
          error,
        );
      }

      attempts++;
      if (attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }

    if (!success) {
      console.error(
        "Échec de la sauvegarde du clip après plusieurs tentatives.",
      );
      setLostConnexion(true);
      return false;
    }

    setIsSavingVideo(false);
    return true;
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex === 0 && !showIntro) {
      onStartSequence();
    }

    if (videoBase64 && !createdVideoPath) {
      const questionId = currentQuestionIdRef.current;
      const selectedQuestion = selectedQuestionRef.current;

      const videoFile = new File([videoBase64], `video-${user.id}.mp4`, {
        type: "video/mp4",
      });

      const success = await saveVideoToDatabase(
        videoFile,
        questionId,
        selectedQuestion,
        token,
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
    clearInterval(timerIntervalId);
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
  const handleApplyBackground = async (filter) => {
    if (filter) {
      if (canvasRef.current && videoCameraRef.current) {
        // Stopper la boucle passthrough si elle tourne
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
          animFrameRef.current = null;
        }

        backgroundImageRef.current = new Image();
        backgroundImageRef.current.src = `${BASE_URL}/uploads/greenFilters/${filter.image}`;

        const checkVideoDimensions = () => {
          const videoWidth = videoCameraRef.current.videoWidth;
          const videoHeight = videoCameraRef.current.videoHeight;

          if (videoWidth > 0 && videoHeight > 0) {
            canvasRef.current.width = 640;
            canvasRef.current.height = 1088;

            selfieSegmentationRef.current.setOptions({
              modelSelection: 0,
              selfieMode: false,
              effect: "mask",
            });
            selfieSegmentationRef.current.onResults(onResults);

            sendToMediaPipe();

            setIsFilterApplied(true);
          } else {
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
    isProcessingRef.current = false;
    contextRef.current = canvasRef.current.getContext("2d");
    contextRef.current.imageSmoothingEnabled = true;
    contextRef.current.imageSmoothingQuality = "high";
    contextRef.current.save();
    contextRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height,
    );

    const wRatio = canvasRef.current.width / results.image.width;
    const hRatio = canvasRef.current.height / results.image.height;
    const ratio = Math.max(wRatio, hRatio);
    const offsetX = (canvasRef.current.width - results.image.width * ratio) / 2;
    const offsetY =
      (canvasRef.current.height - results.image.height * ratio) / 2;

    contextRef.current.drawImage(
      results.segmentationMask,
      offsetX,
      offsetY,
      results.image.width * ratio,
      results.image.height * ratio,
    );

    contextRef.current.globalCompositeOperation = "source-out";

    // Inverser l'image sur l'axe X
    contextRef.current.save();
    contextRef.current.scale(-1, 1);
    contextRef.current.drawImage(
      backgroundImageRef.current,
      -canvasRef.current.width,
      0,
      canvasRef.current.width,
      canvasRef.current.height,
    );
    contextRef.current.restore();

    contextRef.current.globalCompositeOperation = "destination-atop";
    contextRef.current.drawImage(
      results.image,
      offsetX,
      offsetY,
      results.image.width * ratio,
      results.image.height * ratio,
    );

    contextRef.current.restore();
  };

  function sendToMediaPipe(timestamp) {
    if (
      selfieSegmentationRef.current &&
      videoCameraRef.current?.videoWidth &&
      !isProcessingRef.current &&
      timestamp - lastFrameTimeRef.current >= 33
    ) {
      lastFrameTimeRef.current = timestamp;
      isProcessingRef.current = true;
      selfieSegmentationRef.current.send({ image: videoCameraRef.current });
    }
    animFrameRef.current = requestAnimationFrame(sendToMediaPipe);
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
          {videoUrl && (
            <video
              src={videoUrl}
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
                ref={videoCameraRef}
                className="hidden"
                autoPlay
                disablePictureInPicture
                controlsList="nodownload"
                muted
              />

              <canvas
                ref={canvasRef}
                className={`w-full h-full object-contain tall:object-cover ${
                  videoBase64 ? "hidden" : ""
                }`}
                style={{
                  position: "absolute",
                  transform: "scaleX(-1)",
                }}
              />
              <video
                ref={refVideoRecord}
                className="hidden"
                style={{ position: "absolute", transform: "scaleX(-1)" }}
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

        {videoBase64 && (
          <div className="mt-4 flex items-center justify-center">
            <button
              onClick={handleRedoRecording}
              className={`text-xl bg-green_2 text-white px-4 py-2 rounded-lg hover:bg-green_1 ${
                status === "loading" ? "opacity-50 pointer-events-none" : ""
              }`}
              disabled={status === "loading"}
            >
              Recommencer
            </button>
          </div>
        )}

        {/*
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
        */}
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
        ) : !videoBase64 ? (
          "Cliquez sur le bouton de votre droite pour démarrer"
        ) : (
          "Continuer"
        )}
      </button>
    </div>
  );
}
