"use client";

import { useState, useCallback } from "react";
import { type Language, t } from "@/lib/i18n";
import type { StepDefinition } from "@/lib/steps";
import type { StepResult } from "@/lib/ai/schema";
import PhotoCapture from "./PhotoCapture";
import QualityWarning from "./QualityWarning";
import ProgressBar from "./ProgressBar";
import { checkImageQuality, type QualityResult } from "@/lib/imageQuality";

interface StepScreenProps {
  lang: Language;
  step: StepDefinition;
  stepNumber: number;
  totalSteps: number;
  stepResult?: StepResult;
  onPhotoSelected: (file: File) => void;
  onSkip: () => void;
  onNext: () => void;
  onBack: () => void;
  canGoBack: boolean;
}

export default function StepScreen({
  lang,
  step,
  stepNumber,
  totalSteps,
  stepResult,
  onPhotoSelected,
  onSkip,
  onNext,
  onBack,
  canGoBack,
}: StepScreenProps) {
  const [qualityIssues, setQualityIssues] = useState<QualityResult["issues"] | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isRetaking, setIsRetaking] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const title = lang === "id" ? step.titleID : step.titleEN;
  const tip = lang === "id" ? step.tipID : step.tipEN;
  const safetyNote = step.safetyNoteID && lang === "id" ? step.safetyNoteID : step.safetyNoteEN;

  const handleFileSelected = useCallback(async (file: File) => {
    // Show preview immediately
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setPendingFile(file);
    setQualityIssues(null);

    // Run quality check
    try {
      const result = await checkImageQuality(file);
      if (!result.ok) {
        setQualityIssues(result.issues);
        return;
      }
    } catch {
      // If quality check fails, proceed anyway
    }

    // Quality OK, submit
    setIsRetaking(false);
    onPhotoSelected(file);
    setPendingFile(null);
  }, [onPhotoSelected]);

  const handleRetake = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setPendingFile(null);
    setQualityIssues(null);
  }, [previewUrl]);

  const handleSendAnyway = useCallback(() => {
    if (pendingFile) {
      setIsRetaking(false);
      onPhotoSelected(pendingFile);
      setPendingFile(null);
      setQualityIssues(null);
    }
  }, [pendingFile, onPhotoSelected]);

  const hasPhoto = !!stepResult?.thumbnailDataUrl || !!previewUrl;
  const displayThumbnail = stepResult?.thumbnailDataUrl || previewUrl;

  return (
    <div className="flex flex-col min-h-full">
      {/* Progress */}
      <div className="px-5 pt-5 space-y-2">
        <ProgressBar current={stepNumber} total={totalSteps} />
        <p className="text-xs text-gray-500 font-medium">
          {t("stepOf", lang, { current: stepNumber, total: totalSteps })}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 py-6 space-y-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900 leading-tight">{title}</h2>
          <p className="mt-2 text-sm text-gray-600 leading-relaxed">{tip}</p>
          {safetyNote && (
            <p className="mt-2 text-sm text-red-700 font-medium flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              {safetyNote}
            </p>
          )}

          {step.exampleImage && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowGuide((prev) => !prev)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-800 hover:text-green-950 py-1 underline underline-offset-4"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {showGuide ? t("hideGuidePhoto", lang) : t("viewGuidePhoto", lang)}
              </button>
              {showGuide && (
                <div className="mt-2 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 relative aspect-[16/10] max-h-56">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={step.exampleImage}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-gray-950/75 backdrop-blur text-white text-[10px] font-medium px-2 py-0.5 rounded shadow">
                    {lang === "id" ? "Contoh sudut foto yang dianjurkan" : "Recommended framing angle"}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Preview */}
        {displayThumbnail && (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayThumbnail}
              alt={title}
              className="w-full rounded-xl object-cover max-h-56 bg-gray-100"
            />
            {/* Status badge */}
            {stepResult && (
              <div className="absolute bottom-3 right-3">
                {stepResult.status === "analyzing" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur text-xs font-medium rounded-full text-gray-700 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    {t("analyzing", lang)}
                  </span>
                )}
                {stepResult.status === "done" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur text-xs font-medium rounded-full text-green-800 shadow-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {t("done", lang)}
                  </span>
                )}
                {stepResult.status === "failed" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur text-xs font-medium rounded-full text-red-700 shadow-sm">
                    {t("failed", lang)}
                  </span>
                )}
              </div>
            )}
            {/* Retake button below photo */}
            {!isRetaking && !qualityIssues && (
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsRetaking(true)}
                  className="text-xs text-gray-500 hover:text-gray-900 underline underline-offset-2"
                >
                  {t("retake", lang)}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Quality warning */}
        {qualityIssues && qualityIssues.length > 0 && (
          <QualityWarning
            lang={lang}
            issues={qualityIssues}
            onRetake={handleRetake}
            onSendAnyway={handleSendAnyway}
          />
        )}

        {/* Photo capture (show if no photo or retaking) */}
        {((!hasPhoto && !qualityIssues) || isRetaking) && (
          <div className="space-y-2">
            <PhotoCapture lang={lang} onFileSelected={handleFileSelected} />
            {isRetaking && (
              <button
                type="button"
                onClick={() => setIsRetaking(false)}
                className="w-full text-center text-xs text-gray-500 hover:text-gray-700 py-1"
              >
                {lang === "id" ? "Batal ganti foto" : "Cancel retake"}
              </button>
            )}
          </div>
        )}

        {/* Retry button for failed analysis */}
        {stepResult?.status === "failed" && !isRetaking && (
          <div className="space-y-2">
            <p className="text-sm text-red-700">{stepResult.error || t("serverError", lang)}</p>
            <button
              type="button"
              onClick={handleRetake}
              className="w-full h-12 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors text-sm"
            >
              {t("retry", lang)}
            </button>
          </div>
        )}
      </div>

      {/* Bottom actions */}
      <div className="px-5 pb-6 space-y-3">
        {hasPhoto && !qualityIssues && (
          <button
            type="button"
            onClick={onNext}
            className="w-full h-14 bg-green-800 text-white font-medium rounded-xl hover:bg-green-900 transition-colors text-base"
          >
            {t("next", lang)}
          </button>
        )}
        <div className="flex gap-3">
          {canGoBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex-1 h-12 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors text-sm"
            >
              {t("back", lang)}
            </button>
          )}
          {!hasPhoto && (
            <button
              type="button"
              onClick={onSkip}
              className="flex-1 h-12 text-gray-500 font-medium rounded-xl hover:bg-gray-50 transition-colors text-sm"
            >
              {t("skip", lang)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
