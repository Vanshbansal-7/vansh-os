"use client";

import useSWR from "swr";
import { useCallback } from "react";

export interface TemplateBlock {
  id: string;
  time: string; // e.g. "09:00 - 11:00"
  title: string;
  day?: string;
  start_time?: string;
  end_time?: string;
}

export type DayOfWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch timetable blocks");
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message);

  const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const grouped: Record<DayOfWeek, TemplateBlock[]> = {
    Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: []
  };

  (json.data || []).forEach((row: any) => {
    const timeStr = `${row.start_time.slice(0, 5)} - ${row.end_time.slice(0, 5)}`;
    (row.day_of_week || []).forEach((d: number) => {
      const dayName = dayMap[d] as DayOfWeek;
      if (grouped[dayName]) {
        grouped[dayName].push({
          id: row.id,
          time: timeStr,
          title: row.title,
          day: dayName,
          start_time: row.start_time,
          end_time: row.end_time
        });
      }
    });
  });

  // Sort each day chronologically
  Object.keys(grouped).forEach(day => {
    grouped[day as DayOfWeek].sort((a, b) => (a.start_time || '').localeCompare(b.start_time || ''));
  });

  return grouped;
};

export function useTimetableTemplate() {
  const { data, error, isLoading, mutate } = useSWR<Record<DayOfWeek, TemplateBlock[]>>(
    "/api/v1/timetable",
    fetcher,
    { revalidateOnFocus: true }
  );

  const templates = data || {
    Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: []
  };

  const addBlock = async (day: DayOfWeek, block: Omit<TemplateBlock, "id">) => {
    const currentList = templates[day] || [];
    const res = await fetch("/api/v1/timetable", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...block, day, order_index: currentList.length }),
    });
    if (res.ok) mutate();
  };

  const editBlock = async (day: DayOfWeek, id: string, updates: Partial<TemplateBlock>) => {
    const res = await fetch("/api/v1/timetable", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updates }),
    });
    if (res.ok) mutate();
  };

  const deleteBlock = async (day: DayOfWeek, id: string) => {
    const res = await fetch(`/api/v1/timetable?id=${id}`, {
      method: "DELETE",
    });
    if (res.ok) mutate();
  };

  const reorderBlocks = async (day: DayOfWeek, newOrder: TemplateBlock[]) => {
    // In a real app we'd send a bulk update.
    // For now, we'll just optimistically update local state.
    mutate({ ...templates, [day]: newOrder }, false);
    
    // We could dispatch PATCH requests for all items to update order_index
    Promise.all(newOrder.map((b, idx) => 
      fetch("/api/v1/timetable", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: b.id, order_index: idx }),
      })
    )).then(() => mutate());
  };

  return {
    templates,
    isLoading: isLoading && !data,
    addBlock,
    editBlock,
    deleteBlock,
    reorderBlocks,
  };
}
