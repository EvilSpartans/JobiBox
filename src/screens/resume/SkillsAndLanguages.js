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

  useEffect(() => {
    if (!resume) return;

    if (Array.isArray(resume.languages)) {
      setLanguages(resume.languages);
    }

    if (Array.isArray(resume.skills)) {
      setSelectedSkills(resume.skills);
    }
  }, [resume]);

  useEffect(() => {
    if (!resume || !categories.length) return;
    if (!resume.skills || resume.skills.length === 0) return;

    // on essaie de retrouver la catégorie à partir des skills
    const skillNames = resume.skills;

    const matchedCategory = categories.find((cat) =>
      cat.technicalSkills?.some((s) => skillNames.includes(s.name))
    );

    if (matchedCategory) {
      setCategoryId(matchedCategory.id);
    }
  }, [resume, categories]);

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
    if (languages.length >= 5) return;
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
    if (availableSkills.length > 0 && selectedSkills.length === 0) {
      setSelectedSkills(availableSkills.slice(0, 3).map((s) => s.name));
    }
  }, [availableSkills]);

  const addCustomSkill = () => {
    const value = customSkill.trim();
    if (!value) return;

    // déjà sélectionnée
    if (selectedSkills.includes(value)) {
      setCustomSkill("");
      return;
    }

    // limite 5 compétences
    if (selectedSkills.length >= 5) return;

    // ajout en tête de la liste visible
    setAvailableSkills((prev) => [
      { id: `custom-${value}`, name: value },
      ...prev,
    ]);

    // sélection immédiate
    setSelectedSkills((prev) => [value, ...prev]);

    setCustomSkill("");
  };

  const handleNext = async () => {
    if (languages.length === 0 || selectedSkills.length === 0 || loading)
      return;

    const resumeId = localStorage.getItem("resumeId");
    if (!resumeId) return;

    const payload = {
      // 🔒 TOUT ce qui existe déjà
      title: resume?.title,
      template: resume?.template,
      mainColor: resume?.mainColor,
      qrcodePostId: resume?.qrcodePostId,
      personalInfo: resume?.personalInfo,
      contractType: resume?.contractType || [],
      alternanceDuration: resume?.alternanceDuration || "",
      alternanceStartDate: resume?.alternanceStartDate || "",
      presentation: resume?.presentation || "",
      trainings: resume?.trainings || [],
      experiences: resume?.experiences || [],

      // ✅ CE QUE CET ÉCRAN MODIFIE
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

    navigate("/smartGeneration");
  };

  /* ---------- RENDER ---------- */

  return (
    <div className="relative h-screen dark:bg-dark_bg_1 overflow-hidden">
      <Logout />
      <GoBack />

      {/* Glow background */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-emerald-600/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-emerald-800/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 h-full flex items-center justify-center px-4">
        <div className="flex flex-col w-full max-w-5xl min-h-[85vh] max-h-[90vh] overflow-y-auto scrollbar-none p-8 rounded-3xl bg-gradient-to-br from-dark_bg_2/80 to-dark_bg_1/80 backdrop-blur-xl shadow-2xl ring-1 ring-white/10">
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

          {/* ================= LANGUES ================= */}
          <section className="mt-10">
            <h3 className="text-lg font-semibold text-emerald-300 mb-1">
              🌍 Langues parlées
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              Choisis une langue puis son niveau (5 maximum).
            </p>

            {/* Sélecteurs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={selectedLang}
                onChange={(e) => {
                  const lang = e.target.value;
                  setSelectedLang(lang);
                  if (languages.length >= 5) return;
                  if (!lang || !selectedLevel) return;
                  setLanguages((prev) =>
                    prev.some((l) => l.label === lang)
                      ? prev.map((l) =>
                          l.label === lang ? { ...l, level: selectedLevel } : l
                        )
                      : [...prev, { label: lang, level: selectedLevel }]
                  );
                  setSelectedLang("");
                  setSelectedLevel("");
                }}
                className="w-full bg-dark_bg_1/80 border border-white/10 text-white rounded-xl px-5 py-4 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              >
                <option value="" className="bg-dark_bg_2 text-gray-400 text-lg">
                  Choisir une langue
                </option>
                {LANGUAGES.map((l) => (
                  <option
                    key={l}
                    value={l}
                    className="bg-dark_bg_2 text-white text-lg"
                  >
                    {l}
                  </option>
                ))}
              </select>

              <select
                value={selectedLevel}
                onChange={(e) => {
                  const level = e.target.value;
                  setSelectedLevel(level);
                  if (languages.length >= 5) return;
                  if (!selectedLang || !level) return;
                  setLanguages((prev) =>
                    prev.some((l) => l.label === selectedLang)
                      ? prev.map((l) =>
                          l.label === selectedLang ? { ...l, level } : l
                        )
                      : [...prev, { label: selectedLang, level }]
                  );
                  setSelectedLang("");
                  setSelectedLevel("");
                }}
                className="w-full bg-dark_bg_1/80 border border-white/10 text-white rounded-xl px-5 py-4 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              >
                <option value="" className="bg-dark_bg_2 text-gray-400 text-lg">
                  Niveau
                </option>
                {LEVELS.map((lvl) => (
                  <option
                    key={lvl}
                    value={lvl}
                    className="bg-dark_bg_2 text-white text-lg"
                  >
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            {/* Zone langues (toujours visible) */}
            <div className="mt-6 min-h-[72px] rounded-xl bg-white/5 border border-white/10 flex items-center px-4">
              {languages.length === 0 ? (
                <div className="flex items-center gap-3 text-gray-500 text-sm">
                  <span className="text-emerald-400 text-lg">🌐</span>
                  Aucune langue sélectionnée pour le moment
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {languages.map((l) => (
                    <span
                      key={l.label}
                      onClick={() => removeLanguage(l.label)}
                      className="px-4 py-2 rounded-full bg-emerald-600/20 border border-emerald-500 text-white text-sm cursor-pointer hover:bg-emerald-700/30 transition"
                    >
                      {l.label} · {l.level} ✕
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Séparateur CANON */}
          <div className="relative flex items-center justify-center my-10">
            <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
            <div className="relative z-10 w-4 h-4 rounded-full bg-emerald-500/30 ring-1 ring-emerald-400/40 shadow-[0_0_12px_rgba(16,185,129,0.35)]" />
          </div>

          {/* ================= COMPÉTENCES ================= */}
          <section>
            <h3 className="text-lg font-semibold text-emerald-300 mb-1">
              🧩 Compétences
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              Domaine + jusqu’à 5 compétences clés.
            </p>

            {/* Domaine + ajout */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative md:col-span-3">
                <select
                  value={categoryId}
                  onChange={(e) => {
                    setCategoryId(e.target.value);
                    setSelectedSkills([]);
                  }}
                  className="w-full bg-dark_bg_1/80 border border-white/10 text-white rounded-2xl px-6 py-5 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                >
                  <option
                    value=""
                    className="bg-dark_bg_2 text-gray-400 text-lg"
                  >
                    Choisir un domaine d’activité
                  </option>
                  {categories.map((c) => (
                    <option
                      key={c.id}
                      value={c.id}
                      className="bg-dark_bg_2 text-white text-lg"
                    >
                      {c.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-6 flex items-center text-emerald-400 text-lg">
                  ▾
                </div>
              </div>

              <div className="flex gap-2 md:col-span-2">
                <input
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  placeholder="Compétence personnalisée"
                  className="flex-1 bg-dark_bg_1/80 border border-white/10 text-white rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  onKeyDown={(e) => e.key === "Enter" && addCustomSkill()}
                />
                <button
                  onClick={addCustomSkill}
                  className="px-4 rounded-xl bg-emerald-600/20 border border-emerald-500 text-emerald-300 font-semibold hover:bg-emerald-600/30 transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Zone compétences */}
            <div className="min-h-[260px] rounded-2xl bg-white/5 border border-white/10 p-4">
              {availableSkills.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500 text-sm gap-3">
                  <span className="text-emerald-400 text-xl">🧠</span>
                  Sélectionne un domaine pour voir les compétences
                </div>
              ) : (
                <div className="max-h-56 overflow-y-auto space-y-2">
                  {availableSkills.map((skill) => {
                    const checked = selectedSkills.includes(skill.name);
                    return (
                      <label
                        key={skill.id}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition ${
                          checked
                            ? "bg-emerald-600/20 text-white"
                            : "hover:bg-white/5 text-gray-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={!checked && selectedSkills.length >= 5}
                          onChange={() => toggleSkill(skill.name)}
                          className="h-5 w-5 text-emerald-500"
                        />
                        <span className="text-sm font-medium">
                          {skill.name}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* FOOTER */}
          <div className="pt-10 flex justify-end">
            <button
              onClick={handleNext}
              disabled={
                loading || languages.length === 0 || selectedSkills.length === 0
              }
              className={`px-10 py-4 rounded-full text-lg font-semibold transition
    ${
      loading || languages.length === 0 || selectedSkills.length === 0
        ? "bg-white/10 text-gray-500 cursor-not-allowed pointer-events-none"
        : "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-xl hover:from-emerald-700 hover:to-emerald-800"
    }`}
            >
              {loading ? <PulseLoader color="#fff" size={12} /> : "Suivant"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
