"use client";

import useSWR from "swr";
import { ExamMaster, ExamOverviewData } from "@/types/exams";

interface WorkspaceData {
  exam: ExamMaster | null;
  overview: ExamOverviewData | null;
}

const fetcher = async (url: string): Promise<WorkspaceData> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch exam workspace");
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message);
  return json.data;
};

export function useExamModule(slug: string) {
  const { data, error, isLoading, mutate } = useSWR<WorkspaceData>(
    `/api/v1/exams/${slug}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60 * 1000,
    }
  );

  return {
    exam: data?.exam || null,
    overview: data?.overview || null,
    isLoading: isLoading && !data,
    error,
    refresh: () => mutate(),
  };
}
