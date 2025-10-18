import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faTimes,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

const Photo = forwardRef(function Photo({ onPhotoTaken, user }, ref) {
  const [photoConfirmed, setPhotoConfirmed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const isKeyPressed = useRef(false);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("keyup", handleKeyRelease);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("keyup", handleKeyRelease);
    };
  }, [showModal, photo]);

  // Make Pad working
  const handleKeyPress = (event) => {
    if (
      !isKeyPressed.current &&
      /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/.test(event.key)
    ) {
      isKeyPressed.current = true;
      if (showModal && !photo) {
        startCountdown();
      }
    }
  };

  const handleKeyRelease = () => {
    isKeyPressed.current = false;
  };

  let stream;

  const initializeCamera = async () => {
    stream = await navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: "portrait",
          width: { ideal: 640 },
          height: { ideal: 1136 },
        },
        audio: false,
      })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        console.error("Error accessing the camera: ", err);
      });
  };

  const takePhoto = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.width = 640;
    canvas.height = 1136;
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const photoDataUrl = canvas.toDataURL("image/png");
    setPhoto(photoDataUrl);
    if (videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    if (onPhotoTaken) {
      fetch(photoDataUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "photo.png", { type: "image/png" });
          onPhotoTaken(file);
        });
    }
  };

  const uploadAvatar = async (file) => {
    if (!file || !user?.token || !user?.id) return;
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/user/${user.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        console.error(
          "❌ Erreur lors de la mise à jour de l’avatar :",
          await response.text()
        );
      } else {
        console.log("✅ Avatar mis à jour avec succès !");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };

  const startCountdown = () => {
    let countdownValue = 3;
    setCountdown(countdownValue);
    const countdownInterval = setInterval(() => {
      countdownValue -= 1;
      setCountdown(countdownValue);
      if (countdownValue === 0) {
        clearInterval(countdownInterval);
        takePhoto();
        setCountdown(null);
      }
    }, 1000);
  };

  const handleSubmit = async () => {
    setShowModal(true);
    initializeCamera();
  };

  const confirmSubmit = () => {
    // console.log("Photo confirmed:", photo);
    setPhotoConfirmed(true);
    setShowModal(false);
    if (photo) {
      fetch(photo)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "avatar.png", { type: "image/png" });
          uploadAvatar(file);
        });
    }
  };

  const cancelSubmit = async () => {
    setPhoto(null);
    setPhotoConfirmed(false);
    initializeCamera();
  };

  const closeModal = () => {
    setShowModal(false);
    if (videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  useImperativeHandle(ref, () => ({
    open: () => {
      setShowModal(true);
      initializeCamera();
    },
  }));

  return (
    <div className="z-50">
      <button
        type="button"
        className="text-xl w-full flex justify-center bg-gray-300 text-gray-700 p-4 rounded-full tracking-wide
                    font-semibold focus:outline-none hover:bg-gray-400 shadow-lg cursor-pointer transition ease-in duration-300"
        onClick={handleSubmit}
        tabIndex="-1"
      >
        <FontAwesomeIcon icon={faCamera} size="lg" />
        {photoConfirmed && (
          <FontAwesomeIcon
            icon={faCheckCircle}
            size="lg"
            className="ml-2 text-green-500"
          />
        )}
        &nbsp; <span className="text-xl">Créer ma photo CV</span>
      </button>

      <p className="text-center mt-2 text-lg text-white italic">
        Cette image sera affichée comme{" "}
        <strong className="text-blue-400"> miniature </strong>
        de votre vidéo lorsqu'elle sera publiée.
      </p>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="modal bg-black bg-opacity-75 w-full h-full absolute"></div>
          <div className="modal-content bg-white w-1/2 p-4 rounded-lg text-center z-50 relative">
            <button
              className="absolute top-2 right-2 text-gray-800"
              onClick={closeModal}
              tabIndex="-1"
            >
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
            <p className="text-gray-800 text-xl mb-2">
              {photo
                ? "Veux-tu utiliser cette photo ? (Elle apparaîtra comme miniature pour ta vidéo)"
                : "Fais ton plus grand sourire"}
            </p>
            {photo ? (
              <img src={photo} alt="Captured" className="mx-auto" />
            ) : (
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  className="w-full h-auto transform -scale-x-100"
                />{" "}
                {/* Mirror video */}
                <button
                  type="button"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
                  onClick={startCountdown}
                >
                  Prendre la Photo
                </button>
                {countdown !== null && (
                  <div className="countdown-overlay absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 text-white text-9xl">
                    {countdown}
                    <p className="text-sm mt-3 text-center">
                      Souris et regarde la caméra 😉 !
                    </p>
                  </div>
                )}
              </div>
            )}
            {photo && (
              <div className="mt-4">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
                  onClick={confirmSubmit}
                  type="button"
                >
                  Oui
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                  onClick={cancelSubmit}
                  type="button"
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
});

export default Photo;
