import type { Metadata } from "next";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import "./globals.css";

// Police pour les titres - Élégante et autoritaire
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

// Police pour le corps de texte - Moderne et lisible
const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Défense des Épargnants | Cabinet spécialisé fraude bancaire",
  description:
    "Victime de fraude bancaire ? Votre banque refuse de rembourser ? Cabinet d'avocat spécialisé dans la défense des victimes de fraudes au faux conseiller. Tarifs maîtrisés.",
  keywords: [
    "avocat fraude bancaire",
    "fraude bancaire remboursement",
    "faux conseiller bancaire",
    "assignation banque",
    "défense épargnants",
    "litige banque",
  ],
  authors: [{ name: "Cabinet d'Avocat - Barreau de Paris" }],
  openGraph: {
    title: "Défense des Épargnants | Victime de fraude bancaire ?",
    description:
      "Cabinet spécialisé dans la défense des victimes de fraudes bancaires. Nous assignons les banques qui refusent de rembourser.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body
        className={`${playfair.variable} ${sourceSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
