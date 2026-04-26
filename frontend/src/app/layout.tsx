import type { Metadata } from "next";
import { Shadows_Into_Light } from "next/font/google";
import "./globals.css";

const shadowsIntoLight = Shadows_Into_Light({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-shadows-into-light",
});

export const metadata: Metadata = {
  title: "Mina Cafe | Digital Menu",
  description: "Digital menu for Mina Cafe - مینا کافه",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Default initial direction/language matches the most common audience (Persian).
  // Client pages update these via documentElement when the user toggles the
  // language so the rendered HTML stays in sync with the active locale.
  return (
    <html lang="fa" dir="rtl">
      <body className={`bg-background text-foreground antialiased ${shadowsIntoLight.variable}`}>
        {children}
      </body>
    </html>
  );
}
