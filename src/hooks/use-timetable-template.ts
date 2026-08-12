"use client";

import { useState, useEffect, useCallback } from "react";

export interface TemplateBlock {
  id: string;
  time: string; // e.g. "09:00 - 11:00"
  title: string;
}

export type DayOfWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

const SEED_TEMPLATE: Record<DayOfWeek, TemplateBlock[]> = {
  Mon: [
    { id: "mon-1", time: "07:00 - 08:00", title: "Wake Up & Fresh" },
    { id: "mon-2", time: "08:00 - 09:30", title: "DSA – Graphs & DP" },
    { id: "mon-3", time: "09:30 - 10:00", title: "Break" },
    { id: "mon-4", time: "10:00 - 11:30", title: "Core Subjects – OS" },
    { id: "mon-5", time: "12:00 - 13:00", title: "Apply to 2 Companies" },
    { id: "mon-6", time: "13:00 - 14:00", title: "Lunch & Rest" },
    { id: "mon-7", time: "14:00 - 15:00", title: "SSC CGL – Quant Practice" },
    { id: "mon-8", time: "15:00 - 16:30", title: "DBMS Revision & Practice" },
    { id: "mon-9", time: "17:00 - 19:00", title: "Defense Prep – Navy" },
    { id: "mon-10", time: "19:00 - 20:00", title: "Football Training" },
    { id: "mon-11", time: "20:00 - 21:00", title: "Dinner & Family" },
    { id: "mon-12", time: "21:00 - 22:00", title: "Read + Journal" },
    { id: "mon-13", time: "22:00 - 22:30", title: "Plan Tomorrow" },
  ],
  Tue: [],
  Wed: [],
  Thu: [],
  Fri: [],
  Sat: [],
  Sun: [],
};

// Fill empty seed days with Monday's template for convenience
(["Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as DayOfWeek[]).forEach((day) => {
  SEED_TEMPLATE[day] = SEED_TEMPLATE.Mon.map(block => ({ ...block, id: `${day.toLowerCase()}-${block.id.split('-')[1]}` }));
});

export function useTimetableTemplate() {
  const [templates, setTemplates] = useState<Record<DayOfWeek, TemplateBlock[]>>({} as any);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("vos_timetable_templates");
    if (stored) {
      setTemplates(JSON.parse(stored));
    } else {
      setTemplates(SEED_TEMPLATE);
      localStorage.setItem("vos_timetable_templates", JSON.stringify(SEED_TEMPLATE));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("vos_timetable_templates", JSON.stringify(templates));
    }
  }, [templates, isLoaded]);

  const addBlock = useCallback((day: DayOfWeek, block: Omit<TemplateBlock, "id">) => {
    const newBlock: TemplateBlock = { ...block, id: crypto.randomUUID() };
    setTemplates((prev) => ({
      ...prev,
      [day]: [...(prev[day] || []), newBlock],
    }));
  }, []);

  const editBlock = useCallback((day: DayOfWeek, id: string, updates: Partial<TemplateBlock>) => {
    setTemplates((prev) => ({
      ...prev,
      [day]: prev[day].map((b) => (b.id === id ? { ...b, ...updates } : b)),
    }));
  }, []);

  const deleteBlock = useCallback((day: DayOfWeek, id: string) => {
    setTemplates((prev) => ({
      ...prev,
      [day]: prev[day].filter((b) => b.id !== id),
    }));
  }, []);

  const reorderBlocks = useCallback((day: DayOfWeek, newOrder: TemplateBlock[]) => {
    setTemplates((prev) => ({
      ...prev,
      [day]: newOrder,
    }));
  }, []);

  return {
    templates,
    isLoading: !isLoaded,
    addBlock,
    editBlock,
    deleteBlock,
    reorderBlocks,
  };
}
