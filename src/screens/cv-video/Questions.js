import React, { useEffect } from "react";
import Question from "../../components/cv-video/Question";
import GoBack from "../../components/core/GoBack";
import LogoutBtn from "../../components/core/LogoutBtn";

export default function Questions() {

  useEffect(() => {
    const isTrainExam = localStorage.getItem('isTrainExam');
    const examenInProgress = localStorage.getItem('examenInProgress');

    if (isTrainExam === 'true') {
      localStorage.removeItem('isTrainExam');
    }

    if (examenInProgress === 'true') {
      localStorage.removeItem('examenInProgress');
    }
  }, []);

  return (
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
      <LogoutBtn />
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
