"use client";

import useSWR from "swr";
import { ExamMaster, ExamApplication } from "@/types/exams";

interface LauncherData {
  exams: ExamMaster[];
  applications: ExamApplication[];
}

const fetcher = async (url: string): Promise<LauncherData> => {
  const res = await fetch(url);
  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.error?.message || "Failed to fetch exams");
  }
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || "API returned failure");
  return json.data;
};

export function useExamsLauncher() {
  const { data, error, isLoading, mutate } = useSWR<LauncherData>(
    "/api/v1/exams",
    fetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 5_000,
    }
  );

  const exams = data?.exams || [];

  const createExam = async (input: Partial<ExamMaster>): Promise<ExamMaster> => {
    try {
      const res = await fetch("/api/v1/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        console.error("[useExamsLauncher] createExam failed:", json.error);
        throw new Error(json.error?.message || "Failed to register exam");
      }

      await mutate();
      return json.data;
    } catch (err) {
      console.error("[useExamsLauncher] error registering exam:", err);
      throw err;
    }
  };

  const deleteExam = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/exams/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) {
        console.error("[useExamsLauncher] deleteExam failed:", json.error);
        throw new Error(json.error?.message || "Failed to delete exam");
      }

      await mutate();
    } catch (err) {
      console.error("[useExamsLauncher] error deleting exam:", err);
      throw err;
    }
  };

  return {
    exams,
    applications: data?.applications || [],
    isLoading: isLoading && !data,
    error,
    createExam,
    deleteExam,
    setExams: (updater: (prev: ExamMaster[]) => ExamMaster[]) => mutate(),
    refresh: () => mutate(),
  };
}
