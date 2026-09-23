import {
  AnimeDetail,
  EpisodeStreamData,
  DonghuaItem,
  DonghuaDetail,
  DonghuaEpisodeStream,
  ComicItem,
  ComicDetail,
  ChapterItem,
  ChapterReaderData,
  AnimeOngoingItem,
  GenreItem,
  ScheduleDay,
} from '@/types/api';

import {
  mockAnimeOngoing,
  mockAnimeDetail,
  mockEpisodeStream,
  mockDonghuaList,
  mockDonghuaDetail,
  mockDonghuaEpisodeStream,
  mockComicList,
  mockComicDetail,
  mockChapters,
  mockChapterReader,
  mockGenreList,
  mockSchedule,
} from './mock-data';

import { cachedFetch } from './cache';

// Read directly from environment variable (default: true)
export const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';

const SANKA_BASE_URL =
  process.env.NEXT_PUBLIC_SANKA_API_URL || 'https://www.sankavollerei.web.id';
const BROWSER_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function sankaFetch<T>(endpoint: string, revalidateSec = 1800): Promise<T | null> {
  // If in mock mode, do not send any outbound request to avoid rate limits
  if (USE_MOCK_DATA) {
    return null;
  }

  const cacheKey = `sanka:api:${endpoint}`;

  return cachedFetch<T>(
    cacheKey,
    async () => {
      const url = `${SANKA_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const res = await fetch(url, {
          headers: {
            'User-Agent': BROWSER_USER_AGENT,
            'Accept': 'application/json, text/plain, */*',
            'Referer': SANKA_BASE_URL,
          },
          signal: controller.signal,
          next: { revalidate: revalidateSec },
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          console.warn(`[SankaApi] ${endpoint} returned status ${res.status}`);
          return null;
        }

        const json = await res.json();
        return json as T;
      } catch (error: unknown) {
        clearTimeout(timeoutId);
        console.error(`[SankaApi Error] Failed fetching ${endpoint}:`, error);
        return null;
      }
    },
    revalidateSec
  );
}

export const sankaApi = {
  // --- ANIME ---
  async getAnimeHome(): Promise<{ ongoing: { animeList: AnimeOngoingItem[] }; completed?: { animeList: AnimeOngoingItem[] } } | null> {
    if (USE_MOCK_DATA) {
      return {
        ongoing: { animeList: mockAnimeOngoing },
        completed: { animeList: mockAnimeOngoing.slice(2) },
      };
    }
    const raw = await sankaFetch<any>('/anime/home', 1200);
    if (!raw) return null;
    const data = raw.data || raw;
    return {
      ongoing: data.ongoing || { animeList: [] },
      completed: data.completed || { animeList: [] },
    };
  },

  async getAnimeSamehadakuHome(): Promise<{ recent: { animeList: AnimeOngoingItem[] }; top10?: AnimeOngoingItem[] } | null> {
    if (USE_MOCK_DATA) {
      return {
        recent: { animeList: mockAnimeOngoing },
        top10: mockAnimeOngoing,
      };
    }
    const raw = await sankaFetch<any>('/anime/samehadaku/home', 1200);
    if (!raw) return null;
    const data = raw.data || raw;
    return {
      recent: data.recent || { animeList: [] },
      top10: data.top10 || [],
    };
  },

  async getAnimeDetail(source: string, slug: string): Promise<AnimeDetail | null> {
    if (USE_MOCK_DATA) {
      return {
        ...mockAnimeDetail,
        title: slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      };
    }
    const endpoint = source === 'samehadaku' ? `/anime/samehadaku/anime/${slug}` : `/anime/anime/${slug}`;
    const raw = await sankaFetch<any>(endpoint, 3600);
    if (!raw) return null;
    return (raw.data || raw) as AnimeDetail;
  },

  async getAnimeEpisode(source: string, slug: string): Promise<EpisodeStreamData | null> {
    if (USE_MOCK_DATA) {
      return {
        ...mockEpisodeStream,
        title: `${slug.replace(/-/g, ' ').toUpperCase()} Subtitle Indonesia`,
      };
    }
    const endpoint = source === 'samehadaku' ? `/anime/samehadaku/episode/${slug}` : `/anime/episode/${slug}`;
    const raw = await sankaFetch<any>(endpoint, 1800);
    if (!raw) return null;
    return (raw.data || raw) as EpisodeStreamData;
  },

  async searchAnime(query: string): Promise<AnimeOngoingItem[]> {
    if (USE_MOCK_DATA) {
      return mockAnimeOngoing.filter((a) =>
        a.title.toLowerCase().includes(query.toLowerCase())
      );
    }
    const raw = await sankaFetch<any>(`/anime/search/${encodeURIComponent(query)}`, 600);
    if (!raw) return [];
    const data = raw.data || raw;
    if (Array.isArray(data)) return data;
    if (data.animeList && Array.isArray(data.animeList)) return data.animeList;
    return [];
  },

  // --- DONGHUA (Anichin via Sanka /anime/donghua/*) ---
  async getDonghuaHome(): Promise<{
    slider: DonghuaItem[];
    popular: DonghuaItem[];
    latest: DonghuaItem[];
  } | null> {
    if (USE_MOCK_DATA) {
      return {
        slider: mockDonghuaList,
        popular: mockDonghuaList,
        latest: mockDonghuaList.slice(1),
      };
    }
    // New endpoint: /anime/donghua/home/:page returns { latest_release, completed_donghua }
    // We also fetch ongoing for popular list
    const [homeData, ongoingData] = await Promise.all([
      sankaFetch<{ latest_release: DonghuaItem[]; completed_donghua: DonghuaItem[] }>('/anime/donghua/home/1', 1800),
      sankaFetch<{ ongoing_donghua: DonghuaItem[] }>('/anime/donghua/ongoing/1', 1800),
    ]);
    return {
      slider: ongoingData?.ongoing_donghua?.slice(0, 5) || [],
      popular: ongoingData?.ongoing_donghua?.slice(0, 10) || [],
      latest: homeData?.latest_release || [],
    };
  },

  async getDonghuaDetail(slug: string): Promise<DonghuaDetail | null> {
    if (USE_MOCK_DATA) {
      const match = mockDonghuaList.find((d) => d.slug === slug);
      return {
        ...mockDonghuaDetail,
        title: match ? match.title : slug.replace(/-/g, ' ').toUpperCase(),
      };
    }
    // New endpoint: /anime/donghua/detail/:slug
    return sankaFetch(`/anime/donghua/detail/${slug}`, 3600);
  },

  async getDonghuaEpisode(slug: string): Promise<DonghuaEpisodeStream | null> {
    if (USE_MOCK_DATA) {
      return {
        ...mockDonghuaEpisodeStream,
        title: `${slug.replace(/-/g, ' ').toUpperCase()} Subtitle Indonesia`,
      };
    }
    // New endpoint: /anime/donghua/episode/:slug
    // Response: { episode, streaming: { main_url: {name,url}, servers: [{name,url}] } }
    const raw = await sankaFetch<{
      episode: string;
      streaming?: { main_url?: { name: string; url: string }; servers?: { name: string; url: string }[] };
      navigation?: {
        all_episodes?: { slug?: string; href?: string };
        previous_episode?: { slug?: string; href?: string } | null;
        next_episode?: { slug?: string; href?: string } | null;
      };
      donghua_details?: { title?: string; slug?: string; poster?: string };
      download_url?: any;
    }>(`/anime/donghua/episode/${slug}`, 1800);
    if (!raw) return null;

    const streams: { server: string; url: string }[] = [];
    if (raw.streaming?.servers && raw.streaming.servers.length > 0) {
      for (const s of raw.streaming.servers) {
        if (s.url) streams.push({ server: s.name || 'Server', url: s.url });
      }
    } else if (raw.streaming?.main_url?.url) {
      streams.push({ server: raw.streaming.main_url.name || 'Main Server', url: raw.streaming.main_url.url });
    }

    return {
      title: raw.episode,
      navigation: {
        prev_slug: raw.navigation?.previous_episode?.slug || null,
        next_slug: raw.navigation?.next_episode?.slug || null,
        all_slug: raw.navigation?.all_episodes?.slug || raw.donghua_details?.slug || '',
      },
      streams,
      downloadUrl: raw.download_url || null,
    };
  },

  async searchDonghua(query: string): Promise<DonghuaItem[]> {
    if (USE_MOCK_DATA) {
      return mockDonghuaList.filter((d) =>
        d.title.toLowerCase().includes(query.toLowerCase())
      );
    }
    // New search endpoint
    const data = await sankaFetch<{ data?: DonghuaItem[] } | DonghuaItem[]>(
      `/anime/donghua/search/${encodeURIComponent(query)}/1`, 600
    );
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data && 'data' in data && Array.isArray(data.data)) return data.data;
    return [];
  },

  // Resolve a Sanka server ID to an actual embed URL (Otakudesu)
  async getAnimeServer(serverId: string): Promise<string | null> {
    if (USE_MOCK_DATA) return 'https://desustream.com/dummy-stream';
    const data = await sankaFetch<{ url: string }>(`/anime/server/${serverId}`, 3600);
    return data?.url || null;
  },

  // --- COMIC / MANGA / MANHWA (Shinigami via Sanka /comic/shinigami/*) ---
  async getComicPopular(): Promise<ComicItem[]> {
    if (USE_MOCK_DATA) {
      return mockComicList;
    }
    // Response: { status, data: ComicItem[] }
    const raw = await sankaFetch<{ data: ComicItem[] } | ComicItem[]>('/comic/shinigami/popular', 3600);
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (raw && 'data' in raw && Array.isArray(raw.data)) return raw.data;
    return [];
  },

  async getComicLatest(): Promise<ComicItem[]> {
    if (USE_MOCK_DATA) {
      return mockComicList;
    }
    const raw = await sankaFetch<{ data: ComicItem[] } | ComicItem[]>('/comic/shinigami/latest', 1200);
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (raw && 'data' in raw && Array.isArray(raw.data)) return raw.data;
    return [];
  },

  async getComicDetail(mangaId: string): Promise<ComicDetail | null> {
    if (USE_MOCK_DATA) {
      const match = mockComicList.find((c) => c.manga_id === mangaId);
      return {
        ...mockComicDetail,
        title: match ? match.title : mangaId.replace(/-/g, ' ').toUpperCase(),
        manga_id: mangaId,
      };
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    let targetId = mangaId;

    // If mangaId is a slug (e.g. from mock schedule or legacy url), try searching Shinigami for UUID
    if (!uuidRegex.test(targetId)) {
      try {
        const searchResults = await this.searchComic(targetId.replace(/-/g, ' '));
        if (searchResults && searchResults.length > 0 && searchResults[0].manga_id) {
          targetId = searchResults[0].manga_id;
        }
      } catch {
        // Continue with original ID
      }
    }

    // Response: { status, data: ComicDetail }
    try {
      const raw = await sankaFetch<{ status?: string; data?: ComicDetail } | ComicDetail>(`/comic/shinigami/detail/${targetId}`, 3600);
      if (raw && typeof raw === 'object') {
        if ('status' in raw && raw.status === 'error') {
          // Fallback to mock data if API returns manga not found
          const match = mockComicList.find((c) => c.manga_id === mangaId);
          return {
            ...mockComicDetail,
            title: match ? match.title : mangaId.replace(/-/g, ' ').toUpperCase(),
            manga_id: mangaId,
          };
        }
        if ('data' in raw && raw.data && typeof raw.data === 'object') return raw.data as ComicDetail;
        if ('title' in raw) return raw as ComicDetail;
      }
    } catch {
      // Fallback
    }

    const match = mockComicList.find((c) => c.manga_id === mangaId);
    return {
      ...mockComicDetail,
      title: match ? match.title : mangaId.replace(/-/g, ' ').toUpperCase(),
      manga_id: mangaId,
    };
  },

  async getComicChapters(mangaId: string): Promise<ChapterItem[]> {
    if (USE_MOCK_DATA) {
      return mockChapters;
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    let targetId = mangaId;

    if (!uuidRegex.test(targetId)) {
      try {
        const searchResults = await this.searchComic(targetId.replace(/-/g, ' '));
        if (searchResults && searchResults.length > 0 && searchResults[0].manga_id) {
          targetId = searchResults[0].manga_id;
        }
      } catch {
        // continue
      }
    }

    // Response: { status, data: ChapterItem[] }
    try {
      const raw = await sankaFetch<{ status?: string; data?: ChapterItem[] } | ChapterItem[]>(`/comic/shinigami/chapters/${targetId}`, 1800);
      if (Array.isArray(raw)) return raw;
      if (raw && typeof raw === 'object') {
        if ('data' in raw && Array.isArray(raw.data)) return raw.data;
      }
    } catch {
      // Fallback
    }
    return mockChapters;
  },

  async getComicChapterReader(chapterId: string): Promise<ChapterReaderData | null> {
    if (USE_MOCK_DATA) {
      return {
        ...mockChapterReader,
        chapter_id: chapterId,
      };
    }
    const raw = await sankaFetch<{ data: ChapterReaderData } | ChapterReaderData>(`/comic/shinigami/read/${chapterId}`, 3600);
    if (!raw) return null;
    if (raw && 'data' in raw && raw.data && typeof raw.data === 'object') return raw.data as ChapterReaderData;
    return raw as ChapterReaderData;
  },

  async searchComic(query: string): Promise<ComicItem[]> {
    if (USE_MOCK_DATA) {
      return mockComicList.filter((c) =>
        c.title.toLowerCase().includes(query.toLowerCase())
      );
    }
    const raw = await sankaFetch<{ data: ComicItem[] } | ComicItem[]>(`/comic/shinigami/search/${encodeURIComponent(query)}`, 600);
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (raw && 'data' in raw && Array.isArray(raw.data)) return raw.data;
    return [];
  },

  // --- CATALOG & EXPANDED METHODS ---
  async getAnimeList(page = 1, limit = 24, filter: 'all' | 'ongoing' | 'complete' = 'all'): Promise<{ animeList: AnimeOngoingItem[]; total: number; totalPages: number }> {
    if (USE_MOCK_DATA) {
      const start = (page - 1) * limit;
      const paginated = mockAnimeOngoing.slice(start, start + limit);
      return {
        animeList: paginated.length > 0 ? paginated : mockAnimeOngoing.slice(0, limit),
        total: mockAnimeOngoing.length,
        totalPages: Math.ceil(mockAnimeOngoing.length / limit),
      };
    }
    const endpoint = filter === 'ongoing' ? `/anime/ongoing-anime?page=${page}` : `/anime/complete-anime?page=${page}`;
    const raw = await sankaFetch<any>(endpoint, 1800);
    const list = raw?.data?.animeList || raw?.animeList || [];
    const totalPages = raw?.pagination?.totalPages || (filter === 'ongoing' ? 5 : 67);
    return {
      animeList: list,
      total: totalPages * limit,
      totalPages,
    };
  },

  async getAnimeOngoing(day?: string): Promise<AnimeOngoingItem[]> {
    if (USE_MOCK_DATA) {
      if (day && day !== 'all') {
        return mockAnimeOngoing.filter((a) => a.releaseDay?.toLowerCase() === day.toLowerCase());
      }
      return mockAnimeOngoing;
    }
    const res = await this.getAnimeHome();
    const list = res?.ongoing?.animeList || [];
    if (day && day !== 'all') {
      return list.filter((a) => a.releaseDay?.toLowerCase() === day.toLowerCase());
    }
    return list;
  },

  async getDonghuaList(page = 1, limit = 24, status: 'all' | 'ongoing' | 'completed' = 'all'): Promise<{ donghuaList: DonghuaItem[]; total: number; totalPages: number }> {
    if (USE_MOCK_DATA) {
      const start = (page - 1) * limit;
      const paginated = mockDonghuaList.slice(start, start + limit);
      return {
        donghuaList: paginated.length > 0 ? paginated : mockDonghuaList.slice(0, limit),
        total: mockDonghuaList.length,
        totalPages: Math.ceil(mockDonghuaList.length / limit) || 1,
      };
    }
    const endpoint = status === 'completed'
      ? `/anime/donghua/completed/${page}`
      : `/anime/donghua/ongoing/${page}`;
    const raw = await sankaFetch<any>(endpoint, 3600);
    const list = raw?.ongoing_donghua || raw?.completed_donghua || [];
    return {
      donghuaList: list,
      total: list.length > 0 ? 300 : 0,
      totalPages: 10,
    };
  },

  async getDonghuaOngoing(): Promise<DonghuaItem[]> {
    if (USE_MOCK_DATA) {
      return mockDonghuaList.filter((d) => d.status === 'Ongoing');
    }
    const raw = await sankaFetch<{ ongoing_donghua: DonghuaItem[] }>('/anime/donghua/ongoing/1', 1200);
    return raw?.ongoing_donghua || [];
  },

  async getComicList(page = 1, limit = 24, format?: string): Promise<{ comicList: ComicItem[]; total: number; totalPages: number }> {
    if (USE_MOCK_DATA) {
      let list = mockComicList;
      if (format && format !== 'all') {
        list = list.filter((c) => c.format?.toLowerCase() === format.toLowerCase());
      }
      const start = (page - 1) * limit;
      const paginated = list.slice(start, start + limit);
      return {
        comicList: paginated.length > 0 ? paginated : list.slice(0, limit),
        total: list.length,
        totalPages: Math.ceil(list.length / limit) || 1,
      };
    }
    const [latest, popular] = await Promise.all([
      this.getComicLatest(),
      this.getComicPopular(),
    ]);
    const seen = new Set<string>();
    let combined: ComicItem[] = [];
    for (const c of [...latest, ...popular]) {
      if (!seen.has(c.manga_id)) {
        seen.add(c.manga_id);
        combined.push(c);
      }
    }
    if (format && format !== 'all') {
      combined = combined.filter((c) => c.format?.toLowerCase() === format.toLowerCase());
    }
    const start = (page - 1) * limit;
    const paginated = combined.slice(start, start + limit);
    return {
      comicList: paginated.length > 0 ? paginated : combined.slice(0, limit),
      total: combined.length,
      totalPages: Math.max(1, Math.ceil(combined.length / limit)),
    };
  },

  async getComicOngoing(): Promise<ComicItem[]> {
    if (USE_MOCK_DATA) {
      return mockComicList.filter((c) => c.status === 'Ongoing');
    }
    return this.getComicLatest();
  },

  async getGenreList(): Promise<GenreItem[]> {
    if (USE_MOCK_DATA) {
      return mockGenreList;
    }
    const raw = await sankaFetch<any>('/anime/genre', 86400);
    const list = raw?.data?.genreList || raw?.genreList || raw;
    if (Array.isArray(list)) {
      return list.map((g: any) => ({
        name: g.title || g.name,
        slug: g.genreId || g.slug,
        count: g.count || 24,
      }));
    }
    return mockGenreList;
  },

  async getAnimeByGenre(genreSlug: string): Promise<AnimeOngoingItem[]> {
    if (USE_MOCK_DATA) {
      return mockAnimeOngoing;
    }
    const raw = await sankaFetch<any>(`/anime/genre/${encodeURIComponent(genreSlug)}`, 3600);
    const list = raw?.data?.animeList || raw?.animeList || raw;
    return Array.isArray(list) ? list : [];
  },

  // --- SCHEDULES ---
  async getAnimeSchedule(): Promise<{ day: string; anime_list: { title: string; slug: string; url: string; poster?: string }[] }[]> {
    if (USE_MOCK_DATA) return [];
    const raw = await sankaFetch<any>('/anime/schedule', 3600);
    const list = raw?.data || raw;
    return Array.isArray(list) ? list : [];
  },

  async getDonghuaSchedule(): Promise<{ day: string; donghua_list: { title: string; slug: string; href?: string; anichinUrl?: string }[] }[]> {
    if (USE_MOCK_DATA) return [];
    const raw = await sankaFetch<any>('/anime/donghua/schedule', 3600);
    const list = raw?.schedule || raw?.data || raw;
    return Array.isArray(list) ? list : [];
  },

  async getSchedule(): Promise<ScheduleDay[]> {
    if (USE_MOCK_DATA) {
      return mockSchedule;
    }
    try {
      const [animeSched, donghuaSched] = await Promise.all([
        this.getAnimeSchedule(),
        this.getDonghuaSchedule(),
      ]);

      const DAYS_ORDER = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
      const DAYS_EN: Record<string, string> = {
        Senin: 'Monday',
        Selasa: 'Tuesday',
        Rabu: 'Wednesday',
        Kamis: 'Thursday',
        Jumat: 'Friday',
        Sabtu: 'Saturday',
        Minggu: 'Sunday',
      };

      const result: ScheduleDay[] = DAYS_ORDER.map((dayName) => {
        const aDay = animeSched.find((d) => d.day.toLowerCase() === dayName.toLowerCase());
        const dDay = donghuaSched.find((d) => d.day.toLowerCase() === dayName.toLowerCase());

        const entries: ScheduleDay['entries'] = [];

        if (aDay?.anime_list) {
          for (const a of aDay.anime_list) {
            entries.push({
              title: a.title,
              time: 'Update Harian',
              episode: 'Episode Terbaru',
              type: 'anime',
              animeId: a.slug || a.title.toLowerCase().replace(/\s+/g, '-'),
              poster: a.poster || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
            });
          }
        }

        if (dDay?.donghua_list) {
          for (const d of dDay.donghua_list) {
            entries.push({
              title: d.title,
              time: 'Update Harian',
              episode: 'Episode Terbaru',
              type: 'donghua',
              animeId: d.slug || d.title.toLowerCase().replace(/\s+/g, '-'),
              poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
            });
          }
        }

        return {
          day: dayName,
          dayEn: DAYS_EN[dayName] || dayName,
          entries,
        };
      }).filter((d) => d.entries.length > 0);

      if (result.length > 0) return result;
    } catch {
      // Fallback
    }
    return mockSchedule;
  },
};
