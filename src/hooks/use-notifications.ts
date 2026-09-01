"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import useSWR from "swr";
import { VOSNotification } from "@/types/notification";

const READ_STORAGE_KEY = "vos_read_notification_ids";
const DISMISSED_STORAGE_KEY = "vos_dismissed_notification_ids";

const fetcher = async (url: string): Promise<VOSNotification[]> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch notifications");
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || "Notifications API error");
  return json.data || [];
};

export function useNotifications() {
  const { data: rawNotifications, error, mutate, isLoading } = useSWR<VOSNotification[]>(
    "/api/v1/notifications",
    fetcher
  );

  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const savedRead = localStorage.getItem(READ_STORAGE_KEY);
      const savedDismissed = localStorage.getItem(DISMISSED_STORAGE_KEY);
      if (savedRead) setReadIds(new Set(JSON.parse(savedRead)));
      if (savedDismissed) setDismissedIds(new Set(JSON.parse(savedDismissed)));
    } catch (e) {
      console.warn("Could not load read notifications from localStorage", e);
    }
  }, []);

  const notifications: VOSNotification[] = useMemo(() => {
    if (!rawNotifications) return [];
    return rawNotifications
      .filter((n) => !dismissedIds.has(n.id))
      .map((n) => ({
        ...n,
        read: readIds.has(n.id) || n.read,
      }));
  }, [rawNotifications, readIds, dismissedIds]);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const urgentCount = useMemo(() => {
    return notifications.filter((n) => (n.priority === "CRITICAL" || n.priority === "HIGH") && !n.read).length;
  }, [notifications]);

  const markAsRead = useCallback((id: string) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      try {
        localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(Array.from(next)));
      } catch (e) {}
      return next;
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    if (!notifications) return;
    const allIds = new Set(readIds);
    notifications.forEach((n) => allIds.add(n.id));
    setReadIds(allIds);
    try {
      localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(Array.from(allIds)));
    } catch (e) {}
  }, [notifications, readIds]);

  const dismiss = useCallback((id: string) => {
    setDismissedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      try {
        localStorage.setItem(DISMISSED_STORAGE_KEY, JSON.stringify(Array.from(next)));
      } catch (e) {}
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    if (!notifications) return;
    const allIds = new Set(dismissedIds);
    notifications.forEach((n) => allIds.add(n.id));
    setDismissedIds(allIds);
    try {
      localStorage.setItem(DISMISSED_STORAGE_KEY, JSON.stringify(Array.from(allIds)));
    } catch (e) {}
  }, [notifications, dismissedIds]);

  return {
    notifications,
    unreadCount,
    urgentCount,
    isLoading: isLoading && !rawNotifications,
    error,
    markAsRead,
    markAllAsRead,
    dismiss,
    clearAll,
    refresh: mutate,
  };
}