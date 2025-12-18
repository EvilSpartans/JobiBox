import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import PulseLoader from "react-spinners/PulseLoader";
import { QRCodeSVG } from "qrcode.react";
import Confetti from "react-confetti";
import Photo from "../../components/core/Photo";
import Logout from "../../components/core/Logout";
import GoBack from "../../components/core/GoBack";
import {
  getResume,
  updateResume,
  previewResume,
  getResumeDownloadUrl,
  resetResumeState,
} from "../../store/slices/resumeSlice";

import template1 from "../../../assets/images/resume/template1.png";
import template2 from "../../../assets/images/resume/template2.png";
import template3 from "../../../assets/images/resume/template3.png";
import template4 from "../../../assets/images/resume/template4.png";
import template5 from "../../../assets/images/resume/template5.png";
import template6 from "../../../assets/images/resume/template6.png";
import template7 from "../../../assets/images/resume/template7.png";
import { useNavigate } from "react-router-dom";

/* ================= HELPERS DATES ================= */
const toInputDate = (date) => {
  if (!date) return "";
  if (date.includes("-") && date.length === 10) {
    const [d, m, y] = date.split("-");
    return `${y}-${m}-${d}`;
  }
  return date;
};

const fromInputDate = (date) => {
  if (!date) return "";
  const [y, m, d] = date.split("-");
  return `${d}-${m}-${y}`;
};

/* ================= CONSTANTES ================= */
const TEMPLATES = [
  { key: "template1", label: "Classique", image: template1 },
  { key: "template2", label: "Moderne", image: template2 },
  { key: "template3", label: "Créatif", image: template3 },
  { key: "template4", label: "Symétrie", image: template4 },
  { key: "template5", label: "Classique Moderne", image: template5 },
  { key: "template6", label: "Focus Contenu", image: template6 },
  { key: "template7", label: "Proportionnel", image: template7 },
];

const COLORS = [
  "#10b981",
  "#1e3a8a",
  "#6d28d9",
  "#dc2626",
  "#ea580c",
  "#facc15",
  "#111827",
];

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
const CONTRACTS = [
  "CDI",
  "CDD",
  "Alternance",
  "Stage",
  "Freelance",
  "Intérim",
  "Formation",
];

export default function Finalization() {
  const IMAGE_BASE_URL = process.env.REACT_APP_AWS_IMAGE_BASE_URL;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const overlayRef = useRef(null);

  const user = useSelector((state) => state.user.user);
  const { resume, previewHtml, status } = useSelector((state) => state.resume);
  const loading = status === "loading";

  const [activeStep, setActiveStep] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);

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

  /* ================= STEP 4 ================= */
  const [presentation, setPresentation] = useState("");
  const [experiences, setExperiences] = useState([]);
  const [trainings, setTrainings] = useState([]);

  /* ================= STEP 5 ================= */
  const [videos, setVideos] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const photoRef = useRef(null);
  const [videoSelectOpen, setVideoSelectOpen] = useState(false);

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
      alternanceStartDate: toInputDate(resume.alternanceStartDate),
    });

    setLanguages(resume.languages || []);
    setSkills(resume.skills || []);
    setPresentation(resume.presentation || "");
    setExperiences(resume.experiences || []);
    setTrainings(resume.trainings || []);
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
          ? fromInputDate(form.alternanceStartDate)
          : "",
      };
    }

    if (activeStep === "skillsAndLanguages") {
      payload = { ...payload, languages, skills };
    }

    if (activeStep === "smartGeneration") {
      payload = {
        ...payload,
        presentation,
        experiences: experiences.map((e) => ({
          ...e,
          startDate: fromInputDate(e.startDate),
          endDate: fromInputDate(e.endDate),
        })),
        trainings: trainings.map((t) => ({
          ...t,
          startDate: fromInputDate(t.startDate),
          endDate: fromInputDate(t.endDate),
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

  /* ================= RENDER ================= */
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

      {/* Background glow */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-emerald-800/20 rounded-full blur-3xl pointer-events-none" />

      {/* ================= PAGE PRINCIPALE ================= */}
      <div className="relative z-10 h-full flex items-center justify-center px-4">
        <div className="w-full max-w-5xl min-h-[85vh] flex flex-col justify-between p-10 rounded-3xl bg-gradient-to-br from-dark_bg_2/80 to-dark_bg_1/80 backdrop-blur-xl shadow-2xl ring-1 ring-white/10">
          {/* Header */}
          <div className="text-center space-y-5">
            <span
              className="inline-block px-4 py-1 rounded-full text-sm font-semibold 
                           bg-emerald-900/40 text-emerald-300"
            >
              Étape 5 · Finalisation
            </span>

            <h2 className="text-4xl font-extrabold text-white">
              Félicitations !<span className="text-emerald-400">🎉</span>
            </h2>

            <p className="text-gray-300 max-w-2xl mx-auto">
              Clique sur une étape pour modifier ton CV, ou visualise le rendu
              final.
            </p>
          </div>

          {/* ===== STEPS CENTRÉES ===== */}
          {/* ===== STEPS CENTRÉES – VERSION TACTILE ===== */}
          <div className="mt-12 grid grid-cols-1 gap-4 max-w-xl mx-auto w-full">
            {[
              {
                key: "customization",
                step: "01",
                label: "Personnalisation",
                desc: "Template, titre et couleur principale",
              },
              {
                key: "personalInfo",
                step: "02",
                label: "Informations personnelles",
                desc: "Coordonnées et type de contrat",
              },
              {
                key: "skillsAndLanguages",
                step: "03",
                label: "Compétences & Langues",
                desc: "Savoirs-faire et niveaux linguistiques",
              },
              {
                key: "smartGeneration",
                step: "04",
                label: "Génération intelligente",
                desc: "Présentation, expériences et formations",
              },
              {
                key: "medias",
                step: "05",
                label: "Médias",
                desc: "Photo de profil et CV vidéo",
              },
            ].map((s) => (
              <button
                key={s.key}
                onClick={() => setActiveStep(s.key)}
                className="
        w-full flex items-center gap-5
        px-6 py-5
        rounded-2xl
        bg-white/5 border border-white/10
        active:scale-[0.99]
        transition
      "
              >
                {/* Numéro */}
                <div
                  className="
          w-12 h-12 flex items-center justify-center
          rounded-xl
          bg-emerald-600 text-white
          font-bold
        "
                >
                  {s.step}
                </div>

                {/* Texte */}
                <div className="flex-1 text-left">
                  <div className="text-white font-semibold text-lg">
                    {s.label}
                  </div>
                  <div className="text-sm text-gray-400">{s.desc}</div>
                </div>

                {/* Icône action visible */}
                <div
                  className="
          w-10 h-10 flex items-center justify-center
          rounded-full
          bg-white/10 text-emerald-400
          text-lg
        "
                >
                  →
                </div>
              </button>
            ))}
          </div>

          {/* ===== QR CODE + ACTION ===== */}
          <div className="mt-16 flex flex-col items-center">
            {/* QR Code */}
            <div className="bg-white p-5 rounded-2xl shadow-lg">
              <QRCodeSVG value={getResumeDownloadUrl(resume?.id)} />
            </div>

            {/* Actions */}
            <div className="mt-10 flex flex-col items-center gap-4">
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
                onClick={() => {
                  dispatch(resetResumeState());
                  localStorage.removeItem("resumeId");
                  navigate("/");
                }}
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

      {/* ================= MODALE ================= */}
      {activeStep && (
        <div
          ref={overlayRef}
          onClick={(e) =>
            e.target === overlayRef.current && setActiveStep(null)
          }
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4"
        >
          <div className="relative w-full max-w-3xl h-[85vh] bg-dark_bg_2 rounded-2xl shadow-2xl ring-1 ring-white/10 flex flex-col">
            {/* ===== HEADER FIXE ===== */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">
                {activeStep === "customization" && "Personnalisation"}
                {activeStep === "personalInfo" && "Informations personnelles"}
                {activeStep === "skillsAndLanguages" && "Compétences & Langues"}
                {activeStep === "smartGeneration" && "Génération intelligente"}
                {activeStep === "medias" && "Médias"}
              </h3>
              <button
                onClick={() => setActiveStep(null)}
                className="text-white text-xl hover:text-emerald-400"
              >
                ✕
              </button>
            </div>

            {/* ===== CONTENT SCROLLABLE ===== */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
              {/* === STEP 1 === */}
              {activeStep === "customization" && (
                <>
                  <div>
                    <label className="block text-emerald-300 mb-2">
                      Titre du CV
                    </label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 text-white rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-emerald-300 mb-2">
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
                              src={
                                TEMPLATES.find((t) => t.key === template)?.image
                              }
                              alt=""
                              className="w-8 h-12 object-cover rounded"
                            />
                          )}
                          <span>
                            {TEMPLATES.find((t) => t.key === template)?.label ||
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
                          {TEMPLATES.map((t) => {
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
                                <span className="flex-1 text-white">
                                  {t.label}
                                </span>
                                {selected && (
                                  <span className="text-emerald-400">✓</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-emerald-300 mb-2">
                      Couleur principale
                    </label>
                    <div className="flex gap-3">
                      {COLORS.map((c) => (
                        <button
                          key={c}
                          onClick={() => setColor(c)}
                          style={{ backgroundColor: c }}
                          className={`w-9 h-9 rounded-full ${
                            color === c ? "ring-4 ring-white" : ""
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
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      "firstName",
                      "lastName",
                      "email",
                      "phone",
                      "address",
                      "website",
                    ].map((f) => (
                      <input
                        key={f}
                        value={form[f]}
                        onChange={(e) =>
                          setForm({ ...form, [f]: e.target.value })
                        }
                        placeholder={f}
                        className="px-4 py-3 bg-white/5 rounded-xl text-white"
                      />
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {CONTRACTS.map((c) => (
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
                        className={`px-4 py-2 rounded-full ${
                          form.contractType.includes(c)
                            ? "bg-emerald-600 text-white"
                            : "bg-white/10 text-gray-300"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>

                  {form.contractType.includes("Alternance") && (
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        value={form.alternanceDuration}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            alternanceDuration: e.target.value,
                          })
                        }
                        placeholder="Durée alternance"
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
                  )}
                </>
              )}

              {/* === STEP 3 === */}
              {activeStep === "skillsAndLanguages" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      value={selectedLang}
                      onChange={(e) => setSelectedLang(e.target.value)}
                      className="bg-white/5 text-white rounded-xl px-4 py-3"
                    >
                      <option value="">Langue</option>
                      {LANGUAGES.map((l) => (
                        <option key={l}>{l}</option>
                      ))}
                    </select>

                    <select
                      value={selectedLevel}
                      onChange={(e) => setSelectedLevel(e.target.value)}
                      className="bg-white/5 text-white rounded-xl px-4 py-3"
                    >
                      <option value="">Niveau</option>
                      {LEVELS.map((l) => (
                        <option key={l}>{l}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {languages.map((l) => (
                      <span
                        key={l.label}
                        onClick={() =>
                          setLanguages((prev) =>
                            prev.filter((x) => x.label !== l.label)
                          )
                        }
                        className="px-4 py-2 bg-emerald-600/20 text-white rounded-full cursor-pointer"
                      >
                        {l.label} · {l.level} ✕
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <input
                      value={customSkill}
                      onChange={(e) => setCustomSkill(e.target.value)}
                      placeholder="Compétence"
                      className="flex-1 px-4 py-3 bg-white/5 rounded-xl text-white"
                    />
                    <button
                      onClick={() => {
                        if (!customSkill.trim() || skills.includes(customSkill))
                          return;
                        setSkills((prev) => [...prev, customSkill]);
                        setCustomSkill("");
                      }}
                      className="px-4 py-3 bg-emerald-600 rounded-xl text-white"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {skills.map((s) => (
                      <span
                        key={s}
                        onClick={() =>
                          window.confirm(`Supprimer la compétence "${s}" ?`) &&
                          setSkills((prev) => prev.filter((x) => x !== s))
                        }
                        className="px-4 py-2 bg-emerald-600/20 text-white rounded-full cursor-pointer"
                      >
                        {s} ✕
                      </span>
                    ))}
                  </div>
                </>
              )}

              {/* === STEP 4 === */}
              {activeStep === "smartGeneration" && (
                <>
                  <div>
                    <label className="block text-emerald-300 mb-2">
                      Présentation
                    </label>
                    <textarea
                      value={presentation}
                      onChange={(e) => setPresentation(e.target.value)}
                      className="w-full min-h-[120px] bg-white/5 text-white rounded-xl p-4"
                    />
                  </div>

                  <Section title="Expériences">
                    {experiences.map((exp, i) => (
                      <ExperienceForm
                        key={i}
                        data={exp}
                        onChange={(d) =>
                          setExperiences((prev) =>
                            prev.map((e, idx) => (idx === i ? d : e))
                          )
                        }
                      />
                    ))}
                  </Section>

                  <Section title="Formations">
                    {trainings.map((t, i) => (
                      <TrainingForm
                        key={i}
                        data={t}
                        onChange={(d) =>
                          setTrainings((prev) =>
                            prev.map((e, idx) => (idx === i ? d : e))
                          )
                        }
                      />
                    ))}
                  </Section>
                </>
              )}

              {/* === STEP 5 === */}
              {activeStep === "medias" && (
                <>
                  {/* PHOTO DE PROFIL */}
                  <Section title="Photo de profil">
                    <Photo ref={photoRef} user={user} mode="resume" />
                  </Section>

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
                              const video = videos.find(
                                (v) => v.id === selectedVideoId
                              );
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
                              ? videos.find((v) => v.id === selectedVideoId)
                                  ?.title || `CV vidéo #${selectedVideoId}`
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
                                {selected && (
                                  <span className="text-emerald-400">✓</span>
                                )}
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
            </div>

            {/* ===== FOOTER FIXE ===== */}
            <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-4">
              <button
                onClick={() => setActiveStep(null)}
                className="text-gray-300"
              >
                Annuler
              </button>
              <button
                onClick={saveStep}
                className="px-6 py-2 bg-emerald-600 text-white rounded-full"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
}

/* ================= UI ================= */
function Step({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex justify-between px-5 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10"
    >
      <span className="text-gray-200">{label}</span>
      <span className="text-emerald-400">Modifier</span>
    </button>
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

function ExperienceForm({ data, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl">
      <input
        value={data.company}
        onChange={(e) => onChange({ ...data, company: e.target.value })}
        className="bg-dark_bg_1/80 text-white rounded-xl px-3 py-2"
      />
      <input
        value={data.title}
        onChange={(e) => onChange({ ...data, title: e.target.value })}
        className="bg-dark_bg_1/80 text-white rounded-xl px-3 py-2"
      />
      <input
        type="date"
        value={toInputDate(data.startDate)}
        onChange={(e) => onChange({ ...data, startDate: e.target.value })}
        className="bg-dark_bg_1/80 text-white rounded-xl px-3 py-2"
      />
      <input
        type="date"
        value={toInputDate(data.endDate)}
        onChange={(e) => onChange({ ...data, endDate: e.target.value })}
        className="bg-dark_bg_1/80 text-white rounded-xl px-3 py-2"
      />
      <textarea
        value={data.description}
        onChange={(e) => onChange({ ...data, description: e.target.value })}
        className="col-span-2 bg-dark_bg_1/80 text-white rounded-xl px-3 py-2"
      />
    </div>
  );
}

function TrainingForm({ data, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl">
      <input
        value={data.school}
        onChange={(e) => onChange({ ...data, school: e.target.value })}
        className="bg-dark_bg_1/80 text-white rounded-xl px-3 py-2"
      />
      <input
        value={data.degree}
        onChange={(e) => onChange({ ...data, degree: e.target.value })}
        className="bg-dark_bg_1/80 text-white rounded-xl px-3 py-2"
      />
      <input
        type="date"
        value={toInputDate(data.startDate)}
        onChange={(e) => onChange({ ...data, startDate: e.target.value })}
        className="bg-dark_bg_1/80 text-white rounded-xl px-3 py-2"
      />
      <input
        type="date"
        value={toInputDate(data.endDate)}
        onChange={(e) => onChange({ ...data, endDate: e.target.value })}
        className="bg-dark_bg_1/80 text-white rounded-xl px-3 py-2"
      />
      <textarea
        value={data.description}
        onChange={(e) => onChange({ ...data, description: e.target.value })}
        className="col-span-2 bg-dark_bg_1/80 text-white rounded-xl px-3 py-2"
      />
    </div>
  );
}
