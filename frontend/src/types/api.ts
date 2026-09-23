export type MediaType = 'anime' | 'donghua' | 'comic';

export interface BaseMedia {
  id: string;
  title: string;
  poster: string;
  type: MediaType;
  source: string;
  subOrDub?: string;
  latestEpisodeOrChapter?: string | number;
  releaseDate?: string;
  rating?: number | string;
}

// Anime (Otakudesu / Samehadaku)
export interface AnimeOngoingItem {
  title: string;
  poster: string;
  episodes?: number | string;
  releaseDay?: string;
  latestReleaseDate?: string;
  releasedOn?: string;
  animeId: string;
  href: string;
  otakudesuUrl?: string;
  samehadakuUrl?: string;
}

export interface AnimeDetail {
  title: string;
  poster: string;
  japanese?: string;
  score?: string | number;
  producers?: string;
  type?: string;
  status?: string;
  episodes?: string | number;
  duration?: string;
  aired?: string;
  studios?: string;
  synopsis?: string | { paragraphs?: string[]; connections?: unknown[] };
  genreList?: Array<{ title?: string; genreId?: string; href?: string; name?: string; slug?: string }>;
  episodeList?: Array<{
    title: string | number;
    episodeId: string;
    href: string;
    eps?: number | string;
    date?: string;
  }>;
  recommendedAnimeList?: Array<{
    title: string;
    poster: string;
    animeId: string;
    href: string;
  }>;
}

export interface EpisodeStreamData {
  title: string;
  animeId?: string;
  defaultStreamingUrl?: string;
  hasPrevEpisode?: boolean;
  prevEpisode?: {
    title: string;
    episodeId: string;
    href: string;
  } | null;
  hasNextEpisode?: boolean;
  nextEpisode?: {
    title: string;
    episodeId: string;
    href: string;
  } | null;
  server?: {
    title?: string;
    serverList?: Array<{
      title: string;
      serverId: string;
      href?: string;
    }>;
  };
  streams?: Array<{
    server: string;
    url: string;
  }>;
  downloadUrl?: unknown;
}

// Donghua (Donghub)
export interface DonghuaItem {
  title: string;
  slug: string;
  poster: string;
  synopsis?: string;
  rating?: string | number;
  episodes?: string | number;
  status?: string;
  type?: string;
}

export interface DonghuaDetail {
  title: string;
  poster: string;
  rating?: string;
  synopsis: string;
  info?: Record<string, string>;
  genres?: string[];
  batch_link?: string;
  episodes: Array<{
    episode: string | number;
    title: string;
    slug: string;
    date: string;
    url?: string;
  }>;
  recommendations?: Array<{
    title: string;
    slug: string;
    poster: string;
  }>;
}

export interface DonghuaEpisodeStream {
  title: string;
  release_date?: string;
  navigation: {
    prev_slug?: string | null;
    next_slug?: string | null;
    all_slug: string;
  };
  streams: Array<{
    server: string;
    url: string;
  }>;
  downloadUrl?: any;
  anime_info?: {
    title?: string;
    slug?: string;
    thumbnail?: string;
    rating?: string;
    status?: string;
    network?: string;
    studio?: string;
    released?: string;
  };
}

// Comic / Manga / Manhwa / Manhua (Shinigami)
export interface ComicItem {
  manga_id: string;
  title: string;
  alternative_title?: string;
  description?: string;
  cover: string;
  cover_portrait?: string;
  status?: string;
  release_year?: string;
  country?: string;
  rating?: number | string;
  views?: number;
  bookmarks?: number;
  latest_chapter?: number;
  latest_chapter_id?: string;
  genres?: Array<{
    name: string;
    slug: string;
  }>;
  format?: 'Manga' | 'Manhwa' | 'Manhua' | string;
}

export interface ComicDetail extends ComicItem {
  id?: string;
  rank?: number;
  authors?: Array<{ name: string; slug: string }>;
  artists?: Array<{ name: string; slug: string }>;
  created_at?: string;
  updated_at?: string;
}

export interface ChapterItem {
  chapter_id: string;
  manga_id: string;
  chapter_number: number | string;
  chapter_title?: string | null;
  thumbnail?: string;
  views?: number;
  release_date?: string;
}

export interface ChapterReaderData {
  chapter_id: string;
  manga_id: string;
  chapter_number: number | string;
  chapter_title?: string | null;
  thumbnail?: string;
  views?: number;
  release_date?: string;
  prev_chapter?: string | null;
  next_chapter?: string | null;
  images: string[];
  total_images: number;
}

// User state
export interface BookmarkItem {
  id: string;
  title: string;
  poster: string;
  type: MediaType;
  source: string;
  slugOrId: string;
  lastProgress?: string; // e.g. "Ep. 12" or "Ch. 45"
  updatedAt: number;
}

// Genre
export interface GenreItem {
  name: string;
  slug: string;
  count?: number;
  description?: string;
  icon?: string;
}

// Schedule
export interface ScheduleEntry {
  title: string;
  animeId: string;
  source?: string;
  poster: string;
  time: string;
  episode: string;
  genres?: string[];
  type?: 'anime' | 'donghua';
}

export interface ScheduleDay {
  day: string;
  dayEn: string;
  isToday?: boolean;
  entries: ScheduleEntry[];
}

// Comic Schedule
export interface ComicScheduleEntry {
  title: string;
  mangaId: string;
  poster: string;
  time: string;
  chapter: string | number;
  format: 'Manga' | 'Manhwa' | 'Manhua';
  genres?: string[];
  status?: string;
  country?: string;
}

export interface ComicScheduleDay {
  day: string;
  dayEn: string;
  isToday?: boolean;
  entries: ComicScheduleEntry[];
}

// Advertisements
export type AdFormat = 'leaderboard' | 'billboard' | 'rectangle' | 'sticky-footer' | 'sticky-top' | 'popup' | 'multi-strip' | 'in-feed';

export interface AdBannerItem {
  id: string;
  title: string;
  imageUrl?: string;
  targetUrl?: string;
  advertiserName: string;
  badge?: string;
  description?: string;
  isActive: boolean;
}

export interface AdSlotConfig {
  slotId: string;
  format: AdFormat;
  title: string;
  location: string;
  dimensions: string;
  pricePerWeekIdr: number;
  pricePerMonthIdr: number;
  isActive: boolean;
  advertiserName?: string;
  bannerImageUrl?: string;
  targetUrl?: string;
  description?: string;
  maxBanners?: number;
  banners?: AdBannerItem[];
}
