import type { Metadata } from "next";
import { Playfair_Display, Lato, Outfit } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: 'swap',
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
  display: 'swap',
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Grogan Engrave | Custom Tumblers & Gifts",
  description: "Create your masterpiece. Premium custom engraved tumblers and gifts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${playfair.variable} ${lato.variable} ${outfit.variable} font-sans antialiased text-text-primary bg-background`}
      >
        {children}
      </body>
    </html>
  );
}
