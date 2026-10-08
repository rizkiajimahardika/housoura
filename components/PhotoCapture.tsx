"use client";

import { useRef } from "react";
import { type Language, t } from "@/lib/i18n";

interface PhotoCaptureProps {
  lang: Language;
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export default function PhotoCapture({ lang, onFileSelected, disabled }: PhotoCaptureProps) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelected(file);
    }
    // Reset input so the same file can be re-selected
    e.target.value = "";
  };

  return (
    <div className="space-y-3">
      {/* Camera capture */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        className="hidden"
        aria-label={t("takePhoto", lang)}
        id="photo-capture-camera"
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => cameraRef.current?.click()}
        className="w-full h-14 bg-green-800 text-white font-medium rounded-xl hover:bg-green-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 text-base"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
        {t("takePhoto", lang)}
      </button>

      {/* Gallery picker */}
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
        aria-label={t("chooseGallery", lang)}
        id="photo-capture-gallery"
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => galleryRef.current?.click()}
        className="w-full h-12 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        {t("chooseGallery", lang)}
      </button>
    </div>
  );
}
