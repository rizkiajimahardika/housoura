"use client";

import Link from "next/link";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/lib/useLanguage";
import LanguageToggle from "@/components/LanguageToggle";

export default function PrivacyPage() {
  const [lang, setLang] = useLanguage();

  return (
    <div className="flex flex-col min-h-full">
      <header className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <Link href="/" className="text-lg font-bold tracking-tight text-gray-900">
          Housoura
        </Link>
        <LanguageToggle lang={lang} onChange={setLang} />
      </header>

      <main className="flex-1 px-5 py-10 max-w-2xl mx-auto w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{t("privacyTitle", lang)}</h1>

        {lang === "id" ? (
          <div className="prose prose-sm prose-gray max-w-none space-y-4 text-gray-700 leading-relaxed text-sm">
            <p>
              Housoura menggunakan foto yang Anda kirim untuk dianalisis oleh penyedia AI pihak ketiga (Anthropic).
              Foto diproses hanya untuk tujuan analisis dan tidak disimpan oleh Housoura setelah sesi berakhir.
            </p>
            <h2 className="text-base font-semibold text-gray-900 mt-6">Data yang Dikumpulkan</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Foto yang Anda kirim melalui aplikasi</li>
              <li>Informasi properti opsional yang Anda masukkan (tipe, usia, lokasi, catatan)</li>
              <li>Alamat IP Anda digunakan sementara untuk pembatasan laju permintaan dan tidak disimpan secara permanen</li>
            </ul>
            <h2 className="text-base font-semibold text-gray-900 mt-6">Penggunaan Data</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Foto dikirim ke API Anthropic untuk analisis visual</li>
              <li>Tidak ada data yang disimpan di server kami setelah analisis selesai</li>
              <li>Kami tidak membagikan data Anda kepada pihak ketiga lainnya</li>
            </ul>
            <h2 className="text-base font-semibold text-gray-900 mt-6">Penyimpanan Lokal</h2>
            <p>
              Thumbnail foto dan hasil analisis disimpan sementara di peramban Anda (sessionStorage).
              Data ini otomatis hilang saat Anda menutup tab atau peramban.
            </p>
            <h2 className="text-base font-semibold text-gray-900 mt-6">Kontak</h2>
            <p>
              Untuk pertanyaan tentang privasi, silakan hubungi kami melalui informasi kontak yang tersedia di halaman utama.
            </p>
          </div>
        ) : (
          <div className="prose prose-sm prose-gray max-w-none space-y-4 text-gray-700 leading-relaxed text-sm">
            <p>
              Housoura uses photos you submit for analysis by a third-party AI provider (Anthropic).
              Photos are processed solely for analysis purposes and are not stored by Housoura after the session ends.
            </p>
            <h2 className="text-base font-semibold text-gray-900 mt-6">Data Collected</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Photos you submit through the application</li>
              <li>Optional property information you enter (type, age, location, notes)</li>
              <li>Your IP address is used temporarily for rate limiting and is not permanently stored</li>
            </ul>
            <h2 className="text-base font-semibold text-gray-900 mt-6">Data Usage</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Photos are sent to the Anthropic API for visual analysis</li>
              <li>No data is stored on our servers after analysis is complete</li>
              <li>We do not share your data with any other third parties</li>
            </ul>
            <h2 className="text-base font-semibold text-gray-900 mt-6">Local Storage</h2>
            <p>
              Photo thumbnails and analysis results are temporarily stored in your browser (sessionStorage).
              This data is automatically cleared when you close the tab or browser.
            </p>
            <h2 className="text-base font-semibold text-gray-900 mt-6">Contact</h2>
            <p>
              For privacy inquiries, please reach out through the contact information available on our main page.
            </p>
          </div>
        )}
      </main>

      <footer className="px-5 pb-8 text-center">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 underline underline-offset-2">
          ← {lang === "id" ? "Kembali ke beranda" : "Back to home"}
        </Link>
      </footer>
    </div>
  );
}
