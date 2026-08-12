'use client';

import useSWR from 'swr';
import { EnrichedUserProfile } from '@/services/profile.service';
import { UpdateUserProfile } from '@/types/profile';

const fetcher = async (url: string): Promise<EnrichedUserProfile> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch founder profile: ${res.statusText}`);
  }
  const json = await res.json();
  if (!json.success || !json.data) {
    throw new Error(json.error?.message || 'Invalid profile response');
  }
  return json.data;
};

export function useFounderProfile() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<EnrichedUserProfile>(
    '/api/v1/profile',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 1000 * 60 * 10, // 10 minutes
      keepPreviousData: true,
    }
  );

  const updateProfile = async (updates: UpdateUserProfile) => {
    // Optimistic update
    if (data) {
      mutate({ ...data, ...updates }, false);
    }
    const res = await fetch('/api/v1/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const json = await res.json();
    if (json.success && json.data) {
      mutate(json.data);
    } else {
      mutate(); // rollback on error
    }
  };

  return {
    profile: data,
    isLoading,
    isValidating,
    error,
    updateProfile,
    refresh: () => mutate(),
  };
}
