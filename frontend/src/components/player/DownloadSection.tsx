'use client';

import React, { useState } from 'react';
import { Download, ExternalLink, HardDrive, ShieldAlert, Sparkles, Check } from 'lucide-react';

export interface DownloadLink {
  server: string;
  url: string;
}

export interface QualityGroup {
  resolution: string;
  size?: string;
  links: DownloadLink[];
}

interface DownloadSectionProps {
  episodeTitle: string;
  rawDownloads?: any;
}

function getServerBadgeStyle(serverName: string): { btnClass: string; dotClass: string } {
  const name = serverName.toLowerCase();

  if (name.includes('google') || name.includes('gdrive') || name.includes('drive')) {
    return {
      btnClass:
        'bg-emerald-950/50 text-emerald-200 border-emerald-500/40 hover:bg-emerald-600 hover:text-white hover:border-emerald-400 shadow-sm',
      dotClass: 'bg-emerald-400',
    };
  }
  if (name.includes('mega')) {
    return {
      btnClass:
        'bg-rose-950/50 text-rose-200 border-rose-500/40 hover:bg-rose-600 hover:text-white hover:border-rose-400 shadow-sm',
      dotClass: 'bg-rose-400',
    };
  }
  if (name.includes('mediafire')) {
    return {
      btnClass:
        'bg-sky-950/50 text-sky-200 border-sky-500/40 hover:bg-sky-600 hover:text-white hover:border-sky-400 shadow-sm',
      dotClass: 'bg-sky-400',
    };
  }
  if (name.includes('terabox') || name.includes('mirror') || name.includes('kraken')) {
    return {
      btnClass:
        'bg-violet-950/50 text-violet-200 border-violet-500/40 hover:bg-violet-600 hover:text-white hover:border-violet-400 shadow-sm',
      dotClass: 'bg-violet-400',
    };
  }
  if (name.includes('zippy') || name.includes('acefile') || name.includes('fichiers')) {
    return {
      btnClass:
        'bg-amber-950/50 text-amber-200 border-amber-500/40 hover:bg-amber-500 hover:text-black hover:border-amber-400 shadow-sm',
      dotClass: 'bg-amber-400',
    };
  }

  return {
    btnClass:
      'bg-surface-secondary text-content-primary border-border-subtle hover:bg-amber hover:text-black hover:border-amber shadow-sm',
    dotClass: 'bg-amber',
  };
}

function getResolutionBadgeStyle(resolution: string): string {
  const res = resolution.toLowerCase();
  if (res.includes('1080')) {
    return 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.2)]';
  }
  if (res.includes('720')) {
    return 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.2)]';
  }
  if (res.includes('480')) {
    return 'bg-gradient-to-r from-sky-500/20 to-blue-500/20 text-sky-300 border-sky-500/40';
  }
  return 'bg-zinc-800 text-zinc-300 border-zinc-700';
}

export function DownloadSection({ episodeTitle, rawDownloads }: DownloadSectionProps) {
  // Normalize different download formats (Otakudesu vs Donghua)
  const qualityGroups: QualityGroup[] = React.useMemo(() => {
    if (!rawDownloads) return [];

    const result: QualityGroup[] = [];

    // 1. Otakudesu format: { qualities: [ { title: '360p', size: '40 MB', urls: [ { title, url } ] } ] }
    if (rawDownloads.qualities && Array.isArray(rawDownloads.qualities)) {
      for (const q of rawDownloads.qualities) {
        if (q.urls && Array.isArray(q.urls) && q.urls.length > 0) {
          result.push({
            resolution: q.title || 'Unknown',
            size: q.size,
            links: q.urls.map((u: any) => ({
              server: u.title || 'Server',
              url: u.url,
            })),
          });
        }
      }
    }

    // 2. Donghua format: { download_url_360p: { Mirrored: "...", Terabox: "..." }, ... }
    const donghuaResKeys: Record<string, string> = {
      download_url_360p: '360p SD',
      download_url_480p: '480p SD',
      download_url_720p: '720p HD',
      download_url_1080p: '1080p Full HD',
    };

    for (const [key, label] of Object.entries(donghuaResKeys)) {
      if (rawDownloads[key] && typeof rawDownloads[key] === 'object') {
        const links: DownloadLink[] = [];
        for (const [serverName, linkUrl] of Object.entries(rawDownloads[key])) {
          if (typeof linkUrl === 'string' && linkUrl.startsWith('http')) {
            links.push({
              server: serverName,
              url: linkUrl,
            });
          }
        }
        if (links.length > 0) {
          result.push({
            resolution: label,
            links,
          });
        }
      }
    }

    // 3. Fallback dummy if empty
    if (result.length === 0) {
      result.push(
        {
          resolution: '720p HD',
          size: '~120 MB',
          links: [
            { server: 'Google Drive', url: '#' },
            { server: 'Mega.nz', url: '#' },
            { server: 'Mediafire', url: '#' },
            { server: 'Terabox', url: '#' },
          ],
        },
        {
          resolution: '480p SD',
          size: '~65 MB',
          links: [
            { server: 'Google Drive', url: '#' },
            { server: 'KrakenFiles', url: '#' },
            { server: 'ZippyShare', url: '#' },
          ],
        }
      );
    }

    return result;
  }, [rawDownloads]);

  const handleLinkClick = (url: string) => {
    if (url === '#') {
      alert('Tautan download untuk server ini sedang dalam proses sinkronisasi server harian.');
    }
  };

  return (
    <div className="my-8 rounded-xl border border-border-subtle bg-surface-card overflow-hidden shadow-md">
      {/* Header with High-Contrast Accent */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 bg-gradient-to-r from-surface-secondary via-surface-secondary/90 to-surface-card border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber/15 text-amber border border-amber/30 shadow-sm shrink-0">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-editorial text-lg sm:text-xl font-bold text-white tracking-tight">
                Download {episodeTitle}
              </h3>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber/15 text-amber border border-amber/30">
                <Sparkles className="w-3 h-3" /> Hardsub Indo
              </span>
            </div>
            <p className="text-xs text-content-secondary mt-0.5">
              Pilih resolusi dan server mirror download berkecepatan tinggi tanpa limit
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-amber shrink-0 bg-surface-main/80 px-3 py-1.5 rounded-lg border border-border-subtle">
          <HardDrive className="w-4 h-4 text-amber" />
          <span>Multi-Server Mirror</span>
        </div>
      </div>

      {/* Quality Tiers List */}
      <div className="divide-y divide-border-subtle">
        {qualityGroups.map((group, idx) => (
          <div
            key={idx}
            className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-surface-secondary/30 transition-colors"
          >
            {/* Left: Resolution Badge & File Size */}
            <div className="flex items-center gap-3 shrink-0">
              <span
                className={`px-3 py-1 rounded-md text-xs font-bold font-mono tracking-wider border shadow-sm ${getResolutionBadgeStyle(
                  group.resolution
                )}`}
              >
                {group.resolution}
              </span>
              {group.size && (
                <span className="px-2.5 py-0.5 rounded bg-surface-secondary/80 text-[11px] font-mono text-content-secondary border border-border-subtle">
                  {group.size}
                </span>
              )}
            </div>

            {/* Right: Server Link Pills with Distinct Colors */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              {group.links.map((link, lIdx) => {
                const { btnClass, dotClass } = getServerBadgeStyle(link.server);
                return (
                  <a
                    key={lIdx}
                    href={link.url}
                    target={link.url !== '#' ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    onClick={() => handleLinkClick(link.url)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border text-xs font-bold transition-all active:scale-95 group/btn ${btnClass}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClass}`} />
                    <span>{link.server}</span>
                    <ExternalLink className="w-3 h-3 opacity-70 group-hover/btn:opacity-100 transition-opacity" />
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info Notice */}
      <div className="px-5 py-3.5 bg-surface-secondary/50 border-t border-border-subtle text-xs text-content-secondary flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber shrink-0" />
          <span>
            Tips: Jika link utama terkena limit kuota harian, gunakan mirror <strong>Mega</strong>, <strong>Mediafire</strong>, atau <strong>Terabox</strong>.
          </span>
        </div>
        <span className="text-[11px] text-content-muted num-tabular shrink-0">
          Format: MP4 x264 Hardsub
        </span>
      </div>
    </div>
  );
}
export default DownloadSection;
