import React, { useEffect, useState } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import Logout from "../../components/core/Logout";
import PulseLoader from "react-spinners/PulseLoader";
import { useDispatch, useSelector } from "react-redux";

import GoBack from "../../components/core/GoBack";
import { getCategories } from "../../store/slices/categorySlice";
import { getSoftSkills } from "../../store/slices/softSkillSlice";
import { LANGUAGE_LEVELS, LANGUAGES_RESUME } from "../../utils/IAResume";
import { getResume, updateResume } from "../../store/slices/resumeSlice";
import Footer from "../../components/resume/Footer";
import Header from "../../components/resume/Header";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const LANGUAGES = LANGUAGES_RESUME;
const LEVELS = LANGUAGE_LEVELS;

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
 const [availableSoftSkills, setAvailableSoftSkills] = useState([]);
 const [selectedSkills, setSelectedSkills] = useState([]);
 const [customSkill, setCustomSkill] = useState("");

 // onglets
 const [activeTab, setActiveTab] = useState("hard");

 // soft skills
 const softSkillState = useSelector((state) => state.softSkill);
 const softSkillResults = softSkillState.softSkills || [];

 const [softSkills, setSoftSkills] = useState([]);
 const [softSkillInput, setSoftSkillInput] = useState("");

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

  if (Array.isArray(resume.softSkills)) {
   setSoftSkills(resume.softSkills);
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

 useEffect(() => {
  if (!selectedLang || !selectedLevel) return;
  if (languages.length >= 5) return;
  if (languages.some((l) => l.label === selectedLang)) return;

  setLanguages((prev) => [
   ...prev,
   { label: selectedLang, level: selectedLevel },
  ]);

  setSelectedLang("");
  setSelectedLevel("");
 }, [selectedLang, selectedLevel]);

 // Fetch softSkills
 // Fetch soft skills (initial + filtre)
 useEffect(() => {
  dispatch(getSoftSkills(softSkillInput || ""));
 }, [dispatch, softSkillInput]);

 // Remplacement direct des propositions (pas de merge)
 useEffect(() => {
  setAvailableSoftSkills(softSkillResults || []);
 }, [softSkillResults]);

 // Pré-sélection par défaut (une seule fois)
 useEffect(() => {
  if (availableSoftSkills.length > 0 && softSkills.length === 0) {
   setSoftSkills(availableSoftSkills.slice(0, 3).map((s) => s.name));
  }
 }, [availableSoftSkills]);

 /* ---------- HANDLERS ---------- */

 const removeLanguage = (label) => {
  setLanguages((prev) => prev.filter((l) => l.label !== label));
 };

 const toggleSkill = (label) => {
  setSelectedSkills((prev) => {
   if (prev.includes(label)) {
    return prev.filter((s) => s !== label);
   }
   if (prev.length >= 6) return prev; // limite conseillée
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
  if (selectedSkills.length >= 6) return;

  // ajout en tête de la liste visible
  setAvailableSkills((prev) => [
   { id: `custom-${value}`, name: value },
   ...prev,
  ]);

  // sélection immédiate
  setSelectedSkills((prev) => [value, ...prev]);

  setCustomSkill("");
 };

 const toggleSoftSkill = (label) => {
  setSoftSkills((prev) => {
   if (prev.includes(label)) {
    return prev.filter((s) => s !== label);
   }
   if (prev.length >= 6) return prev;
   return [...prev, label];
  });
 };

 const addCustomSoftSkill = () => {
  const value = softSkillInput.trim();
  if (!value) return;

  if (softSkills.includes(value)) {
   setSoftSkillInput("");
   return;
  }

  if (softSkills.length >= 6) return;

  // push dans la liste affichée (COMME SAVOIR-FAIRE)
  setAvailableSoftSkills((prev) => [
   { id: `custom-${value}`, name: value },
   ...prev,
  ]);

  // sélection immédiate
  setSoftSkills((prev) => [value, ...prev]);

  setSoftSkillInput("");
 };

 const handleNext = async () => {
  if (languages.length === 0 || selectedSkills.length === 0 || loading) return;

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
   softSkills: softSkills,
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


 return (
  <div className="relative h-screen dark:bg-dark_bg_1 overflow-hidden">
   <Logout />
   <GoBack />

   {/* Glow background */}
   <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-emerald-600/20 blur-3xl pointer-events-none" />
   <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-emerald-800/20 blur-3xl pointer-events-none" />

   <div className="relative z-10 h-full flex items-center justify-center px-4">
    <div className="flex flex-col w-full max-w-5xl min-h-[85vh] max-h-[90vh] overflow-y-auto scrollbar-none p-8 rounded-3xl bg-gradient-to-br from-dark_bg_2/80 to-dark_bg_1/80 backdrop-blur-xl shadow-2xl ring-1 ring-white/10">
     <Header
      step="Étape 3 · Compétences & Langues"
      title="Tes compétences clés"
      description="Sélectionne ton domaine, tes compétences et les langues maîtrisées."
     />

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
        onChange={(e) => setSelectedLang(e.target.value)}
        className="w-full bg-dark_bg_1/80 border border-white/10 text-white rounded-xl px-5 py-4 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
       >
        <option value="" className="bg-dark_bg_2 text-gray-400 text-lg">
         Choisir une langue
        </option>
        {LANGUAGES.map((l) => (
         <option key={l} value={l} className="bg-dark_bg_2 text-white text-lg">
          {l}
         </option>
        ))}
       </select>

       <select
        value={selectedLevel}
        onChange={(e) => setSelectedLevel(e.target.value)}
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
      {/* ONGLET SWITCH */}
      <div className="flex justify-center mb-8">
       <div className="inline-flex rounded-full bg-white/5 border border-white/10 p-1">
        <button
         onClick={() => setActiveTab("hard")}
         className={`px-6 py-2 rounded-full text-sm font-semibold transition ${
          activeTab === "hard"
           ? "bg-emerald-600 text-white"
           : "text-gray-400 hover:text-white"
         }`}
        >
         🧩 Savoir-faire
        </button>
        <button
         onClick={() => setActiveTab("soft")}
         className={`px-6 py-2 rounded-full text-sm font-semibold transition ${
          activeTab === "soft"
           ? "bg-emerald-600 text-white"
           : "text-gray-400 hover:text-white"
         }`}
        >
         💬 Savoir-être
        </button>
       </div>
      </div>

      {/* ================= SAVOIR-FAIRE ================= */}
      {activeTab === "hard" && (
       <>
        <h3 className="text-lg font-semibold text-emerald-300 mb-1">
         🧩 Savoir-faire
        </h3>
        <p className="text-sm text-gray-400 mb-6">
         Domaine + jusqu’à 6 compétences techniques.
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
           <option value="" className="bg-dark_bg_2 text-gray-400 text-lg">
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

        {/* Zone savoir-faire */}
        <div className="h-[240px] rounded-2xl bg-white/5 border border-white/10 p-4 flex flex-col">
         {availableSkills.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-sm gap-3">
           <span className="text-emerald-400 text-xl">🧠</span>
           Sélectionne un domaine pour voir les compétences
          </div>
         ) : (
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
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
               disabled={!checked && selectedSkills.length >= 6}
               onChange={() => toggleSkill(skill.name)}
               className="h-5 w-5 text-emerald-500"
              />
              <span className="text-sm font-medium">{skill.name}</span>
             </label>
            );
           })}
          </div>
         )}
        </div>
       </>
      )}

      {/* ================= SAVOIR-ÊTRE ================= */}
      {activeTab === "soft" && (
       <>
        <h3 className="text-lg font-semibold text-emerald-300 mb-1">
         💬 Savoir-être
        </h3>
        <p className="text-sm text-gray-400 mb-6">
         Sélectionne jusqu’à 6 qualités humaines.
        </p>

        {/* INPUT */}
        <div className="mb-6 flex items-stretch gap-3">
         <input
          value={softSkillInput}
          onChange={(e) => setSoftSkillInput(e.target.value)}
          placeholder="Rechercher ou ajouter un savoir-être"
          className="flex-1 bg-dark_bg_1/80 border border-white/10 text-white rounded-2xl px-6 py-5 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          onKeyDown={(e) => e.key === "Enter" && addCustomSoftSkill()}
         />

         <button
          onClick={addCustomSoftSkill}
          disabled={softSkills.length >= 6}
          className="px-6 py-5 rounded-2xl bg-emerald-600/20 border border-emerald-500 text-emerald-300 font-semibold hover:bg-emerald-600/30 transition disabled:opacity-40 disabled:cursor-not-allowed"
         >
          +
         </button>
        </div>

        {/* GRID 2 COLONNES — HAUTEUR FIXE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* ===== PROPOSITIONS ===== */}
         <div className="h-[240px] rounded-2xl bg-white/5 border border-white/10 p-4 flex flex-col">
          <h4 className="text-sm font-semibold text-gray-300 mb-3">
           Propositions
          </h4>

          {availableSoftSkills.length === 0 ? (
           <div className="flex-1 flex items-center justify-center text-gray-500 text-sm gap-3">
            <span className="text-emerald-400 text-xl">💡</span>
            Aucune proposition trouvée
           </div>
          ) : (
           <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {availableSoftSkills.map((skill) => {
             const checked = softSkills.includes(skill.name);

             return (
              <label
               key={skill.id}
               className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition ${
                checked
                 ? "bg-emerald-600/20 text-white opacity-60 cursor-not-allowed"
                 : "hover:bg-white/5 text-gray-300"
               }`}
              >
               <input
                type="checkbox"
                checked={checked}
                disabled={checked || softSkills.length >= 6}
                onChange={() => toggleSoftSkill(skill.name)}
                className="h-5 w-5 text-emerald-500"
               />
               <span className="text-sm font-medium">{skill.name}</span>
              </label>
             );
            })}
           </div>
          )}
         </div>

         {/* ===== SÉLECTION ===== */}
         <div className="h-[240px] rounded-2xl bg-white/5 border border-white/10 p-4 flex flex-col">
          <h4 className="text-sm font-semibold text-gray-300 mb-3">
           Sélection ({softSkills.length}/6)
          </h4>

          {softSkills.length === 0 ? (
           <div className="flex-1 flex items-center justify-center text-gray-500 text-sm gap-3">
            <span className="text-emerald-400 text-xl">💬</span>
            Aucun savoir-être sélectionné
           </div>
          ) : (
           <div className="flex-1 overflow-y-auto flex flex-wrap gap-3 content-start">
            {softSkills.map((label) => (
             <span
              key={label}
              onClick={() => toggleSoftSkill(label)}
              className="px-4 py-2 rounded-full bg-emerald-600/20 border border-emerald-500 text-white text-sm cursor-pointer hover:bg-emerald-700/30 transition"
             >
              {label} ✕
             </span>
            ))}
           </div>
          )}
         </div>
        </div>
       </>
      )}
     </section>

     <div className="pt-10 flex justify-end">
      <Footer
       onClick={handleNext}
       disabled={
        loading || languages.length === 0 || selectedSkills.length === 0
       }
       loading={loading}
      />
     </div>
    </div>
   </div>
  </div>
 );
}
