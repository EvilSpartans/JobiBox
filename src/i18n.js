import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import fr from "./locales/fr.json";
import en from "./locales/en.json";
import es from "./locales/es.json";
import de from "./locales/de.json";
import it from "./locales/it.json";
import pt from "./locales/pt.json";
import ar from "./locales/ar.json";

const STORAGE_KEY = "appLang";

const getStoredLang = () => {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

const resources = {
  fr: { translation: fr },
  en: { translation: en },
  es: { translation: es },
  de: { translation: de },
  it: { translation: it },
  pt: { translation: pt },
  ar: { translation: ar },
};

const supportedLangs = ["fr", "en", "es", "de", "it", "pt", "ar"];

const detectLang = () => {
  const stored = getStoredLang();
  if (stored && supportedLangs.includes(stored)) return stored;
  const nav = navigator.language?.slice(0, 2);
  if (nav && supportedLangs.includes(nav)) return nav;
  return "fr";
};

i18n.use(initReactI18next).init({
  resources,
  lng: detectLang(),
  fallbackLng: "fr",
  supportedLngs: supportedLangs,
  interpolation: {
    escapeValue: false,
  },
});

i18n.on("languageChanged", (lng) => {
  try {
    localStorage.setItem(STORAGE_KEY, lng);
  } catch {}
});

export const changeLanguage = (lng) => i18n.changeLanguage(lng);
export const getCurrentLang = () => i18n.language;
export { supportedLangs, STORAGE_KEY };
export default i18n;
