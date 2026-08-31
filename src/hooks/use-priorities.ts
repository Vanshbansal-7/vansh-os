"use client";

import useSWR from "swr";
import { DailyTask } from "@/types/dashboard";

const fetcher = async (url: string): Promise<DailyTask[]> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch priorities");
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message);
  
  const now = Date.now();
  const filtered = (json.data || []).filter((t: DailyTask) => {
    // If marked as done/completed, automatically remove from active list
    if (t.completed) return false;

    // If deadline has ended (passed), automatically remove from active list
    if (t.deadline) {
      const deadlineTime = new Date(t.deadline).getTime();
      if (!isNaN(deadlineTime) && now > deadlineTime) return false;
    }

    return true;
  });

  return filtered;
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
    // If marking as completed, optimistically remove it from active list immediately
    if (!currentCompleted) {
      mutate((current) => (current || []).filter((t) => t.id !== taskId), false);
    }

    const res = await fetch(`/api/v1/priorities/${taskId}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !currentCompleted }),
    });

    if (res.ok) {
      mutate();
    } else {
      // Fallback
      await editTask(taskId, { completed: !currentCompleted, completed_at: !currentCompleted ? new Date().toISOString() : undefined });
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
