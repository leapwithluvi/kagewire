'use client';

import { useState, useCallback, useTransition, useMemo } from 'react';
import MediaCard from '@/components/ui/MediaCard';
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal, X, Loader2, Tv, BookOpen, Play } from 'lucide-react';
import type { AnimeOngoingItem, DonghuaItem, ComicItem } from '@/types/api';

interface GenreClientViewProps {
  slug: string;
  initialAnimeList: AnimeOngoingItem[];
  initialTotalPages: number;
  initialTotal: number;
  genreName: string;
}

type ActiveTab = 'anime' | 'donghua' | 'komik';

const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'az', label: 'A–Z' },
  { value: 'za', label: 'Z–A' },
];

const DAY_OPTIONS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

export function GenreClientView({
  slug,
  initialAnimeList,
  initialTotalPages,
  initialTotal,
  genreName,
}: GenreClientViewProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('anime');

  // ── Anime state ──────────────────────────────────────────────────────────────
  const [animeList, setAnimeList] = useState<AnimeOngoingItem[]>(initialAnimeList);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [total, setTotal] = useState(initialTotal);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  // ── Donghua state ─────────────────────────────────────────────────────────────
  const [donghuaList, setDonghuaList] = useState<DonghuaItem[]>([]);
  const [donghuaLoaded, setDonghuaLoaded] = useState(false);
  const [donghuaLoading, setDonghuaLoading] = useState(false);

  // ── Komik state ───────────────────────────────────────────────────────────────
  const [komikList, setKomikList] = useState<ComicItem[]>([]);
  const [komikLoaded, setKomikLoaded] = useState(false);
  const [komikLoading, setKomikLoading] = useState(false);

  // ── Shared filter state ───────────────────────────────────────────────────────
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'default' | 'az' | 'za'>('default');
  const [filterDay, setFilterDay] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // ── Fetch anime page from API route ──────────────────────────────────────────
  const fetchPage = useCallback(
    (page: number) => {
      startTransition(async () => {
        try {
          const res = await fetch(`/api/genre/${slug}?page=${page}`);
          if (!res.ok) return;
          const data = await res.json();
          setAnimeList(data.animeList ?? []);
          setTotalPages(data.totalPages ?? 1);
          setTotal(data.total ?? 0);
          setCurrentPage(page);
          setSearch('');
          setFilterDay('');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch {
          // silently fail
        }
      });
    },
    [slug]
  );

  // ── Load donghua by genre (client-side filter from full list) ─────────────────
  const loadDonghua = useCallback(async () => {
    if (donghuaLoaded) return;
    setDonghuaLoading(true);
    try {
      // Fetch full donghua list and filter by genre slug on client
      const res = await fetch(`/api/genre/${slug}?type=donghua`);
      if (res.ok) {
        const data = await res.json();
        setDonghuaList(data.donghuaList ?? []);
      }
    } catch {
      // leave empty
    } finally {
      setDonghuaLoading(false);
      setDonghuaLoaded(true);
    }
  }, [slug, donghuaLoaded]);

  // ── Load komik by genre (client-side filter) ──────────────────────────────────
  const loadKomik = useCallback(async () => {
    if (komikLoaded) return;
    setKomikLoading(true);
    try {
      const res = await fetch(`/api/genre/${slug}?type=komik`);
      if (res.ok) {
        const data = await res.json();
        setKomikList(data.comicList ?? []);
      }
    } catch {
      // leave empty
    } finally {
      setKomikLoading(false);
      setKomikLoaded(true);
    }
  }, [slug, komikLoaded]);

  // ── Tab switch handler ────────────────────────────────────────────────────────
  const handleTabSwitch = (tab: ActiveTab) => {
    setActiveTab(tab);
    setSearch('');
    setFilterDay('');
    setSort('default');
    setShowFilters(false);
    if (tab === 'donghua') loadDonghua();
    if (tab === 'komik') loadKomik();
  };

  // ── Filtered + sorted list helpers ───────────────────────────────────────────
  const displayedAnime = useMemo(() => {
    let list = [...animeList];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((a) => (a.title ?? '').toLowerCase().includes(q));
    }
    if (filterDay) {
      list = list.filter((a) => (a.releaseDay ?? '').toLowerCase() === filterDay.toLowerCase());
    }
    if (sort === 'az') list.sort((a, b) => (a.title ?? '').localeCompare(b.title ?? ''));
    if (sort === 'za') list.sort((a, b) => (b.title ?? '').localeCompare(a.title ?? ''));
    return list;
  }, [animeList, search, sort, filterDay]);

  const displayedDonghua = useMemo(() => {
    let list = [...donghuaList];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((d) => (d.title ?? '').toLowerCase().includes(q));
    }
    if (sort === 'az') list.sort((a, b) => (a.title ?? '').localeCompare(b.title ?? ''));
    if (sort === 'za') list.sort((a, b) => (b.title ?? '').localeCompare(a.title ?? ''));
    return list;
  }, [donghuaList, search, sort]);

  const displayedKomik = useMemo(() => {
    let list = [...komikList];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) => (c.title ?? '').toLowerCase().includes(q));
    }
    if (sort === 'az') list.sort((a, b) => (a.title ?? '').localeCompare(b.title ?? ''));
    if (sort === 'za') list.sort((a, b) => (b.title ?? '').localeCompare(a.title ?? ''));
    return list;
  }, [komikList, search, sort]);

  const hasActiveFilter = search.trim() || filterDay || sort !== 'default';

  // Pagination range helper
  const pageNumbers = useMemo(() => {
    const delta = 2;
    const range: (number | 'ellipsis')[] = [];
    for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
      range.push(i);
    }
    if (range[0] !== 1) {
      range.unshift('ellipsis');
      range.unshift(1);
    }
    if (range[range.length - 1] !== totalPages) {
      range.push('ellipsis');
      range.push(totalPages);
    }
    return range;
  }, [currentPage, totalPages]);

  const currentIsLoading = activeTab === 'anime' ? isPending : activeTab === 'donghua' ? donghuaLoading : komikLoading;

  return (
    <div>
      {/* ── Media Type Tabs ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 mb-6 p-1 bg-surface-card rounded-xl border border-border-subtle w-full sm:w-auto sm:inline-flex">
        {([
          { key: 'anime', label: 'Anime', icon: <Tv className="w-3.5 h-3.5" /> },
          { key: 'donghua', label: 'Donghua', icon: <Play className="w-3.5 h-3.5 fill-current ml-0.5" /> },
          { key: 'komik', label: 'Komik', icon: <BookOpen className="w-3.5 h-3.5" /> },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabSwitch(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all flex-1 justify-center sm:flex-none sm:justify-start ${
              activeTab === tab.key
                ? 'bg-amber text-black shadow-sm'
                : 'text-content-secondary hover:text-content-primary hover:bg-surface-secondary'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div className="mb-6 flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-content-muted pointer-events-none" />
          <input
            type="text"
            placeholder={`Cari ${activeTab} genre ${genreName}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-lg bg-surface-secondary border border-border-subtle text-xs text-content-primary placeholder-content-muted focus:outline-none focus:border-amber transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-primary"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters((f) => !f)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${
            showFilters || hasActiveFilter
              ? 'bg-amber/10 border-amber/40 text-amber'
              : 'bg-surface-secondary border-border-subtle text-content-secondary hover:border-amber/30'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filter
          {hasActiveFilter && (
            <span className="ml-1 w-1.5 h-1.5 rounded-full bg-amber" />
          )}
        </button>

        {/* Total count */}
        <span className="text-xs text-content-muted ml-auto">
          {activeTab === 'anime' && (
            <>
              {hasActiveFilter ? (
                <span className="text-amber font-semibold">{displayedAnime.length}</span>
              ) : (
                <span className="text-amber font-semibold">{total}</span>
              )}
              {' '}judul{totalPages > 1 && !hasActiveFilter && `, hal. ${currentPage}/${totalPages}`}
            </>
          )}
          {activeTab === 'donghua' && (
            <span>
              <span className="text-amber font-semibold">{displayedDonghua.length}</span> judul
            </span>
          )}
          {activeTab === 'komik' && (
            <span>
              <span className="text-amber font-semibold">{displayedKomik.length}</span> judul
            </span>
          )}
        </span>
      </div>

      {/* Expanded filter panel */}
      {showFilters && (
        <div className="mb-6 p-4 rounded-xl bg-surface-card border border-border-subtle flex flex-wrap gap-4">
          {/* Sort */}
          <div className="flex flex-col gap-1.5 min-w-[140px]">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-content-muted">Urutkan</span>
            <div className="flex gap-1.5">
              {SORT_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  onClick={() => setSort(o.value as typeof sort)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                    sort === o.value
                      ? 'bg-amber text-black'
                      : 'bg-surface-secondary text-content-secondary hover:text-content-primary hover:bg-surface-hover'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* Day filter — only relevant for anime tab */}
          {activeTab === 'anime' && (
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-content-muted">Hari Tayang</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setFilterDay('')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                    !filterDay
                      ? 'bg-amber text-black'
                      : 'bg-surface-secondary text-content-secondary hover:text-content-primary hover:bg-surface-hover'
                  }`}
                >
                  Semua
                </button>
                {DAY_OPTIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setFilterDay(filterDay === d ? '' : d)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                      filterDay === d
                        ? 'bg-amber text-black'
                        : 'bg-surface-secondary text-content-secondary hover:text-content-primary hover:bg-surface-hover'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Reset */}
          {hasActiveFilter && (
            <button
              onClick={() => { setSearch(''); setSort('default'); setFilterDay(''); }}
              className="self-end flex items-center gap-1 text-xs text-content-muted hover:text-amber transition-colors"
            >
              <X className="w-3 h-3" /> Reset filter
            </button>
          )}
        </div>
      )}

      {/* Loading overlay */}
      {currentIsLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-7 h-7 animate-spin text-amber" />
        </div>
      )}

      {/* ── Anime Tab ─────────────────────────────────────────────────────── */}
      {activeTab === 'anime' && !isPending && (
        <>
          {displayedAnime.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {displayedAnime.map((anime, idx) => (
                <MediaCard
                  key={`anime-${anime.animeId || idx}-${idx}`}
                  id={anime.animeId}
                  title={anime.title}
                  poster={anime.poster}
                  type="anime"
                  href={`/anime/otakudesu/${anime.animeId}`}
                  badge={anime.episodes ? `Ep. ${anime.episodes}` : undefined}
                  subtitle={anime.releaseDay ? `Hari ${anime.releaseDay}` : undefined}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-content-muted">
              <p className="text-sm">
                {search || filterDay
                  ? 'Tidak ada hasil yang cocok dengan filter.'
                  : 'Tidak ada anime ditemukan untuk genre ini.'}
              </p>
              {hasActiveFilter && (
                <button
                  onClick={() => { setSearch(''); setFilterDay(''); setSort('default'); }}
                  className="mt-3 text-xs text-amber hover:underline"
                >
                  Reset filter
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {!hasActiveFilter && totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-1.5 flex-wrap">
              <button
                onClick={() => fetchPage(currentPage - 1)}
                disabled={currentPage <= 1 || isPending}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-secondary border border-border-subtle text-xs font-semibold text-content-secondary hover:text-amber hover:border-amber/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Sebelumnya
              </button>

              {pageNumbers.map((p, i) =>
                p === 'ellipsis' ? (
                  <span key={`e-${i}`} className="px-2 text-xs text-content-muted">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => p !== currentPage && fetchPage(p as number)}
                    disabled={p === currentPage || isPending}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                      p === currentPage
                        ? 'bg-amber text-black shadow-subtle cursor-default'
                        : 'bg-surface-secondary border border-border-subtle text-content-secondary hover:text-amber hover:border-amber/40'
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                onClick={() => fetchPage(currentPage + 1)}
                disabled={currentPage >= totalPages || isPending}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-secondary border border-border-subtle text-xs font-semibold text-content-secondary hover:text-amber hover:border-amber/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Selanjutnya <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </>
      )}

      {/* ── Donghua Tab ───────────────────────────────────────────────────── */}
      {activeTab === 'donghua' && !donghuaLoading && (
        <>
          {displayedDonghua.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {displayedDonghua.map((d, idx) => (
                <MediaCard
                  key={`donghua-${d.slug || idx}-${idx}`}
                  id={d.slug}
                  title={d.title}
                  poster={d.poster}
                  type="donghua"
                  href={`/donghua/${d.slug}`}
                  badge={d.episodes ? `${d.episodes} Ep` : undefined}
                  subtitle={d.status || undefined}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-content-muted">
              <p className="text-sm">
                {donghuaLoaded
                  ? `Tidak ada donghua genre ${genreName} yang tersedia.`
                  : 'Memuat daftar donghua…'}
              </p>
            </div>
          )}
        </>
      )}

      {/* ── Komik Tab ─────────────────────────────────────────────────────── */}
      {activeTab === 'komik' && !komikLoading && (
        <>
          {displayedKomik.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {displayedKomik.map((c, idx) => (
                <MediaCard
                  key={`komik-${c.manga_id || idx}-${idx}`}
                  id={c.manga_id}
                  title={c.title}
                  poster={c.cover_portrait || c.cover}
                  type="komik"
                  href={`/comic/${c.manga_id}`}
                  badge={c.latest_chapter ? `Ch. ${c.latest_chapter}` : undefined}
                  subtitle={c.format || c.status || undefined}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-content-muted">
              <p className="text-sm">
                {komikLoaded
                  ? `Tidak ada komik genre ${genreName} yang tersedia.`
                  : 'Memuat daftar komik…'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
