'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  ArrowUpDown,
  Play,
  BookOpen,
  Filter,
  X,
  Layers,
} from 'lucide-react';

export interface MediaListItem {
  id: string;
  title: string;
  href: string;
  subtitle?: string;
  type: 'episode' | 'chapter';
}

interface MediaItemListFilterProps {
  items: MediaListItem[];
  title?: string;
  type: 'episode' | 'chapter';
  initialSort?: 'desc' | 'asc';
  batchSize?: number;
}

export function MediaItemListFilter({
  items,
  title,
  type,
  initialSort = 'desc',
  batchSize = 50,
}: MediaItemListFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>(initialSort);
  const [selectedRange, setSelectedRange] = useState<string>('all');

  const defaultTitle = type === 'chapter' ? 'Daftar Chapter' : 'Daftar Episode';
  const label = type === 'chapter' ? 'Chapter' : 'Episode';

  // Extract number from title for smarter sorting and filtering if available
  const parseNumber = (text: string): number | null => {
    const match = text.match(/(?:ch(?:apter)?\.?|ep(?:isode)?\.?|\b)\s*(\d+(?:\.\d+)?)/i);
    return match ? parseFloat(match[1]) : null;
  };

  // Generate range chunks if items count is large (> 25)
  const ranges = useMemo(() => {
    if (items.length <= 25) return [];

    const total = items.length;
    const chunkList: Array<{ label: string; value: string; min: number; max: number }> = [];

    for (let i = 0; i < total; i += batchSize) {
      const min = i + 1;
      const max = Math.min(i + batchSize, total);
      chunkList.push({
        label: `${label} ${min} – ${max}`,
        value: `${min}-${max}`,
        min,
        max,
      });
    }
    return chunkList;
  }, [items.length, batchSize, label]);

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let result = [...items];

    // 1. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const queryNum = parseFloat(q);

      result = result.filter((item) => {
        const itemTitle = item.title.toLowerCase();
        if (itemTitle.includes(q)) return true;

        if (!isNaN(queryNum)) {
          const itemNum = parseNumber(item.title);
          if (itemNum !== null && itemNum === queryNum) return true;
        }

        return false;
      });
    }

    // 2. Range Filter (only if range is selected and no search query active)
    if (selectedRange !== 'all' && !searchQuery.trim()) {
      const rangeParts = selectedRange.split('-');
      if (rangeParts.length === 2) {
        const min = parseInt(rangeParts[0], 10);
        const max = parseInt(rangeParts[1], 10);
        // Slice based on index (1-indexed)
        result = result.slice(min - 1, max);
      }
    }

    // 3. Sorting
    result.sort((a, b) => {
      const numA = parseNumber(a.title);
      const numB = parseNumber(b.title);

      if (numA !== null && numB !== null) {
        return sortOrder === 'desc' ? numB - numA : numA - numB;
      }

      return sortOrder === 'desc'
        ? b.title.localeCompare(a.title, undefined, { numeric: true })
        : a.title.localeCompare(b.title, undefined, { numeric: true });
    });

    return result;
  }, [items, searchQuery, selectedRange, sortOrder]);

  const toggleSort = () => {
    setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="w-full">
      {/* Header with Title and Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-border-subtle pb-3">
        <div className="flex items-center gap-2">
          {type === 'chapter' ? (
            <Layers className="w-5 h-5 text-amber" />
          ) : (
            <Play className="w-5 h-5 text-amber fill-amber/20" />
          )}
          <h2 className="font-editorial text-xl sm:text-2xl font-normal text-content-primary">
            {title || defaultTitle}
          </h2>
          <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface-card text-content-muted border border-border-subtle num-tabular">
            {items.length} {label}
          </span>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick Search */}
          <div className="relative flex-1 sm:w-56 min-w-[170px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-content-muted pointer-events-none" />
            <input
              type="text"
              placeholder={`Cari nomor / ${label.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value) setSelectedRange('all');
              }}
              className="w-full pl-9 pr-8 py-2 bg-surface-card border border-border-subtle rounded-lg text-xs sm:text-sm text-content-primary placeholder-content-muted focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber/50 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-content-muted hover:text-content-primary"
                title="Hapus pencarian"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Range Dropdown Filter (only shown if large number of items) */}
          {ranges.length > 0 && (
            <div className="relative flex-shrink-0">
              <select
                value={selectedRange}
                onChange={(e) => {
                  setSelectedRange(e.target.value);
                  setSearchQuery('');
                }}
                className="appearance-none pl-3 pr-8 py-2 bg-surface-card border border-border-subtle rounded-lg text-xs sm:text-sm text-content-secondary hover:text-content-primary focus:outline-none focus:border-amber transition-colors cursor-pointer"
              >
                <option value="all">Semua ({items.length})</option>
                {ranges.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
              <Filter className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-content-muted pointer-events-none" />
            </div>
          )}

          {/* Sort Order Button */}
          <button
            type="button"
            onClick={toggleSort}
            className="flex items-center gap-1.5 px-3 py-2 bg-surface-card border border-border-subtle hover:border-amber/40 rounded-lg text-xs sm:text-sm font-semibold text-content-secondary hover:text-amber transition-colors flex-shrink-0 active:scale-95 shadow-sm"
            title={`Urutkan: ${sortOrder === 'desc' ? 'Terbaru ke Terlama' : 'Terlama ke Terbaru'}`}
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-amber" />
            <span>{sortOrder === 'desc' ? 'Terbaru' : 'Terlama'}</span>
          </button>
        </div>
      </div>

      {/* Filter Info / Counter */}
      {(searchQuery || selectedRange !== 'all') && (
        <div className="flex items-center justify-between text-xs text-content-muted mb-3 px-1">
          <span>
            Menampilkan <strong className="text-amber">{filteredAndSortedItems.length}</strong> dari {items.length} {label.toLowerCase()}
            {searchQuery && (
              <span> untuk pencarian &quot;{searchQuery}&quot;</span>
            )}
          </span>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedRange('all');
            }}
            className="text-amber hover:underline text-xs font-medium ml-2"
          >
            Reset Filter
          </button>
        </div>
      )}

      {/* List Grid */}
      {filteredAndSortedItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-[640px] overflow-y-auto pr-1 scrollbar-thin">
          {filteredAndSortedItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="flex items-center justify-between p-3 rounded-lg bg-surface-card border border-border-subtle hover:border-amber/50 hover:bg-surface-secondary hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-2.5 truncate">
                <div className="w-7 h-7 rounded-md bg-surface-secondary group-hover:bg-amber text-content-secondary group-hover:text-black flex items-center justify-center flex-shrink-0 transition-colors shadow-inner">
                  {type === 'chapter' ? (
                    <BookOpen className="w-3.5 h-3.5" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  )}
                </div>
                <span className="text-xs sm:text-sm font-medium text-content-primary group-hover:text-amber truncate transition-colors">
                  {item.title}
                </span>
              </div>
              {item.subtitle && (
                <span className="text-[10px] sm:text-[11px] text-content-muted whitespace-nowrap ml-2 num-tabular">
                  {item.subtitle}
                </span>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="p-10 text-center rounded-xl bg-surface-card border border-border-subtle space-y-2">
          <p className="text-sm font-semibold text-content-primary">
            Tidak ada {label.toLowerCase()} yang cocok.
          </p>
          <p className="text-xs text-content-secondary max-w-sm mx-auto">
            Coba periksa kata kunci atau nomor {label.toLowerCase()} yang Anda masukkan.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedRange('all');
            }}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber/10 border border-amber/30 text-amber text-xs font-semibold hover:bg-amber hover:text-background transition-all"
          >
            Reset Pencarian
          </button>
        </div>
      )}
    </div>
  );
}
