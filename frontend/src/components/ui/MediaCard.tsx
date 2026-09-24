'use client';

import React from 'react';
import Link from 'next/link';
import { Star, Play, BookOpen, Calendar } from 'lucide-react';
import { MediaType } from '@/types/api';

interface MediaCardProps {
  id: string;
  title: string;
  poster: string;
  type: MediaType;
  href: string;
  badge?: string | number;
  subtitle?: string;
  rating?: string | number;
  releaseDay?: string;
}

export default function MediaCard({
  title,
  poster,
  type,
  href,
  badge,
  subtitle,
  rating,
  releaseDay,
}: MediaCardProps) {
  const typeBadgeColors: Record<string, string> = {
    anime: 'bg-amber/20 text-amber border-amber/40',
    donghua: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
    comic: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    komik: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
  };

  const badgeColor = typeBadgeColors[type] || 'bg-amber/20 text-amber border-amber/40';

  return (
    <Link
      href={href}
      className="group relative flex flex-col rounded-lg overflow-hidden bg-surface-card border border-border-subtle hover:border-amber hover:shadow-lg hover:shadow-amber/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface-secondary">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={poster || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80'}
          alt={title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.dataset.failed) {
              target.dataset.failed = 'true';
              target.src = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80';
            }
          }}
        />

        {/* Subtle Bottom Image Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-card via-transparent to-transparent opacity-80" />

        {/* Floating Quick Action Button on Hover */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber to-amber-hover text-background flex items-center justify-center shadow-lg shadow-amber/40 transform scale-75 group-hover:scale-100 transition-transform duration-200">
            {type === 'comic' ? (
              <BookOpen className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </div>
        </div>

        {/* Category Badge & Rating (Top Left) */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 flex-wrap z-10">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md shadow-sm ${badgeColor}`}>
            {type}
          </span>
          {rating && (
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-surface-main/90 text-amber border border-amber/30 backdrop-blur-sm num-tabular shadow-sm">
              <Star className="w-2.5 h-2.5 fill-amber text-amber" />
              {rating}
            </span>
          )}
        </div>

        {/* Day of Release Badge (Bottom Left) */}
        {releaseDay && (
          <div className="absolute bottom-2 left-2 max-w-[50%] z-10">
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-surface-main/95 text-amber border border-amber/30 backdrop-blur-sm shadow-sm truncate">
              <Calendar className="w-2.5 h-2.5 text-amber flex-shrink-0" />
              <span className="truncate">{releaseDay}</span>
            </span>
          </div>
        )}

        {/* Episode/Chapter Badge (Bottom Right) */}
        {badge && (
          <div className="absolute bottom-2 right-2 max-w-[55%] z-10">
            <span className="block px-2 py-0.5 rounded text-[11px] font-bold bg-surface-main/95 text-content-primary border border-border-subtle backdrop-blur-sm num-tabular shadow-sm truncate">
              {badge}
            </span>
          </div>
        )}
      </div>

      {/* Card Info */}
      <div className="p-3 flex flex-col flex-1 justify-between gap-1">
        <h3
          className="text-xs sm:text-sm font-semibold text-content-primary line-clamp-2 group-hover:text-amber transition-colors leading-snug"
          title={title}
        >
          {title}
        </h3>
        <div className="flex items-center justify-between text-[11px] text-content-muted font-mono gap-1">
          {subtitle && (
            <span className="line-clamp-1">{subtitle}</span>
          )}
          {releaseDay && !subtitle && (
            <span className="text-amber flex items-center gap-1 flex-shrink-0">
              <Calendar className="w-3 h-3" />
              {releaseDay}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
