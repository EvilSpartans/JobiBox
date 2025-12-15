import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logout from "../../components/core/Logout";
import { useDispatch, useSelector } from "react-redux";
import PulseLoader from "react-spinners/PulseLoader";
import axios from "axios";

import { getResume, updateResume } from "../../store/slices/resumeSlice";
import { getCategories } from "../../store/slices/categorySlice";
import GoBack from "../../components/core/GoBack";

const BASE_URL = process.env.REACT_APP_BASE_URL;

/* ---------- CONSTANTES ---------- */

const LANGUAGES = [
  "Français",
  "Anglais",
  "Espagnol",
  "Allemand",
  "Italien",
  "Portugais",
  "Arabe",
];

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2", "Natif"];

export default function SkillsAndLanguages() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  const { resume, status } = useSelector((state) => state.resume);

  const categories = useSelector(
    (state) => state.category.categories?.items || []
  );

  const loading = status === "loading";

  /* ---------- STATES ---------- */

  const [languages, setLanguages] = useState([]);
  const [selectedLang, setSelectedLang] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");

  const [categoryId, setCategoryId] = useState("");
  const [availableSkills, setAvailableSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [customSkill, setCustomSkill] = useState("");

  /* ---------- FETCH RESUME + CATEGORIES ---------- */

  useEffect(() => {
    const resumeId = localStorage.getItem("resumeId");
    if (!resumeId || !user?.token) return;

    dispatch(getResume({ token: user.token, id: resumeId }));
    dispatch(getCategories(user.token));
  }, [dispatch, user]);

  /* ---------- FETCH SKILLS PAR CATÉGORIE ---------- */

  useEffect(() => {
    if (!categoryId || !user?.token) return;

    axios
      .get(`${BASE_URL}/technicalSkills?categoryId=${categoryId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => setAvailableSkills(res.data?.items || []))
      .catch(() => setAvailableSkills([]));
  }, [categoryId, user]);

  /* ---------- HANDLERS ---------- */

  const addLanguage = () => {
    if (!selectedLang || !selectedLevel) return;
    if (languages.some((l) => l.label === selectedLang)) return;

    setLanguages((prev) => [
      ...prev,
      { label: selectedLang, level: selectedLevel },
    ]);

    setSelectedLang("");
    setSelectedLevel("");
  };

  const removeLanguage = (label) => {
    setLanguages((prev) => prev.filter((l) => l.label !== label));
  };

  const toggleSkill = (label) => {
    setSelectedSkills((prev) => {
      if (prev.includes(label)) {
        return prev.filter((s) => s !== label);
      }
      if (prev.length >= 5) return prev; // limite conseillée
      return [...prev, label];
    });
  };

  useEffect(() => {
    if (availableSkills.length > 0) {
      setSelectedSkills(availableSkills.slice(0, 3).map((s) => s.name));
    }
  }, [availableSkills]);

//   const addCustomSkill = () => {
//     if (!customSkill.trim()) return;
//     if (selectedSkills.includes(customSkill.trim())) return;
//     if (selectedSkills.length >= 5) return;

//     setSelectedSkills((prev) => [...prev, customSkill.trim()]);
//     setCustomSkill("");
//   };

  const handleNext = async () => {
    if (languages.length === 0 || selectedSkills.length === 0) return;

    const resumeId = localStorage.getItem("resumeId");
    if (!resumeId) return;

    const payload = {
      languages,
      skills: selectedSkills,
    };

    await dispatch(
      updateResume({
        token: user.token,
        id: resumeId,
        payload,
      })
    );

    // navigate("/resume/experiences");
  };

  /* ---------- RENDER ---------- */

  return (
    <div className="relative h-screen dark:bg-dark_bg_1 overflow-hidden">
      <Logout />
      <GoBack />
      {/* Glow */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-emerald-600/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-emerald-800/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 h-full flex items-center justify-center px-4">
        <div className="flex flex-col w-full max-w-5xl min-h-[82vh] max-h-[90vh] overflow-y-auto scrollbar-none p-8 rounded-3xl bg-gradient-to-br from-dark_bg_2/80 to-dark_bg_1/80 backdrop-blur-xl shadow-2xl ring-1 ring-white/10">
          {/* HEADER */}
          <div className="text-center space-y-4">
            <span className="inline-block px-4 py-1 rounded-full text-sm font-semibold bg-emerald-900/40 text-emerald-300">
              Étape 3 · Compétences & Langues
            </span>
            <h2 className="text-4xl font-extrabold text-white">
              Tes compétences clés
            </h2>
            <p className="text-gray-300">
              Sélectionne ton domaine, tes compétences et les langues
              maîtrisées.
            </p>
          </div>

          {/* LANGUES */}
          <section className="mt-10">
            <h3 className="text-xl font-semibold text-white mb-1">
              🌍 Langues parlées
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              Choisis une langue puis son niveau. Elle sera ajoutée
              automatiquement.
            </p>

            {/* Sélecteurs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Langue */}
              <select
                value={selectedLang}
                onChange={(e) => {
                  const lang = e.target.value;
                  setSelectedLang(lang);

                  if (!lang || !selectedLevel) return;

                  setLanguages((prev) => {
                    const exists = prev.find((l) => l.label === lang);
                    if (exists) {
                      return prev.map((l) =>
                        l.label === lang ? { ...l, level: selectedLevel } : l
                      );
                    }
                    return [...prev, { label: lang, level: selectedLevel }];
                  });

                  setSelectedLang("");
                  setSelectedLevel("");
                }}
                className="
        w-full
        bg-dark_bg_1/80
        border border-white/10
        text-white
        rounded-xl
        px-5 py-4
        text-base
        focus:outline-none
        focus:ring-2 focus:ring-emerald-500/40
      "
              >
                <option value="" className="bg-dark_bg_2 text-gray-400">
                  Choisir une langue
                </option>
                {LANGUAGES.map((l) => (
                  <option key={l} value={l} className="bg-dark_bg_2 text-white">
                    {l}
                  </option>
                ))}
              </select>

              {/* Niveau */}
              <select
                value={selectedLevel}
                onChange={(e) => {
                  const level = e.target.value;
                  setSelectedLevel(level);

                  if (!selectedLang || !level) return;

                  setLanguages((prev) => {
                    const exists = prev.find((l) => l.label === selectedLang);
                    if (exists) {
                      return prev.map((l) =>
                        l.label === selectedLang ? { ...l, level } : l
                      );
                    }
                    return [...prev, { label: selectedLang, level }];
                  });

                  setSelectedLang("");
                  setSelectedLevel("");
                }}
                className="
        w-full
        bg-dark_bg_1/80
        border border-white/10
        text-white
        rounded-xl
        px-5 py-4
        text-base
        focus:outline-none
        focus:ring-2 focus:ring-emerald-500/40
      "
              >
                <option value="" className="bg-dark_bg_2 text-gray-400">
                  Niveau
                </option>
                {LEVELS.map((lvl) => (
                  <option
                    key={lvl}
                    value={lvl}
                    className="bg-dark_bg_2 text-white"
                  >
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            {/* Langues ajoutées */}
            {languages.length > 0 && (
              <div className="mt-6">
                <p className="text-sm text-gray-400 mb-3">
                  Langues sélectionnées
                </p>

                <div className="flex flex-wrap gap-3">
                  {languages.map((l) => (
                    <span
                      key={l.label}
                      onClick={() => removeLanguage(l.label)}
                      className="
              px-4 py-2
              rounded-full
              bg-emerald-600/20
              border border-emerald-500
              text-white
              text-sm
              cursor-pointer
              hover:bg-emerald-700/30
              transition
            "
                    >
                      {l.label} · {l.level} ✕
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* COMPÉTENCES */}
          <section className="mt-14">
            <h3 className="text-xl font-semibold text-white mb-1">
              🧩 Domaine d’activité
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              Choisis ton domaine, puis sélectionne jusqu’à 5 compétences
              associées.
            </p>

            {/* SELECT DOMAINE */}
            <div className="relative mb-8">
              <select
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  setSelectedSkills([]); // reset compétences quand on change de domaine
                }}
                className="
        w-full
        appearance-none
        bg-dark_bg_1/80
        border border-white/10
        text-white
        rounded-2xl
        px-6 py-5
        text-base
        focus:outline-none
        focus:ring-2 focus:ring-emerald-500/40
        transition
      "
              >
                <option value="" className="bg-dark_bg_2 text-gray-400">
                  Choisir un domaine d’activité
                </option>
                {categories.map((c) => (
                  <option
                    key={c.id}
                    value={c.id}
                    className="bg-dark_bg_2 text-white"
                  >
                    {c.name}
                  </option>
                ))}
              </select>

              <div className="pointer-events-none absolute inset-y-0 right-6 flex items-center text-emerald-400 text-lg">
                ▾
              </div>
            </div>

            {/* MULTI SELECT COMPÉTENCES */}
            {availableSkills.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-400 mb-3">
                  Compétences disponibles
                  <span className="ml-2 text-emerald-400">
                    ({selectedSkills.length}/5)
                  </span>
                </p>

                <div
                  className="
          max-h-72
          overflow-y-auto
          rounded-2xl
          border border-white/10
          bg-dark_bg_1/60
          p-4
          space-y-2
        "
                >
                  {availableSkills.map((skill) => {
                    const checked = selectedSkills.includes(skill.name);

                    return (
                      <label
                        key={skill.id}
                        className={`
                flex items-center gap-3
                px-4 py-3
                rounded-xl
                cursor-pointer
                transition
                ${
                  checked
                    ? "bg-emerald-600/20 text-white"
                    : "hover:bg-white/5 text-gray-300"
                }
              `}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={!checked && selectedSkills.length >= 5}
                          onChange={() => toggleSkill(skill.name)}
                          className="
                  h-5 w-5
                  rounded
                  border-white/20
                  bg-transparent
                  text-emerald-500
                  focus:ring-emerald-500
                "
                        />
                        <span className="text-sm font-medium">
                          {skill.name}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          {/* FOOTER */}
          <div className="pt-10 flex justify-end">
            <button
              onClick={handleNext}
              disabled={loading}
              className="px-10 py-4 rounded-full text-lg font-semibold bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-xl"
            >
              {loading ? <PulseLoader color="#fff" size={12} /> : "Suivant"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
