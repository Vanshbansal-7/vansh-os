"use client";

import useSWR from "swr";
import { DailyTask } from "@/types/dashboard";

const PRIORITY_ORDER: Record<string, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };

const fetcher = async (url: string): Promise<DailyTask[]> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch priorities");
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message);
  
  const now = Date.now();
  const filtered = (json.data || []).filter((t: DailyTask) => {
    // If completed: keep in the list for 24 hours after completion
    if (t.completed) {
      if (!t.completed_at) return true; // Keep if just completed
      const completedTime = new Date(t.completed_at).getTime();
      if (isNaN(completedTime)) return true;
      const hoursSinceCompletion = (now - completedTime) / (1000 * 60 * 60);
      return hoursSinceCompletion <= 24; // Automatically removed after 24 hours
    }

    return true;
  });

  // Sort: Incomplete tasks first (by Priority High -> Low), then completed tasks at the bottom
  return filtered.sort((a: DailyTask, b: DailyTask) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return (PRIORITY_ORDER[a.priority_level] ?? 1) - (PRIORITY_ORDER[b.priority_level] ?? 1);
  });
};

export function usePriorities() {
  const { data, error, isLoading, mutate } = useSWR<DailyTask[]>(
    "/api/v1/priorities",
    fetcher,
    { revalidateOnFocus: true, dedupingInterval: 2000 }
  );

  const tasks = data || [];

  const addTask = async (task: Omit<DailyTask, "id" | "user_id" | "created_at" | "updated_at">) => {
    const res = await fetch("/api/v1/priorities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    if (res.ok) {
      mutate();
    }
  };

  const editTask = async (id: string, updates: Partial<Omit<DailyTask, "id" | "user_id">>) => {
    const res = await fetch("/api/v1/priorities", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updates }),
    });
    if (res.ok) {
      mutate();
    }
  };

  const deleteTask = async (id: string) => {
    // Optimistically remove from list
    mutate((current) => (current || []).filter((t) => t.id !== id), false);

    const res = await fetch(`/api/v1/priorities?id=${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      mutate();
    }
  };

  const toggleComplete = async (taskId: string, currentCompleted: boolean) => {
    const nextCompleted = !currentCompleted;
    const nextCompletedAt = nextCompleted ? new Date().toISOString() : undefined;

    // Optimistically update the item state so it instantly crosses out
    mutate((current) => {
      if (!current) return [];
      const updated = current.map((t) =>
        t.id === taskId
          ? { ...t, completed: nextCompleted, completed_at: nextCompletedAt }
          : t
      );
      // Re-sort: incomplete first, completed at bottom
      return [...updated].sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return (PRIORITY_ORDER[a.priority_level] ?? 1) - (PRIORITY_ORDER[b.priority_level] ?? 1);
      });
    }, false);

    const res = await fetch(`/api/v1/priorities/${taskId}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: nextCompleted }),
    });

    if (res.ok) {
      mutate();
    } else {
      // Fallback
      await editTask(taskId, { completed: nextCompleted, completed_at: nextCompletedAt });
    }
  };

  return {
    tasks,
    isLoading: isLoading && !data,
    error,
    addTask,
    editTask,
    deleteTask,
    toggleComplete,
    refresh: () => mutate(),
  };
}
