"use client";

import { useState, useMemo, useCallback } from "react";
import useSWR from "swr";
import { PlacementSubject, PlacementMilestone, PlacementTopic, PlacementModuleGroup } from "@/types/placement";

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
    { revalidateOnFocus: true, dedupingInterval: 3_000 }
  );

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [selectedModuleName, setSelectedModuleName] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [isAddingSubject, setIsAddingSubject] = useState(false);

  const subjects = useMemo(() => {
    return (data || []).map((s: any) => {
      const rawTopics = (s.topics || []).map((t: any) => ({
        ...t,
        title: t.title || t.name || "Untitled Video",
        module_name: (t.description || t.module_name || "General").trim(),
      }));

      // Group topics by Module
      const moduleMap = new Map<string, PlacementTopic[]>();
      let fullyCompletedTopics = 0;
      let completedMilestones = 0;

      rawTopics.forEach((t: any) => {
        let currentMilestones = 0;
        if (t.is_learned) currentMilestones++;
        if (t.is_practiced) currentMilestones++;
        if (t.is_revised) currentMilestones++;
        if (t.is_mastered) currentMilestones++;

        completedMilestones += currentMilestones;
        if (currentMilestones === 4) fullyCompletedTopics++;

        const modName = t.module_name || "General";
        if (!moduleMap.has(modName)) {
          moduleMap.set(modName, []);
        }
        moduleMap.get(modName)!.push({
          ...t,
          completed_milestones: currentMilestones,
          total_milestones: 4,
          progress: Math.round((currentMilestones / 4) * 100),
        });
      });

      const modules: PlacementModuleGroup[] = Array.from(moduleMap.entries()).map(
        ([name, topicList]) => {
          let modCompleted = 0;
          topicList.forEach((tp) => {
            if (tp.completed_milestones === 4) modCompleted++;
          });
          const modTotal = topicList.length * 4;
          const modEarned = topicList.reduce((acc, tp) => acc + tp.completed_milestones, 0);
          return {
            name,
            topics: topicList,
            total_topics: topicList.length,
            completed_topics: modCompleted,
            progress: modTotal > 0 ? Math.round((modEarned / modTotal) * 100) : 0,
          };
        }
      );

      const totalPossible = rawTopics.length * 4;
      const progress = totalPossible > 0 ? Math.round((completedMilestones / totalPossible) * 100) : 0;

      return {
        ...s,
        title: s.title || s.name || "Untitled Subject",
        topics: rawTopics,
        modules,
        completedMilestones,
        fullyCompletedTopics,
        total_topics: rawTopics.length,
        completed_topics: fullyCompletedTopics,
        progress,
      };
    });
  }, [data]);

  // Computed total statistics across all placement subjects
  const stats = useMemo(() => {
    let totalTopics = 0;
    let totalCompletedTopics = 0;
    let totalCompletedMilestones = 0;

    subjects.forEach((subj: any) => {
      totalTopics += subj.topics?.length || 0;
      totalCompletedTopics += subj.fullyCompletedTopics || 0;
      totalCompletedMilestones += subj.completedMilestones || 0;
    });

    const totalPossibleMilestones = totalTopics * 4;
    const progress = totalPossibleMilestones > 0 ? Math.round((totalCompletedMilestones / totalPossibleMilestones) * 100) : 0;
    return { totalTopics, completedTopics: totalCompletedTopics, progress };
  }, [subjects]);

  const selectedSubject = useMemo(() => {
    return subjects.find((s: any) => s.id === selectedSubjectId) || subjects[0] || null;
  }, [subjects, selectedSubjectId]);

  const selectedModule = useMemo(() => {
    if (!selectedSubject || !selectedSubject.modules || selectedSubject.modules.length === 0) return null;
    if (selectedModuleName) {
      return selectedSubject.modules.find((m: PlacementModuleGroup) => m.name === selectedModuleName) || selectedSubject.modules[0];
    }
    return selectedSubject.modules[0];
  }, [selectedSubject, selectedModuleName]);

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

  const addTopic = async (subjectId: string, name: string, moduleName?: string) => {
    const res = await fetch("/api/v1/tracker/topics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject_id: subjectId, name, description: moduleName || selectedModuleName || "General" }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json?.error?.message || "Database insert failed for topic");
    }
    await mutate();
  };

  const addModule = async (subjectId: string, moduleName: string) => {
    // Create first topic in this new module
    await addTopic(subjectId, `1. Introduction to ${moduleName}`, moduleName);
    setSelectedModuleName(moduleName);
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

  const deleteModule = async (subjectId: string, moduleName: string) => {
    const targetSubj = subjects.find((s: any) => s.id === subjectId);
    const topicsInModule = (targetSubj?.topics || []).filter(
      (t: any) => (t.module_name || t.description) === moduleName
    );

    for (const t of topicsInModule) {
      await fetch(`/api/v1/tracker/topics?id=${t.id}`, { method: "DELETE" });
    }
    await mutate();
  };

  return {
    subjects,
    selectedSubjectId,
    selectedSubject,
    selectedModuleName,
    selectedModule,
    setSelectedSubjectId,
    setSelectedModuleName,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    toggleMilestone: handleToggleMilestone,
    addSubject,
    deleteSubject,
    renameSubject,
    addTopic,
    addModule,
    deleteModule,
    deleteTopic,
    renameTopic,
    isAddingSubject,
    setIsAddingSubject,
    isLoading: isLoading && !data,
    swrError,
    stats,
  };
}


