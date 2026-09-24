import { BookmarkItem, MediaType } from '@/types/api';

const BOOKMARKS_STORAGE_KEY = 'kagewire_bookmarks_v1';
const HISTORY_STORAGE_KEY = 'kagewire_history_v1';
const MAX_BOOKMARKS = 200;
const MAX_HISTORY = 50;

function isValidBookmarkItem(item: unknown): item is BookmarkItem {
  if (!item || typeof item !== 'object') return false;
  const b = item as Record<string, unknown>;
  return (
    typeof b.id === 'string' &&
    b.id.length > 0 &&
    b.id.length <= 200 &&
    typeof b.title === 'string' &&
    typeof b.poster === 'string' &&
    (b.type === 'anime' || b.type === 'donghua' || b.type === 'comic') &&
    typeof b.source === 'string' &&
    typeof b.slugOrId === 'string'
  );
}

function safeSanitizeItem(item: {
  id: string;
  title: string;
  poster: string;
  type: MediaType;
  source: string;
  slugOrId: string;
  lastProgress?: string;
}): BookmarkItem {
  return {
    id: String(item.id).slice(0, 200),
    title: String(item.title).slice(0, 200),
    poster: String(item.poster).slice(0, 500),
    type: item.type,
    source: String(item.source).slice(0, 50),
    slugOrId: String(item.slugOrId).slice(0, 150),
    lastProgress: item.lastProgress ? String(item.lastProgress).slice(0, 100) : undefined,
    updatedAt: Date.now(),
  };
}

export const storage = {
  getBookmarks(): BookmarkItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(isValidBookmarkItem).slice(0, MAX_BOOKMARKS);
    } catch {
      return [];
    }
  },

  isBookmarked(id: string): boolean {
    if (!id || typeof id !== 'string') return false;
    const list = this.getBookmarks();
    return list.some((item) => item.id === id);
  },

  toggleBookmark(item: {
    id: string;
    title: string;
    poster: string;
    type: MediaType;
    source: string;
    slugOrId: string;
    lastProgress?: string;
  }): boolean {
    if (!item?.id) return false;
    const list = this.getBookmarks();
    const exists = list.some((b) => b.id === item.id);
    let updated: BookmarkItem[];

    if (exists) {
      updated = list.filter((b) => b.id !== item.id);
    } else {
      const sanitized = safeSanitizeItem(item);
      updated = [sanitized, ...list].slice(0, MAX_BOOKMARKS);
    }

    try {
      localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Storage quota full or disabled; fail gracefully
    }
    return !exists;
  },

  getHistory(): BookmarkItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(isValidBookmarkItem).slice(0, MAX_HISTORY);
    } catch {
      return [];
    }
  },

  recordHistory(item: {
    id: string;
    title: string;
    poster: string;
    type: MediaType;
    source: string;
    slugOrId: string;
    lastProgress: string;
  }) {
    if (typeof window === 'undefined' || !item?.id) return;
    const history = this.getHistory().filter((h) => h.id !== item.id);
    const sanitized = safeSanitizeItem(item);
    const updated = [sanitized, ...history].slice(0, MAX_HISTORY);
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Storage quota full or disabled; fail gracefully
    }
  },

  clearHistory() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch {
      // Ignore
    }
  },
};
