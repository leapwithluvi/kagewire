import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { sankaApi } from '@/lib/sanka-api';
import StreamPlayer from '@/components/player/StreamPlayer';
import { DownloadSection } from '@/components/player/DownloadSection';
import { StreamingNotice } from '@/components/player/StreamingNotice';
import { AdBanner } from '@/components/ads/AdBanner';
import { ArrowLeft } from 'lucide-react';

interface DonghuaWatchPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = 'force-dynamic';

export default async function DonghuaWatchPage({ params }: DonghuaWatchPageProps) {
  const { slug } = await params;
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
