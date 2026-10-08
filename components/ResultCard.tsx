"use client";

import { type Language, t } from "@/lib/i18n";
import type { AnalysisResponse, Confidence } from "@/lib/ai/schema";
import SeverityBadge from "./SeverityBadge";

interface ResultCardProps {
  lang: Language;
  stepTitle: string;
  thumbnailDataUrl?: string;
  analysis: AnalysisResponse;
  onRetake?: () => void;
}

function ConfidenceLabel({ confidence, lang }: { confidence: Confidence; lang: Language }) {
  const key =
    confidence === "high"
      ? "confidenceHigh"
      : confidence === "medium"
        ? "confidenceMedium"
        : "confidenceLow";
  return <span className="text-xs text-gray-500">{t(key, lang)}</span>;
}

export default function ResultCard({
  lang,
  stepTitle,
  thumbnailDataUrl,
  analysis,
  onRetake,
}: ResultCardProps) {
  const { image_usable, usability_note, observations, potential_issues, missing_evidence, recommended_action } = analysis;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Header with thumbnail */}
      <div className="flex items-start gap-4 p-5 pb-4">
        {thumbnailDataUrl && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={thumbnailDataUrl}
            alt={stepTitle}
            className="w-16 h-16 rounded-lg object-cover shrink-0 bg-gray-100"
          />
        )}
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm">{stepTitle}</h3>
          {!image_usable && usability_note && (
            <div className="mt-2">
              <p className="text-sm text-amber-800 bg-amber-50 rounded-lg px-3 py-2 border border-amber-200">
                {usability_note}
              </p>
              {onRetake && (
                <button
                  type="button"
                  onClick={onRetake}
                  className="mt-2 text-sm text-green-800 font-medium hover:text-green-900 underline underline-offset-2"
                >
                  {t("retakePhoto", lang)}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {image_usable && (
        <div className="px-5 pb-5 space-y-4">
          {/* Observations */}
          {observations.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                {t("observations", lang)}
              </h4>
              <ul className="space-y-1.5">
                {observations.map((obs, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-gray-400" aria-hidden="true" />
                    <span>
                      <span className="font-medium">{obs.type}:</span> {obs.description}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Potential Issues */}
          {potential_issues.length > 0 ? (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                {t("potentialIssues", lang)}
              </h4>
              <div className="space-y-3">
                {potential_issues.map((issue, i) => (
                  <div key={i} className="border border-gray-100 rounded-lg p-3.5 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <SeverityBadge severity={issue.severity} lang={lang} />
                      <ConfidenceLabel confidence={issue.confidence} lang={lang} />
                    </div>
                    <p className="text-sm font-medium text-gray-900">{issue.issue}</p>
                    <p className="text-sm text-gray-600">{issue.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">
              {t("noIssues", lang)}
            </p>
          )}

          {/* Missing evidence */}
          {missing_evidence.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                {t("missingEvidence", lang)}
              </h4>
              <ul className="space-y-1">
                {missing_evidence.map((item, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-gray-300" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommended action */}
          {recommended_action && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                {t("recommendedAction", lang)}
              </h4>
              <p className="text-sm text-gray-700">{recommended_action}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
