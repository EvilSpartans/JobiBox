import { MONTHS_FR_TO_NUM } from "./IAResume";

export const parseDate = (value) => {
 if (value === undefined || value === null || value === "") return {};
 if (value === "En cours") return "En cours";

 if (typeof value === "number" && Number.isFinite(value)) {
  const y = Math.trunc(value);
  if (y >= 1900 && y <= 2100) return { year: String(y) };
  return {};
 }

 if (typeof value === "object" && !Array.isArray(value)) {
  const day = value.day ?? value.Day;
  const month = value.month ?? value.Month;
  const year = value.year ?? value.Year;
  if (day === undefined && month === undefined && year === undefined) return {};
  const yStr =
   year !== undefined && year !== null && String(year).trim() !== ""
    ? String(year).trim()
    : "";
  if (!/^\d{4}$/.test(yStr)) {
   return {};
  }
  const result = { year: yStr };
  if (month !== undefined && month !== null && String(month).trim() !== "") {
   result.month = String(month).trim().padStart(2, "0");
  }
  if (day !== undefined && day !== null && String(day).trim() !== "") {
   result.day = String(day).trim().padStart(2, "0");
  }
  return result;
 }

 if (typeof value !== "string") return {};

 value = value.trim();

 if (value === "En cours") {
  return "En cours";
 }

 // ISO 2008-01-01 ou 2008-01-01T00:00:00 — souvent une année seule côté serveur
 const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s].*)?$/);
 if (iso) {
  const [, y, mo, da] = iso;
  const yearOnlyStart = mo === "01" && da === "01";
  const yearOnlyEnd = mo === "12" && da === "31";
  if (yearOnlyStart || yearOnlyEnd) {
   return { year: y };
  }
  return { year: y, month: mo, day: da };
 }

 if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
  const [day, month, year] = value.split("-");
  return { day, month, year };
 }

 if (value.includes("/")) {
  const parts = value.split("/");

  if (parts.length === 3) {
   const [day, month, year] = parts;
   return { day, month, year };
  }

  if (parts.length === 2) {
   const [month, year] = parts;
   return { month, year };
  }
 }

 if (value.includes(" ")) {
  const parts = value.trim().split(" ");
  const partsUpper = parts.map((p) => p.toUpperCase());

  if (parts.length === 2) {
   const monthNum = MONTHS_FR_TO_NUM[partsUpper[0]];
   if (monthNum && /^\d{4}$/.test(parts[1])) {
    return { month: monthNum, year: parts[1] };
   }
  }

  if (parts.length === 3) {
   const day = parts[0].padStart(2, "0");
   const monthNum = MONTHS_FR_TO_NUM[partsUpper[1]];
   const year = parts[2];

   if (monthNum && /^\d{4}$/.test(year)) {
    return { day, month: monthNum, year };
   }
  }
 }

 if (/^\d{4}$/.test(value)) {
  return { year: value };
 }

 return {};
};

/**
 * Prépare jour / mois / année pour les 3 <select> du CV.
 * Granularité : année seule → seule l’année est remplie ; + mois ; + jour.
 */
export const toDateSelectParts = (value) => {
 if (value === undefined || value === null || value === "") {
  return { day: "", month: "", year: "" };
 }
 if (value === "En cours") return "En cours";

 const parsed = parseDate(value);
 if (parsed === "En cours") return "En cours";
 if (!parsed || typeof parsed !== "object") {
  return { day: "", month: "", year: "" };
 }

 const yRaw = parsed.year;
 const mRaw = parsed.month;
 const dRaw = parsed.day;

 const year =
  yRaw !== undefined && yRaw !== null && String(yRaw).trim() !== ""
   ? String(yRaw).trim()
   : "";
 const month =
  mRaw !== undefined && mRaw !== null && String(mRaw).trim() !== ""
   ? String(mRaw).trim().padStart(2, "0")
   : "";
 const day =
  dRaw !== undefined && dRaw !== null && String(dRaw).trim() !== ""
   ? String(Number(String(dRaw).trim()))
   : "";

 return { day, month, year };
};

/** Objet pour onChange DateSelect : uniquement les clés non vides (année seule → { year }). */
export const datePartsToStorableObject = (parts) => {
 if (!parts || typeof parts !== "object") return {};
 const o = {};
 if (parts.year !== undefined && parts.year !== null && String(parts.year).trim() !== "") {
  o.year = String(parts.year).trim();
 }
 if (parts.month !== undefined && parts.month !== null && String(parts.month).trim() !== "") {
  o.month = String(parts.month).trim().padStart(2, "0");
 }
 if (parts.day !== undefined && parts.day !== null && String(parts.day).trim() !== "") {
  o.day = String(parts.day).trim().padStart(2, "0");
 }
 return o;
};

const hasPart = (d, key) => {
 const v = d[key];
 return v !== undefined && v !== null && String(v).trim() !== "";
};

export const formatDate = (d) => {
 if (!d) return "";
 if (d === "En cours") return "En cours";
 if (hasPart(d, "year") && hasPart(d, "month") && hasPart(d, "day")) {
  return `${String(d.day).padStart(2, "0")}/${String(d.month).padStart(2, "0")}/${String(d.year).trim()}`;
 }
 if (hasPart(d, "year") && hasPart(d, "month")) {
  return `${String(d.month).padStart(2, "0")}/${String(d.year).trim()}`;
 }
 if (hasPart(d, "year")) {
  return String(d.year).trim();
 }
 return "";
};

/**
 * Date issue de l'API (CV / IA) : aucune invention côté front.
 * Chaîne → conservée telle quelle (granularité identique au retour).
 * Objet avec day/month/year → sérialisé selon les champs réellement présents.
 */
export const resumeDateFromApi = (value) => {
 if (value === undefined || value === null) return "";
 if (value === "En cours") return "En cours";
 if (typeof value === "string") return value.trim();
 if (typeof value === "object" && !Array.isArray(value)) {
  return formatDate(parseDate(value));
 }
 if (typeof value === "number" && Number.isFinite(value)) {
  const y = Math.trunc(value);
  if (y >= 1900 && y <= 2100) return String(y);
  return "";
 }
 return formatDate(parseDate(value));
};

/** Objet (sélecteurs) → chaîne pour l'API ; chaîne déjà stockée → inchangée. Aucune donnée inventée. */
export const resumeDateForSave = (value) => {
 if (value === undefined || value === null) return "";
 if (value === "En cours") return "En cours";
 if (typeof value === "string") return value.trim();
 if (typeof value === "object" && !Array.isArray(value)) {
  if (Object.keys(value).length === 0) return "";
  return formatDate(parseDate(value));
 }
 if (typeof value === "number" && Number.isFinite(value)) {
  const y = Math.trunc(value);
  if (y >= 1900 && y <= 2100) return String(y);
  return "";
 }
 return formatDate(parseDate(value));
};

/**
 * Toujours la même sérialisation que handleTrainingChange (objet DateSelect { year } → "2008").
 * Si le GET a laissé startDate en "" mais que l’objet a les années, resumeDateForSave(camel) suffit.
 * Si camel est vide, on retombe sur start_date (snake).
 */
function mergeTrainingDateField(camel, snake) {
 const fromCamel = resumeDateForSave(camel);
 if (fromCamel !== "") return fromCamel;
 const fromSnake = resumeDateForSave(snake);
 if (fromSnake !== "") return fromSnake;
 return "";
}

/**
 * Formation / expérience : dates pour trainings[i][startDate] / [endDate] (multipart).
 */
export const normalizeAiTrainingDates = (item) => {
 if (!item || typeof item !== "object") return item;
 const { start_date, end_date, ...rest } = item;
 return {
  ...rest,
  startDate: mergeTrainingDateField(rest.startDate, start_date),
  endDate: mergeTrainingDateField(rest.endDate, end_date),
 };
};

export const normalizeAiExperienceDates = (item) => normalizeAiTrainingDates(item);

export const formatDDMMYYYY = (date) => {
 if (!date) return "";
 // date attendu : YYYY-MM-DD
 const [y, m, d] = date.split("-");
 return `${d}-${m}-${y}`;
};
