import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pasang Iklan & Kemitraan Editorial',
  description:
    'Pasang banner promosi dan kemitraan editorial di KageWire. Jangkau ratusan ribu penikmat anime, donghua, dan komik di Indonesia dengan tingkat konversi tinggi.',
  keywords: [
    'pasang iklan anime',
    'iklan komik',
    'kemitraan digital',
    'slot iklan web',
    'advertising anime',
  ],
  openGraph: {
    title: 'Pasang Iklan & Media Partner | KageWire',
    description:
      'Jangkau komunitas penggemar anime, donghua, dan pembaca komik terbesar di Indonesia.',
  },
};

export default function AdvertiseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
