'use client';

import useSWR from 'swr';
import { DailyGitaVerseResponse, GitaVerse } from '@/types/gita';

const fetcher = async (url: string): Promise<DailyGitaVerseResponse> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch daily verse: ${res.statusText}`);
  }
  const json = await res.json();
  if (!json.success || !json.data) {
    throw new Error(json.error?.message || 'Invalid verse response');
  }
  return json.data;
};

function getLocalYYYYMMDD() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
}

export function useDailyGitaVerse() {
  const today = getLocalYYYYMMDD();
  
  const { data, error, isLoading, isValidating, mutate } = useSWR<DailyGitaVerseResponse>(
    `/api/v1/gita/daily?date=${today}`,
    fetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 1000 * 60 * 5, // 5 minutes
    }
  );

  return {
    verse: data?.verse,
    isDailyRotation: data?.is_daily_rotation,
    isLoading: isLoading && !data,
    isValidating,
    error,
    refresh: () => mutate(),
  };
}
