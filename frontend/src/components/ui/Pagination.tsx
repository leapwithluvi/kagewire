import React from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams?: Record<string, string | number | undefined>;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  searchParams = {},
  className = '',
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, val]) => {
      if (val !== undefined && val !== '' && key !== 'page') {
        params.set(key, String(val));
      }
    });
    if (page > 1) {
      params.set('page', String(page));
    }
    const query = params.toString();
    return query ? `${baseUrl}?${query}` : baseUrl;
  };

  // Generate pagination items (numbers and ellipses)
  const getPageNumbers = (): (number | string)[] => {
    const delta = 1; // Number of pages to show before and after current
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l !== undefined) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  const pages = getPageNumbers();

  return (
    <nav
      aria-label="Paginasi Halaman"
      className={`flex flex-col sm:flex-row items-center justify-center gap-3 my-10 ${className}`}
    >
      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        {/* Tombol Halaman Pertama (<<) */}
        {currentPage > 2 && (
          <Link
            href={createPageUrl(1)}
            className="p-2 sm:px-2.5 sm:py-2 rounded-lg bg-surface-card border border-border-subtle text-content-secondary hover:text-amber hover:border-amber/40 transition-all text-xs font-semibold shadow-sm"
            title="Halaman Pertama"
            aria-label="Halaman Pertama"
          >
            <ChevronsLeft className="w-4 h-4" />
          </Link>
        )}

        {/* Tombol Sebelumnya (<) */}
        {currentPage > 1 ? (
          <Link
            href={createPageUrl(currentPage - 1)}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-surface-card border border-border-subtle text-content-primary hover:text-amber hover:border-amber/40 hover:bg-surface-secondary transition-all text-xs sm:text-sm font-semibold shadow-sm"
            title="Halaman Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Sebelumnya</span>
          </Link>
        ) : (
          <span className="flex items-center gap-1 px-3 py-2 rounded-lg bg-surface-secondary/40 border border-border-subtle/50 text-content-muted text-xs sm:text-sm font-medium cursor-not-allowed opacity-50">
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Sebelumnya</span>
          </span>
        )}

        {/* Nomor-nomor Halaman */}
        <div className="flex items-center gap-1">
          {pages.map((item, index) => {
            if (item === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="w-8 sm:w-9 h-8 sm:h-9 flex items-center justify-center text-xs text-content-muted font-mono"
                >
                  ...
                </span>
              );
            }

            const pageNum = item as number;
            const isCurrent = pageNum === currentPage;

            return isCurrent ? (
              <span
                key={pageNum}
                aria-current="page"
                className="w-8 sm:w-9 h-8 sm:h-9 flex items-center justify-center rounded-lg bg-amber text-background font-bold text-xs sm:text-sm shadow-md shadow-amber/20"
              >
                {pageNum}
              </span>
            ) : (
              <Link
                key={pageNum}
                href={createPageUrl(pageNum)}
                className="w-8 sm:w-9 h-8 sm:h-9 flex items-center justify-center rounded-lg bg-surface-card border border-border-subtle text-content-secondary hover:text-amber hover:border-amber/40 hover:bg-surface-secondary transition-all text-xs sm:text-sm font-semibold shadow-sm"
              >
                {pageNum}
              </Link>
            );
          })}
        </div>

        {/* Tombol Selanjutnya (>) */}
        {currentPage < totalPages ? (
          <Link
            href={createPageUrl(currentPage + 1)}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-surface-card border border-border-subtle text-content-primary hover:text-amber hover:border-amber/40 hover:bg-surface-secondary transition-all text-xs sm:text-sm font-semibold shadow-sm"
            title="Halaman Selanjutnya"
          >
            <span className="hidden sm:inline">Selanjutnya</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <span className="flex items-center gap-1 px-3 py-2 rounded-lg bg-surface-secondary/40 border border-border-subtle/50 text-content-muted text-xs sm:text-sm font-medium cursor-not-allowed opacity-50">
            <span className="hidden sm:inline">Selanjutnya</span>
            <ChevronRight className="w-4 h-4" />
          </span>
        )}

        {/* Tombol Halaman Terakhir (>>) */}
        {currentPage < totalPages - 1 && (
          <Link
            href={createPageUrl(totalPages)}
            className="p-2 sm:px-2.5 sm:py-2 rounded-lg bg-surface-card border border-border-subtle text-content-secondary hover:text-amber hover:border-amber/40 transition-all text-xs font-semibold shadow-sm"
            title="Halaman Terakhir"
            aria-label="Halaman Terakhir"
          >
            <ChevronsRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Ringkasan Halaman */}
      <div className="text-xs text-content-muted font-mono">
        Halaman <span className="font-bold text-amber">{currentPage}</span> dari {totalPages}
      </div>
    </nav>
  );
}
