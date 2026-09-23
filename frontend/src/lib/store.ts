import { BookmarkItem, MediaType } from '@/types/api';

const BOOKMARKS_STORAGE_KEY = 'kagewire_bookmarks_v1';
const HISTORY_STORAGE_KEY = 'kagewire_history_v1';

export const storage = {
  getBookmarks(): BookmarkItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  isBookmarked(id: string): boolean {
    const list = this.getBookmarks();
    return list.some(item => item.id === id);
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
    const list = this.getBookmarks();
    const exists = list.some(b => b.id === item.id);
    let updated: BookmarkItem[];

    if (exists) {
      updated = list.filter(b => b.id !== item.id);
    } else {
      updated = [
        {
          ...item,
          updatedAt: Date.now(),
        },
        ...list,
      ];
    }

    try {
      localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    return !exists;
  },

  getHistory(): BookmarkItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(HISTORY_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
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
    if (typeof window === 'undefined') return;
    const history = this.getHistory().filter(h => h.id !== item.id);
    const updated = [
      {
        ...item,
        updatedAt: Date.now(),
      },
      ...history.slice(0, 29), // keep last 30 items
    ];
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  },

  clearHistory() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  },
};
