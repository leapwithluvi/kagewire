'use client';

import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
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
  RotateCw,
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

function isValidStreamUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export default function StreamPlayer({
  title,
  defaultUrl,
  streamOptions = [],
  prevUrl,
  nextUrl,
  allEpisodesUrl,
}: StreamPlayerProps) {
  // Build unified and deduplicated server list
  const availableServers = useMemo(() => {
    const list: StreamOption[] = [];
    if (defaultUrl && isValidStreamUrl(defaultUrl)) {
      list.push({ server: 'Server Utama', url: defaultUrl });
    }
    streamOptions.forEach((opt) => {
      // Don't add duplicate if already present with same server name or url
      const exists = list.some(
        (s) =>
          s.server.toLowerCase() === opt.server.toLowerCase() ||
          (s.url && opt.url && s.url === opt.url)
      );
      if (!exists) {
        list.push(opt);
      }
    });
    return list;
  }, [defaultUrl, streamOptions]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTheater, setIsTheater] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [resolvedUrls, setResolvedUrls] = useState<Record<number, string>>({});
  const [resolveError, setResolveError] = useState<number | null>(null);

  // Track latest request to avoid race condition during fast server clicking
  const reqIdRef = useRef(0);

  const activeServer = availableServers[currentIndex] || null;
  const activeUrl = resolvedUrls[currentIndex] ?? activeServer?.url ?? '';
  const isSafeUrl = isValidStreamUrl(activeUrl);

  const resolveServerUrl = useCallback(
    async (idx: number, forceRetry = false) => {
      const server = availableServers[idx];
      if (!server) return;

      // If already resolved and not force retrying, skip
      if (!forceRetry && resolvedUrls[idx]) return;

      // Direct URL already valid, skip API call
      if (!forceRetry && server.url && isValidStreamUrl(server.url)) return;

      if (!server.serverId) {
        if (!server.url) {
          setResolveError(idx);
        }
        return;
      }

      const currentReqId = ++reqIdRef.current;
      setResolving(true);
      setResolveError(null);

      try {
        const res = await fetch(`/api/server/${encodeURIComponent(server.serverId)}`);
        // If user already clicked another server while this was fetching, discard
        if (currentReqId !== reqIdRef.current) return;

        if (res.ok) {
          const data = await res.json();
          if (data.url && isValidStreamUrl(data.url)) {
            setResolvedUrls((prev) => ({ ...prev, [idx]: data.url }));
            setResolveError(null);
          } else {
            setResolveError(idx);
          }
        } else {
          setResolveError(idx);
        }
      } catch {
        if (currentReqId === reqIdRef.current) {
          setResolveError(idx);
        }
      } finally {
        if (currentReqId === reqIdRef.current) {
          setResolving(false);
        }
      }
    },
    [availableServers, resolvedUrls]
  );

  const handleServerSelect = useCallback(
    (idx: number, forceRetry = false) => {
      setCurrentIndex(idx);
      setResolveError(null);
      resolveServerUrl(idx, forceRetry);
    },
    [resolveServerUrl]
  );

  // Auto-resolve server on initial load or index change if it requires resolution
  useEffect(() => {
    const server = availableServers[currentIndex];
    if (!server) return;

    if (!resolvedUrls[currentIndex] && (!server.url || !isValidStreamUrl(server.url)) && server.serverId) {
      resolveServerUrl(currentIndex);
    }
  }, [currentIndex, availableServers, resolvedUrls, resolveServerUrl]);

  return (
    <div className={`w-full transition-all duration-300 ${isTheater ? 'max-w-none' : 'max-w-5xl mx-auto'}`}>
      {/* 16:9 Video Container */}
      <div className="relative aspect-video w-full rounded-md overflow-hidden bg-black border border-border-subtle shadow-cinematic">
        {resolving ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-content-muted">
            <Loader2 className="w-8 h-8 text-amber animate-spin" />
            <p className="text-xs font-medium">Menghubungkan ke server…</p>
          </div>
        ) : isSafeUrl ? (
          <iframe
            key={activeUrl}
            src={activeUrl}
            title={title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : resolveError === currentIndex ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-content-muted">
            <AlertCircle className="w-10 h-10 text-rose-500 mb-3" />
            <p className="text-sm font-semibold text-content-primary">
              Gagal Memuat Server Video
            </p>
            <p className="text-xs text-content-muted mt-1 max-w-sm">
              Server yang dipilih ({activeServer?.server || 'Server ini'}) sedang offline atau tautan kedaluwarsa. Silakan coba lagi atau pilih server alternatif.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <button
                onClick={() => handleServerSelect(currentIndex, true)}
                className="px-3 py-1.5 rounded bg-surface-secondary text-content-primary border border-border-subtle hover:border-amber text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5" /> Coba Lagi
              </button>
              {availableServers.length > 1 && (
                <button
                  onClick={() => handleServerSelect((currentIndex + 1) % availableServers.length)}
                  className="px-3 py-1.5 rounded bg-amber text-black hover:bg-amber-hover text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  Ganti ke Server {((currentIndex + 1) % availableServers.length) + 1}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-content-muted">
            <AlertCircle className="w-10 h-10 text-amber mb-3" />
            <p className="text-sm font-semibold text-content-primary">
              Tautan video belum tersedia
            </p>
            <p className="text-xs text-content-muted mt-1 max-w-sm">
              Pilih server lain di bawah, atau klik ikon eksternal untuk membuka di tab baru.
            </p>
            {availableServers.length > 1 && (
              <button
                onClick={() => handleServerSelect((currentIndex + 1) % availableServers.length)}
                className="mt-4 px-3 py-1.5 rounded bg-surface-secondary border border-border-subtle text-content-primary hover:border-amber text-xs font-semibold transition-colors"
              >
                Coba Server Berikutnya
              </button>
            )}
          </div>
        )}
      </div>

      {/* Control Bar & Server Switcher */}
      <div className="mt-4 p-3.5 rounded-md surface-panel flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Server Selector — Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-content-secondary flex items-center gap-1.5 flex-shrink-0">
            <Server className="w-3.5 h-3.5 text-amber" /> Server:
          </span>
          {availableServers.length > 0 ? (
            <div className="relative flex-1 sm:flex-none sm:min-w-[200px]">
              <select
                value={currentIndex}
                onChange={(e) => handleServerSelect(Number(e.target.value))}
                disabled={resolving}
                className="w-full appearance-none pl-3 pr-8 py-1.5 rounded bg-surface-secondary border border-border-subtle text-xs font-semibold text-content-primary focus:border-amber focus:outline-none cursor-pointer transition-colors hover:border-amber/40 disabled:opacity-50"
              >
                {availableServers.map((s, idx) => (
                  <option key={idx} value={idx}>
                    {idx + 1}. {s.server}
                  </option>
                ))}
              </select>
              <ChevronLeft className="w-3 h-3 text-amber absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none rotate-[-90deg]" />
            </div>
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
          {activeUrl && isSafeUrl && (
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
