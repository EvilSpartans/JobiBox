import template1 from "../../assets/images/resume/template1.png";
import template2 from "../../assets/images/resume/template2.png";
import template3 from "../../assets/images/resume/template3.png";
import template4 from "../../assets/images/resume/template4.png";
import template5 from "../../assets/images/resume/template5.png";
import template6 from "../../assets/images/resume/template6.png";
import template7 from "../../assets/images/resume/template7.png";
import template8 from "../../assets/images/resume/template8.jpg";
import template9 from "../../assets/images/resume/template9.jpg";
import template10 from "../../assets/images/resume/template10.jpg";
import template11 from "../../assets/images/resume/template11.jpg";
import template12 from "../../assets/images/resume/template12.jpg";
import template13 from "../../assets/images/resume/template13.jpg";
import template14 from "../../assets/images/resume/template14.jpg";
import template15 from "../../assets/images/resume/template15.jpg";
import template16 from "../../assets/images/resume/template16.jpg";

export const CV_STEPS_STEPPER = [
 {
  id: 1,
  key: "personnalisation",
  label: "PERSONNALISATION",
  path: "/personnalization",
  icon: "palette",
 },
 {
  id: 2,
  key: "informations",
  label: "PROFIL CANDIDAT",
  path: "/personalInfo",
  icon: "user",
 },
 {
  id: 3,
  key: "interests",
  label: "CENTRE D'INTÉRÊT",
  path: "/interestsAndMore",
  icon: "heart",
 },
 {
  id: 4,
  key: "competences",
  label: "COMPÉTENCES",
  path: "/skillsAndLanguages",
  icon: "skills",
 },
 {
  id: 5,
  key: "ia",
  label: "GÉNÉRATION IA",
  path: "/smartGeneration",
  icon: "sparkles",
 },
 {
  id: 6,
  key: "finalisation",
  label: "FINALISATION",
  path: "/finalization",
  icon: "check",
 },
];

export const RESUME_IA_STEPS = [
 {
  step: "01",
  title: "Personnalisation",
  desc: "Choix du titre, du design et de la couleur de ton CV",
 },
 {
  step: "02",
  title: "Profil candidat",
  desc: "Informations personnelles et type de contrat recherché",
 },
 {
  step: "03",
  title: "Centre d'intérêt & autres",
  desc: "Centres d'intérêt, réseaux sociaux, permis et informations complémentaires",
 },
 {
  step: "04",
  title: "Compétences & langues",
  desc: "Sélection de tes skills et langues clés",
 },
 {
  step: "05",
  title: "Génération intelligente",
  desc:
   "L’IA génère automatiquement ta présentation, tes expériences et formations",
 },
 {
  step: "06",
  title: "Finalisation",
  desc: "Ajout de la photo, du CV vidéo et validation du CV papier",
 },
];

export const TEMPLATES = [
 { key: "template1", label: "Classique", image: template1 },
 { key: "template2", label: "Moderne", image: template2 },
 { key: "template3", label: "Créatif", image: template3 },
 { key: "template4", label: "Symétrie", image: template4 },
 { key: "template5", label: "Classique Moderne", image: template5 },
 { key: "template6", label: "Focus Contenu", image: template6 },
 { key: "template7", label: "Proportionnel", image: template7 },
 { key: "template8", label: "Template 8", image: template8 },
 { key: "template9", label: "Template 9", image: template9 },
 { key: "template10", label: "Template 10", image: template10 },
 { key: "template11", label: "Template 11", image: template11 },
 { key: "template12", label: "Template 12", image: template12 },
 { key: "template13", label: "Template 13", image: template13 },
 { key: "template14", label: "Template 14", image: template14 },
 { key: "template15", label: "Template 15", image: template15 },
 { key: "template16", label: "Template 16", image: template16 },
];

export const COLORS = [
 { name: "Émeraude", value: "#10b981" },
 { name: "Bleu nuit", value: "#1e3a8a" },
 { name: "Bleu clair", value: "#2563eb" },
 { name: "Bleu ciel", value: "#0ea5e9" },
 { name: "Cyan", value: "#06b6d4" },
 { name: "Turquoise", value: "#14b8a6" },
 { name: "Violet", value: "#6d28d9" },
 { name: "Prune", value: "#7c3aed" },
 { name: "Fuchsia", value: "#a855f7" },
 { name: "Rose", value: "#ec4899" },
 { name: "Rouge", value: "#dc2626" },
 { name: "Bordeaux", value: "#7f1d1d" },
 { name: "Corail", value: "#f43f5e" },
 { name: "Orange", value: "#ea580c" },
 { name: "Ambre", value: "#f59e0b" },
 { name: "Jaune doré", value: "#facc15" },
 { name: "Vert lime", value: "#84cc16" },
 { name: "Vert forêt", value: "#15803d" },
 { name: "Gris ardoise", value: "#475569" },
 { name: "Noir", value: "#111827" },
];

export const CONTRACTS = [
 "CDI",
 "CDD",
 "Alternance",
 "Stage",
 "Freelance",
 "Intérim",
 "Formation",
];

export const DRIVING_LICENSES = [
 "B",
 "BE",
 "C",
 "CE",
 "C1",
 "C1E",
 "D",
 "DE",
 "En cours",
];

export const LANGUAGES_RESUME = [
 "Français",
 "Anglais",
 "Espagnol",
 "Allemand",
 "Italien",
 "Portugais",
 "Arabe",
];

export const LANGUAGE_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2", "Natif"];

export const SMART_GENERATION_STEP_KEYS = {
 1: "presentation",
 2: "trainings",
 3: "experiences",
};

export const SMART_GENERATION_STEPS_CONFIG = [
 {
  id: 1,
  titleKey: "resume.smartGeneration.presenteToi",
  subtitleKey: "resume.smartGeneration.subtitle1",
  descKey: "resume.smartGeneration.desc1",
  exampleKey: "resume.smartGeneration.example1",
 },
 {
  id: 2,
  titleKey: "resume.smartGeneration.formations",
  subtitleKey: "resume.smartGeneration.subtitle2",
  descKey: "resume.smartGeneration.desc2",
  exampleKey: "resume.smartGeneration.example2",
 },
 {
  id: 3,
  titleKey: "resume.smartGeneration.experiences",
  subtitleKey: "resume.smartGeneration.subtitle3",
  descKey: "resume.smartGeneration.desc3",
  exampleKey: "resume.smartGeneration.example3",
 },
];

export const RESUME_DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

export const RESUME_MONTHS = [
 { value: "01", label: "Janvier" },
 { value: "02", label: "Février" },
 { value: "03", label: "Mars" },
 { value: "04", label: "Avril" },
 { value: "05", label: "Mai" },
 { value: "06", label: "Juin" },
 { value: "07", label: "Juillet" },
 { value: "08", label: "Août" },
 { value: "09", label: "Septembre" },
 { value: "10", label: "Octobre" },
 { value: "11", label: "Novembre" },
 { value: "12", label: "Décembre" },
];

export const MONTHS_FR_TO_NUM = {
 JANVIER: "01",
 FÉVRIER: "02",
 FEVRIER: "02",
 MARS: "03",
 AVRIL: "04",
 MAI: "05",
 JUIN: "06",
 JUILLET: "07",
 AOÛT: "08",
 AOUT: "08",
 SEPTEMBRE: "09",
 OCTOBRE: "10",
 NOVEMBRE: "11",
 DÉCEMBRE: "12",
 DECEMBRE: "12",
};

export const RESUME_YEARS = Array.from(
 { length: 60 },
 (_, i) => new Date().getFullYear() - i,
);

export const FINALIZATION_STEPS = [
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
];

export const PERSONAL_INFO_FIELDS = [
 { value: "firstName", placeholder: "Ajouter un prénom" },
 { value: "lastName", placeholder: "Ajouter un nom" },
 { value: "email", placeholder: "Ajouter une adresse email" },
 { value: "phone", placeholder: "Ajouter un numéro de téléphone" },
 { value: "address", placeholder: "Ajouter une adresse" },
 { value: "website", placeholder: "Ajouter un site web" },
];

export const MODAL_TITLES_STEP_FINALIZATION = {
 customization: "Personnalisation",
 personalInfo: "Informations personnelles",
 skillsAndLanguages: "Compétences & Langues",
 smartGeneration: "Génération intelligente",
 medias: "Médias",
};
