import { NextResponse } from 'next/server';
import { sankaApi } from '@/lib/sanka-api';

interface RouteParams {
  params: Promise<{ serverId: string }>;
}

// Validate serverId: alphanumeric, hyphen, underscore, dot, plus, equal, tilde, 1 to 250 characters
const SERVER_ID_REGEX = /^[a-zA-Z0-9_\-.~+=%]{1,250}$/;

export async function GET(_req: Request, { params }: RouteParams) {
  let { serverId } = await params;
  try {
    serverId = decodeURIComponent(serverId);
  } catch {
    // keep as is
  }

  if (!serverId || !SERVER_ID_REGEX.test(serverId)) {
    return NextResponse.json({ error: 'Invalid serverId format' }, { status: 400 });
  }

  try {
    const url = await sankaApi.getAnimeServer(serverId);

    if (!url) {
      return NextResponse.json({ error: 'Server URL not found' }, { status: 404 });
    }

    // Safety check: ensure URL is HTTP/HTTPS to prevent protocol smuggling
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return NextResponse.json({ error: 'Invalid server protocol' }, { status: 502 });
      }
    } catch {
      return NextResponse.json({ error: 'Malformed upstream server URL' }, { status: 502 });
    }

    return NextResponse.json(
      { url },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch {
    return NextResponse.json({ error: 'Failed to resolve server' }, { status: 502 });
  }
}
