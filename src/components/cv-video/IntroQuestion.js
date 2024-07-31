import React, { useEffect } from 'react';

const IntroQuestion = ({ question, textStyle, selectedTheme, setShowIntro }) => {
  const BASE_URL_THEME = process.env.REACT_APP_THEME_BASE_URL;

  useEffect(() => {
    const introDiv = document.createElement("div");
    introDiv.style.position = "fixed";
    introDiv.style.top = "0";
    introDiv.style.left = "0";
    introDiv.style.width = "100vw";
    introDiv.style.height = "100vh";
    introDiv.style.display = "flex";
    introDiv.style.justifyContent = "center";
    introDiv.style.alignItems = "center";
    introDiv.style.zIndex = "1000";
    introDiv.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    
    const contentDiv = document.createElement("div");
    contentDiv.style.width = "100%";
    contentDiv.style.height = "100%";
    contentDiv.style.backgroundImage = `url(${BASE_URL_THEME}/${selectedTheme.image})`;
    contentDiv.style.backgroundSize = "cover";
    contentDiv.style.backgroundRepeat = "no-repeat";
    contentDiv.style.backgroundPosition = "center";
    contentDiv.style.display = "flex";
    contentDiv.style.justifyContent = "center";
    contentDiv.style.alignItems = "center";
    contentDiv.style.color = textStyle.textColor;
    contentDiv.style.fontSize = `${textStyle.fontSize}px`;
    contentDiv.style.fontFamily = textStyle.fontFamily;
    contentDiv.style.overflow = "hidden";
    
    const textDiv = document.createElement("div");
    textDiv.innerText = question.title;
    textDiv.style.textAlign = "center";
    textDiv.style.overflow = "hidden";
    
    contentDiv.appendChild(textDiv);
    introDiv.appendChild(contentDiv);
    document.body.appendChild(introDiv);

    const timer = setTimeout(() => {
      document.body.removeChild(introDiv);
      setShowIntro(false);
    }, 1600);

    return () => {
      clearTimeout(timer);
      if (document.body.contains(introDiv)) {
        document.body.removeChild(introDiv);
      }
    };
  }, [question, textStyle, selectedTheme, setShowIntro]);

  return null;
};

export default IntroQuestion;
