"use client";

import { useState, useEffect, useCallback } from "react";
import { DailyTask, PriorityLevel } from "@/types/dashboard";

const SEED_TASKS: DailyTask[] = [
  { id: "seed-1", user_id: "local", title: "Amazon OA Deadline", subtitle: "2 Days Left", category: "Career", priority_level: "HIGH", completed: false, due_date: new Date().toISOString().split("T")[0], source: "manual", is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "seed-2", user_id: "local", title: "DSA Daily Goal", subtitle: "3 / 3 Questions", category: "Study", priority_level: "MEDIUM", completed: true, due_date: new Date().toISOString().split("T")[0], source: "manual", is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "seed-3", user_id: "local", title: "System Design", subtitle: "Study 1 Topic", category: "Study", priority_level: "MEDIUM", completed: false, due_date: new Date().toISOString().split("T")[0], source: "manual", is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "seed-4", user_id: "local", title: "Core Subject Revision", subtitle: "Complete OS Unit 4", category: "Study", priority_level: "MEDIUM", completed: false, due_date: new Date().toISOString().split("T")[0], source: "manual", is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "seed-5", user_id: "local", title: "Health Goal", subtitle: "Drink 3L Water", category: "Health", priority_level: "LOW", completed: false, due_date: new Date().toISOString().split("T")[0], source: "manual", is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export function usePriorities() {
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem("vos_daily_priorities");
    if (stored) {
      setTasks(JSON.parse(stored));
    } else {
      setTasks(SEED_TASKS);
      localStorage.setItem("vos_daily_priorities", JSON.stringify(SEED_TASKS));
    }
    setIsLoaded(true);
  }, []);

  // Sync to local storage on changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("vos_daily_priorities", JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  const addTask = useCallback((task: Omit<DailyTask, "id" | "user_id" | "created_at" | "updated_at">) => {
    const newTask: DailyTask = {
      ...task,
      id: crypto.randomUUID(),
      user_id: "local",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, newTask]);
  }, []);

  const editTask = useCallback((id: string, updates: Partial<Omit<DailyTask, "id" | "user_id">>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates, updated_at: new Date().toISOString() } : t))
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleComplete = useCallback((taskId: string, currentCompleted: boolean) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, completed: !currentCompleted, completed_at: !currentCompleted ? new Date().toISOString() : undefined }
          : t
      )
    );
  }, []);

  return {
    tasks,
    isLoading: !isLoaded,
    error: null,
    addTask,
    editTask,
    deleteTask,
    toggleComplete,
    refresh: () => {}, // No-op since it's local
  };
}
