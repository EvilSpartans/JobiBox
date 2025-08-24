import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addCandidacy } from "../../store/slices/userSlice";

export default function ModalOffer({ offer, onClose, videos, user }) {
  const [showSelect, setShowSelect] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState("");
  const dispatch = useDispatch();

  const handleApply = async () => {
    setShowSelect(true);
  };

  const handleCancel = () => {
    setShowSelect(false);
    setSelectedVideo("");
  };

  const handleValidate = () => {
    createCandidacy();
  };

  const createCandidacy = async () => {
    try {
      const formData = new FormData();
      formData.append("type", "offer");
      formData.append("offerId", offer.id);
      formData.append("cv", selectedVideo);

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/candidacy/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("✅ Candidature envoyée :", response.data);
      dispatch(addCandidacy(offer.id));
      setShowSelect(false);
      setSelectedVideo("");
      onClose();
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi de la candidature :", error);
    }
  };

  if (!offer) return null;

  const hasApplied = user?.offerCandidacyIds?.includes(offer.id);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* FOND NOIR OPACITÉ */}
      <div
        className="modal bg-black bg-opacity-75 w-full h-full absolute"
        onClick={onClose}
      ></div>

      {/* CONTENU DE LA MODALE - FOND BLANC */}
      <div className="modal-content bg-white text-gray-900 w-full sm:w-3/4 lg:w-1/2 p-6 rounded-lg text-left z-50 relative max-h-[90vh] overflow-y-auto">
        {/* BOUTON FERMETURE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-gray-500 hover:text-red-500 text-2xl font-bold"
        >
          &times;
        </button>

        {/* LOGO */}
        {offer.logo && (
          <img
            src={offer.logo}
            alt={offer.company}
            className="w-24 h-24 object-contain mb-4 mx-auto"
          />
        )}

        {/* TITRE */}
        <h2 className="text-2xl font-bold text-center mb-2">{offer.title}</h2>
        <p className="text-center text-sm text-gray-600 mb-4">
          {offer.company} • {offer.location.name}
        </p>

        {/* INFOS */}
        <div className="text-sm space-y-3">
          <p>
            <strong>Contrat :</strong> {offer.contract}
          </p>
          <p>
            <strong>Salaire :</strong> {offer.salary}
          </p>
          <p>
            <strong>Domaine :</strong> {offer.jobFunction}
          </p>
          <p>
            <strong>Expérience :</strong> {offer.applicantExperience}
          </p>
          <p>
            <strong>Date limite :</strong>{" "}
            {new Date(offer.expirationDate).toLocaleDateString("fr-FR")}
          </p>

          <div>
            <strong>Description du poste :</strong>
            <p className="whitespace-pre-line mt-1">{offer.description}</p>
          </div>

          <div>
            <strong>Profil recherché :</strong>
            <p className="whitespace-pre-line mt-1">{offer.applicantProfile}</p>
          </div>

          <div>
            <strong>À propos de l'entreprise :</strong>
            <p className="whitespace-pre-line mt-1">
              {offer.companyDescription}
            </p>
          </div>
        </div>

        {/* SECTION POSTULER / VALIDATION */}
        <div className="mt-6 text-center space-y-4">
          {showSelect ? (
            videos.length === 0 ? (
              <div className="text-red-600 font-medium">
                ❌ Vous devez d'abord créer un CV vidéo pour pouvoir postuler à
                une offre.
              </div>
            ) : (
              <>
                <div>
                  <label
                    htmlFor="videoSelect"
                    className="block mb-2 font-semibold"
                  >
                    Sélectionnez une vidéo pour postuler :
                  </label>
                  <select
                    id="videoSelect"
                    value={selectedVideo}
                    onChange={(e) => setSelectedVideo(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">-- Choisissez une vidéo --</option>
                    {videos.map((video) => (
                      <option key={video.id} value={video.video}>
                        {video.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-center gap-4">
                  <button
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
                    onClick={handleCancel}
                  >
                    Annuler
                  </button>
                  <button
                    className="bg-blue_4 text-white px-4 py-2 rounded-md"
                    onClick={handleValidate}
                    disabled={!selectedVideo}
                  >
                    Valider
                  </button>
                </div>
              </>
            )
          ) : hasApplied ? (
            <p className="text-green-600 font-medium">
              ✅ Vous avez déjà postulé à cette offre
            </p>
          ) : (
            <button
              className="bg-blue_4 text-gray-100 hover:bg-blue-500 px-6 py-2 rounded-md text-sm font-medium"
              onClick={handleApply}
            >
              Postuler
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
