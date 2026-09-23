import React from 'react';
import { sankaApi } from '@/lib/sanka-api';
import { ScheduleClientView } from '@/components/schedule/ScheduleClientView';

export const metadata = {
  title: 'Jadwal Rilis Anime & Donghua — KageWire',
  description: 'Pantau jadwal tayang anime dan animasi donghua terbaru setiap hari di KageWire.',
};

export const revalidate = 1800;

export default async function SchedulePage() {
  const schedule = await sankaApi.getSchedule();

  return <ScheduleClientView initialSchedule={schedule} />;
}
