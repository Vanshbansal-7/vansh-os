"use client";

import useSWR from "swr";
import { useCallback } from "react";

export interface TemplateBlock {
  id: string;
  time: string; // e.g. "09:00 - 11:00"
  title: string;
  day?: string;
  order_index?: number;
}

export type DayOfWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch timetable blocks");
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message);

  // Group by day
  const grouped: Record<DayOfWeek, TemplateBlock[]> = {
    Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: []
  };

  (json.data || []).forEach((block: any) => {
    if (block.day && grouped[block.day as DayOfWeek]) {
      grouped[block.day as DayOfWeek].push({
        id: block.id,
        time: block.time,
        title: block.title,
        day: block.day,
        order_index: block.order_index,
      });
    }
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
