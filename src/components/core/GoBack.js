import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";

const GoBack = ({ itemsToRemove = [], to }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    itemsToRemove.forEach((item) => {
      localStorage.removeItem(item);
    });

    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="fixed top-4 left-4 z-50">
      <button
        className="text-xl flex items-center hover:text-blue-700 focus:outline-none text-xl font-bold p-2 blinking"
        onClick={handleBack}
      >
        <FontAwesomeIcon icon={faArrowCircleLeft} className="mr-2" />
        Retour
      </button>
    </div>
  );
};

export default GoBack;
