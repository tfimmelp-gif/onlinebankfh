import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "../components/LanguageProvider";

const geist = Geist({ variable: "--font-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });
const serif = Instrument_Serif({
  variable: "--font-serif",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://northstar-bank.openai.site"),
  title: {
    default: "Northstar — Banking for Every Chapter",
    template: "%s · Northstar",
  },
  description:
    "Personal and business banking, savings, lending, and digital money management in one secure experience.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "Northstar — Banking for Every Chapter",
    description: "A complete, secure digital banking experience for personal and business customers.",
    images: [{ url: "/og-bank-landing.png", width: 1672, height: 939 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Northstar — Banking for Every Chapter",
    description: "A complete, secure digital banking experience for personal and business customers.",
    images: ["/og-bank-landing.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${mono.variable} ${serif.variable}`}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
