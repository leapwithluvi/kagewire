import React from 'react';
import { sankaApi } from '@/lib/sanka-api';
import { mockComicSchedule } from '@/lib/mock-data';
import { ComicScheduleDay, ComicScheduleEntry } from '@/types/api';
import { ComicScheduleClientView } from '@/components/schedule/ComicScheduleClientView';

export const metadata = {
  title: 'Jadwal Rilis Komik, Manhwa & Manga — KageWire',
  description: 'Pantau jadwal rilis chapter terbaru komik Korea (Manhwa), Jepang (Manga), dan China (Manhua) setiap hari di KageWire.',
};

export const revalidate = 1800;

export default async function ComicSchedulePage() {
  const [latestComics, popularComics] = await Promise.all([
    sankaApi.getComicLatest(),
    sankaApi.getComicPopular(),
  ]);

  const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
  const DAYS_EN: Record<string, string> = {
    Senin: 'Monday',
    Selasa: 'Tuesday',
    Rabu: 'Wednesday',
    Kamis: 'Thursday',
    Jumat: 'Friday',
    Sabtu: 'Saturday',
    Minggu: 'Sunday',
  };

  // Combine live latest & popular comics
  const seen = new Set<string>();
  const allComics = [...latestComics, ...popularComics].filter((c) => {
    if (!c.manga_id || seen.has(c.manga_id)) return false;
    seen.add(c.manga_id);
    return true;
  });

  let schedule: ComicScheduleDay[] = [];

  if (allComics.length > 0) {
    // Distribute real comics across the 7 days of the week
    schedule = DAYS.map((dayName, dayIdx) => {
      const daySlice = allComics.filter((_, idx) => idx % 7 === dayIdx);
      const entries: ComicScheduleEntry[] = daySlice.map((c) => ({
        title: c.title,
        mangaId: c.manga_id,
        poster: c.cover_portrait || c.cover || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
        time: '19:00 WIB',
        chapter: c.latest_chapter ? `Chapter ${c.latest_chapter}` : 'Bab Terbaru',
        format: (c.format as 'Manga' | 'Manhwa' | 'Manhua') || 'Manhwa',
        genres: c.genres?.map((g) => (typeof g === 'string' ? g : g.name)).slice(0, 3) || ['Action', 'Fantasy'],
        status: c.status || 'Ongoing',
        country: c.country || 'KR',
      }));

      // If a day has few entries, fill with mock entries so the schedule is full
      const mockDay = mockComicSchedule.find((m) => m.day === dayName);
      if (entries.length < 3 && mockDay) {
        entries.push(...mockDay.entries.slice(0, 3 - entries.length));
      }

      return {
        day: dayName,
        dayEn: DAYS_EN[dayName] || dayName,
        entries,
      };
    });
  } else {
    schedule = mockComicSchedule;
  }

  return <ComicScheduleClientView initialSchedule={schedule} />;
}
