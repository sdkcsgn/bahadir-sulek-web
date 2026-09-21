import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bahadirsulek.com.tr"),

  title: {
    default:
      "Bahadır Sülek | Soğuk Hava Deposu & Meyve Paketleme - Serik Antalya",
    template: "%s | Bahadır Sülek",
  },

  description:
    "Antalya Serik'te soğuk hava depolama, narenciye ve meyve işleme, paketleme ve ürün tedarik hizmetleri. Bahadır Sülek Soğuk Hava & Meyve Paketleme Deposu.",

  keywords: [
    "Bahadır Sülek",
    "soğuk hava deposu",
    "Serik soğuk hava deposu",
    "Antalya soğuk hava deposu",
    "meyve paketleme",
    "Serik meyve paketleme",
    "Antalya meyve paketleme",
    "narenciye paketleme",
    "portakal paketleme",
    "limon paketleme",
    "greyfurt paketleme",
    "meyve işleme",
    "meyve depolama",
    "narenciye tedarik",
    "Serik Antalya",
  ],

  authors: [
    {
      name: "Bahadır Sülek",
    },
  ],

  creator: "Bahadır Sülek",
  publisher: "Bahadır Sülek",

  alternates: {
    canonical: "/",
    languages: {
      "tr-TR": "/?lang=tr",
      "en": "/?lang=en",
      "ru": "/?lang=ru",
    },
  },

  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "/",
    siteName: "Bahadır Sülek",
    title:
      "Bahadır Sülek | Soğuk Hava Deposu & Meyve Paketleme",
    description:
      "Antalya Serik'te soğuk hava depolama, meyve işleme, paketleme ve narenciye tedarik hizmetleri.",
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Bahadır Sülek | Soğuk Hava Deposu & Meyve Paketleme",
    description:
      "Antalya Serik'te soğuk hava depolama, meyve işleme, paketleme ve narenciye tedarik hizmetleri.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}