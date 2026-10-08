"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/useLanguage";
import LanguageToggle from "@/components/LanguageToggle";
import Disclaimer from "@/components/Disclaimer";

export default function PricingPage() {
  const [lang, setLang] = useLanguage();
  const id = lang === "id";

  return (
    <div className="flex flex-col min-h-full bg-white text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-100 px-5 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-8 h-8 rounded-lg bg-green-800 text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:bg-green-900 transition-colors">
              H
            </span>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Housoura
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-sm font-semibold text-green-800">
              {id ? "Harga" : "Pricing"}
            </Link>
            <LanguageToggle lang={lang} onChange={setLang} />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-5 py-16">
        <div className="max-w-xl mx-auto text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-950">
            {id ? "Harga" : "Pricing"}
          </h1>

          <p className="text-lg text-gray-700">
            {id ? "Masih uji coba gratis." : "Still free to try."}
          </p>

          <p className="text-gray-500">
            {id
              ? "Mulai 1 Januari, Housoura akan berbayar. Rincian harga akan kami umumkan nanti."
              : "Starting January 1 2027, Housoura will become a paid service. Pricing details will be announced later."}
          </p>

          <div className="pt-6">
            <Link
              href="/inspect"
              className="inline-flex items-center justify-center px-8 h-14 bg-green-800 text-white font-semibold rounded-xl hover:bg-green-900 active:scale-[0.99] transition-all shadow-sm text-base"
            >
              {id ? "Periksa Properti Gratis" : "Inspect a Property for Free"}
            </Link>
          </div>

          <p className="text-xs text-gray-500 pt-2">
            {id
              ? "Tanpa akun. Langsung mulai dari browser ponsel Anda."
              : "No sign up required. Runs directly in your mobile browser."}
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-5 pb-10 max-w-6xl mx-auto w-full">
        <Disclaimer lang={lang} />
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© 2026 Housoura. Built for property buyers in Indonesia.</p>
          <div className="flex items-center gap-5">
            <Link href="/pricing" className="hover:text-gray-900 underline underline-offset-4">
              {id ? "Harga" : "Pricing"}
            </Link>
            <Link href="/privacy" className="hover:text-gray-900 underline underline-offset-4">
              {id ? "Kebijakan Privasi" : "Privacy Policy"}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}