import React from 'react';
import { notFound } from 'next/navigation';
import { sankaApi } from '@/lib/sanka-api';
import ComicReader from '@/components/reader/ComicReader';

import type { Metadata } from 'next';

interface ReadPageProps {
  params: Promise<{
    chapterId: string;
  }>;
}

export const revalidate = 3600;

export async function generateMetadata({ params }: ReadPageProps): Promise<Metadata> {
  const { chapterId } = await params;
  if (!chapterId) return { title: 'Baca Komik' };

  const chapterData = await sankaApi.getComicChapterReader(chapterId);
  if (!chapterData) return { title: 'Chapter Tidak Ditemukan' };

  const chapterTitle = chapterData.chapter_title || `Chapter ${chapterData.chapter_number}`;
  const mangaName = (chapterData.manga_id || '').replace(/-/g, ' ');
  const title = mangaName ? `${mangaName} - ${chapterTitle}` : chapterTitle;

  return {
    title: `Baca ${title} Bahasa Indonesia — KageWire Reader`,
    description: `Baca komik ${title} sub Indo online dengan kualitas gambar tinggi di KageWire.`,
    keywords: [mangaName, title, 'baca komik sub indo', 'baca manga online'],
    openGraph: {
      title: `Baca ${title} Bahasa Indonesia | KageWire`,
      description: `Baca ${title} resolusi tinggi di KageWire.`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `Baca ${title} Bahasa Indonesia | KageWire`,
    },
  };
}

export default async function ReadPage({ params }: ReadPageProps) {
  const { chapterId } = await params;

  if (!chapterId || chapterId.length > 150 || chapterId.includes('/') || chapterId.includes('..')) {
    notFound();
  }

  const chapterData = await sankaApi.getComicChapterReader(chapterId);

  if (!chapterData) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kagewire.vercel.app';
  const pageUrl = `${siteUrl}/read/${chapterId}`;
  const displayTitle = chapterData.chapter_title
    ? `${(chapterData.manga_id || '').replace(/-/g, ' ')} - ${chapterData.chapter_title}`
    : `Chapter ${chapterData.chapter_number || chapterId}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Beranda',
                item: siteUrl,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Komik',
                item: `${siteUrl}/comic`,
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: displayTitle,
                item: pageUrl,
              },
            ],
          }),
        }}
      />
      <ComicReader data={chapterData} />
    </>
  );
}
