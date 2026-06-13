import type { Metadata } from "next";
import { Fraunces, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HiPerGator — Compute from the Swamp",
  description:
    "HiPerGator opens its racks to UF-founded AI startups. Compute for equity. Apply to Cohort 01.",
  metadataBase: new URL("https://hipergator.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${dmSans.variable} ${mono.variable}`}
    >
      <body className="font-sans bg-ink text-bone antialiased selection:bg-swamp-orange/30 selection:text-bone">
        <div className="noise" aria-hidden />
        {children}
      </body>
    </html>
  );
}
