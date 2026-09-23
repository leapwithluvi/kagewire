import { NextResponse } from 'next/server';
import { sankaApi } from '@/lib/sanka-api';

interface RouteParams {
  params: Promise<{ serverId: string }>;
}

export async function GET(_req: Request, { params }: RouteParams) {
  const { serverId } = await params;

  if (!serverId || serverId.length < 3) {
    return NextResponse.json({ error: 'Invalid serverId' }, { status: 400 });
  }

  const url = await sankaApi.getAnimeServer(serverId);

  if (!url) {
    return NextResponse.json({ error: 'Server URL not found' }, { status: 404 });
  }

  return NextResponse.json({ url });
}
