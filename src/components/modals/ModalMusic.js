import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createMusic } from "../../store/slices/musicSlice";

export default function ModalMusic({ isOpen, onClose, fetchMusics }) {
    
    const user = useSelector((state) => state.user.user);
    const { token } = user;
    const [newMusicTitle, setNewMusicTitle] = useState("");
    const [newMusicFile, setNewMusicFile] = useState(null);
    const dispatch = useDispatch();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewMusicFile(file);
        }
    }

    const handleCreateMusic = async () => {
        try {
            const response = await dispatch(createMusic({
                token: token,
                title: newMusicTitle,
                file: newMusicFile,
            }));
            console.log(response);
            fetchMusics();
        } catch (error) {
            console.error("Erreur lors de l'ajout de la musique :", error);
        }
        onClose();
    };

    const isFormValid = newMusicTitle !== "" && newMusicFile !== null;

    return isOpen ? (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="modal bg-black bg-opacity-75 w-full h-full absolute"></div>
            <div className="modal-content bg-white w-1/2 p-4 rounded-lg text-center z-50 relative">
                <p className="text-gray-800 text-lg">Ajouter une musique</p>

                <div className="flex flex-col items-center">
                    <input
                        className="border p-1 mt-3 text-gray-800 w-full md:w-4/5 sm:w-4/5"
                        type="text"
                        placeholder="Titre de la musique"
                        value={newMusicTitle}
                        onChange={(e) => setNewMusicTitle(e.target.value)}
                    />
                    <input
                        className="border p-1 mt-3 text-gray-800 w-full md:w-4/5 sm:w-4/5"
                        type="file"
                        accept="audio/*"
                        onChange={handleFileChange}
                    />
                </div>

                <div className="mt-4">
                    <button
                        className={`${isFormValid
                            ? "bg-green-500 text-white"
                            : "bg-gray-300 text-gray-600 cursor-not-allowed"
                            } px-4 py-2 rounded-md mr-2`}
                        onClick={handleCreateMusic}
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
