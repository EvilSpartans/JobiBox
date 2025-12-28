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

const Photo = forwardRef(function Photo(
  { onPhotoTaken, user, mode = "video" },
  ref
) {
  const isResume = mode === "resume";

  const [photoConfirmed, setPhotoConfirmed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [cameraLoading, setCameraLoading] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const isKeyPressed = useRef(false);

  /* ================= KEYBOARD ================= */
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("keyup", handleKeyRelease);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("keyup", handleKeyRelease);
    };
  }, [showModal, photo]);

  const handleKeyPress = (event) => {
    if (
      !isKeyPressed.current &&
      /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/.test(event.key)
    ) {
      isKeyPressed.current = true;
      if (showModal && !photo) startCountdown();
    }
  };

  const handleKeyRelease = () => {
    isKeyPressed.current = false;
  };

  /* ================= CAMERA ================= */
  const initializeCamera = async () => {
    try {
      setCameraLoading(true);

      // stop ancienne caméra si existante
      stopCamera();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 1136 },
        },
        audio: false,
      });

      if (!videoRef.current) {
        setCameraLoading(false);
        return;
      }

      videoRef.current.srcObject = stream;

      // ✅ méthode fiable
      videoRef.current.onloadeddata = () => {
        setCameraLoading(false);
      };

      // 🔐 fallback de sécurité (au cas où)
      setTimeout(() => {
        setCameraLoading(false);
      }, 2000);
    } catch (err) {
      console.error("Erreur caméra :", err);
      setCameraLoading(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
    }
  };

  /* ================= PHOTO ================= */
  const takePhoto = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = 640;
    canvas.height = 1136;

    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/png");
    setPhoto(dataUrl);
    stopCamera();

    if (onPhotoTaken) {
      fetch(dataUrl)
        .then((r) => r.blob())
        .then((blob) => {
          onPhotoTaken(new File([blob], "photo.png", { type: "image/png" }));
        });
    }
  };

  const startCountdown = () => {
    let value = 3;
    setCountdown(value);
    const interval = setInterval(() => {
      value -= 1;
      setCountdown(value);
      if (value === 0) {
        clearInterval(interval);
        setCountdown(null);
        takePhoto();
      }
    }, 1000);
  };

  /* ================= AVATAR ================= */
  const uploadAvatar = async (file) => {
    if (!file || !user?.token || !user?.id) return;

    const formData = new FormData();
    formData.append("avatar", file);

    await fetch(`${process.env.REACT_APP_BASE_URL}/user/${user.id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${user.token}` },
      body: formData,
    });
  };

  const confirmSubmit = () => {
    setPhotoConfirmed(true);
    setShowModal(false);

    if (photo) {
      fetch(photo)
        .then((r) => r.blob())
        .then((blob) => uploadAvatar(new File([blob], "avatar.png")));
    }
  };

  const cancelSubmit = () => {
    setPhoto(null);
    setPhotoConfirmed(false);
    initializeCamera();
  };

  const closeModal = () => {
    setShowModal(false);
    setCameraLoading(false);
    stopCamera();
  };

  useImperativeHandle(ref, () => ({
    open: () => {
      setShowModal(true);
      initializeCamera();
    },
  }));

  /* ================= RENDER ================= */
  return (
    <div className="space-y-4">
      {/* ===== BUTTON ===== */}
      <button
        type="button"
        onClick={() => {
          setShowModal(true);
          initializeCamera();
        }}
        className={`
          w-full flex items-center justify-center gap-3
          px-6 py-4 rounded-2xl
          font-semibold
          ${
            isResume ? "bg-emerald-600 text-white" : "bg-gray-300 text-gray-700"
          }
        `}
      >
        <FontAwesomeIcon icon={faCamera} />
        {isResume ? "Créer ma photo de CV" : "Créer ma photo CV vidéo"}
        {photoConfirmed && (
          <FontAwesomeIcon icon={faCheckCircle} className="text-white ml-2" />
        )}
      </button>

      {/* ===== DESCRIPTION ===== */}
      <p className="text-center text-sm text-gray-400">
        {isResume
          ? "Cette photo sera utilisée sur votre CV papier."
          : "Cette image sera affichée comme miniature de votre vidéo."}
      </p>

      {/* ===== MODAL ===== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80" onClick={closeModal} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md z-10">
            <button className="absolute top-3 right-3" onClick={closeModal}>
              <FontAwesomeIcon icon={faTimes} />
            </button>

            <p className="text-center font-semibold mb-4">
              {photo
                ? isResume
                  ? "Utiliser cette photo pour votre CV ?"
                  : "Utiliser cette photo comme miniature ?"
                : "Regarde la caméra et souris 🙂"}
            </p>

            {photo ? (
              <img src={photo} alt="capture" className="mx-auto rounded-xl" />
            ) : (
              <div className="relative">
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full rounded-xl transform -scale-x-100"
                  />

                  {cameraLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-xl">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent" />
                      <p className="mt-4 text-white text-sm">
                        Initialisation de la caméra…
                      </p>
                    </div>
                  )}
                </div>
                <button
                  onClick={startCountdown}
                  className="mt-4 w-full py-2 rounded-xl bg-emerald-600 text-white"
                >
                  Prendre la photo
                </button>
                {countdown !== null && (
                  <div className="absolute inset-0 flex items-center justify-center text-white text-7xl bg-black/70">
                    {countdown}
                  </div>
                )}
              </div>
            )}

            {photo && (
              <div className="mt-4 flex justify-center gap-4">
                <button
                  onClick={confirmSubmit}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-full"
                >
                  Oui
                </button>
                <button
                  onClick={cancelSubmit}
                  className="px-6 py-2 bg-gray-300 rounded-full"
                >
                  Non
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
});

export default Photo;
