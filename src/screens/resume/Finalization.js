import React, { useEffect, useRef, useState } from "react";

import axios from "axios";
import Confetti from "react-confetti";
import { QRCodeSVG } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import { useDispatch, useSelector } from "react-redux";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
 getResume,
 updateResume,
 previewResume,
 getResumeDownloadUrl,
 resetResumeState,
} from "../../store/slices/resumeSlice";
import {
 COLORS,
 CONTRACTS,
 FINALIZATION_STEPS,
 LANGUAGE_LEVELS,
 LANGUAGES_RESUME,
 MODAL_TITLES_STEP_FINALIZATION,
 PERSONAL_INFO_FIELDS,
 TEMPLATES,
} from "../../utils/IAResume";
import Photo from "../../components/core/Photo";
import Logout from "../../components/core/Logout";
import GoBack from "../../components/core/GoBack";
import Modal from "../../components/resume/Modal";
import Header from "../../components/resume/Header";
import StepButton from "../../components/resume/StepButton";
import TrainingForm from "../../components/resume/TrainingForm";
import FormSeparator from "../../components/resume/FormSeparator";
import ExperienceForm from "../../components/resume/ExperienceForm";

/* ================= CONSTANTES ================= */
const templates = TEMPLATES;
const colors = COLORS;
const languagesResume = LANGUAGES_RESUME;
const levels = LANGUAGE_LEVELS;
const contracts = CONTRACTS;
const personalInfoFields = PERSONAL_INFO_FIELDS;
const modalTitles = MODAL_TITLES_STEP_FINALIZATION;

export default function Finalization() {
 const IMAGE_BASE_URL = process.env.REACT_APP_AWS_IMAGE_BASE_URL;

 const dispatch = useDispatch();
 const navigate = useNavigate();
 const user = useSelector((state) => state.user.user);
 const { resume, previewHtml, status } = useSelector((state) => state.resume);
 const loading = status === "loading";

 const [activeStep, setActiveStep] = useState(null);
 const [showPreview, setShowPreview] = useState(false);
 const [showConfetti, setShowConfetti] = useState(true);
 const [deleteTarget, setDeleteTarget] = useState(null);
 // GO HOME
 const [showExitModal, setShowExitModal] = useState(false);

 useEffect(() => {
  const timer = setTimeout(() => setShowConfetti(false), 4000);
  return () => clearTimeout(timer);
 }, []);

 /* ================= STEP 1 ================= */
 const [title, setTitle] = useState("");
 const [template, setTemplate] = useState("");
 const [color, setColor] = useState("#10b981");
 const [templateOpen, setTemplateOpen] = useState(false);

 /* ================= STEP 2 ================= */
 const [form, setForm] = useState({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  website: "",
  contractType: [],
  alternanceDuration: "",
  alternanceStartDate: "",
 });

 /* ================= STEP 3 ================= */
 const [languages, setLanguages] = useState([]);
 const [selectedLang, setSelectedLang] = useState("");
 const [selectedLevel, setSelectedLevel] = useState("");
 const [skills, setSkills] = useState([]);
 const [customSkill, setCustomSkill] = useState("");
 const [softSkills, setSoftSkills] = useState([]);
 const [softSkillInput, setSoftSkillInput] = useState("");

 /* ================= STEP 4 ================= */
 const [presentation, setPresentation] = useState("");
 const [experiences, setExperiences] = useState([]);
 const [trainings, setTrainings] = useState([]);

 /* ================= STEP 5 ================= */
 const [videos, setVideos] = useState([]);
 const [selectedVideoId, setSelectedVideoId] = useState(null);
 const photoRef = useRef(null);
 const [videoSelectOpen, setVideoSelectOpen] = useState(false);
 const [deleteSkillTarget, setDeleteSkillTarget] = useState(null);

 const finalizationSteps = FINALIZATION_STEPS;

 /* ================= FETCH ================= */
 useEffect(() => {
  const resumeId = localStorage.getItem("resumeId");
  if (!resumeId || !user?.token) return;

  dispatch(getResume({ token: user.token, id: resumeId }));
  dispatch(previewResume({ token: user.token, id: resumeId }));
 }, [dispatch, user]);

 useEffect(() => {
  const close = () => setTemplateOpen(false);
  if (templateOpen) {
   window.addEventListener("click", close);
  }
  return () => window.removeEventListener("click", close);
 }, [templateOpen]);

 useEffect(() => {
  if (!user?.id || !user?.token) return;

  const fetchVideos = async () => {
   try {
    const { data } = await axios.get(
     `${process.env.REACT_APP_BASE_URL}/posts`,
     {
      params: {
       userId: user.id,
       page: 1,
       limit: 50,
      },
      headers: {
       Authorization: `Bearer ${user.token}`,
      },
     }
    );

    setVideos(Array.isArray(data.items) ? data.items : []);
   } catch (e) {
    console.error("Erreur récupération CV vidéos", e);
   }
  };

  fetchVideos();
 }, [user?.id]);

 useEffect(() => {
  const close = () => setVideoSelectOpen(false);
  if (videoSelectOpen) {
   window.addEventListener("click", close);
  }
  return () => window.removeEventListener("click", close);
 }, [videoSelectOpen]);

 /* ================= POPULATE ================= */
 useEffect(() => {
  if (!resume) return;

  setTitle(resume.title || "");
  setTemplate(resume.template || "");
  setColor(resume.mainColor || "#10b981");

  setForm({
   firstName: resume.personalInfo?.firstName || "",
   lastName: resume.personalInfo?.lastName || "",
   email: resume.personalInfo?.email || "",
   phone: resume.personalInfo?.phone || "",
   address: resume.personalInfo?.address || "",
   website: resume.personalInfo?.website || "",
   contractType: resume.contractType || [],
   alternanceDuration: resume.alternanceDuration || "",
   alternanceStartDate: resume.alternanceStartDate || "",
  });

  setLanguages(resume.languages || []);
  setSkills(resume.skills || []);
  setSoftSkills(resume.softSkills || []);
  setPresentation(resume.presentation || "");
  setExperiences(
   (resume.experiences || []).map((e) => ({
    ...e,
    startDate: parseDate(e.startDate),
    endDate: parseDate(e.endDate),
   }))
  );

  setTrainings(
   (resume.trainings || []).map((t) => ({
    ...t,
    startDate: parseDate(t.startDate),
    endDate: parseDate(t.endDate),
   }))
  );
 }, [resume]);

 /* ================= LANGUES AUTO ================= */
 useEffect(() => {
  if (!selectedLang || !selectedLevel) return;
  if (languages.some((l) => l.label === selectedLang)) return;

  setLanguages((prev) => [
   ...prev,
   { label: selectedLang, level: selectedLevel },
  ]);
  setSelectedLang("");
  setSelectedLevel("");
 }, [selectedLang, selectedLevel]);

 /* ================= SAVE ================= */

 // DATES
 const parseDate = (value) => {
  if (!value) return {};
  if (typeof value !== "string") return value;

  if (value === "En cours") {
   return "En cours";
  }

  const parts = value.split("/");

  if (parts.length === 3) {
   const [day, month, year] = parts;
   return { day, month, year };
  }

  if (parts.length === 2) {
   const [month, year] = parts;
   return { month, year };
  }

  if (/^\d{4}$/.test(value)) {
   return { year: value };
  }

  return {};
 };

 const formatDate = (d) => {
  if (!d) return "";
  if (d === "En cours") return "En cours";
  if (d.year && d.month && d.day) return `${d.day}/${d.month}/${d.year}`;
  if (d.year && d.month) return `${d.month}/${d.year}`;
  if (d.year) return `${d.year}`;
  return "";
 };

 const formatDDMMYYYY = (date) => {
  if (!date) return "";
  // date attendu : YYYY-MM-DD
  const [y, m, d] = date.split("-");
  return `${d}-${m}-${y}`;
 };

 const saveStep = async () => {
  let payload = { ...resume };

  if (activeStep === "customization") {
   payload = { ...payload, title, template, mainColor: color };
  }

  if (activeStep === "personalInfo") {
   payload = {
    ...payload,
    personalInfo: {
     firstName: form.firstName,
     lastName: form.lastName,
     email: form.email,
     phone: form.phone,
     address: form.address,
     website: form.website,
    },
    contractType: form.contractType,
    alternanceDuration: form.contractType.includes("Alternance")
     ? form.alternanceDuration
     : "",
    alternanceStartDate: form.contractType.includes("Alternance")
     ? formatDDMMYYYY(form.alternanceStartDate)
     : "",
   };
  }

  if (activeStep === "skillsAndLanguages") {
   payload = { ...payload, languages, skills, softSkills };
  }

  if (activeStep === "smartGeneration") {
   payload = {
    ...payload,
    presentation,
    experiences: experiences.map((e) => ({
     ...e,
     startDate: formatDate(e.startDate),
     endDate: formatDate(e.endDate),
    })),
    trainings: trainings.map((t) => ({
     ...t,
     startDate: formatDate(t.startDate),
     endDate: formatDate(t.endDate),
    })),
   };
  }

  if (activeStep === "medias") {
   payload = {
    ...payload,
    qrcodePostId: selectedVideoId,
   };
  }

  await dispatch(updateResume({ token: user.token, id: resume.id, payload }));
  dispatch(previewResume({ token: user.token, id: resume.id }));
  setActiveStep(null);
 };

 const handleBackHome = () => {
  setShowExitModal(true);
 };

 const confirmBackHome = () => {
  dispatch(resetResumeState());
  localStorage.removeItem("resumeId");
  setShowExitModal(false);
  navigate("/");
 };

 const cancelBackHome = () => {
  setShowExitModal(false);
 };

 return (
  <div className="relative h-screen dark:bg-dark_bg_1 overflow-hidden">
   {showConfetti && (
    <Confetti
     numberOfPieces={250}
     gravity={0.25}
     recycle={false}
     colors={["#10b981", "#34d399", "#6ee7b7", "#ffffff"]}
    />
   )}

   <Logout />
   <GoBack />

   <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
   <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-emerald-800/20 rounded-full blur-3xl pointer-events-none" />

   {/* ================= PAGE PRINCIPALE ================= */}
   <div className="relative z-10 h-full flex items-center justify-center px-4">
    <div className="w-full max-w-5xl min-h-[85vh] flex flex-col justify-between p-10 rounded-3xl bg-gradient-to-br from-dark_bg_2/80 to-dark_bg_1/80 backdrop-blur-xl shadow-2xl ring-1 ring-white/10">
     <Header
      step="Étape 5 · Finalisation"
      title="Félicitations !🎉"
      description="Clique sur une étape pour modifier ton CV, ou visualise le rendu final."
     />

     {/* ===== STEPS CENTRÉES – VERSION TACTILE ===== */}
     <div className="mt-12 grid grid-cols-1 gap-4 max-w-xl mx-auto w-full">
      {finalizationSteps.map((s) => (
       <StepButton
        key={s.key}
        step={s.step}
        label={s.label}
        desc={s.desc}
        onClick={() => setActiveStep(s.key)}
       />
      ))}
     </div>

     {/* ===== QR CODE + ACTION ===== */}
     <div className="mt-16 flex flex-col items-center">
      <p className="mb-6 text-sm text-gray-400 text-center max-w-md">
       Scanne le QR code pour récupérer ton CV. Il reste disponible à tout
       moment dans ton espace privé sur{" "}
       <span className="text-emerald-400 font-medium">jobissim.com</span>.
      </p>
      {/* QR Code */}
      <div className="bg-white p-5 rounded-2xl shadow-lg">
       <QRCodeSVG value={getResumeDownloadUrl(resume?.id)} />
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-col items-center gap-3">
       <button
        onClick={() => setShowPreview(true)}
        className="
        px-10 py-3
        rounded-full
        bg-gradient-to-r from-emerald-600 to-emerald-700
        text-white font-semibold
        shadow-lg
        active:scale-[0.98]
        transition
      "
       >
        Voir le CV
       </button>

       <button
        onClick={handleBackHome}
        className="
          px-8 py-2
          rounded-full
          bg-transparent
          text-gray-400
          underline underline-offset-4
          active:text-gray-200
        "
       >
        Retour à l’accueil
       </button>
      </div>
     </div>
    </div>
   </div>

   <Modal
    isOpen={!!activeStep}
    onClose={() => setActiveStep(null)}
    title={modalTitles[activeStep]}
    onSave={saveStep}
   >
    {/* === STEP 1 === */}
    {activeStep === "customization" && (
     <>
      <div>
       <label className="block text-emerald-300 font-semibold mb-2">
        Titre du CV
       </label>
       <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-4 py-3 bg-white/5 text-white rounded-xl"
       />
      </div>

      <FormSeparator />

      <div>
       <label className="block text-emerald-300 font-semibold mb-2">
        Template
       </label>
       <div className="relative">
        <button
         type="button"
         onClick={(e) => {
          e.stopPropagation();
          setTemplateOpen((v) => !v);
         }}
         className="w-full flex items-center justify-between px-4 py-3 bg-white/5 rounded-xl text-white border border-white/10"
        >
         <div className="flex items-center gap-3">
          {template && (
           <img
            src={templates.find((t) => t.key === template)?.image}
            alt=""
            className="w-8 h-12 object-cover rounded"
           />
          )}
          <span>
           {templates.find((t) => t.key === template)?.label ||
            "Choisir un template"}
          </span>
         </div>
         <span className="text-gray-400">▾</span>
        </button>

        {templateOpen && (
         <div
          className="absolute z-50 mt-2 w-full bg-dark_bg_1 rounded-xl border border-white/10 shadow-xl max-h-64 overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
         >
          {templates.map((t) => {
           const selected = t.key === template;
           return (
            <button
             key={t.key}
             type="button"
             onClick={() => {
              setTemplate(t.key);
              setTemplateOpen(false);
             }}
             className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/10 ${
              selected ? "bg-white/10" : ""
             }`}
            >
             <img
              src={t.image}
              alt={t.label}
              className="w-8 h-12 object-cover rounded"
             />
             <span className="flex-1 text-white">{t.label}</span>
             {selected && <span className="text-emerald-400">✓</span>}
            </button>
           );
          })}
         </div>
        )}
       </div>
      </div>

      <FormSeparator />

      <div>
       <label className="block text-emerald-300 font-semibold mb-2">
        Couleur principale
       </label>
       <div className="flex gap-3">
        {colors.map((c) => (
         <button
          key={c.value}
          onClick={() => setColor(c.value)}
          style={{ backgroundColor: c.value }}
          className={`w-9 h-9 rounded-full ${
           color === c.value ? "ring-4 ring-white" : ""
          }`}
         />
        ))}
       </div>
      </div>
     </>
    )}

    {/* === STEP 2 === */}
    {activeStep === "personalInfo" && (
     <>
      <div className="space-y-3">
       <h4 className="font-semibold text-emerald-300">
        Identité & coordonnées
       </h4>

       <div className="grid grid-cols-2 gap-4">
        {personalInfoFields.map((field) => (
         <input
          key={field.value}
          value={form[field.value]}
          onChange={(e) => setForm({ ...form, [field.value]: e.target.value })}
          placeholder={field.placeholder}
          className="px-4 py-3 bg-white/5 rounded-xl text-white"
         />
        ))}
       </div>
      </div>

      <FormSeparator />

      <div className="space-y-3">
       <h4 className="font-semibold text-emerald-300">Contrats recherchés</h4>

       <div className="flex flex-wrap gap-3">
        {contracts.map((c) => (
         <button
          key={c}
          onClick={() =>
           setForm((prev) => ({
            ...prev,
            contractType: prev.contractType.includes(c)
             ? prev.contractType.filter((x) => x !== c)
             : [...prev.contractType, c],
           }))
          }
          className={`
          px-4 py-2 rounded-full text-sm font-medium transition
          ${
           form.contractType.includes(c)
            ? "bg-emerald-600 text-white"
            : "bg-white/10 text-gray-300 hover:bg-white/20"
          }
        `}
         >
          {c}
         </button>
        ))}
       </div>
      </div>

      {form.contractType.includes("Alternance") && (
       <>
        <FormSeparator />

        <div className="space-y-3">
         <h4 className="font-semibold text-emerald-300">
          Détails de l’alternance
         </h4>

         <div className="grid grid-cols-2 gap-4">
          <input
           value={form.alternanceDuration}
           onChange={(e) =>
            setForm({
             ...form,
             alternanceDuration: e.target.value,
            })
           }
           placeholder="Durée (ex : 12 mois)"
           className="px-4 py-3 bg-white/5 rounded-xl text-white"
          />

          <input
           type="date"
           value={form.alternanceStartDate}
           onChange={(e) =>
            setForm({
             ...form,
             alternanceStartDate: e.target.value,
            })
           }
           className="px-4 py-3 bg-white/5 rounded-xl text-white"
          />
         </div>
        </div>
       </>
      )}
     </>
    )}

    {/* === STEP 3 === */}
    {activeStep === "skillsAndLanguages" && (
     <>
      {/* ===== LANGUES ===== */}
      <div className="space-y-3">
       <h4 className="font-semibold text-emerald-300">Langues</h4>

       <div className="grid grid-cols-2 gap-4">
        <select
         value={selectedLang}
         onChange={(e) => setSelectedLang(e.target.value)}
         className="w-full bg-dark_bg_1/80 border border-white/10 text-white rounded-xl px-5 py-4 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
        >
         <option value="" className="bg-dark_bg_2 text-gray-400 text-lg">
          Choisir une langue
         </option>
         {languagesResume.map((l) => (
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
         {levels.map((lvl) => (
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

       <div className="flex flex-wrap gap-3">
        {languages.map((l) => (
         <span
          key={l.label}
          onClick={() =>
           setLanguages((prev) => prev.filter((x) => x.label !== l.label))
          }
          className="px-4 py-2 bg-emerald-600/20 text-white rounded-full cursor-pointer"
         >
          {l.label} · {l.level} ✕
         </span>
        ))}
       </div>
      </div>

      <FormSeparator />

      {/* ===== COMPÉTENCES ===== */}
      <div className="space-y-3">
       <h4 className="font-semibold text-emerald-300">Savoir-faire</h4>

       <div className="flex gap-3">
        <input
         value={customSkill}
         onChange={(e) => setCustomSkill(e.target.value)}
         placeholder="Ajouter une compétence"
         className="flex-1 px-4 py-3 bg-white/5 rounded-xl text-white"
        />
        <button
         onClick={() => {
          if (!customSkill.trim() || skills.includes(customSkill)) return;
          setSkills((prev) => [...prev, customSkill]);
          setCustomSkill("");
         }}
         className="px-4 py-3 bg-emerald-600 rounded-xl text-white font-semibold"
        >
         +
        </button>
       </div>

       <div className="flex flex-wrap gap-3">
        {skills.map((s) => (
         <span
          key={s}
          onClick={() => setDeleteSkillTarget(s)}
          className="px-4 py-2 bg-emerald-600/20 text-white rounded-full cursor-pointer"
         >
          {s} ✕
         </span>
        ))}
       </div>
      </div>

      <FormSeparator />

      {/* ===== SAVOIR-ÊTRE ===== */}
      <div className="space-y-3">
       <h4 className="font-semibold text-emerald-300">Savoir-être</h4>

       {/* INPUT AJOUT */}
       <div className="flex items-stretch gap-3">
        <input
         value={softSkillInput}
         onChange={(e) => setSoftSkillInput(e.target.value)}
         placeholder="Ajouter un savoir-être"
         className="flex-1 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
         onKeyDown={(e) => {
          if (e.key === "Enter") {
           const value = softSkillInput.trim();
           if (!value) return;
           if (softSkills.includes(value)) return;
           if (softSkills.length >= 6) return;

           setSoftSkills((prev) => [...prev, value]);
           setSoftSkillInput("");
          }
         }}
        />

        <button
         onClick={() => {
          const value = softSkillInput.trim();
          if (!value) return;
          if (softSkills.includes(value)) return;
          if (softSkills.length >= 6) return;

          setSoftSkills((prev) => [...prev, value]);
          setSoftSkillInput("");
         }}
         className="px-6 py-3 rounded-2xl bg-emerald-600/20 border border-emerald-500 text-emerald-300 font-semibold"
        >
         +
        </button>
       </div>

       {/* LISTE DES SAVOIR-ÊTRE */}
       <div className="flex flex-wrap gap-3">
        {softSkills.length === 0 ? (
         <span className="text-sm text-gray-400">Aucun savoir-être ajouté</span>
        ) : (
         softSkills.map((s) => (
          <span
           key={s}
           onClick={() => setSoftSkills((prev) => prev.filter((x) => x !== s))}
           className="px-4 py-2 bg-emerald-600/20 border border-emerald-500 text-white rounded-full cursor-pointer hover:bg-emerald-700/30 transition"
          >
           {s} ✕
          </span>
         ))
        )}
       </div>
      </div>
     </>
    )}

    {/* === STEP 4 === */}
    {activeStep === "smartGeneration" && (
     <>
      <div>
       <label className="block text-emerald-300 font-semibold mb-2">
        Présentation
       </label>
       <textarea
        value={presentation}
        onChange={(e) => setPresentation(e.target.value)}
        className="w-full min-h-[120px] bg-white/5 text-white rounded-xl p-4"
       />
      </div>

      <FormSeparator />

      <Section title="Expériences">
       {experiences.map((exp, i) => (
        <ExperienceForm
         key={i}
         data={{ ...exp, __index: i }}
         onChange={(d) =>
          setExperiences((prev) => prev.map((e, idx) => (idx === i ? d : e)))
         }
         onDelete={(index) => setDeleteTarget({ type: "experience", index })}
        />
       ))}
      </Section>

      <button
       type="button"
       onClick={() =>
        setExperiences((prev) => [
         ...prev,
         {
          company: "",
          title: "",
          startDate: {},
          endDate: {},
          description: "",
         },
        ])
       }
       className="
        group
        w-full
        flex items-center justify-center gap-3
        px-6 py-4
        rounded-2xl
        border border-emerald-500/30
        bg-emerald-500/10
        text-emerald-300
        font-semibold
        transition
        hover:bg-emerald-500/20
        hover:border-emerald-400/60
      "
      >
       <span
        className="
          flex items-center justify-center
          w-9 h-9
          rounded-full
          bg-emerald-500/20
          group-hover:bg-emerald-500/30
          transition
        "
       >
        <FontAwesomeIcon icon={faPlus} />
       </span>
       Ajouter une expérience
      </button>

      <FormSeparator />

      <Section title="Formations">
       {trainings.map((t, i) => (
        <TrainingForm
         key={i}
         data={{ ...t, __index: i }}
         onChange={(d) =>
          setTrainings((prev) => prev.map((e, idx) => (idx === i ? d : e)))
         }
         onDelete={(index) => setDeleteTarget({ type: "training", index })}
        />
       ))}
      </Section>

      <button
       type="button"
       onClick={() =>
        setTrainings((prev) => [
         ...prev,
         {
          school: "",
          degree: "",
          startDate: {},
          endDate: {},
          description: "",
         },
        ])
       }
       className="
          group
          w-full
          flex items-center justify-center gap-3
          px-6 py-4
          rounded-2xl
          border border-emerald-500/30
          bg-emerald-500/10
          text-emerald-300
          font-semibold
          transition
          hover:bg-emerald-500/20
          hover:border-emerald-400/60
          "
      >
       <span
        className="
          flex items-center justify-center
          w-9 h-9
          rounded-full
          bg-emerald-500/20
          group-hover:bg-emerald-500/30
          transition
        "
       >
        <FontAwesomeIcon icon={faPlus} />
       </span>
       Ajouter une formation
      </button>
     </>
    )}

    {/* === STEP 5 === */}
    {activeStep === "medias" && (
     <>
      {/* PHOTO DE PROFIL */}
      <Section title="Photo de profil">
       <Photo ref={photoRef} user={user} mode="resume" />
      </Section>

      <FormSeparator />

      {/* CV VIDÉO */}
      <Section title="CV vidéo">
       <div className="relative">
        <button
         type="button"
         onClick={(e) => {
          e.stopPropagation();
          setVideoSelectOpen((v) => !v);
         }}
         disabled={videos.length === 0}
         className={`
          w-full flex items-center justify-between
          px-4 py-3 rounded-xl
          border border-white/10
          ${
           videos.length === 0
            ? "bg-white/5 text-gray-500 cursor-not-allowed"
            : "bg-white/5 text-white"
          }
    `}
        >
         <div className="flex items-center gap-3">
          {selectedVideoId &&
           (() => {
            const video = videos.find((v) => v.id === selectedVideoId);
            return (
             <img
              src={
               video?.image
                ? `${IMAGE_BASE_URL}/${video.image}`
                : "/placeholder-video.png"
              }
              alt=""
              className="w-10 h-10 object-cover rounded"
             />
            );
           })()}

          <span>
           {selectedVideoId
            ? videos.find((v) => v.id === selectedVideoId)?.title ||
              `CV vidéo #${selectedVideoId}`
            : videos.length === 0
            ? "Aucun CV vidéo disponible"
            : "Sélectionner un CV vidéo"}
          </span>
         </div>

         <span className="text-gray-400">▾</span>
        </button>

        {videoSelectOpen && videos.length > 0 && (
         <div
          className="
            absolute z-50 mt-2 w-full
            bg-dark_bg_1
            rounded-xl
            border border-white/10
            shadow-xl
            max-h-64 overflow-y-auto
          "
          onClick={(e) => e.stopPropagation()}
         >
          {videos.map((video) => {
           const selected = video.id === selectedVideoId;

           return (
            <button
             key={video.id}
             type="button"
             onClick={() => {
              setSelectedVideoId(video.id);
              setVideoSelectOpen(false);
             }}
             className={`
              w-full flex items-center gap-3
              px-4 py-3 text-left
              hover:bg-white/10
              ${selected ? "bg-white/10" : ""}
            `}
            >
             <img
              src={
               video.image
                ? `${IMAGE_BASE_URL}/${video.image}`
                : "/placeholder-video.png"
              }
              alt=""
              className="w-10 h-10 object-cover rounded"
             />

             <span className="flex-1 text-white">
              {video.title || `CV vidéo #${video.id}`}
             </span>
             {selected && <span className="text-emerald-400">✓</span>}
            </button>
           );
          })}
         </div>
        )}
       </div>

       <p className="text-sm text-gray-400 mt-2">
        Ce CV vidéo sera accessible via le QR code du CV.
       </p>
      </Section>
     </>
    )}
   </Modal>

   {/* ================= PREVIEW ================= */}
   {showPreview && (
    <div
     className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
     onClick={() => setShowPreview(false)}
    >
     <button
      onClick={() => setShowPreview(false)}
      className="absolute top-6 right-6 text-white text-2xl"
     >
      ✕
     </button>
     {loading ? (
      <PulseLoader color="#10b981" />
     ) : (
      <iframe
       srcDoc={previewHtml}
       title="CV"
       onClick={(e) => e.stopPropagation()}
       className="w-[794px] h-[1123px] bg-white"
      />
     )}
    </div>
   )}

   {/* ===================GO HOME============= */}
   {showExitModal && (
    <div className="fixed inset-0 flex items-center justify-center z-50">
     <div className="absolute inset-0 bg-black bg-opacity-75"></div>

     <div className="bg-white w-full max-w-md p-6 rounded-lg text-center z-50 relative">
      <p className="text-gray-800 text-lg font-semibold">
       Veux-tu vraiment revenir à l’accueil ?
      </p>
      <p className="text-gray-600 mt-2">
       Tu pourras toujours éditer ton CV depuis le site Jobissim.
      </p>

      <div className="mt-6 flex justify-center gap-4">
       <button
        className="bg-emerald-600 text-white px-6 py-2 rounded-md"
        onClick={confirmBackHome}
       >
        Oui
       </button>
       <button
        className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md"
        onClick={cancelBackHome}
       >
        Non
       </button>
      </div>
     </div>
    </div>
   )}

   {/* Confirm delete */}
   {deleteTarget && (
    <div className="fixed inset-0 flex items-center justify-center z-50">
     <div className="absolute inset-0 bg-black bg-opacity-75"></div>

     <div className="bg-white w-full max-w-md p-6 rounded-lg text-center z-50 relative">
      <p className="text-gray-800 text-lg font-semibold">
       Confirmer la suppression
      </p>
      <p className="text-gray-600 mt-2">Cette action est irréversible.</p>

      <div className="mt-6 flex justify-center gap-4">
       <button
        className="bg-red-600 text-white px-6 py-2 rounded-md"
        onClick={() => {
         if (deleteTarget.type === "experience") {
          setExperiences((prev) =>
           prev.filter((_, i) => i !== deleteTarget.index)
          );
         }
         if (deleteTarget.type === "training") {
          setTrainings((prev) =>
           prev.filter((_, i) => i !== deleteTarget.index)
          );
         }
         setDeleteTarget(null);
        }}
       >
        Supprimer
       </button>

       <button
        className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md"
        onClick={() => setDeleteTarget(null)}
       >
        Annuler
       </button>
      </div>
     </div>
    </div>
   )}

   {/* Confirm delete copétence */}
   {deleteSkillTarget && (
    <div className="fixed inset-0 flex items-center justify-center z-50">
     <div className="absolute inset-0 bg-black bg-opacity-75"></div>

     <div className="bg-white w-full max-w-md p-6 rounded-lg text-center z-50 relative">
      <p className="text-gray-800 text-lg font-semibold">
       Supprimer la compétence
      </p>
      <p className="text-gray-600 mt-2">
       Êtes-vous sûr de vouloir supprimer « {deleteSkillTarget} » ?
      </p>

      <div className="mt-6 flex justify-center gap-4">
       <button
        className="bg-red-600 text-white px-6 py-2 rounded-md"
        onClick={() => {
         setSkills((prev) => prev.filter((s) => s !== deleteSkillTarget));
         setDeleteSkillTarget(null);
        }}
       >
        Supprimer
       </button>

       <button
        className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md"
        onClick={() => setDeleteSkillTarget(null)}
       >
        Annuler
       </button>
      </div>
     </div>
    </div>
   )}
  </div>
 );
}

function Section({ title, children }) {
 return (
  <div className="mb-8">
   <h4 className="text-emerald-300 font-semibold mb-4">{title}</h4>
   <div className="space-y-4">{children}</div>
  </div>
 );
}
