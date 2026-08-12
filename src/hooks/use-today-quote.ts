'use client';

import useSWR from 'swr';
import { DailyQuote } from '@/types/dashboard';

const FALLBACK_QUOTE: DailyQuote = {
  id: 'fallback',
  quote: 'Consistency is the foundation of virtue.',
  author: 'Francis Bacon',
  theme: 'discipline',
};

const fetcher = async (url: string): Promise<{ quote: DailyQuote; date: string }> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch quote');
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message);
  return json.data;
};

export function useTodayQuote() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/v1/quotes/today',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      dedupingInterval: 1000 * 60 * 60, // 1 hour — same quote all day
      fallbackData: { quote: FALLBACK_QUOTE, date: new Date().toISOString().split('T')[0] },
    }
  );

  return {
    quote: data?.quote || FALLBACK_QUOTE,
    date: data?.date,
    isLoading: isLoading && !data,
    error,
    refresh: () => mutate(),
  };
}
