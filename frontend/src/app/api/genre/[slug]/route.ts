import { NextRequest, NextResponse } from 'next/server';
import { sankaApi } from '@/lib/sanka-api';

export const dynamic = 'force-dynamic';

const VALID_SLUG = /^[a-z0-9-]{1,80}$/;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!VALID_SLUG.test(slug)) {
    return NextResponse.json({ error: 'Invalid genre slug' }, { status: 400 });
  }

  const type = req.nextUrl.searchParams.get('type') || 'anime';
  const page = Math.max(1, parseInt(req.nextUrl.searchParams.get('page') || '1', 10));

  try {
    if (type === 'donghua') {
      const res = await sankaApi.getDonghuaList(1, 100);
      const genreClean = slug.toLowerCase().replace(/[-_]/g, ' ');
      const filtered = (res.donghuaList || []).filter((d) => {
        if (d.genres && Array.isArray(d.genres) && d.genres.length > 0) {
          return d.genres.some((g: string) => {
            const gl = g.toLowerCase().replace(/[-_]/g, ' ');
            return gl.includes(genreClean) || genreClean.includes(gl);
          });
        }
        // Fallback: check synopsis or title if genres not explicitly tagged
        const text = `${d.title} ${d.synopsis || ''}`.toLowerCase();
        return text.includes(genreClean);
      });
      // If no strict match found, return the general list so user sees content
      return NextResponse.json({
        donghuaList: filtered.length > 0 ? filtered : res.donghuaList,
      });
    }

    if (type === 'komik') {
      const res = await sankaApi.getComicList(1, 100);
      const genreClean = slug.toLowerCase().replace(/[-_]/g, ' ');
      const filtered = (res.comicList || []).filter((c) => {
        if (c.genres && Array.isArray(c.genres) && c.genres.length > 0) {
          return c.genres.some((g: any) => {
            const gName = (typeof g === 'string' ? g : g.name || g.slug || '').toLowerCase().replace(/[-_]/g, ' ');
            return gName.includes(genreClean) || genreClean.includes(gName);
          });
        }
        const text = `${c.title} ${c.description || ''}`.toLowerCase();
        return text.includes(genreClean);
      });
      return NextResponse.json({
        comicList: filtered.length > 0 ? filtered : res.comicList,
      });
    }

    const data = await sankaApi.getAnimeByGenre(slug, page);
    return NextResponse.json(data);
  } catch {
    if (type === 'donghua') return NextResponse.json({ donghuaList: [] }, { status: 200 });
    if (type === 'komik') return NextResponse.json({ comicList: [] }, { status: 200 });
    return NextResponse.json({ animeList: [], totalPages: 1, total: 0 }, { status: 200 });
  }
}
