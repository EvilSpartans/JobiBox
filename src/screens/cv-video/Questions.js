import React, { useEffect } from "react";
import Question from "../../components/cv-video/Question";
import GoBack from "../../components/core/GoBack";
import Logout from "../../components/core/Logout";

export default function Questions() {

  useEffect(() => {
    const isTrainExam = localStorage.getItem('isTrainExam');
    const examenInProgress = localStorage.getItem('examenInProgress');
    const beginnerInProgress = localStorage.getItem('beginnerInProgress');
    const intermediateInProgress = localStorage.getItem('intermediateInProgress');
    const expertInProgress = localStorage.getItem('expertInProgress');

    if (isTrainExam === 'true') {
      localStorage.removeItem('isTrainExam');
    }

    if (examenInProgress === 'true') {
      localStorage.removeItem('examenInProgress');
    }

    if (beginnerInProgress) {
      localStorage.removeItem('beginnerInProgress');
    }

    if (intermediateInProgress) {
      localStorage.removeItem('intermediateInProgress');
    }

    if (expertInProgress) {
      localStorage.removeItem('expertInProgress');
    }
  }, []);

  return (
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
      <Logout />
      <GoBack />
      {/*Container*/}
      <div className="flex w-full mx-auto h-full">
        {/*Login Form */}
        <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
          {/* Container */}
          <Question />
        </div>
      </div>
    </div>
  );
}
