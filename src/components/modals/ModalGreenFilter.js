import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createGreenFilter } from "../../store/slices/greenFilterSlice";

export default function ModalGreenFilter({ isOpen, onClose, fetchGreenFilters }) {
    
    const user = useSelector((state) => state.user.user);
    const { token } = user;
    const [newGreenFilterTitle, setNewGreenFilterTitle] = useState("");
    const [newGreenFilterImage, setNewGreenFilterImage] = useState(null);
    const dispatch = useDispatch();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewGreenFilterImage(file);
        }
    }

    const handleCreateGreenFilter = async () => {
        try {
            const response = await dispatch(createGreenFilter({
                token: token,
                title: newGreenFilterTitle,
                file: newGreenFilterImage,
            }));
            console.log(response);
            fetchGreenFilters();
        } catch (error) {
            console.error("Erreur lors de la création de l'écran vert :", error);
        }
        onClose();
    };

    const isFormValid = newGreenFilterImage !== "" && newGreenFilterImage !== null;

    return isOpen ? (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="modal bg-black bg-opacity-75 w-full h-full absolute"></div>
            <div className="modal-content bg-white w-1/2 p-4 rounded-lg text-center z-50 relative">
                <p className="text-gray-800 text-lg">Ajouter un écran vert</p>

                <div className="flex flex-col items-center">
                    <input
                        className="border p-1 mt-3 text-gray-800 w-full md:w-4/5 sm:w-4/5"
                        type="text"
                        placeholder="Titre du filtre"
                        value={newGreenFilterTitle}
                        onChange={(e) => setNewGreenFilterTitle(e.target.value)}
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
                        onClick={handleCreateGreenFilter}
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
