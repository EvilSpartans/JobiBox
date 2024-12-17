import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useDispatch, useSelector } from "react-redux";
import PulseLoader from "react-spinners/PulseLoader";
import { useNavigate } from "react-router-dom";
import { getGreenFilters } from "../../store/slices/greenFilterSlice";
import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";

export default function GreenFilter() {
  
  const user = useSelector((state) => state.user.user);
  const { token } = user;
  const BASE_URL = process.env.REACT_APP_WEB_BASE_URL;

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [greenFilters, setGreenFilters] = useState([]);
  const [mediaStream, setMediaStream] = useState(null);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [selectedGreenFilterIndex, setSelectedGreenFilterIndex] = useState(-1);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

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
      navigate("/recordS");
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
            width: { ideal: 320 }, 
            height: { ideal: 568 },
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

  const handleContinueClick = () => {
    const selectedGreenFilter = greenFilters[selectedGreenFilterIndex];
    if (selectedGreenFilter) {
      localStorage.setItem("selectedGreenFilter", JSON.stringify(selectedGreenFilter));
      sessionStorage.removeItem('hasReloaded');
    }
    navigate("/recordS");
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

  let backgroundImage;

  const handleApplyBackground = async (index) => {
    if (index !== null && index >= 0 && greenFilters[index]) {
      if (canvasRef.current && videoRef.current) {
        backgroundImage = new Image();
        backgroundImage.src = `${BASE_URL}/uploads/greenFilters/${greenFilters[index].image}`;
  
        const checkVideoDimensions = () => {
          const videoWidth = videoRef.current.videoWidth;
          const videoHeight = videoRef.current.videoHeight;
  
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

  const onResults = (results) => {
    contextRef.current = canvasRef.current.getContext("2d");
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
      if (!selfieSegmentation || !videoRef.current.videoWidth) {
        requestAnimationFrame(sendToMediaPipe);
      } else {
        await selfieSegmentation.send({ image: videoRef.current });
        requestAnimationFrame(sendToMediaPipe);
      }
  }

  const handleRemoveBackground = () => {
    setIsFilterApplied(false);
    setSelectedGreenFilterIndex(null);
  };

  return (
    <div className="flex flex-col justify-center min-h-[60%] h-fit tall:h-[90%] w-fit min-w-[60%] tall:w-[90%] space-y-8 tall:space-y-16 p-10 dark:bg-dark_bg_2 rounded-xl">
      {/* Heading */}
      <div className="text-center dark:text-dark_text_1">
        <h2 className="mt-6 text-3xl font-bold">Liste des fonds verts</h2>
        <p className="mt-6 text-lg">
          Pour finir, nous te recommandons de sélectionner un <span className="text-blue-400">fond vert</span> parmi la liste suivante. Celui-ci sera appliqué en arrière-plan dans tes séquences.
        </p>
      </div>
      <div className="dark:text-dark_text_1">
        {loading ? (
          <div className="text-center">
            <PulseLoader color="#fff" size={16} />
          </div>
        ) : (
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
        )}

        <Slider {...sliderSettings}>
          {!loading && (
            <div
              className={`addButton relative rounded-lg cursor-pointer mb-2 mx-2 ${selectedGreenFilterIndex === -1 ? "theme-selected" : ""}`}
              onClick={isFilterApplied ? handleRemoveBackground : null}
            >
              <img
                src="assets/images/no-filter.png"
                className="w-full h-32 tall:h-56 object-cover"
              />
              {selectedGreenFilterIndex === -1 && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                  <p className="text-blue-500 text-3xl">&hearts;</p>
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
                  <p className="text-blue-500 text-3xl">&hearts;</p>
                </div>
              )}
            </div>
          ))}
        </Slider>
      </div>
      <button
        className="w-full flex justify-center bg-blue_3 text-gray-100 p-4 rounded-full tracking-wide font-semibold focus:outline-none hover:bg-blue_4 shadow-lg cursor-pointer transition ease-in duration-300"
        onClick={handleContinueClick}
      >
        Continuer
      </button>
    </div>
  );
}
