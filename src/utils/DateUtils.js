export const parseDate = (value) => {
 if (!value) return {};
 if (typeof value !== "string") return value;

 if (value === "En cours") {
  return "En cours";
 }

 const parts = value.split("/");

 if (parts.length === 3) {
  const [day, month, year] = parts;
  return { day, month, year };
 }

 if (parts.length === 2) {
  const [month, year] = parts;
  return { month, year };
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
