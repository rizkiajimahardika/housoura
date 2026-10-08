import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Housoura — Know what to worry about before you buy",
  description:
    "AI-guided property screening tool for buyers in Indonesia. Take guided photos and get visual risk notes on what's worth investigating.",
  openGraph: {
    title: "Housoura — Know what to worry about before you buy",
    description:
      "AI-guided property screening tool for buyers in Indonesia. Take guided photos and get visual risk notes.",
    type: "website",
    locale: "id_ID",
    alternateLocale: "en_US",
    siteName: "Housoura",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
