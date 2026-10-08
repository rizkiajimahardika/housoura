import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inspect — Housoura",
  description: "Start your property inspection with Housoura.",
  robots: "noindex, nofollow",
};

export default function InspectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
