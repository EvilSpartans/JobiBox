import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/modals/Modal";

export default function Config() {

  const [publicModalOpen, setPublicModalOpen] = useState(false);
  const [privateModalOpen, setPrivateModalOpen] = useState(false);

  const openModal = (type) => {
    if (type === "public") {
      setPublicModalOpen(true);
    } else if (type === "private") {
      setPrivateModalOpen(true);
    }
  };

  const closeModal = (type) => {
    if (type === "public") {
      setPublicModalOpen(false);
    } else if (type === "private") {
      setPrivateModalOpen(false);
    }
  };

  const navigate = useNavigate();
  useEffect(() => {
    const existingBusiness = localStorage.getItem("businessId");
    if (existingBusiness) {
      navigate("/welcome");
    }
  }, []);

  const handleConfirm = (type) => {
    if (type === "public") {
        localStorage.setItem("businessId", null);
        localStorage.setItem("trainingActivated", false);
        localStorage.setItem("examActivated", false);
        setPublicModalOpen(false);
        navigate("/welcome");
      } else if (type === "private") {
        setPrivateModalOpen(false);
        navigate("/portal");
      }
  };

  return (
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
      {/*Container*/}
      <div className="flex w-full mx-auto h-full">
        {/*Login Form */}
        <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
          {/* Container */}
          <div className="flex flex-col justify-center min-h-[60%] h-fit tall:h-[90%] w-fit min-w-[60%] tall:w-[90%] space-y-8 tall:space-y-20 p-10 dark:bg-dark_bg_2 rounded-xl">
            {/*Heading*/}
            <div className="text-center dark:text-dark_text_1">
              <h2 className="mt-6 text-3xl font-bold">Configuration</h2>
              <p className="mt-6 text-base">
                Définir si la JobiBox doit être publique ou privée
              </p>
            </div>
            {/*Buttons*/}
            <button
              className="w-full flex justify-center bg-blue_3 text-gray-100 p-4 rounded-full tracking-wide
          font-semibold focus:outline-none hover:bg-blue_4 shadow-lg cursor-pointer transition ease-in duration-300
          "
              onClick={() => openModal("public")}
            >
              Ouvert à tout le monde
            </button>
            <button
                className="w-full flex justify-center bg-gray-300 text-gray-700 p-4 rounded-full tracking-wide
                    font-semibold focus:outline-none hover:bg-gray-400 shadow-lg cursor-pointer transition ease-in duration-300"
                    onClick={() => openModal("private")}
            >
                Reliée à une entreprise
            </button>
          </div>
        </div>
      </div>

      {/* Public Modal */}
      <Modal
        isOpen={publicModalOpen}
        onClose={() => closeModal("public")}
        onConfirm={() => handleConfirm("public")}
        title="Veux-tu vraiment que la JobiBox soit publique ?"
      />

      {/* Private Modal */}
      <Modal
        isOpen={privateModalOpen}
        onClose={() => closeModal("private")}
        onConfirm={() => handleConfirm("private")}
        title="Veux-tu vraiment que la JobiBox soit privée ?"
      />
    </div>
  );
}
