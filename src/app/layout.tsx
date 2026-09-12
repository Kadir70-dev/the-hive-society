import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import { siteName, siteTagline, siteUrl } from "@/lib/site";
import "./globals.css";
import "./tailwind.css";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — ${siteTagline}`,
    template: `%s — ${siteName}`,
  },
  description:
    "Find your circle. Find your gathering. In Abu Dhabi.",
  openGraph: {
    siteName,
    type: "website",
    locale: "en_AE",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cormorantGaramond.variable}>
      <body>{children}</body>
    </html>
  );
}
