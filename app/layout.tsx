import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ನಮ್ಮ ಟ್ಯಾಲೆಂಟ್",
  description:
    "Namma Talent connects you with verified photographers, designers, tutors, musicians and freelancers near you. Browse profiles, compare, and book in minutes.",
  icons: [{
    rel: "icon",
    url: "/icon.png",
  }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <body className="font-body antialiased bg-mist">{children}</body>
    </html>
  );
}
