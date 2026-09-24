import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string | number;
  icon?: React.ReactNode;
  actionHref?: string;
  actionText?: string;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  badge,
  icon,
  actionHref,
  actionText = 'Lihat Semua',
  className = '',
}: SectionHeaderProps) {
  const badgeText = typeof badge === 'number' ? `${badge} Judul` : badge;

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-gradient-to-r from-surface-card via-surface-card/95 to-surface-secondary/70 border border-border-subtle p-3.5 sm:p-4 mb-5 shadow-sm backdrop-blur-sm ${className}`}
    >
      {/* Decorative left accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-1 sm:w-1.5 bg-gradient-to-b from-amber via-amber-light to-amber shadow-[0_0_10px_rgba(245,158,11,0.5)]" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pl-2 sm:pl-2.5">
        {/* Title and metadata */}
        <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 flex-wrap">
          {icon && (
            <div className="p-1.5 sm:p-2 rounded-lg bg-amber/15 text-amber border border-amber/30 shrink-0">
              {icon}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-editorial text-base sm:text-xl font-bold text-white tracking-tight leading-snug">
                {title}
              </h2>
              {badgeText && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-bold font-mono bg-amber/15 text-amber border border-amber/30 num-tabular shadow-inner">
                  {badgeText}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-[11px] sm:text-xs text-content-secondary mt-0.5 line-clamp-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Action Button */}
        {actionHref && (
          <Link
            href={actionHref}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-lg bg-surface-main/80 hover:bg-amber hover:text-black border border-border-subtle hover:border-amber text-xs font-bold text-content-primary hover:text-black transition-all shadow-sm active:scale-95 shrink-0 self-start sm:self-auto group"
          >
            <span>{actionText}</span>
            <ChevronRight className="w-3.5 h-3.5 text-amber group-hover:text-black transition-colors" />
          </Link>
        )}
      </div>
    </div>
  );
}

export default SectionHeader;
