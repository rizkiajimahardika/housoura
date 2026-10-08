"use client";

import { useSyncExternalStore, useCallback } from "react";
import type { Language } from "./i18n";

const STORAGE_KEY = "housoura_lang";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("housoura_lang_change", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("housoura_lang_change", callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): Language {
  if (typeof window === "undefined") return "id";
  const val = sessionStorage.getItem(STORAGE_KEY);
  return val === "en" ? "en" : "id";
}

function getServerSnapshot(): Language {
  return "id";
}

export function useLanguage(): [Language, (lang: Language) => void] {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setLang = useCallback((newLang: Language) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(STORAGE_KEY, newLang);
      window.dispatchEvent(new Event("housoura_lang_change"));
    }
  }, []);

  return [lang, setLang];
}
