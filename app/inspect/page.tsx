"use client";

import { useState, useEffect, useCallback, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/lib/useLanguage";
import LanguageToggle from "@/components/LanguageToggle";
import StepScreen from "@/components/StepScreen";
import ResultCard from "@/components/ResultCard";
import Disclaimer from "@/components/Disclaimer";
import PhotoCapture from "@/components/PhotoCapture";
import { STEPS, EXTRA_STEP } from "@/lib/steps";
import type { StepResult, AnalysisResponse, PropertyContext } from "@/lib/ai/schema";
import { resizeImage, createThumbnail } from "@/lib/imageResize";

// ─── Screens ───
type Screen = "setup" | "steps" | "extra" | "results";

// ─── Session storage keys ───
const STORAGE_KEYS = {
  screen: "housoura_screen",
  stepIndex: "housoura_stepIndex",
  results: "housoura_results",
  propertyContext: "housoura_propertyContext",
  consent: "housoura_consent",
} as const;

function loadFromSession<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = sessionStorage.getItem(key);
    if (stored === null) return fallback;
    return JSON.parse(stored) as T;
  } catch {
    return fallback;
  }
}

function saveToSession(key: string, value: unknown) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // sessionStorage may be full; we can't do much about it
  }
}

const emptySubscribe = () => () => {};

export default function InspectPage() {
  const [lang, setLang] = useLanguage();
  const isHydrated = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const [screen, setScreen] = useState<Screen>(() => loadFromSession<Screen>(STORAGE_KEYS.screen, "setup"));
  const [currentStep, setCurrentStep] = useState<number>(() => loadFromSession<number>(STORAGE_KEYS.stepIndex, 0));
  const [results, setResults] = useState<Record<string, StepResult>>(() => loadFromSession<Record<string, StepResult>>(STORAGE_KEYS.results, {}));
  const [propertyContext, setPropertyContext] = useState<PropertyContext>(() => loadFromSession<PropertyContext>(STORAGE_KEYS.propertyContext, {}));
  const [consent, setConsent] = useState<boolean>(() => loadFromSession<boolean>(STORAGE_KEYS.consent, false));

  // In-memory full-resolution images (not stored in sessionStorage)
  const fullImagesRef = useRef<Map<string, { base64: string; mediaType: "image/jpeg" }>>(new Map());

  // ─── Persist state changes ───
  useEffect(() => {
    if (!isHydrated) return;
    saveToSession(STORAGE_KEYS.screen, screen);
  }, [screen, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    saveToSession(STORAGE_KEYS.stepIndex, currentStep);
  }, [currentStep, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    saveToSession(STORAGE_KEYS.results, results);
  }, [results, isHydrated]);

  // ─── Setup form state ───
  const [setupType, setSetupType] = useState("");
  const [setupAge, setSetupAge] = useState("");
  const [setupPrice, setSetupPrice] = useState("");
  const [setupLocation, setSetupLocation] = useState("");
  const [setupNotes, setSetupNotes] = useState("");

  const handleStartInspection = () => {
    if (!consent) return;

    const ctx: PropertyContext = {};
    if (setupType) ctx.type = setupType;
    if (setupAge) ctx.age = setupAge;
    if (setupLocation) ctx.location = setupLocation;
    if (setupNotes) ctx.notes = setupNotes;

    setPropertyContext(ctx);
    saveToSession(STORAGE_KEYS.propertyContext, ctx);
    saveToSession(STORAGE_KEYS.consent, true);
    setScreen("steps");
    setCurrentStep(0);
  };

  // ─── Photo analysis ───
  const analyzePhoto = useCallback(
    async (stepId: string, file: File) => {
      // Create thumbnail for sessionStorage
      const thumbnailDataUrl = await createThumbnail(file);

      // Resize full image
      const resized = await resizeImage(file);

      // Store full image in memory only
      fullImagesRef.current.set(stepId, {
        base64: resized.base64,
        mediaType: resized.mediaType,
      });

      // Set analyzing status
      setResults((prev) => ({
        ...prev,
        [stepId]: {
          stepId,
          status: "analyzing",
          thumbnailDataUrl,
        },
      }));

      // Call API in background
      try {
        const resp = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            stepId,
            imageBase64: resized.base64,
            mediaType: resized.mediaType,
            language: lang,
            propertyContext,
          }),
        });

        if (resp.status === 429) {
          setResults((prev) => ({
            ...prev,
            [stepId]: {
              ...prev[stepId],
              stepId,
              status: "failed",
              thumbnailDataUrl,
              error: t("rateLimitError", lang),
            },
          }));
          return;
        }

        if (!resp.ok) {
          setResults((prev) => ({
            ...prev,
            [stepId]: {
              ...prev[stepId],
              stepId,
              status: "failed",
              thumbnailDataUrl,
              error: t("serverError", lang),
            },
          }));
          return;
        }

        const data: AnalysisResponse = await resp.json();
        setResults((prev) => ({
          ...prev,
          [stepId]: {
            stepId,
            status: "done",
            thumbnailDataUrl,
            analysis: data,
          },
        }));
      } catch {
        setResults((prev) => ({
          ...prev,
          [stepId]: {
            ...prev[stepId],
            stepId,
            status: "failed",
            thumbnailDataUrl,
            error: t("networkError", lang),
          },
        }));
      }
    },
    [lang, propertyContext]
  );

  const handlePhotoSelected = useCallback(
    (stepId: string, file: File) => {
      analyzePhoto(stepId, file);
    },
    [analyzePhoto]
  );

  // ─── Extra photos ───
  const handleExtraPhoto = useCallback(
    (file: File) => {
      const extraId = `extra_${Date.now()}`;
      analyzePhoto(extraId, file);
    },
    [analyzePhoto]
  );

  // ─── Navigation ───
  const goNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setScreen("extra");
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  const skipStep = () => {
    goNext();
  };

  const handleStartOver = () => {
    const confirmed = window.confirm(t("startOverConfirm", lang));
    if (!confirmed) return;

    // Clear all state
    setScreen("setup");
    setCurrentStep(0);
    setResults({});
    setPropertyContext({});
    setConsent(false);
    fullImagesRef.current.clear();

    // Clear sessionStorage
    Object.values(STORAGE_KEYS).forEach((key) => {
      sessionStorage.removeItem(key);
    });
  };

  // ─── Results sorting ───
  const severityOrder: Record<string, number> = {
    high: 0,
    medium: 1,
    low: 2,
    unable_to_assess: 3,
  };

  const getSortPriority = (result: StepResult): number => {
    if (!result.analysis?.potential_issues?.length) return 99;
    return Math.min(
      ...result.analysis.potential_issues.map(
        (p) => severityOrder[p.severity] ?? 99
      )
    );
  };

  // Count photographed areas (only the 10 main steps)
  const mainStepResults = STEPS.filter((s) => results[s.id]?.status === "done");
  const photographedCount = mainStepResults.length;

  // All results sorted for display
  const sortedResults = Object.values(results)
    .filter((r) => r.status === "done" && r.analysis)
    .sort((a, b) => getSortPriority(a) - getSortPriority(b));

  // Skipped steps
  const skippedSteps = STEPS.filter(
    (s) => !results[s.id] || results[s.id].status === "failed"
  );

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-green-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
        <Link href="/" className="text-lg font-bold tracking-tight text-gray-900">
          Housoura
        </Link>
        <LanguageToggle lang={lang} onChange={setLang} />
      </header>

      {/* ═══════════ SETUP SCREEN ═══════════ */}
      {screen === "setup" && (
        <main className="flex-1 px-5 py-8 max-w-lg mx-auto w-full">
          <div className="space-y-6">
            {/* Visual Setup Banner */}
            <div className="rounded-2xl overflow-hidden border border-gray-200 relative aspect-[16/7] bg-gray-100 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/hero-property.jpg"
                alt="Property screening setup"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-gray-950/30 to-transparent flex items-end p-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-green-300">
                    Housoura Inspection
                  </span>
                  <h2 className="text-lg font-bold text-white leading-tight">
                    {lang === "id" ? "Persiapan Pemeriksaan Properti" : "Property Screening Setup"}
                  </h2>
                  <p className="text-xs text-gray-200 mt-0.5">
                    {lang === "id" ? "10 area panduan foto visual terarah" : "10 guided visual photo checkpoints"}
                  </p>
                </div>
              </div>
            </div>

            {/* Consent */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <label className="flex items-start gap-3 cursor-pointer" htmlFor="consent-checkbox">
                <input
                  id="consent-checkbox"
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-green-800 focus:ring-green-800 shrink-0"
                />
                <span className="text-sm text-gray-700 leading-relaxed">
                  {t("consentLabel", lang)}{" "}
                  <Link
                    href="/privacy"
                    className="text-green-800 underline underline-offset-2 hover:text-green-900"
                  >
                    {t("privacyLink", lang)}
                  </Link>
                </span>
              </label>
            </div>

            {/* Property type */}
            <div>
              <label htmlFor="property-type" className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("propertyType", lang)}
              </label>
              <select
                id="property-type"
                value={setupType}
                onChange={(e) => setSetupType(e.target.value)}
                className="w-full h-12 px-3 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-800 focus:border-green-800 outline-none"
              >
                <option value="">—</option>
                <option value="House">{t("propertyTypeHouse", lang)}</option>
                <option value="Apartment">{t("propertyTypeApartment", lang)}</option>
                <option value="Townhouse">{t("propertyTypeTownhouse", lang)}</option>
                <option value="Other">{t("propertyTypeOther", lang)}</option>
              </select>
            </div>

            {/* Property age */}
            <div>
              <label htmlFor="property-age" className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("propertyAge", lang)}
              </label>
              <select
                id="property-age"
                value={setupAge}
                onChange={(e) => setSetupAge(e.target.value)}
                className="w-full h-12 px-3 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-800 focus:border-green-800 outline-none"
              >
                <option value="">—</option>
                <option value="Unknown">{t("ageUnknown", lang)}</option>
                <option value="<5">{t("ageLess5", lang)}</option>
                <option value="5-10">{t("age5to10", lang)}</option>
                <option value="10-20">{t("age10to20", lang)}</option>
                <option value="20+">{t("age20plus", lang)}</option>
              </select>
            </div>

            {/* Asking price */}
            <div>
              <label htmlFor="asking-price" className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("askingPrice", lang)}
              </label>
              <input
                id="asking-price"
                type="number"
                value={setupPrice}
                onChange={(e) => setSetupPrice(e.target.value)}
                placeholder="e.g. 850000000"
                className="w-full h-12 px-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-800 focus:border-green-800 outline-none"
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("location", lang)}
              </label>
              <input
                id="location"
                type="text"
                value={setupLocation}
                onChange={(e) => setSetupLocation(e.target.value)}
                placeholder={lang === "id" ? "Contoh: Jakarta Selatan" : "e.g. South Jakarta"}
                className="w-full h-12 px-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-800 focus:border-green-800 outline-none"
              />
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("notes", lang)}
              </label>
              <textarea
                id="notes"
                value={setupNotes}
                onChange={(e) => setSetupNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-800 focus:border-green-800 outline-none resize-none"
              />
            </div>

            {/* Start button */}
            <button
              type="button"
              disabled={!consent}
              onClick={handleStartInspection}
              className="w-full h-14 bg-green-800 text-white font-semibold rounded-xl hover:bg-green-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-base"
            >
              {t("startButton", lang)}
            </button>
          </div>
        </main>
      )}

      {/* ═══════════ STEP SCREENS ═══════════ */}
      {screen === "steps" && currentStep < STEPS.length && (
        <main className="flex-1 flex flex-col">
          <StepScreen
            lang={lang}
            step={STEPS[currentStep]}
            stepNumber={currentStep + 1}
            totalSteps={STEPS.length}
            stepResult={results[STEPS[currentStep].id]}
            onPhotoSelected={(file) =>
              handlePhotoSelected(STEPS[currentStep].id, file)
            }
            onSkip={skipStep}
            onNext={goNext}
            onBack={goBack}
            canGoBack={currentStep > 0}
          />
        </main>
      )}

      {/* ═══════════ EXTRA PHOTOS SCREEN ═══════════ */}
      {screen === "extra" && (
        <main className="flex-1 px-5 py-6 max-w-lg mx-auto w-full">
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {t("addMoreTitle", lang)}
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {t("addMoreTip", lang)}
              </p>
            </div>

            {/* Show extra photo thumbnails */}
            {Object.entries(results)
              .filter(([key]) => key.startsWith("extra_"))
              .map(([key, result]) => (
                <div
                  key={key}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  {result.thumbnailDataUrl && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={result.thumbnailDataUrl}
                      alt="Extra photo"
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    {result.status === "analyzing" && (
                      <span className="text-sm text-amber-700 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        {t("analyzing", lang)}
                      </span>
                    )}
                    {result.status === "done" && (
                      <span className="text-sm text-green-800 flex items-center gap-1.5">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {t("done", lang)}
                      </span>
                    )}
                    {result.status === "failed" && (
                      <span className="text-sm text-red-700">
                        {t("failed", lang)}
                      </span>
                    )}
                  </div>
                </div>
              ))}

            {/* Add more (up to 5) */}
            {Object.keys(results).filter((k) => k.startsWith("extra_")).length < 5 && (
              <PhotoCapture
                lang={lang}
                onFileSelected={handleExtraPhoto}
              />
            )}

            {/* Navigation */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => setScreen("results")}
                className="w-full h-14 bg-green-800 text-white font-semibold rounded-xl hover:bg-green-900 transition-colors text-base"
              >
                {t("seeResults", lang)}
              </button>
              <button
                type="button"
                onClick={() => {
                  setScreen("steps");
                  setCurrentStep(STEPS.length - 1);
                }}
                className="w-full h-12 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors text-sm"
              >
                {t("back", lang)}
              </button>
            </div>
          </div>
        </main>
      )}

      {/* ═══════════ RESULTS SCREEN ═══════════ */}
      {screen === "results" && (
        <main className="flex-1 px-5 py-6 max-w-2xl mx-auto w-full">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t("resultsTitle", lang)}
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                {t("areasPhotographed", lang, { count: photographedCount })}
              </p>

              {/* Limited coverage banner */}
              {photographedCount < 5 && (
                <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                  <p className="text-sm text-amber-800 font-medium">
                    {t("limitedCoverage", lang)}
                  </p>
                </div>
              )}
            </div>

            {/* Result cards */}
            {sortedResults.map((result) => {
              const mainStep = STEPS.find((s) => s.id === result.stepId);
              const isExtra = result.stepId.startsWith("extra");
              const stepTitle = mainStep
                ? lang === "id"
                  ? mainStep.titleID
                  : mainStep.titleEN
                : isExtra
                  ? lang === "id"
                    ? EXTRA_STEP.titleID
                    : EXTRA_STEP.titleEN
                  : result.stepId;

              return (
                <ResultCard
                  key={result.stepId}
                  lang={lang}
                  stepTitle={stepTitle}
                  thumbnailDataUrl={result.thumbnailDataUrl}
                  analysis={result.analysis!}
                  onRetake={
                    result.analysis && !result.analysis.image_usable
                      ? () => {
                          // Go back to the step to retake
                          const stepIndex = STEPS.findIndex(
                            (s) => s.id === result.stepId
                          );
                          if (stepIndex >= 0) {
                            // Clear the result for this step
                            setResults((prev) => {
                              const next = { ...prev };
                              delete next[result.stepId];
                              return next;
                            });
                            setCurrentStep(stepIndex);
                            setScreen("steps");
                          }
                        }
                      : undefined
                  }
                />
              );
            })}

            {/* Still analyzing */}
            {Object.values(results).some((r) => r.status === "analyzing") && (
              <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                {t("analyzing", lang)}
              </div>
            )}

            {/* Skipped steps */}
            {skippedSteps.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  {t("skippedSteps", lang)}
                </h3>
                <div className="space-y-2">
                  {skippedSteps.map((step) => (
                    <div
                      key={step.id}
                      className="flex items-center justify-between py-2.5 px-3.5 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm text-gray-600">
                        {lang === "id" ? step.titleID : step.titleEN}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">
                        {t("notAssessed", lang)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <Disclaimer lang={lang} />

            {/* Start over */}
            <button
              type="button"
              onClick={handleStartOver}
              className="w-full h-12 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors text-sm"
            >
              {t("startOver", lang)}
            </button>
          </div>
        </main>
      )}
    </div>
  );
}
