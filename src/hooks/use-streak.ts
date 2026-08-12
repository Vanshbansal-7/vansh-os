'use client';

import useSWR from 'swr';
import { StreakData } from '@/types/dashboard';

const INITIAL_STREAK: StreakData = {
  current_streak: 14,
  longest_streak: 42,
  last_checkin_date: new Date().toISOString().split('T')[0],
  monthly_streak: 28,
  yearly_streak: 42,
  weekly_pattern: [
    { day: "M", date: "2026-08-03", status: "completed" },
    { day: "T", date: "2026-08-04", status: "completed" },
    { day: "W", date: "2026-08-05", status: "completed" },
    { day: "T", date: "2026-08-06", status: "completed" },
    { day: "F", date: "2026-08-07", status: "completed" },
    { day: "S", date: "2026-08-08", status: "completed" },
    { day: "S", date: "2026-08-09", status: "active" },
  ],
  checked_in_today: true,
};

const fetcher = async (url: string): Promise<StreakData> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch streak');
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message);
  return json.data;
};

export function useStreak() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<StreakData>(
    '/api/v1/streak',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 1000 * 60 * 5,
      keepPreviousData: true,
      fallbackData: INITIAL_STREAK,
    }
  );

  const checkin = async () => {
    try {
      const res = await fetch('/api/v1/checkin', { method: 'POST' });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.streak) {
          mutate(json.data.streak, { revalidate: false });
        }
      }
    } catch (err) {
      console.error("[useStreak] checkin error:", err);
    }
  };

  return {
    streak: data || INITIAL_STREAK,
    currentStreak: data?.current_streak || 14,
    longestStreak: data?.longest_streak || 42,
    weeklyPattern: data?.weekly_pattern || INITIAL_STREAK.weekly_pattern,
    checkedInToday: data?.checked_in_today ?? true,
    isLoading: isLoading && !data,
    isValidating,
    error,
    checkin,
    refresh: () => mutate(),
  };
}
