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

export function extractText(val: any): string {
  if (!val) return '';
  if (typeof val === 'string') {
    return val.replace(/<[^>]*>/g, '').trim();
  }
  if (Array.isArray(val)) {
    return val
      .map((item) => (typeof item === 'string' ? item.replace(/<[^>]*>/g, '').trim() : extractText(item)))
      .filter(Boolean)
      .join('\n\n');
  }
  if (typeof val === 'object') {
    if (Array.isArray(val.paragraphs)) {
      return val.paragraphs
        .map((p: any) => (typeof p === 'string' ? p.replace(/<[^>]*>/g, '').trim() : String(p)))
        .join('\n\n');
    }
    if (typeof val.text === 'string') return val.text.replace(/<[^>]*>/g, '').trim();
    if (typeof val.content === 'string') return val.content.replace(/<[^>]*>/g, '').trim();
    if (typeof val.description === 'string') return val.description.replace(/<[^>]*>/g, '').trim();
    if (typeof val.synopsis === 'string') return val.synopsis.replace(/<[^>]*>/g, '').trim();
  }
  return String(val);
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
      const match = mockAnimeOngoing.find((a) => a.animeId === slug);
      const title = match ? match.title : slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
      const isSoloLeveling = slug.toLowerCase().includes('solo-leveling');
      return {
        ...mockAnimeDetail,
        title,
        poster: match ? match.poster : mockAnimeDetail.poster,
        synopsis: isSoloLeveling ? mockAnimeDetail.synopsis : '',
      };
    }
    const endpoint = source === 'samehadaku' ? `/anime/samehadaku/anime/${slug}` : `/anime/anime/${slug}`;
    const raw = await sankaFetch<any>(endpoint, 3600);
    if (!raw) return null;
    const data = raw.data || raw;

    const title = data.title || data.anime_title || data.name || slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    const poster = data.poster || data.thumb || data.thumbnail || data.image || '';
    const japanese = data.japanese || data.japanese_title || data.native_title || '';
    const score = data.score || data.rating || '';
    const producers = data.producers || data.producer || '';
    const type = data.type || 'TV';
    const status = data.status || '';
    const episodes = data.episodes || data.total_episode || data.total_episodes || '';
    const duration = data.duration || '';
    const aired = data.aired || data.release_date || '';
    const studios = data.studios || data.studio || '';

    // Synopsis normalization: handle string, array of strings, object with paragraphs, sinopsis, description
    const synopsis =
      extractText(data.synopsis) ||
      extractText(data.sinopsis) ||
      extractText(data.description) ||
      '';

    // Genre List normalization
    const rawGenres = data.genreList || data.genre_list || data.genres || [];
    const genreList = Array.isArray(rawGenres)
      ? rawGenres.map((g: any) => {
          if (typeof g === 'string') {
            return {
              title: g,
              name: g,
              slug: g.toLowerCase().replace(/\s+/g, '-'),
              genreId: g.toLowerCase().replace(/\s+/g, '-'),
            };
          }
          return {
            title: g.title || g.genre_title || g.name || '',
            name: g.name || g.genre_title || g.title || '',
            slug: g.genreId || g.genre_id || g.slug || g.genre_endpoint || '',
            genreId: g.genreId || g.genre_id || g.slug || '',
            href: g.href || `/genre/${g.genreId || g.genre_id || g.slug}`,
          };
        })
      : [];

    // Episode List normalization
    const rawEpisodes = data.episodeList || data.episode_list || data.episodes || [];
    const episodeList = Array.isArray(rawEpisodes)
      ? rawEpisodes.map((ep: any, idx: number) => {
          const epSlug =
            ep.episodeId ||
            ep.episode_endpoint ||
            ep.slug ||
            ep.id ||
            ep.href?.split('/').filter(Boolean).pop() ||
            `episode-${idx + 1}`;
          return {
            title: ep.title || ep.episode_title || ep.name || `Episode ${ep.eps || ep.episode || idx + 1}`,
            episodeId: epSlug,
            href: ep.href || `/watch/${source}/${epSlug}`,
            eps: ep.eps || ep.episode || idx + 1,
            date: ep.date || ep.episode_date || ep.release_date || '',
          };
        })
      : [];

    // Recommended Anime normalization
    const rawRecs = data.recommendedAnimeList || data.recommendations || data.recommended_anime_list || [];
    const recommendedAnimeList = Array.isArray(rawRecs)
      ? rawRecs.map((rec: any) => {
          const recId = rec.animeId || rec.endpoint || rec.slug || rec.id || '';
          return {
            title: rec.title || rec.anime_title || '',
            poster: rec.poster || rec.thumb || rec.thumbnail || '',
            animeId: recId,
            href: rec.href || `/anime/${source}/${recId}`,
          };
        })
      : [];

    return {
      title,
      poster,
      japanese,
      score,
      producers,
      type,
      status,
      episodes,
      duration,
      aired,
      studios,
      synopsis,
      genreList,
      episodeList,
      recommendedAnimeList,
    };
  },

  async getAnimeEpisode(source: string, slug: string): Promise<EpisodeStreamData | null> {
    if (USE_MOCK_DATA) {
      return {
        ...mockEpisodeStream,
        title: `${slug.replace(/-/g, ' ').toUpperCase()} Subtitle Indonesia`,
      };
    }

    // Try multiple endpoints for robustness — providers may have different prefixes
    let raw: any = null;
    if (source === 'samehadaku') {
      raw = await sankaFetch<any>(`/anime/samehadaku/episode/${slug}`, 1800);
    } else {
      // Otakudesu: try primary, then prefixed endpoint as fallback
      raw = await sankaFetch<any>(`/anime/episode/${slug}`, 1800);
      if (!raw) {
        raw = await sankaFetch<any>(`/anime/otakudesu/episode/${slug}`, 1800);
      }
    }

    if (!raw) return null;
    const data = raw.data || raw;

    const prev = data.prevEpisode || data.previous_episode || data.prev_episode;
    const next = data.nextEpisode || data.next_episode;

    return {
      title: data.title || data.episode_title || `${slug.replace(/-/g, ' ').toUpperCase()}`,
      animeId: data.animeId || data.anime_id || data.anime_endpoint || '',
      defaultStreamingUrl: data.defaultStreamingUrl || data.default_streaming_url || data.stream_url || '',
      hasPrevEpisode: data.hasPrevEpisode ?? data.has_previous_episode ?? Boolean(prev),
      prevEpisode: prev
        ? {
            title: prev.title || prev.name || 'Episode Sebelumnya',
            episodeId:
              prev.episodeId ||
              prev.episode_endpoint ||
              prev.id ||
              prev.slug ||
              prev.href?.split('/').filter(Boolean).pop() ||
              '',
            href: prev.href || `/watch/${source}/${prev.episodeId || prev.episode_endpoint || prev.slug || ''}`,
          }
        : null,
      hasNextEpisode: data.hasNextEpisode ?? data.has_next_episode ?? Boolean(next),
      nextEpisode: next
        ? {
            title: next.title || next.name || 'Episode Berikutnya',
            episodeId:
              next.episodeId ||
              next.episode_endpoint ||
              next.id ||
              next.slug ||
              next.href?.split('/').filter(Boolean).pop() ||
              '',
            href: next.href || `/watch/${source}/${next.episodeId || next.episode_endpoint || next.slug || ''}`,
          }
        : null,
      server: data.server || (data.server_list ? { serverList: data.server_list } : undefined),
      streams: data.streams || [],
      downloadUrl: data.downloadUrl || data.download_url || data.download_links || null,
    };
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
    const [homeRaw, ongoingRaw] = await Promise.all([
      sankaFetch<any>('/anime/donghua/home/1', 1800),
      sankaFetch<any>('/anime/donghua/ongoing/1', 1800),
    ]);
    const homeData = (homeRaw as any)?.data || homeRaw;
    const ongoingData = (ongoingRaw as any)?.data || ongoingRaw;
    return {
      slider: ongoingData?.ongoing_donghua?.slice(0, 5) || [],
      popular: ongoingData?.ongoing_donghua?.slice(0, 10) || [],
      latest: homeData?.latest_release || [],
    };
  },

  async getDonghuaDetail(slug: string): Promise<DonghuaDetail | null> {
    if (USE_MOCK_DATA) {
      const match = mockDonghuaList.find((d) => d.slug === slug);
      const isPerfectWorld = slug.toLowerCase().includes('perfect-world');
      return {
        ...mockDonghuaDetail,
        ...(match ? {
          title: match.title,
          poster: match.poster,
          rating: match.rating !== undefined ? String(match.rating) : mockDonghuaDetail.rating,
          genres: match.genres,
          synopsis: match.synopsis || '',
        } : {
          title: slug.replace(/-/g, ' ').toUpperCase(),
          synopsis: isPerfectWorld ? mockDonghuaDetail.synopsis : '',
        }),
      };
    }
    const raw = await sankaFetch<any>(`/anime/donghua/detail/${slug}`, 3600);
    if (!raw) return null;
    const data = raw.data || raw;

    const title = data.title || data.donghua_title || data.name || slug.replace(/-/g, ' ').toUpperCase();
    const poster = data.poster || data.thumbnail || data.thumb || data.image || data.cover || '';
    const rating = data.rating || data.score || '';
    const synopsis =
      extractText(data.synopsis) ||
      extractText(data.sinopsis) ||
      extractText(data.description) ||
      '';

    // Safe info mapping (ensure only primitive strings to avoid React child crashes)
    const info: Record<string, string> = {};
    if (data.info && typeof data.info === 'object') {
      for (const [k, v] of Object.entries(data.info)) {
        if (typeof v === 'string' || typeof v === 'number') {
          info[k] = String(v);
        } else if (Array.isArray(v)) {
          info[k] = v.join(', ');
        } else if (v && typeof v === 'object') {
          info[k] = (v as any).name || (v as any).title || '';
        }
      }
    }

    // Genre normalization
    const rawGenres = data.genres || data.genre_list || data.genreList || [];
    const genres: string[] = Array.isArray(rawGenres)
      ? rawGenres
          .map((g: any) => (typeof g === 'string' ? g : g.name || g.title || g.genre_title || ''))
          .filter(Boolean)
      : [];

    // Episode List normalization
    const rawEpisodes = data.episodes || data.episode_list || data.episodes_list || [];
    const episodes = Array.isArray(rawEpisodes)
      ? rawEpisodes.map((ep: any, idx: number) => {
          const epSlug =
            ep.slug ||
            ep.episode_endpoint ||
            ep.endpoint ||
            ep.id ||
            ep.href?.split('/').filter(Boolean).pop() ||
            `${slug}-episode-${idx + 1}`;
          return {
            episode: ep.episode || ep.eps || ep.number || idx + 1,
            title: ep.title || ep.episode_title || ep.name || `Episode ${ep.episode || idx + 1}`,
            slug: epSlug,
            date: ep.date || ep.release_date || ep.uploaded_on || '',
            url: ep.url || '',
          };
        })
      : [];

    // Recommendations normalization
    const rawRecs = data.recommendations || data.recommended || data.recommendation_list || [];
    const recommendations = Array.isArray(rawRecs)
      ? rawRecs.map((rec: any) => ({
          title: rec.title || rec.name || '',
          slug: rec.slug || rec.endpoint || rec.id || '',
          poster: rec.poster || rec.thumbnail || rec.thumb || rec.image || '',
        }))
      : [];

    return {
      title,
      poster,
      rating,
      synopsis,
      info: Object.keys(info).length > 0 ? info : undefined,
      genres,
      batch_link: data.batch_link || data.batchLink,
      episodes,
      recommendations,
    };
  },

  async getDonghuaEpisode(slug: string): Promise<DonghuaEpisodeStream | null> {
    if (USE_MOCK_DATA) {
      return {
        ...mockDonghuaEpisodeStream,
        title: `${slug.replace(/-/g, ' ').toUpperCase()} Subtitle Indonesia`,
      };
    }
    const raw = await sankaFetch<any>(`/anime/donghua/episode/${slug}`, 1800);
    if (!raw) return null;
    const data = raw.data || raw;

    const streams: { server: string; url: string }[] = [];
    if (data.streaming?.servers && Array.isArray(data.streaming.servers)) {
      for (const s of data.streaming.servers) {
        if (s.url) streams.push({ server: s.name || s.server || 'Server', url: s.url });
      }
    } else if (data.streaming?.main_url?.url) {
      streams.push({ server: data.streaming.main_url.name || 'Main Server', url: data.streaming.main_url.url });
    } else if (Array.isArray(data.streams)) {
      for (const s of data.streams) {
        if (s.url) streams.push({ server: s.server || s.name || 'Server', url: s.url });
      }
    } else if (Array.isArray(data.servers)) {
      for (const s of data.servers) {
        if (s.url) streams.push({ server: s.name || s.server || 'Server', url: s.url });
      }
    }

    const prevSlug =
      data.navigation?.previous_episode?.slug ||
      data.navigation?.prev_slug ||
      data.prev_episode?.slug ||
      data.prev_slug ||
      null;
    const nextSlug =
      data.navigation?.next_episode?.slug ||
      data.navigation?.next_slug ||
      data.next_episode?.slug ||
      data.next_slug ||
      null;
    const allSlug =
      data.navigation?.all_episodes?.slug ||
      data.donghua_details?.slug ||
      data.all_slug ||
      slug.replace(/-episode-\d+.*$/, '');

    return {
      title: data.episode || data.title || `${slug.replace(/-/g, ' ').toUpperCase()}`,
      release_date: data.release_date || data.date || '',
      navigation: {
        prev_slug: prevSlug,
        next_slug: nextSlug,
        all_slug: allSlug,
      },
      streams,
      downloadUrl: data.download_url || data.download_links || null,
      anime_info: data.donghua_details || data.anime_info,
    };
  },

  async searchDonghua(query: string): Promise<DonghuaItem[]> {
    if (USE_MOCK_DATA) {
      return mockDonghuaList.filter((d) =>
        d.title.toLowerCase().includes(query.toLowerCase())
      );
    }
    const data = await sankaFetch<{ data?: DonghuaItem[] } | DonghuaItem[]>(
      `/anime/donghua/search/${encodeURIComponent(query)}/1`, 600
    );
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data && 'data' in data && Array.isArray(data.data)) return data.data;
    return [];
  },

  // Resolve a Sanka server ID to an actual embed URL (Otakudesu/Samehadaku)
  async getAnimeServer(serverId: string): Promise<string | null> {
    if (USE_MOCK_DATA) return 'https://desustream.com/dummy-stream';
    let raw = await sankaFetch<any>(`/anime/server/${serverId}`, 300);
    if (!raw) {
      raw = await sankaFetch<any>(`/anime/otakudesu/server/${serverId}`, 300);
    }
    if (!raw) return null;
    // SankaApi may return url under different keys
    const url =
      raw?.url ||
      raw?.data?.url ||
      raw?.embed_url ||
      raw?.streaming_url ||
      raw?.stream_url ||
      raw?.link ||
      raw?.data?.embed_url ||
      raw?.data?.streaming_url ||
      raw?.data?.link ||
      null;
    return typeof url === 'string' && url.startsWith('http') ? url : null;
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
      const isRevengeSwordHound = mangaId.toLowerCase().includes('revenge-iron-blooded') || mangaId.toLowerCase().includes('sword-hound');
      return {
        ...mockComicDetail,
        ...(match ? {
          ...match,
          genres: match.genres || mockComicDetail.genres,
        } : {
          title: mangaId.replace(/-/g, ' ').toUpperCase(),
          manga_id: mangaId,
          description: isRevengeSwordHound ? mockComicDetail.description : '',
        }),
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
        const detailObj = ('data' in raw && raw.data ? raw.data : raw) as any;
        if (detailObj && typeof detailObj === 'object' && ('title' in detailObj || 'name' in detailObj)) {
          return {
            ...detailObj,
            title: detailObj.title || detailObj.name || mangaId,
            description: extractText(detailObj.description) || extractText(detailObj.synopsis) || extractText(detailObj.sinopsis) || '',
            cover: detailObj.cover || detailObj.cover_portrait || detailObj.thumbnail || detailObj.thumb || '',
            cover_portrait: detailObj.cover_portrait || detailObj.cover || detailObj.thumbnail || '',
          } as ComicDetail;
        }
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
    const raw = await sankaFetch<any>(`/comic/shinigami/read/${chapterId}`, 3600);
    if (!raw) return null;
    const obj = (raw && 'data' in raw && raw.data && typeof raw.data === 'object' ? raw.data : raw) as any;
    if (!obj || typeof obj !== 'object') return null;

    const images: string[] = Array.isArray(obj.images)
      ? obj.images.map((img: any) => (typeof img === 'string' ? img : img.url || img.src || ''))
      : Array.isArray(obj.chapter_images)
      ? obj.chapter_images.map((img: any) => (typeof img === 'string' ? img : img.url || img.src || ''))
      : Array.isArray(obj.pages)
      ? obj.pages.map((img: any) => (typeof img === 'string' ? img : img.url || img.src || ''))
      : [];

    const prevChapter =
      typeof obj.prev_chapter === 'string'
        ? obj.prev_chapter
        : obj.prev_chapter?.chapter_id || obj.prev_chapter?.id || obj.prev_chapter?.slug || null;
    const nextChapter =
      typeof obj.next_chapter === 'string'
        ? obj.next_chapter
        : obj.next_chapter?.chapter_id || obj.next_chapter?.id || obj.next_chapter?.slug || null;
    const mangaId =
      typeof obj.manga_id === 'string'
        ? obj.manga_id
        : obj.manga_id?.id || obj.manga_id?.slug || obj.mangaId || '';

    return {
      chapter_id: obj.chapter_id || chapterId,
      manga_id: mangaId,
      chapter_number: obj.chapter_number || obj.number || '',
      chapter_title: obj.chapter_title || obj.title || '',
      images: images.filter(Boolean),
      total_images: images.length,
      prev_chapter: prevChapter,
      next_chapter: nextChapter,
    };
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
    const data = raw?.data || raw;
    const rawList = data?.ongoing_donghua || data?.completed_donghua || (Array.isArray(data) ? data : []);
    const list: DonghuaItem[] = rawList.map((d: any) => ({
      title: d.title || d.donghua_title || d.name || '',
      slug: d.slug || d.endpoint || d.id || '',
      poster: d.poster || d.thumbnail || d.thumb || d.image || '',
      synopsis: extractText(d.synopsis) || extractText(d.sinopsis) || '',
      rating: d.rating || d.score || '',
      status: d.status || (status === 'completed' ? 'Completed' : 'Ongoing'),
      episodes: d.episodes || d.episode || d.total_episode || '',
      type: d.type || 'Donghua',
    }));
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
    const raw = await sankaFetch<any>('/anime/donghua/ongoing/1', 1200);
    const data = raw?.data || raw;
    const rawList = data?.ongoing_donghua || (Array.isArray(data) ? data : []);
    return rawList.map((d: any) => ({
      title: d.title || d.donghua_title || d.name || '',
      slug: d.slug || d.endpoint || d.id || '',
      poster: d.poster || d.thumbnail || d.thumb || d.image || '',
      synopsis: extractText(d.synopsis) || extractText(d.sinopsis) || '',
      rating: d.rating || d.score || '',
      status: d.status || 'Ongoing',
      episodes: d.episodes || d.episode || '',
      type: d.type || 'Donghua',
    }));
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
      }));
    }
    return mockGenreList;
  },

  async getAnimeByGenre(genreSlug: string, page = 1): Promise<{ animeList: AnimeOngoingItem[]; totalPages: number; total: number }> {
    if (USE_MOCK_DATA) {
      return { animeList: mockAnimeOngoing, totalPages: 1, total: mockAnimeOngoing.length };
    }
    const raw = await sankaFetch<any>(`/anime/genre/${encodeURIComponent(genreSlug)}?page=${page}`, 3600);
    const list: AnimeOngoingItem[] = raw?.data?.animeList || raw?.animeList || (Array.isArray(raw) ? raw : []);
    const totalPages: number = raw?.pagination?.totalPages || raw?.data?.pagination?.totalPages || 1;
    const total: number = raw?.pagination?.total || raw?.data?.pagination?.total || list.length;
    return { animeList: list, totalPages, total };
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

      // Poster map for common donghua titles when the API omits poster/thumbnail
      const DONGHUA_POSTER_MAP: Record<string, string> = {
        'perfect-world': 'https://donghive.vip/wp-content/uploads/2025/02/perfect-world-poster-1-rotated.jpg',
        'soul-land-2': 'https://cdn.myanimelist.net/images/anime/1041/136706.jpg',
        'btth': 'https://cdn.myanimelist.net/images/anime/1660/125866.jpg',
        'battle-through-the-heavens': 'https://cdn.myanimelist.net/images/anime/1660/125866.jpg',
        'swallowed-star': 'https://cdn.myanimelist.net/images/anime/1169/110599.jpg',
        'renegade-immortal': 'https://cdn.myanimelist.net/images/anime/1077/137682.jpg',
        'a-will-eternal': 'https://cdn.myanimelist.net/images/anime/1004/108920.jpg',
        'shrouding-the-heavens': 'https://cdn.myanimelist.net/images/anime/1063/135118.jpg',
        'martial-universe': 'https://cdn.myanimelist.net/images/anime/1792/101831.jpg',
        'stellar-transformation': 'https://cdn.myanimelist.net/images/anime/1150/96112.jpg',
        'rmji': 'https://cdn.myanimelist.net/images/anime/1429/108922.jpg',
        'record-of-a-mortals-journey-to-immortality': 'https://cdn.myanimelist.net/images/anime/1429/108922.jpg',
        'jade-dynasty': 'https://cdn.myanimelist.net/images/anime/1202/125867.jpg',
        'against-the-gods': 'https://cdn.myanimelist.net/images/anime/1199/139366.jpg',
        'big-brother': 'https://cdn.myanimelist.net/images/anime/1676/133034.jpg',
        'apotheosis': 'https://cdn.myanimelist.net/images/anime/1915/129759.jpg',
        'tales-of-demons-and-gods': 'https://cdn.myanimelist.net/images/anime/1067/92842.jpg',
        'the-kings-avatar': 'https://cdn.myanimelist.net/images/anime/1004/142991.jpg',
      };

      const PLACEHOLDER_POSTER = 'https://cdn.myanimelist.net/images/anime/1341/136870.jpg';

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
              poster: a.poster || PLACEHOLDER_POSTER,
            });
          }
        }

        if (dDay?.donghua_list) {
          for (const d of dDay.donghua_list) {
            const dSlug = d.slug || d.title.toLowerCase().replace(/\s+/g, '-');
            const mappedPoster = DONGHUA_POSTER_MAP[dSlug];
            entries.push({
              title: d.title,
              time: 'Update Harian',
              episode: 'Episode Terbaru',
              type: 'donghua',
              animeId: dSlug,
              poster: (d as any).poster || (d as any).image || (d as any).thumbnail || (d as any).cover || mappedPoster || PLACEHOLDER_POSTER,
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
