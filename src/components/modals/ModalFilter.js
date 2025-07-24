import React, { useState } from "react";

export default function ModalFilter({ onClose, onApply, currentFilters }) {
  const [filters, setFilters] = useState(
    currentFilters || {
      title: "",
      company: "",
      contract: "",
      location: "",
    }
  );

  const handleChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const reset = {
      title: "",
      company: "",
      contract: "",
      location: "",
    };
    setFilters(reset);
    onApply(reset);
    onClose();
  };

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

        <h2 className="text-xl font-bold mb-4">Filtrer les offres</h2>

        <div className="space-y-4">
          <div>
            <label className="font-medium">Titre du post</label>
            <input
              type="text"
              name="title"
              placeholder="Ex : Vendeur, Agent d'entretien, Développeur..."
              value={filters.title}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-md mt-1"
            />
          </div>

          <div>
            <label className="font-medium">Organisme</label>
            <input
              type="text"
              name="company"
              placeholder="Ex : Decathlon, Carrefour, Leroy Merlin..."
              value={filters.company}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-md mt-1"
            />
          </div>
          
          <div>
            <label className="font-medium">Ville</label>
            <input
              type="text"
              name="location"
              placeholder="Ex : Lille, Lyon, Marseille..."
              value={filters.location}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-md mt-1"
            />
          </div>

          <div>
            <label className="font-medium">Contrat</label>
            <select
              name="contract"
              value={filters.contract}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-md mt-1"
            >
              <option value="">-- Type de contrat --</option>
              <option value="CDI">CDI</option>
              <option value="CDD">CDD</option>
              <option value="Intérim">Intérim</option>
              <option value="Stage">Stage</option>
              <option value="Alternance">Alternance</option>
              <option value="Freelance">Freelance</option>
            </select>
          </div>

        </div>

        <div className="flex justify-end mt-6 gap-4">
          <button
            onClick={handleReset}
            className="text-gray-600 hover:text-red-600"
          >
            Réinitialiser
          </button>
          <button
            onClick={handleApply}
            className="bg-blue_4 text-white px-4 py-2 rounded-md"
          >
            Appliquer
          </button>
        </div>
      </div>
    </div>
  );
}
