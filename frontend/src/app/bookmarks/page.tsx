'use client';

import React, { useState, useEffect } from 'react';
import { storage } from '@/lib/store';
import { BookmarkItem } from '@/types/api';
import MediaCard from '@/components/ui/MediaCard';
import { Bookmark, Clock, Trash2 } from 'lucide-react';

export default function BookmarksPage() {
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'history'>('bookmarks');
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [history, setHistory] = useState<BookmarkItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setBookmarks(storage.getBookmarks());
    setHistory(storage.getHistory());
  }, []);

  const handleClearHistory = () => {
    if (confirm('Hapus semua riwayat tontonan dan bacaan?')) {
      storage.clearHistory();
      setHistory([]);
    }
  };

  if (!isMounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-content-muted">
        Memuat data...
      </div>
    );
  }

  const currentList = activeTab === 'bookmarks' ? bookmarks : history;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Editorial Header */}
      <div className="mb-10 border-b border-border-subtle pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-amber">
            Perpustakaan
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-content-primary mt-1 tracking-tight">
            Pustaka Pribadi
          </h1>
          <p className="text-xs sm:text-sm text-content-secondary mt-1">
            Daftar simpanan dan riwayat aktivitas yang tersimpan otomatis
          </p>
        </div>

        {activeTab === 'history' && history.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-status-error/10 text-status-error hover:bg-status-error/20 border border-status-error/20 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Bersihkan Riwayat
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8">
        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold transition-all ${
            activeTab === 'bookmarks'
              ? 'bg-amber text-black'
              : 'text-content-secondary hover:text-content-primary hover:bg-surface-secondary border border-border-subtle'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          Tersimpan ({bookmarks.length})
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold transition-all ${
            activeTab === 'history'
              ? 'bg-amber text-black'
              : 'text-content-secondary hover:text-content-primary hover:bg-surface-secondary border border-border-subtle'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Riwayat ({history.length})
        </button>
      </div>

      {/* Content List */}
      {currentList.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {currentList.map((item) => {
            const href =
              item.type === 'anime'
                ? `/anime/${item.source}/${item.slugOrId}`
                : item.type === 'donghua'
                ? `/donghua/${item.slugOrId}`
                : `/comic/${item.slugOrId}`;

            return (
              <MediaCard
                key={item.id}
                id={item.id}
                title={item.title}
                poster={item.poster}
                type={item.type}
                href={href}
                badge={item.lastProgress}
              />
            );
          })}
        </div>
      ) : (
        <div className="p-16 text-center surface-panel rounded-md">
          {activeTab === 'bookmarks' ? (
            <>
              <Bookmark className="w-12 h-12 text-amber mx-auto mb-3 opacity-40" />
              <p className="text-sm font-semibold text-content-primary">
                Belum ada judul yang disimpan
              </p>
              <p className="text-xs text-content-muted mt-1">
                Jelajahi katalog dan simpan judul favorit Anda untuk akses cepat.
              </p>
            </>
          ) : (
            <>
              <Clock className="w-12 h-12 text-amber mx-auto mb-3 opacity-40" />
              <p className="text-sm font-semibold text-content-primary">
                Riwayat tontonan dan bacaan masih kosong
              </p>
              <p className="text-xs text-content-muted mt-1">
                Episode atau chapter yang Anda tonton akan otomatis muncul di sini.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
