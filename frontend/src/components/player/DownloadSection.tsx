'use client';

import React, { useState } from 'react';
import { Download, ExternalLink, HardDrive, CheckCircle2, ShieldAlert } from 'lucide-react';

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

export function DownloadSection({ episodeTitle, rawDownloads }: DownloadSectionProps) {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

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
      alert('Tautan download untuk server ini sedang dalam proses sinkronisasi.');
    }
  };

  return (
    <div className="my-8 rounded-xl border border-border-subtle bg-surface-card overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 bg-surface-secondary/70 border-b border-border-subtle">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber/15 text-amber border border-amber/30">
            <Download className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-editorial text-lg font-bold text-content-primary">
              Download {episodeTitle}
            </h3>
            <p className="text-xs text-content-muted">
              Pilih server dan resolusi video yang diinginkan (MP4 H.264 Hardsub Indo)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-content-muted">
          <HardDrive className="w-3.5 h-3.5 text-amber" />
          <span>Multi-Server Mirror</span>
        </div>
      </div>

      {/* Quality Tiers List */}
      <div className="divide-y divide-border-subtle">
        {qualityGroups.map((group, idx) => (
          <div
            key={idx}
            className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-surface-hover/40 transition-colors"
          >
            {/* Left: Resolution Badge & File Size */}
            <div className="flex items-center gap-3 shrink-0">
              <span className="px-2.5 py-1 rounded-md text-xs font-bold font-mono tracking-wider bg-surface-main text-amber border border-amber/30 shadow-sm">
                {group.resolution}
              </span>
              {group.size && (
                <span className="text-xs font-mono text-content-secondary">
                  {group.size}
                </span>
              )}
            </div>

            {/* Right: Server Link Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {group.links.map((link, lIdx) => (
                <a
                  key={lIdx}
                  href={link.url}
                  target={link.url !== '#' ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  onClick={() => handleLinkClick(link.url)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-main hover:bg-amber hover:text-black border border-border-subtle text-xs font-semibold text-content-primary hover:border-amber transition-all shadow-sm active:scale-95 group/btn"
                >
                  <span>{link.server}</span>
                  <ExternalLink className="w-3 h-3 text-content-muted group-hover/btn:text-black transition-colors" />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info Notice */}
      <div className="px-5 py-3 bg-surface-secondary/40 border-t border-border-subtle text-[11px] text-content-muted flex items-center gap-2">
        <ShieldAlert className="w-3.5 h-3.5 text-amber shrink-0" />
        <span>
          Tips: Jika link utama eror atau limit download harian tercapai, gunakan mirror seperti <strong>Terabox</strong>, <strong>Mega</strong>, atau <strong>Kraken</strong>.
        </span>
      </div>
    </div>
  );
}
