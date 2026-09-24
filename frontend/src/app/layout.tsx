import type { Metadata } from 'next';
import './globals.css';
import { Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TopProgressBar from '@/components/ui/TopProgressBar';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kagewire.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'KageWire — Editorial Anime, Donghua & Comic Platform',
    template: '%s | KageWire',
  },
  description:
    'Platform kurasi digital dan streaming hiburan Anime, Donghua, dan Komik/Manga bahasa Indonesia tercepat dan terlengkap dengan antarmuka editorial premium.',
  applicationName: 'KageWire',
  keywords: [
    'anime sub indo',
    'nonton anime',
    'baca komik',
    'baca manga sub indo',
    'donghua sub indo',
    'streaming anime',
    'kagewire',
    'komikku',
    'otakudesu',
    'samehadaku',
  ],
  authors: [{ name: 'KageWire Team', url: siteUrl }],
  creator: 'KageWire',
  publisher: 'KageWire',
  category: 'Entertainment',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: siteUrl,
    siteName: 'KageWire',
    title: 'KageWire — Editorial Anime, Donghua & Comic Platform',
    description:
      'Platform kurasi digital dan streaming hiburan Anime, Donghua, dan Komik/Manga bahasa Indonesia tercepat dan terlengkap.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KageWire — Editorial Anime, Donghua & Comic Platform',
    description:
      'Kurasi anime, donghua & komik bahasa Indonesia terlengkap dan mutakhir.',
    creator: '@kagewire',
  },
  icons: {
    icon: '/kage-chan.svg',
    shortcut: '/kage-chan.svg',
    apple: '/kage-chan.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'WebSite',
                  '@id': `${siteUrl}/#website`,
                  url: siteUrl,
                  name: 'KageWire',
                  description:
                    'Platform kurasi digital dan streaming hiburan Anime, Donghua, dan Komik bahasa Indonesia.',
                  inLanguage: 'id-ID',
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: {
                      '@type': 'EntryPoint',
                      urlTemplate: `${siteUrl}/search?q={search_term_string}`,
                    },
                    'query-input': 'required name=search_term_string',
                  },
                },
                {
                  '@type': 'Organization',
                  '@id': `${siteUrl}/#organization`,
                  name: 'KageWire',
                  url: siteUrl,
                  logo: {
                    '@type': 'ImageObject',
                    url: `${siteUrl}/kage-chan.svg`,
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-content-primary font-sans antialiased selection:bg-amber selection:text-black">
        <Suspense fallback={null}>
          <TopProgressBar />
        </Suspense>
        <Navbar />
        <main className="flex-1 w-full pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
