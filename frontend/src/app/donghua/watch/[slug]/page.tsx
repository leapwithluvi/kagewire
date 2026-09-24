import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { sankaApi } from '@/lib/sanka-api';
import StreamPlayer from '@/components/player/StreamPlayer';
import { DownloadSection } from '@/components/player/DownloadSection';
import { StreamingNotice } from '@/components/player/StreamingNotice';
import { AdBanner } from '@/components/ads/AdBanner';
import { ArrowLeft } from 'lucide-react';

import type { Metadata } from 'next';

interface DonghuaWatchPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 300;

export async function generateMetadata({ params }: DonghuaWatchPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!slug) return { title: 'Nonton Donghua' };

  const streamData = await sankaApi.getDonghuaEpisode(slug);
  if (!streamData) return { title: 'Episode Tidak Ditemukan' };

  const epTitle = streamData.title || slug.replace(/-/g, ' ');

  return {
    title: `Nonton ${epTitle} Sub Indo — Streaming Donghua`,
    description: `Nonton streaming ${epTitle} subtitle Indonesia online kualitas HD gratis tanpa buffering di KageWire.`,
    keywords: [epTitle, `${epTitle} sub indo`, `nonton ${epTitle}`, 'streaming donghua sub indo'],
    openGraph: {
      title: `Nonton ${epTitle} Sub Indo | KageWire`,
      description: `Streaming ${epTitle} subtitle Indonesia online gratis di KageWire.`,
      type: 'video.episode',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Nonton ${epTitle} Sub Indo | KageWire`,
      description: `Streaming ${epTitle} subtitle Indonesia di KageWire.`,
    },
  };
}

export default async function DonghuaWatchPage({ params }: DonghuaWatchPageProps) {
  const { slug } = await params;

  if (!slug || slug.length > 150 || slug.includes('/') || slug.includes('..')) {
    notFound();
  }

  const streamData = await sankaApi.getDonghuaEpisode(slug);

  if (!streamData) {
    notFound();
  }

  const prevUrl = streamData.navigation?.prev_slug
    ? `/donghua/watch/${streamData.navigation.prev_slug}`
    : null;
  const nextUrl = streamData.navigation?.next_slug
    ? `/donghua/watch/${streamData.navigation.next_slug}`
    : null;
  const allEpisodesUrl = streamData.navigation?.all_slug
    ? `/donghua/${streamData.navigation.all_slug}`
    : `/donghua`;

  const streamOptions = streamData.streams || [];
  const defaultUrl = streamOptions[0]?.url;

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kagewire.vercel.app';
  const pageUrl = `${siteUrl}/donghua/watch/${slug}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Schema.org Rich Snippet */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'TVEpisode',
                '@id': `${pageUrl}/#episode`,
                name: streamData.title || slug,
                inLanguage: 'zh',
                subtitleLanguage: 'id',
                partOfSeries: {
                  '@type': 'TVSeries',
                  name: streamData.navigation?.all_slug || 'Donghua',
                  url: allEpisodesUrl.startsWith('http') ? allEpisodesUrl : `${siteUrl}${allEpisodesUrl}`,
                },
              },
              {
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
                    name: 'Donghua',
                    item: `${siteUrl}/donghua`,
                  },
                  {
                    '@type': 'ListItem',
                    position: 3,
                    name: streamData.title || slug,
                    item: pageUrl,
                  },
                ],
              },
            ],
          }),
        }}
      />

      {/* Back button */}
      <div className="mb-4">
        <Link
          href={allEpisodesUrl}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-content-secondary hover:text-amber transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke detail serial donghua
        </Link>
      </div>

      {/* Header Info */}
      <div className="mb-6 border-b border-border-subtle pb-4">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-amber">
          Streaming Animasi Donghua Sub Indo
        </span>
        <h1 className="font-editorial text-xl sm:text-3xl font-normal text-content-primary mt-1 tracking-tight">
          {streamData.title}
        </h1>
        {streamData.release_date && (
          <p className="text-xs text-content-muted mt-1 num-tabular">
            Tanggal Rilis: {streamData.release_date}
          </p>
        )}
      </div>

      {/* Ad Placement above player */}
      <AdBanner slotId="watch-player-top" className="mb-6" />

      {/* Video Player */}
      <StreamPlayer
        title={streamData.title}
        defaultUrl={defaultUrl}
        streamOptions={streamOptions}
        prevUrl={prevUrl}
        nextUrl={nextUrl}
        allEpisodesUrl={allEpisodesUrl}
      />

      {/* Multi-banner strip below player */}
      <AdBanner slotId="watch-player-bottom" className="my-6" />

      {/* Download Section (Resolusi 360p, 480p, 720p, 1080p + Mirror Servers) */}
      <DownloadSection
        episodeTitle={streamData.title}
        rawDownloads={streamData.downloadUrl}
      />

      {/* Streaming Guides, Troubleshooting, Broken Link Report & DMCA Notice */}
      <StreamingNotice title={streamData.title} />
    </div>
  );
}
