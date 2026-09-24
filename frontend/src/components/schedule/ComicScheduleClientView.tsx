'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ComicScheduleDay } from '@/types/api';
import { AdBanner } from '@/components/ads/AdBanner';
import {
  Calendar,
  Clock,
  BookOpen,
  Search,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

const DAYS = ['Semua', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

interface ComicScheduleClientViewProps {
  initialSchedule: ComicScheduleDay[];
}

export function ComicScheduleClientView({ initialSchedule }: ComicScheduleClientViewProps) {
  // Determine today in WIB
  const todayName = useMemo(() => {
    const daysMap = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const wib = new Date(utc + 3600000 * 7);
    return daysMap[wib.getDay()];
  }, []);

  const [selectedDay, setSelectedDay] = useState<string>(todayName);
  const [filterFormat, setFilterFormat] = useState<'all' | 'Manhwa' | 'Manga' | 'Manhua'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDays = useMemo(() => {
    return initialSchedule
      .filter((day) => selectedDay === 'Semua' || day.day.toLowerCase() === selectedDay.toLowerCase())
      .map((day) => ({
        ...day,
        isToday: day.day.toLowerCase() === todayName.toLowerCase(),
        entries: day.entries.filter((entry) => {
          const matchesFormat = filterFormat === 'all' || entry.format === filterFormat;
          const q = searchQuery.trim().toLowerCase();
          const matchesQuery =
            !q ||
            entry.title.toLowerCase().includes(q) ||
            (entry.genres && entry.genres.some((g) => g.toLowerCase().includes(q)));
          return matchesFormat && matchesQuery;
        }),
      }))
      .filter((day) => day.entries.length > 0);
  }, [initialSchedule, selectedDay, filterFormat, searchQuery, todayName]);

  const totalShown = filteredDays.reduce((acc, d) => acc + d.entries.length, 0);

  return (
    <div className="min-h-screen bg-background text-content-primary pb-20 pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber/15 border border-amber/30 text-amber text-xs font-mono mb-3 shadow-sm">
            <Calendar className="w-3.5 h-3.5" />
            <span>Update Harian Manga, Manhwa &amp; Manhua</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-content-primary">
            Jadwal Rilis Komik
          </h1>
          <p className="mt-3 text-sm sm:text-base text-content-secondary leading-relaxed">
            Pantau jadwal update bab terbaru komik Korea (Manhwa), Jepang (Manga), dan Tiongkok (Manhua) setiap hari. Waktu penayangan disesuaikan dengan Waktu Indonesia Barat (WIB).
          </p>
        </div>

        {/* Top Leaderboard Ad */}
        <AdBanner slotId="comic-leaderboard" className="mb-10" />

        {/* Dropdown Filters Row */}
        <div className="flex flex-col sm:flex-row items-stretch gap-3 mb-8 p-4 bg-surface-card rounded-xl border border-border-subtle shadow-sm">

          {/* Day Dropdown */}
          <div className="relative flex-1">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-content-muted mb-1">
              Hari Rilis
            </label>
            <div className="relative">
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="w-full appearance-none pl-3.5 pr-9 py-2.5 rounded-lg bg-surface-main border border-border-subtle text-sm font-semibold text-content-primary focus:border-amber focus:outline-none cursor-pointer transition-colors hover:border-amber/40"
              >
                {DAYS.map((day) => (
                  <option key={day} value={day}>
                    {day === todayName ? `${day} (Hari Ini)` : day === 'Semua' ? 'Semua Hari' : `Hari ${day}`}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-amber absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Format Dropdown */}
          <div className="relative flex-1 sm:max-w-[200px]">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-content-muted mb-1">
              Format
            </label>
            <div className="relative">
              <select
                value={filterFormat}
                onChange={(e) => setFilterFormat(e.target.value as 'all' | 'Manhwa' | 'Manga' | 'Manhua')}
                className="w-full appearance-none pl-3.5 pr-9 py-2.5 rounded-lg bg-surface-main border border-border-subtle text-sm font-semibold text-content-primary focus:border-amber focus:outline-none cursor-pointer transition-colors hover:border-amber/40"
              >
                <option value="all">Semua Format</option>
                <option value="Manhwa">Manhwa (Korea)</option>
                <option value="Manga">Manga (Jepang)</option>
                <option value="Manhua">Manhua (China)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-amber absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 sm:max-w-[280px]">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-content-muted mb-1">
              Cari Komik
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Judul / Genre..."
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-surface-main border border-border-subtle text-sm text-content-primary placeholder:text-content-muted focus:border-amber focus:outline-none transition-colors"
              />
              <Search className="w-4 h-4 text-content-muted absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Count Badge */}
          <div className="flex sm:flex-col justify-between items-center sm:items-start shrink-0 px-4 py-2 rounded-lg bg-surface-secondary border border-border-subtle">
            <span className="text-[11px] font-mono text-content-muted">Tampil</span>
            <span className="text-sm font-bold text-amber font-mono">{totalShown} Komik</span>
          </div>
        </div>

        {/* Schedule Grid List */}
        {filteredDays.length === 0 ? (
          <div className="py-20 text-center text-content-muted text-sm rounded-xl border border-border-subtle bg-surface-card p-8">
            <p className="font-semibold text-content-primary mb-1">Tidak ada jadwal komik yang cocok</p>
            <p className="text-xs text-content-secondary">Coba pilih hari lain atau bersihkan kata kunci pencarian Anda.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {filteredDays.map((day) => (
              <div key={day.day} className="space-y-4">
                {/* Day Divider Banner */}
                <div className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-gradient-to-r from-surface-card via-surface-card/95 to-surface-secondary/70 border border-border-subtle shadow-sm">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-amber via-amber-light to-amber shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                  <div className="flex items-center gap-2.5 pl-2">
                    <h2 className="font-editorial text-xl sm:text-2xl font-bold text-white tracking-tight">
                      {day.day}
                    </h2>
                    <span className="text-xs font-mono text-content-secondary">
                      ({day.dayEn})
                    </span>
                    {day.isToday && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber/20 text-amber border border-amber/40 shadow-sm">
                        <Sparkles className="w-3 h-3" />
                        Hari Ini
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono font-semibold text-amber bg-amber/10 border border-amber/30 px-2.5 py-1 rounded-full self-start sm:self-auto ml-2 sm:ml-0">
                    {day.entries.length} Judul Rilis
                  </span>
                </div>

                {/* Comic Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {day.entries.map((comic, idx) => (
                    <div
                      key={`${comic.mangaId}-${idx}`}
                      className="group flex flex-col justify-between p-3.5 rounded-xl bg-surface-card border border-border-subtle hover:border-amber/50 hover:shadow-lg hover:shadow-amber/5 transition-all"
                    >
                      <div className="flex gap-3">
                        {/* Poster */}
                        <div className="relative w-16 sm:w-20 aspect-[3/4] rounded-lg overflow-hidden shrink-0 border border-border-subtle bg-surface-main">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={comic.poster}
                            alt={comic.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80';
                            }}
                          />
                          <span
                            className={`absolute top-1 left-1 px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider ${
                              comic.format === 'Manhwa'
                                ? 'bg-sky-500/80 text-white'
                                : comic.format === 'Manga'
                                ? 'bg-amber/90 text-black'
                                : 'bg-emerald-500/80 text-white'
                            }`}
                          >
                            {comic.format}
                          </span>
                        </div>

                        {/* Metadata */}
                        <div className="flex flex-col justify-between flex-1 min-w-0">
                          <div>
                            <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber mb-1">
                              <Clock className="w-3 h-3 shrink-0" />
                              <span>{comic.time}</span>
                            </div>
                            <Link
                              href={`/comic/${comic.mangaId}`}
                              className="font-semibold text-xs sm:text-sm text-content-primary line-clamp-2 group-hover:text-amber transition-colors leading-snug"
                              title={comic.title}
                            >
                              {comic.title}
                            </Link>
                          </div>
                          <div className="mt-2">
                            <span className="inline-block px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber/15 text-amber border border-amber/30">
                              {comic.chapter}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="mt-3 pt-3 border-t border-border-subtle flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1 text-[10px] text-content-muted truncate">
                          {comic.genres?.slice(0, 2).map((g) => (
                            <span key={g} className="px-1.5 py-0.5 rounded bg-surface-main border border-border-subtle">
                              {g}
                            </span>
                          ))}
                        </div>
                        <Link
                          href={`/comic/${comic.mangaId}`}
                          className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber hover:bg-amber-hover text-background text-xs font-bold transition-all shadow-sm shadow-amber/20 active:scale-95"
                        >
                          <BookOpen className="w-3 h-3 text-background" />
                          <span>Baca</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
