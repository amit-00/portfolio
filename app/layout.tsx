import type { Metadata } from "next";
import { JetBrains_Mono, Public_Sans } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Amit Verma — Software Engineer",
  description:
    "Portfolio of Amit Verma, a software engineer building web and AI products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The font variables must land on <html>: Tailwind resolves --font-sans and
    // --font-mono at :root, and a var() it cannot see there computes to nothing.
    <html lang="en" className={`${jetbrainsMono.variable} ${publicSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
