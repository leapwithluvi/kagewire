import { NextResponse } from 'next/server';
import { sankaApi } from '@/lib/sanka-api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim() || '';

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const [anime, donghua, comic] = await Promise.all([
      sankaApi.searchAnime(q),
      sankaApi.searchDonghua(q),
      sankaApi.searchComic(q),
    ]);

    const results = [
      ...(anime || []).slice(0, 3).map((a) => ({
        id: a.animeId,
        title: a.title,
        poster: a.poster,
        type: 'anime' as const,
        href: `/anime/otakudesu/${a.animeId}`,
        subtitle: a.releaseDay ? `Hari ${a.releaseDay}` : 'Anime Series',
        badge: a.episodes ? `Ep. ${a.episodes}` : undefined,
      })),
      ...(donghua || []).slice(0, 3).map((d) => ({
        id: d.slug,
        title: d.title,
        poster: d.poster,
        type: 'donghua' as const,
        href: `/donghua/${d.slug}`,
        subtitle: d.status || 'Donghua 3D',
        badge: d.rating ? `★ ${d.rating}` : undefined,
      })),
      ...(comic || []).slice(0, 3).map((c) => ({
        id: c.manga_id,
        title: c.title,
        poster: c.cover_portrait || c.cover,
        type: 'comic' as const,
        href: `/comic/${c.manga_id}`,
        subtitle: c.format || 'Manhwa',
        badge: c.latest_chapter ? `Ch. ${c.latest_chapter}` : undefined,
      })),
    ].slice(0, 7);

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Live search API error:', error);
    return NextResponse.json({ results: [] });
  }
}
