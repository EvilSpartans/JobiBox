import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faRedo, faTrash, faCut } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import {
  getVideoProcesses,
  changeStatus,
  deleteVideoProcess,
  compileVideoProcess,
  updateVideoProcess,
} from "../../store/slices/videoProcessSlice";
import { useDispatch, useSelector } from "react-redux";
import { PulseLoader } from "react-spinners";
import Tuto from "../core/Tuto";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

export default function Clip() {
  
  const BASE_URL = process.env.REACT_APP_VP_BASE_URL;
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const { token } = user;
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.videoProcess);

  const [questions, setQuestions] = useState([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null);
  const [showModalOpen, setShowModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [trimModalOpen, setTrimModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [endValue, setEndValue] = useState(100);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isSliderMoved, setIsSliderMoved] = useState(false);
  const videoRef = useRef(null);

  const fetchQuestions = async () => {
    try {

      dispatch(changeStatus("loading"));
      const response = await dispatch(getVideoProcesses(token));
      const payload = response.payload;
      const filteredQuestions = payload.filter(question => question.type !== "TrainExam");
      setQuestions(filteredQuestions);
  
      if (filteredQuestions && filteredQuestions.length === 0) {
        navigate("/questions");
      }
  
    } catch (error) {
      console.error("Erreur lors de la récupération des questions :", error);
    } finally {
      dispatch(changeStatus(""));
    }
  };

  useEffect(() => {
    const videoId = localStorage.getItem("videoId");
    const removeCompiledVideo = async () => {
      try {
        await dispatch(
          deleteVideoProcess({
            token: token,
            id: videoId,
          })
        );
      } catch (error) {
        console.error("Error :", error);
      } finally {
        localStorage.removeItem("videoId")
      }
    };
    
    if (videoId != null) {
      removeCompiledVideo()
    }
  }, [dispatch, token]);

  useEffect(() => {
    fetchQuestions();
  }, [dispatch, token]);

  const openShowModal = (index) => {
    setSelectedQuestionIndex(index);
    setShowModalOpen(true);
  };

  const closeShowModal = () => {
    setSelectedQuestionIndex(null);
    setShowModalOpen(false);
  };

  const openEditModal = (index) => {
    setSelectedQuestionIndex(index);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedQuestionIndex(null);
    setEditModalOpen(false);
  };

  const openTrimModal = (index) => {
    setSelectedQuestionIndex(index);
    setTrimModalOpen(true);
  };

  const closeTrimModal = () => {
    setSelectedQuestionIndex(null);
    setTrimModalOpen(false);
  };

  const openConfirmationModal = (index) => {
    setSelectedQuestionIndex(index);
    setIsConfirmationModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setSelectedQuestionIndex(null);
    setIsConfirmationModalOpen(false);
  };

  const handleAdd = () => {
    navigate("/questions");
  };

  const handleSliderChange = (value) => {
    const minEndValue = 3;
    const newEndValue = Math.max(value, minEndValue);
    setEndValue(newEndValue);
    setIsSliderMoved(true);
  
    if (videoRef.current && !videoRef.current.paused) {
      videoRef.current.currentTime = newEndValue;
      videoRef.current.play();
    }
  };

  const handleTrim = async (index) => {
    closeTrimModal();
  
    let res;
    try {
      dispatch(changeStatus("loading"));
      const values = {
        token,
        video: null,
        startValue: 0,
        endValue,
        id: questions[index].id,
      };
      res = await dispatch(updateVideoProcess(values));
      fetchQuestions();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du clip :", error);
    } finally {
      if (res.meta.requestStatus === "fulfilled") {
        dispatch(changeStatus(""));
      }
    }
  }

  const handleEdit = async (index) => {
    closeEditModal();

    const selectedQuestion = {
      id: questions[index].id,
      title: questions[index].questionTitle,
      updateState: true
    };
    localStorage.setItem("selectedQuestions", JSON.stringify([selectedQuestion]));
    localStorage.setItem("questionOrder", null);
    navigate("/record");
  };

  const handleDelete = async (index) => {
    closeConfirmationModal();
    try {
      await dispatch(
        deleteVideoProcess({
          token: token,
          id: questions[index].id,
        })
      );
      if (questions.length === 1) {
        navigate("/questions");
      } else {
        fetchQuestions();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la question :", error);
    } finally {
    }
  };

  const assembleAndStoreVideo = async () => {
    let res;
    try {
      dispatch(changeStatus("loading"));
      const values = { token, type: "CvVideo" };
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
        navigate("/post");
        dispatch(changeStatus(""));
      }
    }
  };

  return (
    <div className="flex flex-col justify-center min-h-[60%] h-fit tall:h-[90%] w-fit min-w-[60%] tall:w-[90%] space-y-8 tall:space-y-16 p-10 dark:bg-dark_bg_2 rounded-xl">
      {/*Heading*/}
      <div className="text-center dark:text-dark_text_1">
        <h2 className="mt-6 text-4xl font-bold">Tableau de bord</h2>
        <p className="mt-6 text-xl">Passe en <span className="text-blue-400">revue</span> tes différents clips.</p>
      </div>
      <div className="dark:text-dark_text_1">

        {status !== "loading" &&
          <div className="mb-2 flex items-center justify-center">
            <div className="mb-4">
              <button
                onClick={handleAdd}
                className="text-xl addButton bg-gray-200 hover-bg-gray-300 text-gray-500 font-semibold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
              >
                + Ajouter une question
              </button>
            </div>
          </div>
        }

        {status === "loading" && (
          <div className="text-center mt-8">
            <PulseLoader color="#fff" size={16} />
          </div>
        )}

        <div className="max-h-56 tall:max-h-96 overflow-y-auto">
        {status !== "loading" && questions && questions.length > 0 &&
          questions.map((question, index) => (
            <div key={index} className="mb-3 flex items-center allIcons">
              <span className="flex-grow text-xl">{question.questionTitle}</span>
              <button
                onClick={() => openShowModal(index)}
                className="ml-3 showIcon bg-blue-100 hover:bg-blue-200 text-blue-500 font-semibold px-3 py-2 rounded-md mr-2"
              >
                <FontAwesomeIcon icon={faEye} size="lg" />
              </button>
              <button
                onClick={() => openEditModal(index)}
                className="editIcon bg-green-100 hover:bg-green-200 text-green-500 font-semibold px-3 py-2 rounded-md mr-2"
              >
                <FontAwesomeIcon icon={faRedo} size="lg" />
              </button>
              <button
                onClick={() => openTrimModal(index)}
                className="trimIcon bg-yellow-100 hover:bg-yellow-200 text-yellow-500 font-semibold px-3 py-2 rounded-md mr-2"
              >
                <FontAwesomeIcon icon={faCut} size="lg" />
              </button>
              <button
                onClick={() => openConfirmationModal(index)}
                className="deleteIcon bg-red-100 hover:bg-red-200 text-red-500 font-semibold px-3 py-2 rounded-md"
              >
                <FontAwesomeIcon icon={faTrash} size="lg" />
              </button>
            </div>
          ))}
          </div>

        {/* Show */}
        {showModalOpen && selectedQuestionIndex !== null && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              className="absolute inset-0 bg-gray-900 opacity-75"
              onClick={closeShowModal}
            ></div>
            <div className="relative flex items-center justify-center">
              <div
                style={{ height: "80vh" }}
                className="modal-content bg-white p-4 rounded-lg h-screen max-h-screen overflow-hidden"
              >
                <video
                  src={`${BASE_URL}/${questions[selectedQuestionIndex].video}`}
                  controls
                  disablePictureInPicture
                  controlsList="nodownload"
                  autoPlay
                  className="w-full h-full object-cover"
                ></video>
              </div>
            </div>
          </div>
        )}

        {/* Trim */}
        {trimModalOpen && selectedQuestionIndex !== null && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              className="absolute inset-0 bg-gray-900 opacity-75"
              onClick={closeTrimModal}
            ></div>
            <div className="relative flex items-center justify-center">
              <div className="modal-content bg-white p-4 rounded-lg text-center z-50 relative">
                <p className="text-gray-800 text-xl">Raccourcir le clip</p>
                <div
                  style={{ height: "50vh" }}
                  className="modal-content bg-white p-4 rounded-lg h-screen max-h-screen overflow-hidden"
                >
                  <video
                    ref={(ref) => {
                      if (ref) {
                        videoRef.current = ref;
                        ref.currentTime = 0; 
                      }
                    }}
                    onTimeUpdate={(e) => {
                      if (e.target.currentTime >= endValue) {
                        e.target.pause();
                      }
                    }}
                    onLoadedMetadata={(e) => {
                      setVideoDuration(e.target.duration);
                      setEndValue(e.target.duration);
                    }}
                    src={`${BASE_URL}/${questions[selectedQuestionIndex].video}`}
                    autoPlay
                    controls
                    disablePictureInPicture
                    controlsList="nodownload"
                    className="w-full h-full object-cover hide-video-controls"
                  />
                </div>
                <p className="text-gray-500 text-sm">
                  Fin : {endValue}
                </p>
                <Slider
                  min={3} 
                  step={0.1}
                  max={videoDuration}
                  value={endValue}
                  onChange={handleSliderChange}
                />
                <div className="mt-4">
                  <button
                    className={`${
                      isSliderMoved
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    } px-4 py-2 rounded-md mr-2`}
                    onClick={() => handleTrim(selectedQuestionIndex)}
                    disabled={!isSliderMoved}
                  >
                    Valider
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                    onClick={closeTrimModal}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit */}
        {editModalOpen && selectedQuestionIndex !== null && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="modal bg-black bg-opacity-75 w-full h-full absolute"></div>
            <div className="modal-content bg-white w-1/2 p-4 rounded-lg text-center z-50 relative">
              <p className="text-gray-800 text-xl">
                Veux-tu vraiment recommencer cette séquence ?
              </p>
              <div className="mt-4">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
                  onClick={() => handleEdit(selectedQuestionIndex)}
                >
                  Oui
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                  onClick={closeEditModal}
                >
                  Non
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete */}
        {isConfirmationModalOpen && selectedQuestionIndex !== null && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="modal bg-black bg-opacity-75 w-full h-full absolute"></div>
            <div className="modal-content bg-white w-1/2 p-4 rounded-lg text-center z-50 relative">
              <p className="text-gray-800 text-xl">
                Veux-tu vraiment supprimer cette séquence ?
              </p>
              <div className="mt-4">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
                  onClick={() => handleDelete(selectedQuestionIndex)}
                >
                  Oui
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                  onClick={closeConfirmationModal}
                >
                  Non
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
        {status !== "loading" &&
        <button
          className="text-xl w-full flex justify-center bg-blue_3 text-gray-100 p-4 rounded-full tracking-wide
                  font-semibold focus:outline-none hover:bg-blue_4 shadow-lg cursor-pointer transition ease-in duration-300"
          onClick={assembleAndStoreVideo}
        >
          Continuer
        </button>
      }

      <Tuto
        steps={[
          {
            element: ".addButton",
            intro:
              "Si tu as oublié d'aborder un sujet, il est encore possible d'ajouter une question !",
          },
          {
            element: ".allIcons",
            intro: "Tu peux aussi revoir, refaire, scinder ou supprimer une séquence,",
          }
        ]}
        tutorialKey="clipTuto"
      />
    </div>
  );
}
