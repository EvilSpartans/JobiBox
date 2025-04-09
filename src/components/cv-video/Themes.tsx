import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useDispatch, useSelector } from "react-redux";
import {AppDispatch, RootState} from '../../store/Store';
import PulseLoader from "react-spinners/PulseLoader";
import { useNavigate } from "react-router-dom";
import {getThemes} from '../../services/theme.service';
import { Theme } from "../../models/Theme";

export default function Themes(): React.JSX.Element {
  
  const user = useSelector((state: RootState) => state.user.user);
  const { token } = user;
  const BASE_URL = process.env.REACT_APP_THEME_BASE_URL;
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.theme.status);
  const themes = useSelector(
    (state: RootState) => state.theme.themes as Theme[],
  );
  const [selectedThemeIndex, setSelectedThemeIndex] = useState(0);
  const [selectedAnimation, setSelectedAnimation] = useState("");

  const sliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 3,
  };

  const animations = [
    { label: "0", value: "" },
    { label: "1", value: "fade" },
    { label: "2", value: "swipe" },
    { label: "3", value: "rotate" },
    { label: "4", value: "slide" }
  ];

  const navigate = useNavigate();

  const fetchThemes = async () => {
    await dispatch(getThemes(token));
  };

  const handleAnimationChange = (animation: string) => {
    setSelectedAnimation(animation);
    const container = document.getElementById("animationContainer");
    if (container) {
      container.classList.remove("fadeIn", "swipe", "rotate", "slide");
      if (animation !== "none") {
        void container.offsetWidth; 
        container.classList.add(animation);
      }
    }
  };

  useEffect(() => {
    const existingSelectedTheme = localStorage.getItem("selectedTheme");
    if (existingSelectedTheme) {
      navigate("/textStyles");
    } else {
      fetchThemes();
    }
  }, [dispatch, token]);

  useEffect(() => {
    setSelectedThemeIndex(0);
  }, []);

  const handleContinueClick = () => {
    const selectedTheme = themes[selectedThemeIndex];
    if (selectedTheme) {
      localStorage.setItem("selectedTheme", JSON.stringify(selectedTheme));
      localStorage.setItem("selectedAnimation", selectedAnimation);
    }
    navigate("/textStyles");
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
      {/*Heading*/}
      <div className="text-center dark:text-dark_text_1">
        <h2 className="mt-6 text-4xl font-bold">Liste des thèmes</h2>
        <p className="mt-6 text-xl">
        Tu as sélectionné tes questions, tu peux maintenant <span className="text-blue-400">choisir un fond</span> de couleur (ou Template) sur lequel elles seront notées. Tu peux aussi sélectionner une <span className="text-blue-400">animation</span> qui servira de transition entre les séquences.
        </p>
      </div>
      <div className="dark:text-dark_text_1">
        <div className="mb-8">
          {themes && themes[selectedThemeIndex] && (
            <div className="relative mb-4" id="animationContainer">
              <img
                src={`${BASE_URL}/${themes[selectedThemeIndex].image}`}
                alt={themes[selectedThemeIndex].title}
                className="rounded-lg mx-auto"
                style={{ height: '568px', width: '320px' }}
              />
              <p 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xl whitespace-nowrap"
                style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)' }}>
                  Tes questions apparaîtront ici
              </p>
              <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2 bg-gray-800 bg-opacity-70 p-4 rounded-lg">
              <p className="text-white mb-2 text-center" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)' }}>Choisi une animation :</p>
                {animations.map((animation) => (
                  <label key={animation.value} className="mr-2 text-white">
                    <input
                      type="radio"
                      name="animation"
                      value={animation.value}
                      checked={selectedAnimation === animation.value}
                      onChange={() => handleAnimationChange(animation.value)}
                    /> {animation.label}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        <Slider {...sliderSettings}>
          {themes && themes.map((theme, index) => (
            <div
              key={index}
              className={`relative rounded-lg cursor-pointer mb-2 mx-2 ${
                selectedThemeIndex === index ? "theme-selected" : ""
              }`}
              onClick={() => setSelectedThemeIndex(index)}
            >
              <img
                src={`${BASE_URL}/${theme.image}`}
                alt={theme.title}
                className="w-full h-32 tall:h-56 object-cover"
              />
              {selectedThemeIndex === index && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                  <p className="text-blue-500 text-4xl">&hearts;</p>
                </div>
              )}
            </div>
          ))}
        </Slider>
      </div>
      <button
        className="text-xl w-full flex justify-center bg-blue_3 text-gray-100 p-4 rounded-full tracking-wide
font-semibold focus:outline-none hover:bg-blue_4 shadow-lg cursor-pointer transition ease-in duration-300
"
        onClick={handleContinueClick}
      >
        Continuer
      </button>
    </div>
  );
}
