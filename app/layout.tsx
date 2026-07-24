import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });
const serif = Instrument_Serif({
  variable: "--font-serif",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://northstar-simulated-bank.openai.site"),
  title: {
    default: "Northstar — Simulated Banking, Fully Under Control",
    template: "%s · Northstar",
  },
  description:
    "A secure, self-hosted simulated banking environment for training teams and validating operations without live payment rails.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "Northstar — Simulated Banking, Fully Under Control",
    description: "Training environment. No real funds or payment rails.",
    images: [{ url: "/og.png", width: 1536, height: 1024 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Northstar — Simulated Banking, Fully Under Control",
    description: "Training environment. No real funds or payment rails.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${mono.variable} ${serif.variable}`}>
        {children}
      </body>
    </html>
  );
}
