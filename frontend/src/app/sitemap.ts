import type { MetadataRoute } from 'next';
import { sankaApi } from '@/lib/sanka-api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kagewire.vercel.app';
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/anime`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/anime/ongoing`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/anime/list`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/comic`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/comic/ongoing`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/comic/list`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/comic/schedule`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/donghua`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/donghua/ongoing`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/donghua/list`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/genre`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/schedule`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/advertise`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  const dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    const [animeData, donghuaData, comicData] = await Promise.all([
      sankaApi.getAnimeHome(),
      sankaApi.getDonghuaHome(),
      sankaApi.getComicPopular(),
    ]);

    const ongoingAnime = animeData?.ongoing?.animeList || [];
    for (const item of ongoingAnime.slice(0, 30)) {
      if (item.animeId) {
        dynamicRoutes.push({
          url: `${baseUrl}/anime/otakudesu/${item.animeId}`,
          lastModified,
          changeFrequency: 'daily',
          priority: 0.8,
        });
      }
    }

    const donghuaItems = [...(donghuaData?.slider || []), ...(donghuaData?.popular || [])];
    const seenDonghua = new Set<string>();
    for (const item of donghuaItems.slice(0, 30)) {
      if (item.slug && !seenDonghua.has(item.slug)) {
        seenDonghua.add(item.slug);
        dynamicRoutes.push({
          url: `${baseUrl}/donghua/${item.slug}`,
          lastModified,
          changeFrequency: 'daily',
          priority: 0.8,
        });
      }
    }

    const comics = comicData || [];
    for (const item of comics.slice(0, 30)) {
      if (item.manga_id) {
        dynamicRoutes.push({
          url: `${baseUrl}/comic/${item.manga_id}`,
          lastModified,
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      }
    }
  } catch {
    // Graceful fallback to static routes on network/upstream error
  }

  return [...staticRoutes, ...dynamicRoutes];
}
