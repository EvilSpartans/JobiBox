import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { changeStatus } from "../../store/slices/videoProcessSlice";
import {
  getVideoProcesses,
  compileVideoProcess,
} from "../../services/videoProcess.service";
import { useDispatch, useSelector } from "react-redux";
import { PulseLoader } from "react-spinners";
import "rc-slider/assets/index.css";
import { AppDispatch, RootState } from "../../store/Store";
import { VideoProcess } from "../../models/VideoProcess";

export default function Clip(): React.JSX.Element  {
  
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);
  const { token } = user;
  const dispatch = useDispatch<AppDispatch>();
  const [questions, setQuestions] = useState<VideoProcess[]>([]);
  const simulationInProgress =
  localStorage.getItem("beginnerInProgress") ||
  localStorage.getItem("intermediateInProgress") ||
  localStorage.getItem("expertInProgress");

  const fetchQuestions = async () => {
    try {
      dispatch(changeStatus("loading"));
      const response = await dispatch(getVideoProcesses(token));
      const payload = response.payload;

      if (Array.isArray(payload)) {
        const filteredQuestions = payload.filter(question => question.type === "TrainExam");
        setQuestions(filteredQuestions);
          
        if (filteredQuestions && filteredQuestions.length === 0) {
          navigate("/questionVideo");
        }
      }
  
    } catch (error) {
      console.error("Erreur lors de la récupération des questions :", error);
    } finally {
      dispatch(changeStatus(""));
    }
  };
  
  useEffect(() => {
    fetchQuestions();
  }, [dispatch, token]);

  useEffect(() => {
    const checkExamenInProgress = async () => {
      if (simulationInProgress) {
        await assembleAndStoreVideo();
      }
    };
    checkExamenInProgress();
  }, []);

  const assembleAndStoreVideo = async () => {
    let res;
    try {
      dispatch(changeStatus("loading"));
      const values = { token, type: "TrainExam" };
      res = await dispatch(compileVideoProcess(values));
    } catch (error) {
      console.error("Erreur lors de la compilation du clip :", error);
    } finally {
      if (res.meta.requestStatus === "fulfilled") {
        if (localStorage.getItem('videoPath')) {
          localStorage.removeItem('videoPath');
        }
        localStorage.setItem("videoPath", res.payload.video);
        localStorage.setItem("videoId", res.payload.id);
        localStorage.setItem("isTrainExam", 'true');

        if (simulationInProgress) {
          navigate("/evaluation");
        } else {
          navigate("/post");          
        }

        dispatch(changeStatus(""));
      }
    }
  };

  return (
    <div className="text-center mt-8">
      <PulseLoader color="#fff" size={16} />
    </div>
  );

}
