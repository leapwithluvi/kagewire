import type { Metadata } from "next";
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
  title: "Kagewire - Anime, Manga & Drama News",
  description: "Kagewire is a platform that provides news and updates about anime, manga, and dramas.",
  icons: {
    icon: [
      {
        url: "/kage-chan.svg",
        type: "image/svg+xml",
      },
      {
        url: "/kagewire-icon.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
    apple: {
      url: "/kagewire-icon.png",
      sizes: "180x180",
      type: "image/png",
    },
  },
};

import { ThemeProvider } from "@/components/providers/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
