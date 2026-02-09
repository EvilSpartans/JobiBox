const STORAGE_KEY = 'careerGuideHistory';

/**
 * @param {{ role: 'user'|'bot', text: string }[]} messages
 */
function saveHistory(agentKey, messages) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : {};
    data[agentKey] = messages;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('careerGuideHistory save', e);
  }
}

/**
 * @returns {{ role: 'user'|'bot', text: string }[]}
 */
function loadHistory(agentKey) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : {};
    const list = data[agentKey];
    return Array.isArray(list) ? list : [];
  } catch (e) {
    console.warn('careerGuideHistory load', e);
    return [];
  }
}

/**
 * Clé de stockage : id de l'agent ou "general" si pas d'agent.
 */
export function getHistoryKey(agent) {
  return agent ? agent.id : 'general';
}

/**
 * Nombre de messages par clé (pour affichage sidebar).
 * @param {{ id: string }[]} agents
 * @returns {{ general: number, [agentId: string]: number }}
 */
export function getHistoryCounts(agents) {
  const counts = { general: loadHistory('general').length };
  (agents || []).forEach((a) => {
    counts[a.id] = loadHistory(a.id).length;
  });
  return counts;
}

export { saveHistory, loadHistory };
