import React, { useEffect } from "react";
import Questions from "../../components/cv-video/Questions";
import GoBack from "../../components/core/GoBack";
import Logout from "../../components/core/Logout";

export default function QuestionScreen(): React.JSX.Element {

  useEffect(() => {
    const isTrainExam = localStorage.getItem('isTrainExam');
    const beginnerInProgress = localStorage.getItem('beginnerInProgress');
    const intermediateInProgress = localStorage.getItem('intermediateInProgress');
    const expertInProgress = localStorage.getItem('expertInProgress');

    if (isTrainExam === 'true') {
      localStorage.removeItem('isTrainExam');
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
          <Questions />
        </div>
      </div>
    </div>
  );
}
