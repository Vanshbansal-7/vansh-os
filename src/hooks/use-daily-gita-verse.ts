'use client';

import useSWR from 'swr';
import { DailyGitaVerseResponse, GitaVerse } from '@/types/gita';

const DEFAULT_FOUNDATIONAL_VERSE: GitaVerse = {
  id: '00000000-0000-0000-0000-000000000001',
  chapter: 2,
  verse: 47,
  chapter_name: 'सांख्य योग',
  sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥',
  hindi_meaning: 'तेरा अधिकार केवल कर्म करने में है, उसके फलों में कभी नहीं। इसलिए तू कर्मफल का हेतु मत बन और न ही तेरी अकर्मण्यता में आसक्ति हो।',
  english_meaning: 'You have a right to perform your prescribed duty, but you are not entitled to the fruits of action. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty.',
  theme: 'Nishkama Karma',
  keywords: ['karma', 'duty', 'detachment', 'focus'],
  life_topics: ['productivity', 'discipline', 'work_ethic', 'stress_relief'],
  difficulty: 'foundational',
  source: 'Bhagavad Gita As It Is',
  is_featured: true,
  display_priority: 100,
};

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
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function useDailyGitaVerse() {
  const today = getLocalYYYYMMDD();
  
  const { data, error, isLoading, isValidating, mutate } = useSWR<DailyGitaVerseResponse>(
    `/api/v1/gita/daily?date=${today}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      dedupingInterval: 1000 * 60 * 60, // 1 hour
      keepPreviousData: true,
      fallbackData: {
        date: new Date().toISOString().split('T')[0],
        verse: DEFAULT_FOUNDATIONAL_VERSE,
        is_daily_rotation: true,
        cached_at: new Date().toISOString(),
      },
    }
  );

  return {
    verse: data?.verse || DEFAULT_FOUNDATIONAL_VERSE,
    isDailyRotation: data?.is_daily_rotation,
    isLoading: isLoading && !data,
    isValidating,
    error,
    refresh: () => mutate(),
  };
}
