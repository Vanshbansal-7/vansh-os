"use client";

import { useState, useMemo, useCallback } from "react";
import useSWR from "swr";
import { PlacementSubject, PlacementMilestone } from "@/types/placement";

const fetcher = async (url: string): Promise<PlacementSubject[]> => {
  const res = await fetch(url);
  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.error?.message || "Failed to fetch placement tracker subjects from database");
  }
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || "Database query failed");
  return json.data;
};

export function usePlacementTracker() {
  const { data, isLoading, error: swrError, mutate } = useSWR<PlacementSubject[]>(
    "/api/v1/tracker/subjects?module=PLACEMENT",
    fetcher,
    { revalidateOnFocus: true, dedupingInterval: 5_000 }
  );

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [isAddingSubject, setIsAddingSubject] = useState(false);

  const subjects = useMemo(() => {
    return (data || []).map((s: any) => {
      const topicList = (s.topics || []).map((t: any) => ({
        ...t,
        title: t.title || t.name || "Untitled Topic",
      }));

      let completedMilestones = 0;
      topicList.forEach((t: any) => {
        if (t.is_learned) completedMilestones++;
        if (t.is_practiced) completedMilestones++;
        if (t.is_revised) completedMilestones++;
        if (t.is_mastered) completedMilestones++;
      });

      const totalPossible = topicList.length * 4;
      const progress = totalPossible > 0 ? Math.round((completedMilestones / totalPossible) * 100) : 0;

      return {
        ...s,
        title: s.title || s.name || "Untitled Subject",
        topics: topicList,
        completedMilestones,
        totalPossibleMilestones: totalPossible,
        progress,
      };
    });
  }, [data]);

  // Computed total statistics across all placement subjects
  const stats = useMemo(() => {
    let totalTopics = 0;
    let totalCompletedMilestones = 0;

    subjects.forEach((subj: any) => {
      totalTopics += subj.topics?.length || 0;
      totalCompletedMilestones += subj.completedMilestones || 0;
    });

    const totalPossibleMilestones = totalTopics * 4;
    const progress = totalPossibleMilestones > 0 ? Math.round((totalCompletedMilestones / totalPossibleMilestones) * 100) : 0;
    return { totalTopics, completedTopics: totalCompletedMilestones, progress };
  }, [subjects]);

  const selectedSubject = useMemo(() => {
    return subjects.find((s: any) => s.id === selectedSubjectId) || subjects[0] || null;
  }, [subjects, selectedSubjectId]);

  const handleToggleMilestone = useCallback(
    async (subjectId: string, topicId: string, milestone: PlacementMilestone) => {
      const targetSubj = subjects.find((s: any) => s.id === subjectId);
      const targetTopic = targetSubj?.topics?.find((t: any) => t.id === topicId);
      const currentValue = targetTopic ? targetTopic[milestone] : false;
      const newValue = !currentValue;

      const res = await fetch("/api/v1/tracker/topics", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic_id: topicId, milestone, value: newValue }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message || "Failed to update topic milestone in database");
      }
      await mutate();
    },
    [subjects, mutate]
  );

  const addSubject = async (name: string, description?: string) => {
    const res = await fetch("/api/v1/tracker/subjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ module: "PLACEMENT", name, description }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json?.error?.message || "Database insert failed for subject");
    }
    await mutate();
    if (json.data?.id) setSelectedSubjectId(json.data.id);
  };

  const renameSubject = async (id: string, newTitle: string) => {
    const res = await fetch("/api/v1/tracker/subjects", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name: newTitle }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json?.error?.message || "Database update failed for subject");
    }
    await mutate();
  };

  const deleteSubject = async (id: string) => {
    const res = await fetch(`/api/v1/tracker/subjects?id=${id}`, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json?.error?.message || "Database delete failed for subject");
    }
    await mutate();
  };

  const addTopic = async (subjectId: string, name: string) => {
    const res = await fetch("/api/v1/tracker/topics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject_id: subjectId, name }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json?.error?.message || "Database insert failed for topic");
    }
    await mutate();
  };

  const deleteTopic = async (subjectId: string, topicId: string) => {
    const res = await fetch(`/api/v1/tracker/topics?id=${topicId}`, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json?.error?.message || "Database delete failed for topic");
    }
    await mutate();
  };

  const renameTopic = async (subjectId: string, topicId: string, newTitle: string) => {
    const res = await fetch("/api/v1/tracker/topics", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic_id: topicId, name: newTitle }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json?.error?.message || "Database update failed for topic");
    }
    await mutate();
  };

  return {
    subjects,
    selectedSubjectId,
    selectedSubject,
    setSelectedSubjectId,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    toggleMilestone: handleToggleMilestone,
    addSubject,
    deleteSubject,
    renameSubject,
    addTopic,
    deleteTopic,
    renameTopic,
    isAddingSubject,
    setIsAddingSubject,
    isLoading: isLoading && !data,
    swrError,
    stats,
  };
}
