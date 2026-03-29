/**
 * Logique CVthèque alignée sur GET /business/{id}/resume-settings (catalogue = CvMainColorPreset).
 */

export const CV_MAIN_COLOR_PRESETS = [
 "#1A365D",
 "#2C5282",
 "#2B6CB0",
 "#3182CE",
 "#38A169",
 "#276749",
 "#744210",
 "#975A16",
 "#C05621",
 "#C53030",
 "#822727",
 "#553C9A",
 "#6B46C1",
 "#2D3748",
 "#1A202C",
 "#000000",
];

/**
 * @param {string|null|undefined} hex
 * @returns {string|null} #RRGGBB majuscules ou null si invalide
 */
export function normalizeHexForCompare(hex) {
 if (hex == null || typeof hex !== "string") return null;
 let s = hex.trim();
 if (!s.startsWith("#")) s = `#${s}`;
 if (!/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(s)) return null;
 if (s.length === 4) {
  s = `#${s[1]}${s[1]}${s[2]}${s[2]}${s[3]}${s[3]}`;
 }
 return s.toUpperCase();
}

/**
 * @param {Record<string, unknown>|null|undefined} raw — réponse API snake_case et/ou camelCase (Symfony / sérialiseurs)
 */
export function mapResumeSettingsFromApi(raw) {
 if (!raw || typeof raw !== "object") {
  return {
   allowedTemplates: [],
   excludedMainColorPresets: [],
   additionalMainColors: [],
  };
 }
 const allowedTemplates = Array.isArray(raw.allowed_templates)
  ? raw.allowed_templates
  : Array.isArray(raw.allowedTemplates)
   ? raw.allowedTemplates
   : [];
 const excludedMainColorPresets = Array.isArray(raw.excluded_main_color_presets)
  ? raw.excluded_main_color_presets
  : Array.isArray(raw.excludedMainColorPresets)
   ? raw.excludedMainColorPresets
   : [];
 const additionalMainColors = Array.isArray(raw.additional_main_colors)
  ? raw.additional_main_colors
  : Array.isArray(raw.additionalMainColors)
   ? raw.additionalMainColors
   : [];
 return {
  allowedTemplates,
  excludedMainColorPresets,
  additionalMainColors,
 };
}

/**
 * @param {string[]} allowedIdsFromApi — vide ou absent côté API = les 16 gabarits
 * @param {{ key: string }[]} allTemplates
 */
export function buildAllowedTemplates(allowedIdsFromApi, allTemplates) {
 const ids = Array.isArray(allowedIdsFromApi) ? allowedIdsFromApi.filter(Boolean) : [];
 if (ids.length === 0) return [...allTemplates];
 const byKey = new Map(allTemplates.map((t) => [String(t.key).toLowerCase(), t]));
 const out = [];
 for (const id of ids) {
  const t = byKey.get(String(id).trim().toLowerCase());
  if (t) out.push(t);
 }
 if (out.length === 0) {
  const fallback = allTemplates.find((t) => t.key === "template1") || allTemplates[0];
  return fallback ? [fallback] : [];
 }
 return out;
}

/**
 * @param {string[]} excluded
 * @param {string[]} additional
 * @returns {string[]} hex #RRGGBB majuscules, uniques
 */
export function buildAllowedMainColors(excluded, additional) {
 const normList = (arr) =>
  (Array.isArray(arr) ? arr : []).map(normalizeHexForCompare).filter(Boolean);
 const excludedSet = new Set(normList(excluded));
 const catalog = CV_MAIN_COLOR_PRESETS.map((c) => normalizeHexForCompare(c)).filter(Boolean);
 const fromCatalog = catalog.filter((c) => !excludedSet.has(c));
 const additionals = normList(additional);
 const seen = new Set();
 const out = [];
 for (const c of [...fromCatalog, ...additionals]) {
  if (!seen.has(c)) {
   seen.add(c);
   out.push(c);
  }
 }
 return out;
}

/**
 * Contrainte couleur active ssi au moins une exclusion ou une couleur additionnelle (doc CVthèque).
 */
export function isMainColorConstrained(excluded, additional) {
 const e = Array.isArray(excluded) ? excluded.filter((x) => String(x).trim()) : [];
 const a = Array.isArray(additional) ? additional.filter((x) => String(x).trim()) : [];
 return e.length > 0 || a.length > 0;
}

/**
 * @param {string|null|undefined} currentKey
 * @param {{ key: string }[]} allowedTemplateList
 */
export function pickDefaultTemplate(currentKey, allowedTemplateList) {
 const keys = allowedTemplateList.map((t) => t.key);
 if (keys.length === 0) return "template1";
 const cur = currentKey != null ? String(currentKey).trim().toLowerCase() : "";
 if (cur) {
  const match = keys.find((k) => String(k).toLowerCase() === cur);
  if (match) return match;
 }
 return keys[0];
}

/**
 * @param {string|null|undefined} currentHex
 * @param {string[]} allowedHexesUppercase — sortie de buildAllowedMainColors
 */
export function pickDefaultMainColor(currentHex, allowedHexesUppercase) {
 if (!allowedHexesUppercase.length) return CV_MAIN_COLOR_PRESETS[0] || "#1A365D";
 const cur = normalizeHexForCompare(currentHex);
 if (cur && allowedHexesUppercase.includes(cur)) return cur;
 return allowedHexesUppercase[0];
}

/**
 * Extrait un id business depuis referenceBusiness (objet { id }, IRI "/api/business/12", etc.).
 * @param {unknown} rb
 * @returns {string|number|null}
 */
export function parseBusinessIdFromReferenceBusiness(rb) {
 if (rb == null) return null;
 if (typeof rb === "number" && !Number.isNaN(rb)) return rb;
 if (typeof rb === "string") {
  const s = rb.trim();
  if (s === "" || s === "null") return null;
  const fromIri = s.match(/\/business\/(\d+)/i);
  if (fromIri) return fromIri[1];
  if (/^\d+$/.test(s)) return s;
  return null;
 }
 if (typeof rb === "object") {
  const id = rb.id ?? rb["@id"];
  if (id == null || id === "") return null;
  if (typeof id === "number" && !Number.isNaN(id)) return id;
  const s = String(id).trim();
  const fromIri = s.match(/\/business\/(\d+)/i);
  if (fromIri) return fromIri[1];
  if (/^\d+$/.test(s)) return s;
 }
 return null;
}

/**
 * businessId pour GET resume-settings.
 * Priorité : cabine (localStorage `businessId`) → user.referenceBusiness → CV déjà lié (referenceBusinessId).
 * @param {{ referenceBusiness?: unknown }|null|undefined} user
 * @param {Record<string, unknown>|null|undefined} resume
 */
export function resolveCvthequeBusinessId(user, resume) {
 if (typeof window !== "undefined") {
  const ls = window.localStorage.getItem("businessId");
  if (ls != null && ls !== "null" && String(ls).trim() !== "") {
   return String(ls).trim();
  }
 }

 const fromUser = parseBusinessIdFromReferenceBusiness(user?.referenceBusiness);
 if (fromUser != null && String(fromUser).trim() !== "") return fromUser;

 const rid = resume?.referenceBusinessId ?? resume?.reference_business_id;
 if (rid != null && String(rid).trim() !== "") return rid;

 return null;
}
