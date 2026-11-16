import type { Metadata, Viewport } from "next";
import { Archivo_Black, Space_Grotesk } from "next/font/google";
import "./globals.css";

const archivo = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-archivo",
});

const grotesk = Space_Grotesk({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-grotesk",
});

const description = "Suivi de projets et espace client de Gaël Tournier, développeur web.";

export const metadata: Metadata = {
  metadataBase: new URL("https://panel.gaeltournier.dev"),
  title: { default: "Panel · Gaël Tournier", template: "%s · Panel" },
  description,
  applicationName: "Panel",
  authors: [{ name: "Gaël Tournier", url: "https://gaeltournier.dev" }],
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    siteName: "Panel · Gaël Tournier",
    title: "Panel · Gaël Tournier",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Panel · Gaël Tournier",
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#c4a1ff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${archivo.variable} ${grotesk.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
