import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

export default function ModalFilter({
  onClose,
  onApply,
  currentFilters,
  baseUrl,
}) {
  const [filters, setFilters] = useState(
    currentFilters || {
      title: "",
      company: "",
      contract: "",
      location: "",
      radiusKm: 0,
    }
  );

  const [cityOptions, setCityOptions] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [showCityList, setShowCityList] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const abortRef = useRef(null);
  const cityBoxRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    if (name === "location") {
      setIsTyping(true);
      setShowCityList(true);
    }
  };

  const handleApply = () => {
    const payload = filters.location
      ? filters
      : { ...filters, radiusKm: 0, location: "" };
    onApply(payload);
    setIsTyping(false);
    setShowCityList(false);
    setCityOptions([]);
    setHighlight(-1);
    onClose();
  };

  const handleReset = () => {
    const reset = {
      title: "",
      company: "",
      contract: "",
      location: "",
      radiusKm: 0,
    };
    setFilters(reset);
    onApply(reset);
    setIsTyping(false);
    setShowCityList(false);
    setCityOptions([]);
    setHighlight(-1);
    onClose();
  };

  // Fetch des villes
  useEffect(() => {
    if (!isTyping) {
      setShowCityList(false);
      return;
    }

    const q = (filters.location || "").trim();
    if (q.length < 2) {
      setCityOptions([]);
      setShowCityList(false);
      setHighlight(-1);
      return;
    }

    setCitiesLoading(true);
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const t = setTimeout(async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/cities`, {
          params: { page: 1, limit: 10, name: q },
          signal: controller.signal,
        });
        const items = Array.isArray(data?.items) ? data.items : [];
        setCityOptions(items.map(({ id, name }) => ({ id, name })));
        setShowCityList(true);
        setHighlight(items.length ? 0 : -1);
      } catch {
        if (!controller.signal.aborted) setCityOptions([]);
      } finally {
        if (!controller.signal.aborted) setCitiesLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [filters.location, baseUrl, isTyping]);

  const selectCity = (c) => {
    setFilters((prev) => ({ ...prev, location: c?.name || "" }));
    setIsTyping(false);
    setShowCityList(false);
    setCityOptions([]);
    setHighlight(-1);
  };

  // Fermer la liste au clic extérieur
  useEffect(() => {
    const onClickOutside = (e) => {
      if (cityBoxRef.current && !cityBoxRef.current.contains(e.target)) {
        setShowCityList(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    setShowCityList(false);
    setCityOptions([]);
    setHighlight(-1);
    setIsTyping(false);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* FOND NOIR OPACITÉ */}
      <div
        className="modal bg-black bg-opacity-75 w-full h-full absolute"
        onClick={onClose}
      ></div>

      {/* CONTENU DE LA MODALE - FOND BLANC */}
      <div className="modal-content bg-white text-gray-900 w-full sm:w-3/4 lg:w-1/2 p-6 rounded-lg text-left z-50 relative max-h-[90vh] min-h-[60vh] overflow-y-auto">
        {/* BOUTON FERMETURE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-gray-500 hover:text-red-500 text-2xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-8">Filtrer les offres</h2>

        <div className="space-y-8">
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

          <div ref={cityBoxRef} className="relative">
            <label className="font-medium">Ville</label>
            <input
              type="text"
              name="location"
              placeholder="Ex : Lille, Lyon, Marseille..."
              value={filters.location}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (!showCityList || !cityOptions.length) return;
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setHighlight((h) => Math.min(h + 1, cityOptions.length - 1));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setHighlight((h) => Math.max(h - 1, 0));
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  if (highlight >= 0) selectCity(cityOptions[highlight]);
                } else if (e.key === "Escape") {
                  setShowCityList(false);
                }
              }}
              className="w-full border border-gray-300 px-3 py-2 rounded-md mt-1"
            />
            {showCityList && (
              <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-auto">
                {citiesLoading && (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    Recherche…
                  </div>
                )}
                {!citiesLoading && cityOptions.length === 0 && (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    Aucune ville
                  </div>
                )}
                {!citiesLoading &&
                  cityOptions.map((c, idx) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => selectCity(c)}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                        idx === highlight ? "bg-gray-100" : ""
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
              </div>
            )}
          </div>

          <div
            className={`px-3 py-2 rounded-md mt-1 transition-opacity ${
              filters.location ? "opacity-100" : "opacity-50"
            }`}
          >
            <label className="font-medium flex items-center justify-between">
              <span>Rayon (km)</span>
              <span className="text-sm text-gray-600">
                {filters.radiusKm || 0} km
              </span>
            </label>
            <div className="mt-3 px-1">
              <Slider
                min={0}
                max={100}
                step={1}
                value={Number(filters.radiusKm) || 0}
                disabled={!filters.location}
                onChange={(val) =>
                  setFilters((prev) => ({ ...prev, radiusKm: Number(val) }))
                }
                marks={{ 0: "0", 25: "25", 50: "50", 75: "75", 100: "100" }}
                allowCross={false}
                rail={{ height: 6 }}
                track={{ height: 6 }}
                handle={{ height: 18, width: 18, marginTop: -6 }}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-12 gap-4">
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
