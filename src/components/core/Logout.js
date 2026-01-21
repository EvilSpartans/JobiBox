import React, { useState } from "react";
import { logout } from "../../store/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { deleteVideoProcess } from "../../store/slices/videoProcessSlice";
import { resetResumeState } from "../../store/slices/resumeSlice";
import ConfirmModal from "../modals/ConfirmModal";

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
  dispatch(resetResumeState());
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

   <ConfirmModal
    isOpen={showModal}
    title="Veux-tu vraiment te déconnecter ?"
    onCancel={cancelLogout}
    onConfirm={confirmLogout}
   />
  </div>
 );
}
