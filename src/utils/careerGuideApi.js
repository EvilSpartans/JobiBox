import axios from 'axios';

// REACT_APP_BASE_URL = "https://core.jobissim.com/api" => POST sur /career-guide
const BASE_URL = process.env.REACT_APP_BASE_URL;

/**
 * Envoie une requête au Guide Carrière.
 * POST {BASE_URL}/career-guide en multipart/form-data, Bearer JWT.
 */
export async function sendCareerGuideRequest({ question, audio, agent }, token) {
  const formData = new FormData();
  if (question != null && question.trim() !== '') {
    const q = question.trim();
    formData.append('question', q);
    formData.append('message', q); // certain backends attendent "message"
  }
  if (audio instanceof File) {
    formData.append('audio', audio);
  }
  if (agent) {
    formData.append('agent', agent);
  }

  const { data } = await axios.post(`${BASE_URL}/career-guide`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}
