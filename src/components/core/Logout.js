import React, { useState } from "react";
import { logout } from "../../store/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { deleteVideoProcess } from "../../store/slices/videoProcessSlice";

export default function Logout({ position = "fixed" }) {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const videoId = localStorage.getItem("videoId");
  const user = useSelector((state) => state.user.user);
  const { token } = user;

  const handleLogout = () => {
    setShowModal(true);
  };

  const confirmLogout = async () => {
    dispatch(logout());
    clearLocalStorage();
    await clearCache();
    setShowModal(false);

    if (videoId != null) {
      handleDelete();
    }
  };

  const cancelLogout = () => {
    setShowModal(false);
  };

  const handleDelete = async () => {
    try {
      await dispatch(
        deleteVideoProcess({
          token: token,
          id: videoId,
        })
      );
    } catch (error) {
      console.error("Error :", error);
    }
  };

  const clearLocalStorage = () => {
    const keysToKeep = [
      "jobiboxId",
      "examActivated",
      "trainingActivated",
      "businessId",
    ];
    const valuesToKeep = {};

    keysToKeep.forEach((key) => {
      valuesToKeep[key] = localStorage.getItem(key);
    });

    localStorage.clear();

    keysToKeep.forEach((key) => {
      if (valuesToKeep[key] !== null) {
        localStorage.setItem(key, valuesToKeep[key]);
      }
    });
  };

  const clearCache = async () => {
    try {
      const result = await electron.clearCache();
      if (result.success) {
      }
    } catch (error) {
      console.error("Error clearing cache:", error);
    }
  };

  return (
    <div className={position === "fixed" ? "fixed top-3 right-4 z-50" : ""}>
      <button
        className="text-xl w-full flex justify-center bg-gray-300 text-gray-700 p-4 rounded-full tracking-wide
                    font-semibold focus:outline-none hover:bg-gray-400 shadow-lg cursor-pointer transition ease-in duration-300"
        onClick={handleLogout}
      >
        Déconnexion
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="modal bg-black bg-opacity-75 w-full h-full absolute"></div>
          <div className="modal-content bg-white w-1/2 p-4 rounded-lg text-center z-50 relative">
            <p className="text-gray-800 text-xl">
              Veux-tu vraiment te déconnecter ?
            </p>
            <div className="mt-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
                onClick={confirmLogout}
              >
                Oui
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={cancelLogout}
              >
                Non
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
