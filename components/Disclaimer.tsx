"use client";

import { type Language, t } from "@/lib/i18n";

interface DisclaimerProps {
  lang: Language;
}

export default function Disclaimer({ lang }: DisclaimerProps) {
  return (
    <div className="border-t border-gray-200 pt-6 mt-8">
      <p className="text-xs text-gray-500 leading-relaxed max-w-2xl">
        {t("disclaimer", lang)}
      </p>
    </div>
  );
}
