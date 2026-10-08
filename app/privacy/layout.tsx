import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Housoura",
  description: "Housoura privacy policy. Learn how your data is handled.",
  robots: "index, follow",
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
