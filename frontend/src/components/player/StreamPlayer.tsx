'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Maximize,
  Minimize,
  ChevronLeft,
  ChevronRight,
  Server,
  ExternalLink,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface StreamOption {
  server: string;
  url: string;
  serverId?: string;
}

interface StreamPlayerProps {
  title: string;
  defaultUrl?: string;
  streamOptions?: StreamOption[];
  prevUrl?: string | null;
  nextUrl?: string | null;
  allEpisodesUrl?: string;
}

export default function StreamPlayer({
  title,
  defaultUrl,
  streamOptions = [],
  prevUrl,
  nextUrl,
  allEpisodesUrl,
}: StreamPlayerProps) {
  // Build unified server list
  const availableServers: StreamOption[] = [];
  if (defaultUrl) {
    availableServers.push({ server: 'Server Utama', url: defaultUrl });
  }
  streamOptions.forEach((opt) => {
    if (!availableServers.some((s) => s.server === opt.server)) {
      availableServers.push(opt);
    }
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTheater, setIsTheater] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [resolvedUrls, setResolvedUrls] = useState<Record<number, string>>({});

  const activeServer = availableServers[currentIndex] || null;
  const activeUrl = resolvedUrls[currentIndex] ?? activeServer?.url ?? '';

  const handleServerSelect = useCallback(
    async (idx: number) => {
      setCurrentIndex(idx);
      const server = availableServers[idx];
      if (!server) return;

      // Already resolved
      if (resolvedUrls[idx] || server.url) return;

      // Has serverId — resolve via our API route
      if (server.serverId) {
        setResolving(true);
        try {
          const res = await fetch(`/api/server/${server.serverId}`);
          if (res.ok) {
            const data = await res.json();
            if (data.url) {
              setResolvedUrls((prev) => ({ ...prev, [idx]: data.url }));
            }
          }
        } catch {
          // ignore — user can retry by clicking again
        } finally {
          setResolving(false);
        }
      }
    },
    [availableServers, resolvedUrls]
  );

  return (
    <div className={`w-full transition-all duration-300 ${isTheater ? 'max-w-none' : 'max-w-5xl mx-auto'}`}>
      {/* 16:9 Video Container */}
      <div className="relative aspect-video w-full rounded-md overflow-hidden bg-black border border-border-subtle shadow-cinematic">
        {resolving ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-content-muted">
            <Loader2 className="w-8 h-8 text-amber animate-spin" />
            <p className="text-xs font-medium">Menghubungkan ke server…</p>
          </div>
        ) : activeUrl ? (
          <iframe
            key={activeUrl}
            src={activeUrl}
            title={title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-content-muted">
            <AlertCircle className="w-10 h-10 text-amber mb-3" />
            <p className="text-sm font-semibold text-content-primary">
              Tautan video belum tersedia
            </p>
            <p className="text-xs text-content-muted mt-1 max-w-sm">
              Pilih server lain di bawah, atau klik ikon eksternal untuk membuka di tab baru.
            </p>
          </div>
        )}
      </div>

      {/* Control Bar & Server Switcher */}
      <div className="mt-4 p-3.5 rounded-md surface-panel flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Server Selector */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-content-secondary flex items-center gap-1.5 flex-shrink-0">
            <Server className="w-3.5 h-3.5 text-amber" /> Server:
          </span>
          {availableServers.length > 0 ? (
            availableServers.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleServerSelect(idx)}
                className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap transition-all ${
                  currentIndex === idx
                    ? 'bg-amber text-black font-bold shadow-subtle'
                    : 'bg-surface-secondary text-content-secondary hover:text-content-primary hover:bg-surface-hover'
                }`}
              >
                {s.server}
              </button>
            ))
          ) : (
            <span className="text-xs text-content-muted">Tidak ada server tersedia</span>
          )}
        </div>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {prevUrl && (
            <Link
              href={prevUrl}
              className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium bg-surface-secondary text-content-secondary hover:text-content-primary hover:bg-surface-hover transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Sebelumnya
            </Link>
          )}

          {allEpisodesUrl && (
            <Link
              href={allEpisodesUrl}
              className="px-3 py-1.5 rounded text-xs font-medium bg-surface-secondary text-content-secondary hover:text-content-primary hover:bg-surface-hover transition-colors"
            >
              Daftar Episode
            </Link>
          )}

          {nextUrl && (
            <Link
              href={nextUrl}
              className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold bg-amber hover:bg-amber-hover text-black transition-colors"
            >
              Selanjutnya <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}

          {/* Theater Mode Toggle */}
          <button
            onClick={() => setIsTheater(!isTheater)}
            className="hidden md:flex items-center p-1.5 rounded bg-surface-secondary text-content-secondary hover:text-content-primary transition-colors"
            title="Toggle Theater Mode"
            aria-label="Toggle Theater Mode"
          >
            {isTheater ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* External Player Link */}
          {activeUrl && (
            <a
              href={activeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded bg-surface-secondary text-content-secondary hover:text-amber transition-colors"
              title="Buka pemutar di tab baru"
              aria-label="Buka pemutar di tab baru"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
