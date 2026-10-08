"use client";

import { useState } from "react";
import Link from "next/link";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/lib/useLanguage";
import LanguageToggle from "@/components/LanguageToggle";
import Disclaimer from "@/components/Disclaimer";
import SeverityBadge from "@/components/SeverityBadge";

const HOW_STEPS = ["howStep1", "howStep2", "howStep3", "howStep4"] as const;

export default function LandingPage() {
  const [lang, setLang] = useLanguage();

  // Interactive state for hero hotspot pins
  const [activeHotspot, setActiveHotspot] = useState<number | null>(0);

  // Interactive state for area inspection showcase
  const [activeAreaTab, setActiveAreaTab] = useState<number>(0);

  // Interactive sample report toggle
  const [sampleReportType, setSampleReportType] = useState<"issue" | "clean">("issue");

  const hotspots = [
    {
      id: 0,
      x: "48%",
      y: "18%",
      titleKey: "hotspotRoof",
      descKey: "hotspotRoofDesc",
      number: "1",
    },
    {
      id: 1,
      x: "36%",
      y: "48%",
      titleKey: "hotspotWall",
      descKey: "hotspotWallDesc",
      number: "2",
    },
    {
      id: 2,
      x: "82%",
      y: "82%",
      titleKey: "hotspotDrainage",
      descKey: "hotspotDrainageDesc",
      number: "3",
    },
  ] as const;

  const inspectionAreas = [
    {
      id: 0,
      title: lang === "id" ? "Plafon & Sambungan Dinding" : "Ceilings & Wall Joints",
      image: "/images/living-ceiling.jpg",
      badge: lang === "id" ? "Fokus: Lembap & Noda Air" : "Focus: Damp & Water Marks",
      note:
        lang === "id"
          ? "Cat baru sering menutupi bekas rembesan air hujan. Foto sudut plafon memperlihatkan bayangan lekukan atau cat yang belum matang merata."
          : "Fresh paint often conceals past rainwater leakage. High-angle ceiling photos reveal swelling shadows or unevaporated moisture.",
    },
    {
      id: 1,
      title: lang === "id" ? "Drainase Keliling & Fondasi" : "Perimeter Drainage & Foundation",
      image: "/images/foundation-drainage.jpg",
      badge: lang === "id" ? "Fokus: Aliran Air & Retak Rambut" : "Focus: Water Runoff & Cracks",
      note:
        lang === "id"
          ? "Genangan di dekat dinding bawah memicu rembesan kapiler ke lantai dalam. Kami memeriksa kondisi parit dan kemiringan tanah."
          : "Ponding near lower exterior walls causes capillary seepage into interior flooring. We examine trench runoff and ground slope.",
    },
    {
      id: 2,
      title: lang === "id" ? "Panel Listrik & MCB" : "Electrical MCB Panel",
      image: "/images/electrical-panel.jpg",
      badge: lang === "id" ? "Fokus: Keselamatan & Jalur Kabel" : "Focus: Safety & Conduit Condition",
      note:
        lang === "id"
          ? "Kotak sekring yang rapi menunjukkan instalasi yang dirawat. Kami memeriksa kebersihan fisik dan label pemutus arus tanpa menyentuh kabel."
          : "A tidy breaker box indicates well-maintained installations. We inspect physical cleanliness and breaker labeling without touching any wiring.",
    },
  ];

  return (
    <div className="flex flex-col min-h-full bg-white text-gray-900 selection:bg-green-100 selection:text-green-900">
      {/* ─── Header ─── */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-100 px-5 py-4 transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-8 h-8 rounded-lg bg-green-800 text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-sm group-hover:bg-green-900 transition-colors">
              H
            </span>
            <span className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-green-950 transition-colors">
              Housoura
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <LanguageToggle lang={lang} onChange={setLang} />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ─── 1. Hero Section ─── */}
        <section className="px-5 pt-8 pb-14 md:pt-14 md:pb-20 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-200/80 text-green-900 text-xs font-semibold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
                {lang === "id" ? "Penyaringan Visual Properti Terpandu" : "Guided Visual Property Screening"}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-950 leading-[1.15] tracking-tight">
                {t("heroHeadline", lang)}
              </h1>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl">
                {t("heroSub", lang)}
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                <Link
                  href="/inspect"
                  className="inline-flex items-center justify-center px-8 h-14 bg-green-800 text-white font-semibold rounded-xl hover:bg-green-900 active:scale-[0.99] transition-all shadow-sm hover:shadow text-base text-center"
                >
                  {t("ctaButton", lang)}
                  <svg
                    className="ml-2.5 w-5 h-5 transition-transform group-hover:translate-x-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>

              {/* Trust line under hero */}
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed flex items-start gap-2">
                  <svg
                    className="w-4 h-4 text-green-700 shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <span>{t("trustLine", lang)}</span>
                </p>
              </div>
            </div>

            {/* Right Column: Interactive Property Card with Hotspot Pins */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border border-gray-200/90 shadow-md bg-gray-50 group">
                {/* Photo */}
                <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/hero-property.jpg"
                    alt={lang === "id" ? "Foto rumah yang diperiksa Housoura" : "House screened by Housoura"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 via-gray-950/10 to-transparent pointer-events-none" />

                  {/* Hotspot Pins */}
                  {hotspots.map((pin) => {
                    const isActive = activeHotspot === pin.id;
                    return (
                      <button
                        key={pin.id}
                        type="button"
                        onClick={() => setActiveHotspot(isActive ? null : pin.id)}
                        style={{ left: pin.x, top: pin.y }}
                        aria-label={t(pin.titleKey, lang)}
                        className="absolute -translate-x-1/2 -translate-y-1/2 z-10 group/pin focus:outline-none"
                      >
                        <span className="relative flex h-8 w-8 items-center justify-center">
                          <span
                            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                              isActive ? "bg-amber-400" : "bg-green-400"
                            }`}
                          />
                          <span
                            className={`relative inline-flex rounded-full h-7 w-7 text-white text-xs font-bold items-center justify-center shadow-lg transition-transform hover:scale-110 ${
                              isActive ? "bg-amber-600 ring-2 ring-white" : "bg-green-800 ring-2 ring-white"
                            }`}
                          >
                            {pin.number}
                          </span>
                        </span>
                      </button>
                    );
                  })}

                  {/* Property Card Pill */}
                  <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg border border-white/50 text-xs font-semibold text-gray-900 shadow-sm">
                    {lang === "id" ? "Simulasi Area Foto #1 Eksterior Depan" : "Live Simulation: Area #1 Front Exterior"}
                  </div>
                </div>

                {/* Hotspot details banner */}
                <div className="p-4 sm:p-5 bg-white border-t border-gray-100 space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium text-gray-500">
                    <span className="flex items-center gap-1.5 text-green-800 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                      {t("tapToExplore", lang)}
                    </span>
                    <span className="text-gray-400">3 Titik Skrining</span>
                  </div>

                  {activeHotspot !== null ? (
                    <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200/80 transition-all">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-gray-900">
                          {t(hotspots[activeHotspot].titleKey, lang)}
                        </h4>
                        <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-800 font-medium">
                          Area #{hotspots[activeHotspot].number}
                        </span>
                      </div>
                      <p className="mt-1 text-xs sm:text-sm text-gray-600 leading-relaxed">
                        {t(hotspots[activeHotspot].descKey, lang)}
                      </p>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500 italic py-2">
                      {lang === "id"
                        ? "Klik salah satu nomor pin (1, 2, atau 3) di atas gambar untuk melihat fokus pemeriksaan."
                        : "Click any numbered pin (1, 2, or 3) on the image above to view inspection focus."}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 2. Section "Jangan hanya melihat rumahnya. Selidiki." ─── */}
        <section className="px-5 py-14 bg-gray-50 border-y border-gray-200/70">
          <div className="max-w-6xl mx-auto space-y-10">
            <div className="max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-950 tracking-tight leading-snug">
                {t("investigateTitle", lang)}
              </h2>
              <p className="mt-3 text-base sm:text-lg text-gray-600 leading-relaxed">
                {t("investigateCopy", lang)}
              </p>
            </div>

            {/* Interactive Inspector Showcase */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-7 shadow-sm">
              {/* Tab Selector */}
              <div className="flex flex-wrap gap-2 pb-5 border-b border-gray-100" role="tablist">
                {inspectionAreas.map((area, idx) => (
                  <button
                    key={area.id}
                    type="button"
                    role="tab"
                    aria-selected={activeAreaTab === idx}
                    onClick={() => setActiveAreaTab(idx)}
                    className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      activeAreaTab === idx
                        ? "bg-green-800 text-white shadow-sm"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200/80"
                    }`}
                  >
                    {area.title}
                  </button>
                ))}
              </div>

              {/* Active Tab Preview */}
              <div className="pt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-7 rounded-xl overflow-hidden aspect-[4/3] bg-gray-100 border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={inspectionAreas[activeAreaTab].image}
                    alt={inspectionAreas[activeAreaTab].title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:col-span-5 space-y-4">
                  <span className="inline-block px-3 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
                    {inspectionAreas[activeAreaTab].badge}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900">
                    {inspectionAreas[activeAreaTab].title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {inspectionAreas[activeAreaTab].note}
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/inspect"
                      className="text-sm font-semibold text-green-800 hover:text-green-950 inline-flex items-center gap-1.5 underline underline-offset-4"
                    >
                      {lang === "id" ? "Buka checklist 10 area lengkap →" : "View full 10-area checklist →"}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 3. Section "Cara kerjanya" (4 steps) ─── */}
        <section className="px-5 py-16 max-w-6xl mx-auto">
          <div className="space-y-10">
            <div className="max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-950 tracking-tight">
                {t("howItWorksTitle", lang)}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-gray-500">
                {lang === "id"
                  ? "Proses 4 langkah yang dirancang praktis saat Anda meninjau rumah langsung di lokasi."
                  : "A practical 4-step workflow designed for when you visit a property in person."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {HOW_STEPS.map((key, i) => {
                const stepIcons = [
                  // Step 1: Walkthrough icon
                  <path
                    key="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />,
                  // Step 2: Camera icon
                  <path
                    key="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />,
                  // Step 3: Analysis icon
                  <path
                    key="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />,
                  // Step 4: Eye / Check icon
                  <path
                    key="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />,
                ];

                return (
                  <div
                    key={key}
                    className="p-6 rounded-2xl border border-gray-200 bg-white hover:border-green-300 hover:shadow-md transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="w-10 h-10 rounded-xl bg-green-50 text-green-800 flex items-center justify-center font-bold text-base group-hover:bg-green-800 group-hover:text-white transition-colors">
                          {i + 1}
                        </span>
                        <svg
                          className="w-5 h-5 text-gray-400 group-hover:text-green-700 transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                        >
                          {stepIcons[i]}
                        </svg>
                      </div>
                      <h3 className="text-base font-bold text-gray-900 group-hover:text-green-950 transition-colors">
                        {t(key, lang)}
                      </h3>
                    </div>
                    <div className="pt-4 mt-4 border-t border-gray-100 text-xs text-gray-400">
                      Langkah {i + 1} / 4
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── Interactive Sample Finding Preview ─── */}
        <section className="px-5 py-14 bg-gray-50 border-y border-gray-200/80">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs font-bold tracking-wider uppercase text-green-800">
                {t("interactiveExampleTag", lang)}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950">
                {lang === "id" ? "Bukan Sekadar 'Bagus atau Rusak'" : "Not Just 'Good or Bad'"}
              </h2>
              <p className="text-sm text-gray-600">
                {t("interactiveExampleSub", lang)}
              </p>
            </div>

            {/* Toggle sample state */}
            <div className="flex justify-center">
              <div className="inline-flex p-1 rounded-xl bg-gray-200/80 border border-gray-300">
                <button
                  type="button"
                  onClick={() => setSampleReportType("issue")}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                    sampleReportType === "issue"
                      ? "bg-white text-gray-950 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {lang === "id" ? "Contoh Temuan (Perlu Diperiksa)" : "Sample Finding (Investigate)"}
                </button>
                <button
                  type="button"
                  onClick={() => setSampleReportType("clean")}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                    sampleReportType === "clean"
                      ? "bg-white text-gray-950 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {lang === "id" ? "Contoh Area Bersih (Normal)" : "Sample Clean Area"}
                </button>
              </div>
            </div>

            {/* Mock Result Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6 space-y-5">
              <div className="flex items-start gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/living-ceiling.jpg"
                  alt="Living ceiling sample"
                  className="w-16 h-16 rounded-xl object-cover border border-gray-200 shrink-0"
                />
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Area #5
                  </span>
                  <h3 className="text-base font-bold text-gray-900">
                    {lang === "id" ? "Plafon ruang tamu" : "Living room ceiling"}
                  </h3>
                </div>
              </div>

              {sampleReportType === "issue" ? (
                <div className="space-y-4 pt-2 border-t border-gray-100">
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      {t("observations", lang)}
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                        <span>
                          <strong className="font-semibold">Perubahan warna:</strong> Lingkaran kekuningan samar berdiameter ~30cm pada gypsum dekat sambungan dinding luar.
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="border border-amber-200 bg-amber-50/50 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <SeverityBadge severity="medium" lang={lang} />
                      <span className="text-xs text-gray-500">{t("confidenceHigh", lang)}</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      {lang === "id" ? "Potensi rembesan air hujan dari dak atau talang" : "Potential rainwater leakage from roof slab or gutter"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {lang === "id"
                        ? "Pola lingkaran mengindikasikan air merembes secara berkala saat hujan deras, meskipun permukaan saat ini tampak kering."
                        : "Circular pattern indicates intermittent water intrusion during heavy rainfall, despite surface appearing dry."}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      {t("recommendedAction", lang)}
                    </h4>
                    <p className="text-sm text-gray-700">
                      {lang === "id"
                        ? "Periksa area atap tepat di atas titik ini saat siang hari; uji siram talang atau minta tukang memeriksa sambungan waterproofing."
                        : "Inspect the roof area directly above this point during daylight; water-test gutters or have a technician check waterproofing joints."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="pt-2 border-t border-gray-100 space-y-3">
                  <p className="text-sm text-gray-600 italic bg-gray-50 rounded-xl p-4 border border-gray-100">
                    {t("noIssues", lang)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {lang === "id"
                      ? "Housoura tidak pernah menyatakan 'rumah aman'. Kami hanya melaporkan apa yang dapat diamati secara visual dari foto yang dikirim."
                      : "Housoura never states 'everything is fine'. We strictly report visual observations from the submitted photos."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ─── 4. Section "Dibuat untuk pembelian terbesar dalam hidup Anda." ─── */}
        <section className="px-5 py-16 max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-green-950 via-green-900 to-green-950 text-white rounded-3xl p-8 sm:p-12 md:p-16 shadow-xl relative overflow-hidden">
            <div className="max-w-2xl relative z-10 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-green-300">
                Housoura Inspection
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight tracking-tight">
                {t("builtForTitle", lang)}
              </h2>
              <p className="text-base sm:text-lg text-green-100/90 leading-relaxed pt-2">
                {t("builtForCopy", lang)}
              </p>
              <div className="pt-4">
                <Link
                  href="/inspect"
                  className="inline-flex items-center justify-center px-8 h-14 bg-white text-green-950 font-bold rounded-xl hover:bg-green-50 active:scale-[0.99] transition-all text-base shadow"
                >
                  {t("ctaButton", lang)}
                </Link>
              </div>
            </div>

            {/* Subtle decorative background watermarks */}
            <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-96 h-96 rounded-full bg-white/5 pointer-events-none blur-2xl" />
          </div>
        </section>

        {/* ─── 5. Final CTA Button ─── */}
        <section className="px-5 pb-16 max-w-2xl mx-auto text-center space-y-4">
          <Link
            href="/inspect"
            className="inline-flex items-center justify-center w-full sm:w-auto px-10 h-14 bg-green-800 text-white font-semibold rounded-xl hover:bg-green-900 active:scale-[0.99] transition-all text-base shadow-sm"
          >
            {t("ctaButton", lang)}
          </Link>
          <p className="text-xs text-gray-500">
            {lang === "id" ? "Tanpa akun. Langsung mulai dari browser ponsel Anda." : "No sign up required. Runs directly in your mobile browser."}
          </p>
        </section>
      </main>

      {/* ─── 6. Footer ─── */}
      <footer className="px-5 pb-10 max-w-6xl mx-auto w-full">
        <Disclaimer lang={lang} />
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© 2026 Housoura. Built for property buyers in Indonesia.</p>
          <Link
            href="/privacy"
            className="hover:text-gray-900 underline underline-offset-4"
          >
            {t("privacyLink", lang)}
          </Link>
        </div>
      </footer>
    </div>
  );
}
