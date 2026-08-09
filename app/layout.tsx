import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "../components/LanguageProvider";
import { PublicBrandProvider } from "../components/usePublicBrand";
import { getActiveSimulationBrand, getPublicSimulationWebsite } from "../server/d1/sim-bank";

const geist = Geist({ variable: "--font-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });
const serif = Instrument_Serif({ variable: "--font-serif", weight: "400", subsets: ["latin"] });

export const dynamic = "force-dynamic";

function configuredMetadataBase() {
  const host = process.env.NORTHSTAR_HOST?.trim();
  try { return new URL(host?.includes("://") ? host : `https://${host || "localhost"}`); }
  catch { return new URL("https://localhost"); }
}

export async function generateMetadata(): Promise<Metadata> {
  const [brand, website] = await Promise.all([
    getActiveSimulationBrand().catch(() => null),
    getPublicSimulationWebsite().catch(() => null),
  ]);
  const title = website?.content.pageTitle || brand?.bankName || "Online Banking";
  const description = website?.content.heroMessage
    || "Secure digital banking for accounts, transfers, lending, statements, and support.";
  return {
    metadataBase: configuredMetadataBase(),
    title,
    description,
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: { title, description, images: [{ url: "/og-bank-landing.png", width: 1672, height: 939 }] },
    twitter: { card: "summary_large_image", title, description, images: ["/og-bank-landing.png"] },
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const initialBrand = await getActiveSimulationBrand().catch(() => null);
  return (
    <html lang="en">
      <body className={`${geist.variable} ${mono.variable} ${serif.variable}`}>
        <PublicBrandProvider initialBrand={initialBrand}>
          <LanguageProvider>{children}</LanguageProvider>
        </PublicBrandProvider>
      </body>
    </html>
  );
}
