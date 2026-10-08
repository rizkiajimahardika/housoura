"use client";

import { type Language } from "@/lib/i18n";

interface LanguageToggleProps {
  lang: Language;
  onChange: (lang: Language) => void;
}

export default function LanguageToggle({ lang, onChange }: LanguageToggleProps) {
  return (
    <div className="flex items-center gap-1 text-sm font-medium" role="radiogroup" aria-label="Language">
      <button
        type="button"
        role="radio"
        aria-checked={lang === "id"}
        className={`px-2.5 py-1.5 rounded-md transition-colors ${
          lang === "id"
            ? "bg-green-800 text-white"
            : "text-gray-500 hover:text-gray-800"
        }`}
        onClick={() => onChange("id")}
      >
        ID
      </button>
      <span className="text-gray-300" aria-hidden="true">|</span>
      <button
        type="button"
        role="radio"
        aria-checked={lang === "en"}
        className={`px-2.5 py-1.5 rounded-md transition-colors ${
          lang === "en"
            ? "bg-green-800 text-white"
            : "text-gray-500 hover:text-gray-800"
        }`}
        onClick={() => onChange("en")}
      >
        EN
      </button>
    </div>
  );
}
