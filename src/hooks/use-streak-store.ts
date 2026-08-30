"use client";

import { useState, useEffect, useCallback } from "react";

export interface StreakStore {
  loginDates: string[]; // ISO date strings "YYYY-MM-DD"
  lastCheckin: string | null;
}

const STORAGE_KEY = "vos_streak_v3";

export function getISTDate(): Date {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  // now.getTime() is UTC milliseconds. Adding istOffset gives a Date object whose 
  // UTC time matches the IST local time. This allows us to use .toISOString() safely.
  return new Date(now.getTime() + istOffset);
}

export function getISTDateString(istDate: Date): string {
  return istDate.toISOString().split("T")[0];
}

export function getTodayIST(): string {
  return getISTDateString(getISTDate());
}

function calculateStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const sorted = [...new Set(dates)].sort().reverse();
  const today = getTodayIST();
  
  // Check if today or yesterday is the start
  if (sorted[0] !== today) {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    if (sorted[0] !== yesterdayStr) return 0;
  }

  let streak = 1;
  for (let i = 0; i < sorted.length - 1; i++) {
    const current = new Date(sorted[i]);
    const prev = new Date(sorted[i + 1]);
    const diffDays = Math.round((current.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function calculateLongestStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const sorted = [...new Set(dates)].sort();
  let longest = 1;
  let current = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }
  return longest;
}

export function useStreakStore() {
  const [data, setData] = useState<StreakStore>({ loginDates: [], lastCheckin: null });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setData(JSON.parse(stored));
    } else {
      const initial: StreakStore = { loginDates: [], lastCheckin: null };
      setData(initial);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    }
    setIsLoaded(true);
  }, []);

  const persist = useCallback((newData: StreakStore) => {
    setData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  }, []);

  const checkIn = useCallback(() => {
    const today = getTodayIST();
    if (data.loginDates.includes(today)) return; // already checked in
    const updated: StreakStore = {
      loginDates: [...data.loginDates, today],
      lastCheckin: today,
    };
    persist(updated);
  }, [data, persist]);

  const today = getTodayIST();
  const checkedInToday = data.loginDates.includes(today);
  const currentStreak = calculateStreak(data.loginDates);
  const longestStreak = calculateLongestStreak(data.loginDates);
  const totalDays = new Set(data.loginDates).size;

  // Build a Set for O(1) lookups
  const loginDateSet = new Set(data.loginDates);

  return {
    loginDates: data.loginDates,
    loginDateSet,
    checkedInToday,
    currentStreak,
    longestStreak,
    totalDays,
    checkIn,
    isLoading: !isLoaded,
  };
}
