import React, { useState } from 'react';
import { logout } from "../store/features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { deleteVideoProcess } from '../store/features/videoProcessSlice';

export default function Logout() {

    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const videoId = localStorage.getItem("videoId");
    const user = useSelector((state) => state.user.user);
    const { token } = user;

    const handleLogout = () => {
        setShowModal(true);
    };

    const confirmLogout = () => {
        dispatch(logout());
        localStorage.removeItem('selectedQuestions');
        localStorage.removeItem('selectedTheme');
        localStorage.removeItem('selectedMusic');
        localStorage.removeItem('videoPath');
        localStorage.removeItem("videoId");
        localStorage.removeItem('questionTuto');
        localStorage.removeItem('themeTuto');
        localStorage.removeItem('musicTuto');
        localStorage.removeItem('filmTuto');
        localStorage.removeItem('clipTuto');
        localStorage.removeItem('textStyleTuto');
        localStorage.removeItem('textStyle');
        localStorage.removeItem('transcriptionTuto');
        localStorage.removeItem('loginTuto');
        localStorage.removeItem('registerTuto');
        setShowModal(false);

        if (videoId != null) {
            handleDelete()
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
        } finally {
        }
    };

    return (
        <div>
            {/* <div className="border-t-2 border-dark_border_2 mb-4"></div>
            <button
                className="w-full flex justify-center text-gray-500 p-2 font-semibold focus:outline-none hover:text-gray-300 hover:underline cursor-pointer transition ease-in duration-300"
                onClick={handleLogout}
            >
                Déconnexion
            </button> */}
            <button
                className="w-full flex justify-center bg-gray-300 text-gray-700 p-4 rounded-full tracking-wide
                    font-semibold focus:outline-none hover:bg-gray-400 shadow-lg cursor-pointer transition ease-in duration-300"
                onClick={handleLogout}
            >
                Déconnexion
            </button>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="modal bg-black bg-opacity-75 w-full h-full absolute"></div>
                    <div className="modal-content bg-white w-1/2 p-4 rounded-lg text-center z-50 relative">
                        <p className="text-gray-800 text-lg">
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
