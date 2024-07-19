import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Wheel from '@uiw/react-color-wheel';

export default function TextStyle() {
  
  const BASE_URL = process.env.REACT_APP_THEME_BASE_URL;
  const selectedTheme = JSON.parse(localStorage.getItem("selectedTheme"));
  const user = useSelector((state) => state.user.user);
  const [textStyle, setTextStyle] = useState({
    fontSize: 20,
    textColor: "#ffffff",
    fontFamily: "Roboto", 
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = user;

  useEffect(() => {
    const existingTextStyle = localStorage.getItem("textStyle");
    if (existingTextStyle) {
      navigate("/musics");
    }
  }, [dispatch, token]);

  const handleContinueClick = () => {
    if (localStorage.getItem("textStyle")) {
      localStorage.removeItem("textStyle");
    }
    localStorage.setItem("textStyle", JSON.stringify(textStyle));
    navigate("/musics");
  };

  const handleFontSizeChange = (value) => {
    setTextStyle((prev) => ({ ...prev, fontSize: value }));
  };

  const handleTextColorChange = (color) => {
    setTextStyle((prev) => ({ ...prev, textColor: color.hex }));
  };

  const handleFontFamilyChange = (fontFamily) => {
    setTextStyle((prev) => ({ ...prev, fontFamily }));
  };

  return (
    <div className="flex flex-col justify-center min-h-[60%] h-fit tall:h-[90%] w-fit min-w-[60%] tall:w-[90%] space-y-8 tall:space-y-16 p-10 dark:bg-dark_bg_2 rounded-xl">
      <div className="text-center dark:text-dark_text_1">
        <h2 className="mt-6 text-3xl font-bold">Style des questions</h2>
        <p className="mt-6 text-lg">
          Tu peux <span className="text-blue-400">ajuster la taille</span> de tes questions en faisant glisser le curseur, Tu as aussi la possibilité d'en définir la <span className="text-blue-400">couleur</span> et la <span className="text-blue-400">police</span>.
        </p>
      </div>
      <div className="dark:text-dark_text_1">
        <div className="mb-8">
          {selectedTheme && (
            <div className="relative mb-4">
              <img
                src={`${BASE_URL}/${selectedTheme.image}`}
                alt={selectedTheme.title}
                className="rounded-lg mx-auto"
                style={{ height: '568px', width: '320px' }}
              />
              <p
                style={{
                  fontSize: `${textStyle.fontSize}px`,
                  color: textStyle.textColor,
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                  fontFamily: textStyle.fontFamily, // Application de la police
                }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-sm whitespace-nowrap"
              >
                Vos questions apparaîtront ici
              </p>
              <div className="absolute bottom-48 left-1/2 transform -translate-x-1/2 bg-gray-800 bg-opacity-70 p-4 rounded-lg">
                <label className="mr-2 text-white">
                  <input
                    type="radio"
                    name="fontFamily"
                    value="Roboto"
                    checked={textStyle.fontFamily === "Roboto"}
                    onChange={() => handleFontFamilyChange("Roboto")}
                  /> Roboto
                </label>
                <label className="mr-2 text-white">
                  <input
                    type="radio"
                    name="fontFamily"
                    value="Impact"
                    checked={textStyle.fontFamily === "Impact"}
                    onChange={() => handleFontFamilyChange("Impact")}
                  /> Impact
                </label>
                <label className="text-white">
                  <input
                    type="radio"
                    name="fontFamily"
                    value="Cursive"
                    checked={textStyle.fontFamily === "Cursive"}
                    onChange={() => handleFontFamilyChange("Cursive")}
                  /> Cursive
                </label>
              </div>
            </div>
          )}
          <div className="mt-8 text-center">
            <Slider
              min={14}
              max={25}
              step={1}
              value={textStyle.fontSize}
              onChange={handleFontSizeChange}
            />
          </div>
          <div className="mt-8 flex items-center justify-center">
            <Wheel
              color={textStyle.textColor}
              onChange={handleTextColorChange}
            />
          </div>
        </div>
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
