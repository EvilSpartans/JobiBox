import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faTimes, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

export default function Photo({ onPhotoTaken }) {
    const [photoConfirmed, setPhotoConfirmed] = useState(false); 
    const [showModal, setShowModal] = useState(false);
    const [photo, setPhoto] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    let stream;

    const initializeCamera = async () => {
        stream = await navigator.mediaDevices
            .getUserMedia({
                video: {
                    facingMode: "portrait",
                    width: { ideal: 640 },
                    height: { ideal: 1136 },
                },
                audio: false, // Désactiver l'audio
            })
            .then(stream => {
                videoRef.current.srcObject = stream;
            })
            .catch(err => {
                console.error("Error accessing the camera: ", err);
            });
    };

    const takePhoto = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.width = 640;
        canvas.height = 1136;
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const photoDataUrl = canvas.toDataURL('image/png');
        setPhoto(photoDataUrl);
        if (videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
        if (onPhotoTaken) {
            fetch(photoDataUrl)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], 'photo.png', { type: 'image/png' });
                    onPhotoTaken(file);
                });
        }
    };

    const handleSubmit = async () => {
        setShowModal(true);
        initializeCamera();
    };

    const confirmSubmit = () => {
        console.log('Photo confirmed:', photo);
        setPhotoConfirmed(true);
        setShowModal(false);
    };

    const cancelSubmit = async () => {
        setPhoto(null);
        setPhotoConfirmed(false);
        initializeCamera();
    };

    const closeModal = () => {
        setShowModal(false);
        if (videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
    };

    return (
        <div className='z-50' style={{ marginTop: '3%' }}>
            <button
                className="w-full flex justify-center bg-gray-300 text-gray-700 p-4 rounded-full tracking-wide
                    font-semibold focus:outline-none hover:bg-gray-400 shadow-lg cursor-pointer transition ease-in duration-300"
                onClick={handleSubmit}
            >
                <FontAwesomeIcon icon={faCamera} size="lg" /> 
                {photoConfirmed && <FontAwesomeIcon icon={faCheckCircle} size="lg" className="ml-2 text-green-500" />}
            </button>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="modal bg-black bg-opacity-75 w-full h-full absolute"></div>
                    <div className="modal-content bg-white w-1/2 p-4 rounded-lg text-center z-50 relative">
                        <button className="absolute top-2 right-2 text-gray-800" onClick={closeModal}>
                            <FontAwesomeIcon icon={faTimes} size="lg" /> 
                        </button>
                        <p className="text-gray-800 text-lg">
                            {photo ? "Veux-tu utiliser cette photo ? (Elle apparaîtra comme miniature pour ta vidéo)" : "Fais ton plus grand sourire"}
                        </p>
                        {photo ? (
                            <img src={photo} alt="Captured" className="mx-auto" />
                        ) : (
                            <div>
                                <video ref={videoRef} autoPlay className="w-full h-auto transform -scale-x-100" /> {/* Mirror video */}
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
                                    onClick={takePhoto}
                                >
                                    Prendre la Photo
                                </button>
                            </div>
                        )}
                        {photo && (
                            <div className="mt-4">
                                <button
                                    className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
                                    onClick={confirmSubmit}
                                >
                                    Oui
                                </button>
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                                    onClick={cancelSubmit}
                                >
                                    Non
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
    );
}
