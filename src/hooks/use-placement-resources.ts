"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import { PlacementResource } from "@/types/placement";

const fetcher = async (url: string): Promise<PlacementResource[]> => {
  const res = await fetch(url);
  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.error?.message || "Failed to fetch placement resources");
  }
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || "API returned failure");
  return json.data;
};

export function usePlacementResources() {
  const { data, isLoading, mutate } = useSWR<PlacementResource[]>(
    "/api/v1/resources?module=PLACEMENT",
    fetcher,
    { revalidateOnFocus: true, dedupingInterval: 5_000 }
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [activeType, setActiveType] = useState("ALL");
  const [activePriority, setActivePriority] = useState("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const resources = data || [];

  const categories = useMemo(() => {
    const cats = Array.from(new Set(resources.map((r) => r.category)));
    return ["ALL", ...cats];
  }, [resources]);

  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = res.title.toLowerCase().includes(q);
        const matchesMeta = (res.metadata || "").toLowerCase().includes(q);
        const matchesTag = res.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesMeta && !matchesTag) return false;
      }

      if (activeCategory !== "ALL" && res.category !== activeCategory) {
        return false;
      }

      if (activePriority !== "ALL" && res.priority !== activePriority) {
        return false;
      }

      return true;
    });
  }, [resources, searchQuery, activeCategory, activePriority]);

  const addResource = async (newRes: any) => {
    try {
      const res = await fetch("/api/v1/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: "PLACEMENT", ...newRes }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        console.error("[usePlacementResources] addResource failed:", json.error);
        throw new Error(json.error?.message || "Failed to add placement resource");
      }
      await mutate();
    } catch (err) {
      console.error("[usePlacementResources] error adding placement resource:", err);
      throw err;
    }
  };

  const deleteResource = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/resources/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) {
        console.error("[usePlacementResources] deleteResource failed:", json.error);
        throw new Error(json.error?.message || "Failed to delete placement resource");
      }
      await mutate();
    } catch (err) {
      console.error("[usePlacementResources] error deleting placement resource:", err);
      throw err;
    }
  };

  return {
    resources,
    filteredResources,
    categories,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    activeType,
    setActiveType,
    activePriority,
    setActivePriority,
    addResource,
    deleteResource,
    isAddModalOpen,
    setIsAddModalOpen,
    isLoading: isLoading && !data,
  };
}
