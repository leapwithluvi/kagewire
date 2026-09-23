import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'KageWire — Editorial Anime, Donghua & Comic Platform',
  description: 'Curated digital entertainment catalog and streaming experience for Anime, Donghua, and Comic powered by SankaApi.',
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
      </head>
      <body className="min-h-screen flex flex-col bg-background text-content-primary font-sans antialiased selection:bg-amber selection:text-black">
        <Navbar />
        <main className="flex-1 w-full pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
