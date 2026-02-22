import marieAvatar from '../../assets/images/career/career-marie2.png';
import thomasAvatar from '../../assets/images/career/career-thomas2.png';
import sophieAvatar from '../../assets/images/career/career-sophie2.png';
import lucasAvatar from '../../assets/images/career/career-lucas2.png';
import emmaAvatar from '../../assets/images/career/career-emma2.png';
import paulAvatar from '../../assets/images/career/career-paul2.png';

/**
 * Agents du Guide Carrière (sujets thématiques).
 * id = valeur envoyée au backend (agent).
 * firstName = prénom affiché.
 * avatar = image du coach ; sinon affichage de l'initiale du prénom.
 * starterQuestions = variantes affichées aléatoirement au clic.
 */
export const CAREER_AGENTS = [
  {
    id: 'projet_professionnel',
    firstName: 'Marie',
    avatar: marieAvatar,
    title: 'Projet professionnel',
    description: 'Définir et clarifier vos objectifs de carrière',
    color: 'bg-sky-600',
    starterQuestions: [
      "J'aimerais travailler sur mon projet professionnel. Peux-tu m'aider à le définir et le clarifier ?",
      "J'ai besoin d'y voir plus clair dans mon projet professionnel. Par où commencer ?",
      "Comment définir et clarifier mes objectifs de carrière ?",
    ],
    icon: 'target',
  },
  {
    id: 'cv_profil',
    firstName: 'Thomas',
    avatar: thomasAvatar,
    title: 'CV & Profil',
    description: 'Optimiser votre CV et profil LinkedIn',
    color: 'bg-emerald-600',
    starterQuestions: [
      "Comment optimiser mon CV et mon profil LinkedIn ?",
      "J'aimerais améliorer mon CV. Quels conseils me donner ?",
      "Comment rendre mon CV et mon LinkedIn plus percutants ?",
    ],
    icon: 'file',
  },
  {
    id: 'entretien',
    firstName: 'Sophie',
    avatar: sophieAvatar,
    title: 'Entretiens',
    description: 'Se préparer aux questions et situations',
    color: 'bg-purple-600',
    starterQuestions: [
      "Comment bien préparer un entretien ?",
      "Je dois passer un entretien bientôt. Comment m'y préparer ?",
      "Quelles sont les clés pour réussir un entretien d'embauche ?",
    ],
    icon: 'users',
  },
  {
    id: 'lettre_motivation',
    firstName: 'Lucas',
    avatar: lucasAvatar,
    title: 'Lettre de motivation',
    description: 'Rédiger des lettres percutantes',
    color: 'bg-orange-500',
    starterQuestions: [
      "Comment structurer ma lettre de motivation ?",
      "Comment rédiger une lettre de motivation qui attire l'attention ?",
      "Quel plan suivre pour une lettre de motivation efficace ?",
    ],
    icon: 'envelope',
  },
  {
    id: 'recherche_emploi',
    firstName: 'Emma',
    avatar: emmaAvatar,
    title: 'Recherche d\'emploi',
    description: 'Stratégies et méthodes efficaces',
    color: 'bg-rose-600',
    starterQuestions: [
      "Quelles stratégies pour ma recherche d'emploi ?",
      "Comment organiser ma recherche d'emploi pour être plus efficace ?",
      "Par où commencer une recherche d'emploi structurée ?",
    ],
    icon: 'search',
  },
  {
    id: 'reconversion',
    firstName: 'Paul',
    avatar: paulAvatar,
    title: 'Reconversion',
    description: 'Changer de voie professionnelle',
    color: 'bg-cyan-600',
    starterQuestions: [
      "Je réfléchis à une reconversion, par où commencer ?",
      "Comment réussir une reconversion professionnelle ?",
      "J'envisage de changer de métier. Quelles étapes suivre ?",
    ],
    icon: 'refresh',
  },
];

/**
 * Retourne une question starter aléatoire pour un agent.
 */
export function getRandomStarterQuestion(agent) {
  const questions = agent.starterQuestions || (agent.starterQuestion ? [agent.starterQuestion] : []);
  if (questions.length === 0) return '';
  return questions[Math.floor(Math.random() * questions.length)];
}
