import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTheme } from "../../store/slices/themeSlice";

export default function ModalTheme({ isOpen, onClose, fetchThemes }) {
    
    const user = useSelector((state) => state.user.user);
    const { token } = user;
    const [newThemeTitle, setNewThemeTitle] = useState("");
    const [newThemeImage, setNewThemeImage] = useState(null);
    const dispatch = useDispatch();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewThemeImage(file);
        }
    }

    const handleCreateTheme = async () => {
        try {
            const response = await dispatch(createTheme({
                token: token,
                title: newThemeTitle,
                file: newThemeImage,
            }));
            // console.log(response);
            fetchThemes();
        } catch (error) {
            console.error("Erreur lors de la création du thème :", error);
        }
        onClose();
    };

    const isFormValid = newThemeTitle !== "" && newThemeImage !== null;

    return isOpen ? (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="modal bg-black bg-opacity-75 w-full h-full absolute"></div>
            <div className="modal-content bg-white w-1/2 p-4 rounded-lg text-center z-50 relative">
                <p className="text-gray-800 text-xl">Ajouter un thème</p>

                <div className="flex flex-col items-center">
                    <input
                        className="border p-1 mt-3 text-gray-800 w-full md:w-4/5 sm:w-4/5"
                        type="text"
                        placeholder="Titre du thème"
                        value={newThemeTitle}
                        onChange={(e) => setNewThemeTitle(e.target.value)}
                    />
                    <input
                        className="border p-1 mt-3 text-gray-800 w-full md:w-4/5 sm:w-4/5"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>

                <div className="mt-4">
                    <button
                        className={`${isFormValid
                                ? "bg-green-500 text-white"
                                : "bg-gray-300 text-gray-600 cursor-not-allowed"
                            } px-4 py-2 rounded-md mr-2`}
                        onClick={handleCreateTheme}
                        disabled={!isFormValid}
                    >
                        Valider
                    </button>
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded-md"
                        onClick={onClose}
                    >
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    ) : null;
}
