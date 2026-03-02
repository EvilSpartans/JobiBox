import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { changeLanguage, supportedLangs } from "../../i18n";

const FLAGS = {
  fr: "🇫🇷",
  en: "🇬🇧",
  es: "🇪🇸",
  de: "🇩🇪",
  it: "🇮🇹",
  pt: "🇵🇹",
  ar: "🇸🇦",
};

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [showDropdown, setShowDropdown] = useState(false);
  const currentLang = i18n.language || "fr";
  const displayLang = supportedLangs.includes(currentLang) ? currentLang : "fr";

  const handleSelect = (lang) => {
    changeLanguage(lang);
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowDropdown((v) => !v)}
        className="flex items-center gap-2 px-4 py-4 rounded-full bg-emerald-600/25 border border-emerald-500/50 text-white hover:bg-emerald-500/35 hover:border-emerald-400/60 transition text-xl font-semibold"
        title={i18n.t(`languages.${displayLang}`)}
      >
        <span className="text-2xl">{FLAGS[displayLang] || "🌐"}</span>
        <span className="hidden sm:inline">{i18n.t(`languages.${displayLang}`)}</span>
        <span className={`inline-block transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`}>▾</span>
      </button>

      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
            aria-hidden="true"
          />
          <div
            className="absolute right-0 top-full mt-2 z-50 py-2 rounded-xl bg-dark_bg_2 border border-white/10 shadow-xl min-w-[180px]"
            onClick={(e) => e.stopPropagation()}
          >
            {supportedLangs.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => handleSelect(lang)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-white/10 transition ${
                  displayLang === lang ? "bg-emerald-600/20 text-emerald-300" : "text-white"
                }`}
              >
                <span className="text-2xl">{FLAGS[lang]}</span>
                <span>{i18n.t(`languages.${lang}`)}</span>
                {displayLang === lang && <span className="ml-auto text-emerald-400">✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
