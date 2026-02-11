import { MONTHS_FR_TO_NUM } from "./IAResume";

export const parseDate = (value) => {
 if (!value) return {};

 if (typeof value === "object" && value !== null) {
  if ("day" in value || "month" in value || "year" in value) {
   return value;
  }
  return {};
 }

 if (typeof value !== "string") return {};

 if (value === "En cours") {
  return "En cours";
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

export const formatDate = (d) => {
 if (!d) return "";
 if (d === "En cours") return "En cours";
 if (d.year && d.month && d.day) return `${d.day}/${d.month}/${d.year}`;
 if (d.year && d.month) return `${d.month}/${d.year}`;
 if (d.year) return `${d.year}`;
 return "";
};

export const formatDDMMYYYY = (date) => {
 if (!date) return "";
 // date attendu : YYYY-MM-DD
 const [y, m, d] = date.split("-");
 return `${d}-${m}-${y}`;
};
