import React from 'react';
import { notFound } from 'next/navigation';
import { sankaApi } from '@/lib/sanka-api';
import ComicReader from '@/components/reader/ComicReader';

interface ReadPageProps {
  params: Promise<{
    chapterId: string;
  }>;
}

export const revalidate = 3600;

export default async function ReadPage({ params }: ReadPageProps) {
  const { chapterId } = await params;
  const chapterData = await sankaApi.getComicChapterReader(chapterId);

  if (!chapterData) {
    notFound();
  }

  return <ComicReader data={chapterData} />;
}
