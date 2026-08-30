'use client';

import useSWR from 'swr';
import { TimetableEntry } from '@/types/dashboard';

const fetcher = async (url: string): Promise<TimetableEntry[]> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch timeline');
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message);
  return json.data;
};

export function useTimeline() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<TimetableEntry[]>(
    '/api/v1/timeline',
    fetcher,
    {
      revalidateOnFocus: true,
      refreshInterval: 60 * 1000, // Re-fetch every 60s to auto-update statuses
      dedupingInterval: 30 * 1000,
      keepPreviousData: true,
      fallbackData: [],
    }
  );

  const addEntry = async (entry: Omit<TimetableEntry, "id" | "user_id" | "status" | "elapsed" | "window">) => {
    const res = await fetch("/api/v1/timeline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
    if (res.ok) {
      mutate();
    }
  };

  return {
    entries: data || [],
    isLoading: isLoading && !data,
    isValidating,
    error,
    refresh: () => mutate(),
    addEntry,
  };
}
