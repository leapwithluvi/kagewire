import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { sankaApi } from '@/lib/sanka-api';
import StreamPlayer from '@/components/player/StreamPlayer';
import { DownloadSection } from '@/components/player/DownloadSection';
import { StreamingNotice } from '@/components/player/StreamingNotice';
import { AdBanner } from '@/components/ads/AdBanner';
import { ArrowLeft } from 'lucide-react';

interface WatchPageProps {
  params: Promise<{
    source: string;
    slug: string;
  }>;
}

export const revalidate = 300;

const ALLOWED_ANIME_SOURCES = ['otakudesu', 'samehadaku'];

export default async function WatchPage({ params }: WatchPageProps) {
  const { source, slug } = await params;

  // Security: validate source allowlist and prevent path traversal
  if (
    !source ||
    !ALLOWED_ANIME_SOURCES.includes(source) ||
    !slug ||
    slug.length > 150 ||
    slug.includes('/') ||
    slug.includes('..')
  ) {
    notFound();
  }

  const streamData = await sankaApi.getAnimeEpisode(source, slug);

  if (!streamData) {
    notFound();
  }

  let prevUrl: string | null = null;
  if (streamData.prevEpisode?.episodeId) {
    prevUrl = `/watch/${source}/${streamData.prevEpisode.episodeId}`;
  } else if (streamData.prevEpisode?.href) {
    const prevSlug = streamData.prevEpisode.href.split('/').filter(Boolean).pop();
    prevUrl = `/watch/${source}/${prevSlug}`;
  }

  let nextUrl: string | null = null;
  if (streamData.nextEpisode?.episodeId) {
    nextUrl = `/watch/${source}/${streamData.nextEpisode.episodeId}`;
  } else if (streamData.nextEpisode?.href) {
    const nextSlug = streamData.nextEpisode.href.split('/').filter(Boolean).pop();
    nextUrl = `/watch/${source}/${nextSlug}`;
  }

  const allEpisodesUrl = streamData.animeId
    ? `/anime/${source}/${streamData.animeId}`
    : `/anime`;

  type ServerEntry = { server: string; url: string; quality?: string; serverId?: string };
  const serverList: ServerEntry[] = [];

  if (streamData.streams && streamData.streams.length > 0) {
    serverList.push(...streamData.streams.map((s) => ({ server: s.server, url: s.url })));
  } else if (streamData.server?.serverList) {
    for (const s of streamData.server.serverList) {
      serverList.push({ server: s.title, url: '', serverId: s.serverId });
    }
  } else if ((streamData.server as Record<string, unknown>)?.qualities) {
    const quals = (streamData.server as { qualities: { title: string; serverList: { title: string; serverId: string }[] }[] }).qualities;
    for (const q of quals) {
      for (const s of q.serverList || []) {
        serverList.push({ server: `${s.title} [${q.title}]`, url: '', serverId: s.serverId, quality: q.title });
      }
    }
  }

  let defaultUrl = streamData.defaultStreamingUrl || '';
  if (!defaultUrl && serverList[0]?.serverId) {
    const resolved = await sankaApi.getAnimeServer(serverList[0].serverId);
    if (resolved) {
      defaultUrl = resolved;
      serverList[0].url = resolved;
    }
  }

  const streamOptions = serverList
    .filter((_, i) => i > 0 || serverList[0]?.url)
    .map((s) => ({
      server: s.server,
      url: s.url,
      serverId: s.serverId,
    }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back button */}
      <div className="mb-4">
        <Link
          href={allEpisodesUrl}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-content-secondary hover:text-amber transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke detail anime
        </Link>
      </div>

      {/* Episode Title */}
      <div className="mb-6 border-b border-border-subtle pb-4">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-amber">
          Streaming Serial Anime Sub Indo
        </span>
        <h1 className="font-editorial text-xl sm:text-3xl font-normal text-content-primary mt-1 tracking-tight">
          {streamData.title}
        </h1>
      </div>

      {/* Ad Placement above player */}
      <AdBanner slotId="watch-player-top" className="mb-6" />

      {/* Video Player with server resolver */}
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
