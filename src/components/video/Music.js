import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMusics } from "../../store/features/musicSlice";
import PulseLoader from "react-spinners/PulseLoader";
import ModalMusic from "../modals/ModalMusic";
import { useNavigate } from "react-router-dom";
// import Tuto from "../Tuto";

export default function Music() {
  const user = useSelector((state) => state.user.user);
  const { token } = user;
  const BASE_URL = "https://jobibox.jobissim.com/uploads/musics/";

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [musics, setMusics] = useState([]);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchMusics = async () => {
    try {
      const response = await dispatch(getMusics(token));
      const musicsData = response.payload;
      setMusics(musicsData);
      if (musicsData && musicsData.length > 0) {
        setSelectedMusic(musicsData[0]);
        setSelectedLabel(0);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des musiques :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const existingSelectedMusic = localStorage.getItem("selectedMusic");
    if (existingSelectedMusic) {
      navigate("/record");
    } else {
      fetchMusics();
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (musics && musics.length > 0) {
      handleSelectMusic(musics[0], 0);
    }
  }, [musics]);

  const handleSelectMusic = (music, index) => {
    setSelectedMusic(music);
    setSelectedLabel(index);
    const audioPlayer = document.getElementById("music-player");
    audioPlayer.src = BASE_URL + music.music;
    audioPlayer.load();
    audioPlayer.play();
  };

  const handleNewMusicClick = () => {
    setModalOpen(true);
  };

  const handleContinueClick = () => {
    const selectedMusic = musics[selectedLabel];
    if (selectedMusic) {
      localStorage.setItem("selectedMusic", JSON.stringify(selectedMusic));
    }
    navigate("/record");
  };

  return (
    <div className="flex flex-col justify-center min-h-[60%] h-fit tall:h-[90%] w-fit min-w-[60%] tall:w-[90%] space-y-8 tall:space-y-16 p-10 dark:bg-dark_bg_2 rounded-xl">
      {/*Heading*/}
      <div className="text-center dark:text-dark_text_1">
        <h2 className="mt-6 text-3xl font-bold">Liste des musiques</h2>
        <p className="mt-6 text-base">Tu peux maintenant <span className="text-blue-400">sélectionner une musique</span> qui correspond le plus à ta personnalité.</p>
      </div>
      <div className="dark:text-dark_text_1">
        <div className="audio-player mt-4">
          <audio controls id="music-player" className="w-full">
            <source
              src={
                selectedMusic && selectedMusic.music
                  ? BASE_URL + selectedMusic.music
                  : ""
              }
            />
          </audio>
        </div>

        {loading ? (
          <div className="text-center mt-8">
            <PulseLoader color="#fff" size={16} />
          </div>
        ) : (
          <div
            className="flex flex-wrap mt-6 max-h-[350px] tall:max-h-[34rem]"
            style={{ overflowY: "auto" }}
          >
            {/* New music */}
            {/* <div className=" addButton w-1/3 mb-4 p-2">
                            <label
                                className={`block relative border-2 p-3 rounded-lg hover:cursor-pointer`}
                            >
                                <div className="music-icon">
                                    <img
                                        src="assets/musics/addMusic.webp"
                                        alt="Music Icon"
                                        className="w-12 h-12 mx-auto mb-2"
                                    />
                                </div>
                                <input
                                    type="radio"
                                    name="music-selection"
                                    className="hidden"
                                    onClick={handleNewMusicClick}
                                />
                                <span className="music-title text-xs font-semibold overflow-hidden whitespace-nowrap text-center flex items-center justify-center hover:cursor-pointer">
                                    Ajouter
                                </span>
                            </label>
                        </div> */}
            {/* ------- */}

            {/* Music list */}
            {musics && musics.map((music, index) => (
              <div key={index} className="w-1/3 mb-4 p-2">
                <label
                  className={`block relative border-2 p-3 rounded-lg ${
                    index === selectedLabel
                      ? "theme-selected"
                      : "border-gray-300"
                  } hover:cursor-pointer`}
                >
                  <div className="music-icon">
                    <img
                      src="assets/images/music.png"
                      alt="Music Icon"
                      className="w-12 h-12 mx-auto mb-2"
                    />
                  </div>
                  <input
                    type="radio"
                    name="music-selection"
                    className="hidden"
                    value={music.music}
                    onChange={() => handleSelectMusic(music, index)}
                  />
                  <span className="music-title text-xs font-semibold overflow-hidden whitespace-nowrap text-center flex items-center justify-center">
                    {music.title.length > 10
                      ? `${music.title.substring(0, 10)}...`
                      : music.title}
                  </span>
                </label>
              </div>
            ))}
            {/* ------ */}
          </div>
        )}

        <ModalMusic
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          fetchMusics={fetchMusics}
        />
      </div>
      <button
        className="w-full flex justify-center bg-blue_3 text-gray-100 p-4 rounded-full tracking-wide
font-semibold focus:outline-none hover:bg-blue_4 shadow-lg cursor-pointer transition ease-in duration-300
"
        onClick={handleContinueClick}
      >
        Continuer
      </button>

      {/* <Tuto
        steps={[
          {
            element: ".theme-selected",
            intro:
              "Tu peux maintenant sélectionner une musique qui correspond le plus à ta personnalité.",
          },
        ]}
        tutorialKey="musicTuto"
      /> */}
    </div>
  );
}
