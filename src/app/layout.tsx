import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RecruitAI — Screen Smarter, Hire Faster",
  description:
    "AI-powered candidate pre-screening platform. Automate phone screens with voice AI, score candidates instantly, and build your shortlist in minutes.",
  keywords: ["recruitment", "AI hiring", "voice AI", "candidate screening", "HR automation"],
  authors: [{ name: "RecruitAI" }],
  openGraph: {
    title: "RecruitAI — AI-Powered Hiring Platform",
    description: "Screen candidates 5x faster with voice AI. Automated phone screens, instant scoring, and smart shortlisting.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
