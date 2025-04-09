import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useDispatch, useSelector } from "react-redux";
import PulseLoader from "react-spinners/PulseLoader";
import { useNavigate } from "react-router-dom";
import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";
import { AppDispatch, RootState } from "../../store/Store";
import { getGreenFilters } from "../../services/greenFilter.service";
import { GreenFilter } from "../../models/GreenFilter";

export default function GreenFilters(): React.JSX.Element {
  
  const user = useSelector((state: RootState) => state.user.user);
  const { token } = user;
  const BASE_URL = process.env.REACT_APP_WEB_BASE_URL;

  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.theme.status);
  const [loading, setLoading] = useState(true);
  const greenFilters = useSelector(
    (state: RootState) => state.greenFilter.greenFilters as GreenFilter[],
  );
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [selectedGreenFilterIndex, setSelectedGreenFilterIndex] = useState<number | null>(-1);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  const sliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 3,
  };

  const navigate = useNavigate();

  useEffect(() => {
    const existingSelectedGreenFilter = localStorage.getItem("selectedGreenFilter");

    if (existingSelectedGreenFilter) {
      navigate("/record");
    } else {
      fetchGreenFilters();
    }

  }, [dispatch, token]);

  useEffect(() => {
    const hasReloaded = sessionStorage.getItem('hasReloaded');

    if (!hasReloaded) {
      sessionStorage.setItem('hasReloaded', 'true');
      initializeCamera();
    } else {
      sessionStorage.removeItem('hasReloaded');
    }
  }, []);

  useEffect(() => {
    if (!mediaStream) {
      initializeCamera();
    }
  }, [mediaStream]);

  const initializeCamera = async () => {
    try {
      setLoading(true);
      const stream = await navigator.mediaDevices
        .getUserMedia({
          video: {
            facingMode: "portrait",
            width: { ideal: 640 }, 
            height: { ideal: 1136 },
          },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      setMediaStream(stream);

    } catch (error) {
      console.error("Erreur lors de l'accès à la caméra : ", error);
      navigate("/malfunction");
    } finally {
      setLoading(false);
    }
  };
  
  const fetchGreenFilters = async () => {
    await dispatch(getGreenFilters(token));
  };

  const handleContinueClick = () => {
    if (selectedGreenFilterIndex === -1) {
      localStorage.removeItem("selectedGreenFilter");
    } else if (
      selectedGreenFilterIndex !== null &&
      selectedGreenFilterIndex >= 0 &&
      selectedGreenFilterIndex < greenFilters.length
    ) {
      const selectedGreenFilter = greenFilters[selectedGreenFilterIndex];
      if (selectedGreenFilter) {
        localStorage.setItem("selectedGreenFilter", JSON.stringify(selectedGreenFilter));
      }
    }
  
    sessionStorage.removeItem('hasReloaded');
    navigate("/record");
  };

  const handleGreenFilterClick = (index) => {
    if (index !== selectedGreenFilterIndex) {
      setSelectedGreenFilterIndex(index);
      handleApplyBackground(index);
    }
  };
  
  // Apply Green Filter
  const selfieSegmentation = new SelfieSegmentation({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
  });

  let backgroundImage: any;

  const handleApplyBackground = async (index) => {
    if (index !== null && index >= 0 && greenFilters[index]) {
      const canvas = canvasRef.current;
    const video = videoRef.current;

      if (canvas && video) {
        backgroundImage = new Image();
        backgroundImage.src = `${BASE_URL}/uploads/greenFilters/${greenFilters[index].image}`;
  
        const checkVideoDimensions = () => {
          const videoWidth = video.videoWidth;
          const videoHeight = video.videoHeight;
  
          if (videoWidth > 0 && videoHeight > 0) {
            canvas.width = videoWidth;
            canvas.height = videoHeight;
  
            selfieSegmentation.setOptions({
              modelSelection: 0,
              selfieMode: false,
            });
            selfieSegmentation.onResults(onResults);
  
            sendToMediaPipe();
  
            setIsFilterApplied(true);
          } else {
            console.error("Video dimensions are not valid. Retrying...");
            setTimeout(checkVideoDimensions, 100);
          }
        };
  
        checkVideoDimensions();
      } else {
        console.error("canvasRef or videoRef is not defined.");
      }
    }
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

  const handleRemoveBackground = () => {
    setIsFilterApplied(false);
    setSelectedGreenFilterIndex(null);
  };

  if (status === 'loading') {
    return (
      <div className="text-center">
      <PulseLoader color="#fff" size={16} />
    </div>
    );
  }

  return (
    <div className="flex flex-col justify-center min-h-[60%] h-fit tall:h-[90%] w-fit min-w-[60%] tall:w-[90%] space-y-8 tall:space-y-16 p-10 dark:bg-dark_bg_2 rounded-xl">
      {/* Heading */}
      <div className="text-center dark:text-dark_text_1">
        <h2 className="mt-6 text-4xl font-bold">Liste des fonds verts</h2>
        <p className="mt-6 text-xl">
          Pour finir, nous te recommandons de sélectionner un <span className="text-blue-400">fond vert</span> parmi la liste suivante. Celui-ci sera appliqué en arrière-plan. N'oublie pas de faire des <span className="text-blue-400">séquences courtes</span> et impactantes (10 à 20 secondes).
        </p>
      </div>
      <div className="dark:text-dark_text_1">
        <div className="mb-8">
          {greenFilters && (
            <div className="relative mb-4 mx-auto" style={{ height: '568px', width: '320px' }}>
              <video
                ref={videoRef}
                className="absolute rounded-lg top-0 left-0 w-full h-full transform scale-x-[-1]"
                style={{ display: isFilterApplied ? 'none' : 'block', objectFit: 'cover' }}
              />
              <canvas
                ref={canvasRef}
                className="rounded-lg mx-auto absolute top-0 left-0 transform scale-x-[-1]"
                style={{ height: '100%', width: '100%', display: isFilterApplied ? 'block' : 'none', objectFit: 'cover' }}
              />
            </div>
          )}
        </div>

        <Slider {...sliderSettings}>
          {!loading && (
            <div
              className={`addButton relative rounded-lg cursor-pointer mb-2 mx-2 ${selectedGreenFilterIndex === -1 ? "theme-selected" : ""}`}
              onClick={isFilterApplied ? handleRemoveBackground : undefined}
            >
              <img
                src="./public/images/no-filter.png"
                className="w-full h-32 tall:h-56 object-cover"
              />
              {selectedGreenFilterIndex === -1 && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                  <p className="text-blue-500 text-4xl">&hearts;</p>
                </div>
              )}
            </div>
          )}
          {greenFilters && greenFilters.map((greenFilter, index) => (
            <div
              key={index}
              className={`relative rounded-lg cursor-pointer mb-2 mx-2 ${
                selectedGreenFilterIndex === index ? "theme-selected" : ""
              }`}
              onClick={() => handleGreenFilterClick(index)}
            >
              <img
                src={`${BASE_URL}/uploads/greenFilters/${greenFilter.image}`}
                alt={greenFilter.title}
                className="w-full h-32 tall:h-56 object-cover"
              />
              {selectedGreenFilterIndex === index && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                  <p className="text-blue-500 text-4xl">&hearts;</p>
                </div>
              )}
            </div>
          ))}
        </Slider>
      </div>
      <button
        className="text-xl w-full flex justify-center bg-blue_3 text-gray-100 p-4 rounded-full tracking-wide font-semibold focus:outline-none hover:bg-blue_4 shadow-lg cursor-pointer transition ease-in duration-300"
        onClick={handleContinueClick}
      >
        Continuer
      </button>
    </div>
  );
}
