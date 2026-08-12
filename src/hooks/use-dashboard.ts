'use client';

import useSWR from 'swr';
import { DashboardSummary } from '@/types/dashboard';

const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;

function getClientGreeting(): string {
  const hour = new Date(Date.now() + IST_OFFSET_MS).getUTCHours();
  if (hour >= 5 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  if (hour >= 17 && hour < 21) return 'Good Evening';
  return 'Good Night';
}

function getClientDateFormatted(): string {
  return new Date().toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const FALLBACK: DashboardSummary = {
  greeting: getClientGreeting(),
  user_name: 'Vansh',
  current_date_formatted: getClientDateFormatted(),
  timezone: 'Asia/Kolkata',
};

const fetcher = async (url: string): Promise<DashboardSummary> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch dashboard');
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message);
  return json.data;
};

export function useDashboard() {
  const { data, error, isLoading, mutate } = useSWR<DashboardSummary>(
    '/api/v1/dashboard',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      dedupingInterval: 1000 * 60 * 5, // 5 min
      fallbackData: FALLBACK,
    }
  );

  return {
    greeting: data?.greeting || FALLBACK.greeting,
    userName: data?.user_name || FALLBACK.user_name,
    currentDateFormatted: data?.current_date_formatted || FALLBACK.current_date_formatted,
    isLoading: isLoading && !data,
    error,
    refresh: () => mutate(),
  };
}
