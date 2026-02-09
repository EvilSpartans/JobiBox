/**
 * Liste des questions fréquentes du Guide Carrière.
 * Un sous-ensemble aléatoire est affiché à chaque arrivée sur l'écran.
 */

const CAREER_FAQ_POOL = [
  "Comment répondre à 'Parlez-moi de vous' en entretien ?",
  "Quelles compétences mettre en avant sur mon CV ?",
  "Comment négocier mon salaire ?",
  "Comment structurer ma lettre de motivation ?",
  "Comment bien préparer un entretien ?",
  "Quels mots-clés mettre sur mon CV ?",
  "Comment gérer le stress avant un entretien ?",
  "Comment expliquer une période de chômage ?",
  "Comment répondre à 'Quelles sont vos prétentions salariales ?'",
  "Comment mettre en valeur une reconversion sur mon CV ?",
  "Comment relancer après un entretien ?",
  "Comment adapter mon CV à une offre d'emploi ?",
];

/**
 * Mélange Fisher-Yates.
 */
function shuffle(array) {
  const out = [...array];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Retourne un nombre aléatoire de questions fréquentes (par défaut 3).
 * À appeler au montage de l'écran pour varier l'affichage.
 */
export function getRandomFaqQuestions(count = 3) {
  return shuffle(CAREER_FAQ_POOL).slice(0, Math.min(count, CAREER_FAQ_POOL.length));
}
