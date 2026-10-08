"use client";

import { type Language, t } from "@/lib/i18n";
import type { Severity } from "@/lib/ai/schema";

interface SeverityBadgeProps {
  severity: Severity;
  lang: Language;
}

const severityConfig: Record<Severity, { bg: string; text: string; key: "severityHigh" | "severityMedium" | "severityLow" | "severityUnable" }> = {
  high: { bg: "bg-red-50 border-red-200", text: "text-red-800", key: "severityHigh" },
  medium: { bg: "bg-amber-50 border-amber-200", text: "text-amber-800", key: "severityMedium" },
  low: { bg: "bg-green-50 border-green-200", text: "text-green-800", key: "severityLow" },
  unable_to_assess: { bg: "bg-gray-50 border-gray-200", text: "text-gray-600", key: "severityUnable" },
};

export default function SeverityBadge({ severity, lang }: SeverityBadgeProps) {
  const config = severityConfig[severity];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md border ${config.bg} ${config.text}`}
    >
      {t(config.key, lang)}
    </span>
  );
}
