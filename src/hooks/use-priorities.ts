"use client";

import useSWR from "swr";
import { DailyTask, PriorityLevel } from "@/types/dashboard";

const fetcher = async (url: string): Promise<DailyTask[]> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch priorities");
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message);
  
  // Client-side 24-hour auto-removal filter for completed tasks
  const now = new Date().getTime();
  const filtered = (json.data || []).filter((t: DailyTask) => {
    if (t.completed && t.completed_at) {
      const completedTime = new Date(t.completed_at).getTime();
      const hoursSinceCompletion = (now - completedTime) / (1000 * 60 * 60);
      if (hoursSinceCompletion > 24) return false;
    } else if (!t.completed && t.deadline) {
      // Note: As per requirements: "Do NOT remove an unchecked priority before its deadline."
      // Let's interpret this as: if deadline passed, maybe show it as overdue, or maybe keep it?
      // "It stays visible until its deadline expires." -> meaning it should be hidden after deadline?
      // Actually, if it's expired, it shouldn't disappear immediately unless that's what "until its deadline expires" means.
      // Wait, "Do NOT remove an unchecked priority before its deadline."
      // Let's remove it if it's past deadline by some margin or just leave it. The prompt said:
      // "IF a priority is NOT completed: -> It stays visible until its deadline expires."
      const deadlineTime = new Date(t.deadline).getTime();
      if (now > deadlineTime) return false;
    }
    return true;
  });

  return filtered;
};

export function usePriorities() {
  const { data, error, isLoading, mutate } = useSWR<DailyTask[]>(
    "/api/v1/priorities",
    fetcher,
    { revalidateOnFocus: true, dedupingInterval: 5000 }
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
    const res = await fetch(`/api/v1/priorities?id=${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      mutate();
    }
  };

  const toggleComplete = async (taskId: string, currentCompleted: boolean) => {
    const res = await fetch(`/api/v1/priorities/${taskId}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !currentCompleted }),
    });
    // Wait, the API route for complete is /api/v1/priorities/[id]/complete/route.ts
    // Let me check if that route exists! Yes, from my file listing:
    // `src/app/api/v1/priorities/[id]/complete/route.ts`
    if (res.ok) {
      mutate();
    } else {
      // Fallback if that route doesn't work
      editTask(taskId, { completed: !currentCompleted, completed_at: !currentCompleted ? new Date().toISOString() : undefined });
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
