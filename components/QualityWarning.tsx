"use client";

import { type Language, t } from "@/lib/i18n";
import type { QualityResult } from "@/lib/imageQuality";

interface QualityWarningProps {
  lang: Language;
  issues: QualityResult["issues"];
  onRetake: () => void;
  onSendAnyway: () => void;
}

export default function QualityWarning({
  lang,
  issues,
  onRetake,
  onSendAnyway,
}: QualityWarningProps) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 space-y-3">
      <p className="font-semibold text-gray-900 text-sm">
        {t("qualityTitle", lang)}
      </p>
      <ul className="space-y-1.5">
        {issues.map((issue) => (
          <li key={issue} className="text-sm text-amber-800 flex items-start gap-2">
            <span className="mt-0.5 shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500" aria-hidden="true" />
            {issue === "too_dark" && t("tooDark", lang)}
            {issue === "too_bright" && t("tooBright", lang)}
            {issue === "blurry" && t("blurry", lang)}
          </li>
        ))}
      </ul>
      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onRetake}
          className="flex-1 h-12 bg-green-800 text-white text-sm font-medium rounded-lg hover:bg-green-900 transition-colors"
        >
          {t("retake", lang)}
        </button>
        <button
          type="button"
          onClick={onSendAnyway}
          className="flex-1 h-12 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          {t("sendAnyway", lang)}
        </button>
      </div>
    </div>
  );
}
