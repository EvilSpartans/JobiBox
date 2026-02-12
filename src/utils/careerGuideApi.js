import axios from 'axios';

// REACT_APP_BASE_URL = "https://core.jobissim.com/api" => POST sur /career-guide
const BASE_URL = process.env.REACT_APP_BASE_URL;

/** Messages d'erreur 400 côté backend */
export const CAREER_ERROR_NO_INPUT =
  "Envoie une question, un message, un fichier audio, ou un agent pour démarrer la conversation.";
export const CAREER_ERROR_INVALID_AGENT = "Agent invalide";

/**
 * Envoie une requête au Guide Carrière.
 * POST {BASE_URL}/career-guide en multipart/form-data, Bearer JWT.
 *
 * @param {Object} params
 * @param {string} [params.question] - Texte de la question (optionnel si agent fourni pour amorce)
 * @param {string} [params.message] - Alias pour question (backend accepte les deux)
 * @param {File} [params.audio] - Fichier audio (question vocale)
 * @param {string} [params.agent] - projet_professionnel | cv_profil | entretien | lettre_motivation | recherche_emploi | reconversion
 * @param {boolean} [params.historique] - true dès que la conversation a commencé (évite re-présentation)
 * @param {boolean} [params.audioResponse] - true pour recevoir la réponse en audio (audioBase64)
 * @returns {Promise<{ response: string, message?: string, agent?: string, audioBase64?: string }>}
 */
export async function sendCareerGuideRequest(
  { question, message, audio, agent, historique = false, audioResponse = false },
  token
) {
  const formData = new FormData();

  const text = (question != null && question.trim() !== '' ? question.trim() : null) || (message != null && message.trim() !== '' ? message.trim() : null);
  if (text) {
    formData.append('question', text);
    formData.append('message', text);
  }

  if (audio instanceof File) {
    formData.append('audio', audio);
  }
  if (agent) {
    formData.append('agent', agent);
  }
  formData.append('historique', historique ? '1' : '0');
  formData.append('audioResponse', audioResponse ? '1' : '0');

  try {
    const { data } = await axios.post(`${BASE_URL}/career-guide`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (err) {
    if (err.response?.status === 400) {
      const backendError = err.response?.data?.error || err.response?.data?.details || '';
      const isNoInput = !text && !agent && !(audio instanceof File);
      if (isNoInput || /démarrer|question|message|audio|agent/i.test(backendError)) {
        err.userMessage = CAREER_ERROR_NO_INPUT;
      } else if (/agent|invalide/i.test(backendError)) {
        err.userMessage = CAREER_ERROR_INVALID_AGENT + (backendError ? ` – ${backendError}` : '');
      }
    }
    throw err;
  }
}
