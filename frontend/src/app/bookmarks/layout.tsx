import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bookmark & Riwayat Tontonan',
  description: 'Daftar anime, donghua, dan komik favorit yang Anda simpan beserta riwayat tontonan terakhir.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function BookmarksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
