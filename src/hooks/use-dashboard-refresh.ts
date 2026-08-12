'use client';

import { useSWRConfig } from 'swr';
import { useRouter, usePathname } from 'next/navigation';
import React from 'react';

const DASHBOARD_SWR_KEYS = [
  '/api/v1/dashboard',
  '/api/v1/gita/daily',
  '/api/v1/profile',
  '/api/v1/navigation',
  '/api/v1/timeline',
  '/api/v1/priorities',
  '/api/v1/streak',
  '/api/v1/quotes/today',
];

export function useDashboardRefresh() {
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const pathname = usePathname();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const executeRefresh = React.useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Revalidate all dashboard SWR keys in parallel
      await Promise.all(
        DASHBOARD_SWR_KEYS.map((key) => mutate(key, undefined, { revalidate: true }))
      );

      // Also broadcast for any non-SWR widgets / live timers
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('vos:refresh-dashboard', { detail: { timestamp: Date.now() } })
        );
      }
    } catch (err) {
      console.error('[VOS] Error during dashboard refresh:', err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 800);
    }
  }, [mutate]);

  const handleLogoClick = React.useCallback(
    async (e?: React.MouseEvent) => {
      if (e) e.preventDefault();

      if (pathname !== '/') {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('vos_pending_refresh', 'true');
        }
        router.push('/');
      } else {
        await executeRefresh();
      }
    },
    [pathname, router, executeRefresh]
  );

  // Auto-refresh when navigating back to '/' with pending flag
  React.useEffect(() => {
    if (pathname === '/' && typeof window !== 'undefined') {
      const isPending = sessionStorage.getItem('vos_pending_refresh');
      if (isPending === 'true') {
        sessionStorage.removeItem('vos_pending_refresh');
        executeRefresh();
      }
    }
  }, [pathname, executeRefresh]);

  return {
    handleLogoClick,
    executeRefresh,
    isRefreshing,
  };
}
