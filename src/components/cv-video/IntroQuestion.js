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
    
    const outerMostParentDiv = document.createElement("div");
    outerMostParentDiv.style.width = "100%";
    outerMostParentDiv.style.height = "100%";
    outerMostParentDiv.style.display = "flex";
    outerMostParentDiv.style.justifyContent = "center";
    outerMostParentDiv.style.alignItems = "center";
    
    const outerParentDiv = document.createElement("div");
    outerParentDiv.style.width = "100%";
    outerParentDiv.style.height = "100%";
    outerParentDiv.style.display = "flex";
    outerParentDiv.style.justifyContent = "center";
    outerParentDiv.style.alignItems = "center";
    
    const parentDiv = document.createElement("div");
    parentDiv.style.width = "80%";
    parentDiv.style.height = "80%";
    parentDiv.style.display = "flex";
    parentDiv.style.justifyContent = "center";
    parentDiv.style.alignItems = "center";
    parentDiv.style.position = "relative";
    
    const contentDiv = document.createElement("div");
    contentDiv.style.width = "640px";
    contentDiv.style.height = "1136px";
    contentDiv.style.backgroundImage = `url(${BASE_URL_THEME}/${selectedTheme.image})`;
    contentDiv.style.backgroundSize = "contain";
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
    textDiv.style.maxWidth = "90%"; 
    textDiv.style.maxHeight = "90%";  
    textDiv.style.overflow = "hidden";  
    textDiv.style.padding = "10px"; 
    
    contentDiv.appendChild(textDiv);
    parentDiv.appendChild(contentDiv);
    outerParentDiv.appendChild(parentDiv);
    outerMostParentDiv.appendChild(outerParentDiv);
    introDiv.appendChild(outerMostParentDiv);
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
