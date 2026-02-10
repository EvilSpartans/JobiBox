import template1 from "../../assets/images/resume/template1.png";
import template2 from "../../assets/images/resume/template2.png";
import template3 from "../../assets/images/resume/template3.png";
import template4 from "../../assets/images/resume/template4.png";
import template5 from "../../assets/images/resume/template5.png";
import template6 from "../../assets/images/resume/template6.png";
import template7 from "../../assets/images/resume/template7.png";

export const CV_STEPS_STEPPER = [
 {
  id: 1,
  key: "personnalisation",
  label: "PERSONNALISATION",
  sublabel: "Template & Couleurs",
  path: "/personnalization",
  icon: "palette",
 },
 {
  id: 2,
  key: "informations",
  label: "PROFIL CANDIDAT",
  sublabel: "Données personnelles",
  path: "/personalInfo",
  icon: "user",
 },
 {
  id: 3,
  key: "competences",
  label: "COMPÉTENCES & LANGUES",
  sublabel: "Skills & Langues",
  path: "/skillsAndLanguages",
  icon: "skills",
 },
 {
  id: 4,
  key: "ia",
  label: "GÉNÉRATION INTELLIGENTE",
  sublabel: "Génération intelligente",
  path: "/smartGeneration",
  icon: "sparkles",
 },
 {
  id: 5,
  key: "finalisation",
  label: "FINALISATION",
  sublabel: "Aperçu & Export",
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
  title: "Compétences & langues",
  desc: "Sélection de tes skills et langues clés",
 },
 {
  step: "04",
  title: "Génération intelligente",
  desc:
   "L’IA génère automatiquement ta présentation, tes expériences et formations",
 },
 {
  step: "05",
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
];

export const COLORS = [
 { name: "Émeraude", value: "#10b981" },
 { name: "Bleu nuit", value: "#1e3a8a" },
 { name: "Bleu clair", value: "#2563eb" },
 { name: "Violet", value: "#6d28d9" },
 { name: "Prune", value: "#7c3aed" },
 { name: "Rouge", value: "#dc2626" },
 { name: "Bordeaux", value: "#7f1d1d" },
 { name: "Orange", value: "#ea580c" },
 { name: "Jaune doré", value: "#facc15" },
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
  title: "Présente-toi",
  subtitle: "Qui es-tu ?",
  description:
   "Présente-toi librement en quelques phrases. Dis qui tu es, ce que tu recherches et ce qui te motive.",
  example:
   "« Je m’appelle Alex, j’ai 24 ans et je recherche un poste dans la logistique. J’aime le travail d’équipe et je suis motivé à apprendre et évoluer rapidement. »",
 },
 {
  id: 2,
  title: "Formations & parcours scolaire",
  subtitle: "Ton parcours académique",
  description:
   "Parle de tes formations, diplômes ou apprentissages. Précise le nom de l’établissement, la période et ce que tu as appris.",
  example:
   "« J’ai suivi un CAP Matelot au lycée maritime d’Étaples entre 2023 et 2025. J’y ai appris la navigation, la sécurité en mer et le travail en équipe. »",
 },
 {
  id: 3,
  title: "Expériences professionnelles",
  subtitle: "Ton expérience terrain",
  description:
   "Parle de tes expériences professionnelles. Pour chaque expérience, indique où tu as travaillé, sur quelle période et ce que tu faisais concrètement.",
  example:
   "« En 2024, j’ai travaillé sur des chantiers de rénovation à Étaples : placo, peinture, menuiserie, revêtements de sol. J’ai aussi effectué un stage maritime. »",
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
