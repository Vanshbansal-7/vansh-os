'use client';

import useSWR, { mutate as globalMutate } from 'swr';
import { DailyTask } from '@/types/dashboard';
import React from 'react';

const fetcher = async (url: string): Promise<DailyTask[]> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch priorities');
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message);
  return json.data;
};

export function usePriorities() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<DailyTask[]>(
    '/api/v1/priorities',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30 * 1000,
      keepPreviousData: true,
      fallbackData: [],
    }
  );

  const toggleComplete = React.useCallback(
    async (taskId: string, currentCompleted: boolean) => {
      const newCompleted = !currentCompleted;

      // Optimistic update — flip locally immediately
      mutate(
        (prev) =>
          (prev || []).map((t) =>
            t.id === taskId
              ? { ...t, completed: newCompleted, completed_at: newCompleted ? new Date().toISOString() : undefined }
              : t
          ),
        { revalidate: false }
      );

      try {
        const res = await fetch(`/api/v1/priorities/${taskId}/complete`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completed: newCompleted }),
        });

        if (!res.ok) {
          // Rollback on failure
          mutate();
        }
      } catch {
        mutate();
      }
    },
    [mutate]
  );

  return {
    tasks: data || [],
    isLoading: isLoading && !data,
    isValidating,
    error,
    toggleComplete,
    refresh: () => mutate(),
  };
}
