"use client";

import useSWR from "swr";
import {
  YouTubeChannelProfile,
  VaultAsset,
  YouTubeResource,
  YouTubeNote,
} from "@/types/youtube";
import { YouTubeVideoTask } from "@/repositories/youtube.repository";

interface YouTubeModuleData {
  profile: YouTubeChannelProfile;
  tasks?: YouTubeVideoTask[];
  vaultAssets: VaultAsset[];
  resources: YouTubeResource[];
  notes: YouTubeNote[];
}

const fetcher = async (url: string): Promise<YouTubeModuleData> => {
  const res = await fetch(url);
  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.error?.message || "Failed to fetch YouTube data");
  }
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || "API returned failure");
  return json.data;
};

export function useYouTubeModule() {
  const { data, error, isLoading, mutate } = useSWR<YouTubeModuleData>(
    "/api/v1/youtube",
    fetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 5_000,
    }
  );

  const tasks = data?.tasks || [];
  const profile = data?.profile || null;

  const saveProfile = async (input: Partial<YouTubeChannelProfile>) => {
    const updated: YouTubeChannelProfile = {
      id: profile?.id || crypto.randomUUID(),
      name: input.name || input.channel_name || profile?.name || "New Creator",
      channel_name: input.channel_name || input.name || profile?.channel_name || "New Creator",
      handle: input.handle || input.channel_handle || profile?.handle || "@creator",
      channel_handle: input.channel_handle || input.handle || profile?.channel_handle || "@creator",
      channel_url: input.channel_url || profile?.channel_url || "https://youtube.com",
      category: input.category || input.niche || profile?.category || "Tech",
      niche: input.niche || input.category || profile?.niche || "Tech",
      subscribers: input.subscribers || profile?.subscribers || "0",
      total_videos: input.total_videos || profile?.total_videos || 0,
      description: input.description || profile?.description || "",
      upload_frequency: input.upload_frequency || profile?.upload_frequency || "Weekly",
      content_focus_tags: input.content_focus_tags || profile?.content_focus_tags || ["Tech"],
    };

    try {
      const res = await fetch("/api/v1/youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save_profile", profile: updated }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        console.error("[useYouTubeModule] saveProfile failed:", json.error);
        throw new Error(json.error?.message || "Failed to save channel profile");
      }
      await mutate();
    } catch (err) {
      console.error("[useYouTubeModule] error saving channel profile:", err);
      throw err;
    }
  };

  const createVideoTask = async (title: string, category: string) => {
    try {
      const res = await fetch("/api/v1/youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create_task", title, category }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        console.error("[useYouTubeModule] createVideoTask failed:", json.error);
        throw new Error(json.error?.message || "Failed to create video task");
      }
      await mutate();
    } catch (err) {
      console.error("[useYouTubeModule] error creating video task:", err);
      throw err;
    }
  };

  const updateVideoTaskStage = async (id: string, updates: Partial<YouTubeVideoTask>) => {
    try {
      const res = await fetch("/api/v1/youtube", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        console.error("[useYouTubeModule] updateVideoTaskStage failed:", json.error);
        throw new Error(json.error?.message || "Failed to update video task stage");
      }
      await mutate();
    } catch (err) {
      console.error("[useYouTubeModule] error updating video task stage:", err);
      throw err;
    }
  };

  const deleteVideoTask = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/youtube?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) {
        console.error("[useYouTubeModule] deleteVideoTask failed:", json.error);
        throw new Error(json.error?.message || "Failed to delete video task");
      }
      await mutate();
    } catch (err) {
      console.error("[useYouTubeModule] error deleting video task:", err);
      throw err;
    }
  };

  const addVaultAsset = async (assetData: any) => {
    try {
      const payload = {
        module: "YOUTUBE",
        exam_id: undefined, // Must be undefined to avoid foreign key errors
        title: assetData.name,
        url: assetData.url || "#",
        type: "website", // Hardcoded to bypass DB constraint
        category: "VAULT_ASSET", // Hardcoded to partition vault assets
        metadata: JSON.stringify({
          realCategory: assetData.category || "Uncategorized",
          realType: assetData.type || "image",
          size: assetData.size || "Unknown Size",
        }),
        priority: assetData.is_favorite ? "HIGH" : "MEDIUM",
        tags: [assetData.category || "Uncategorized"],
      };

      const res = await fetch("/api/v1/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to create vault asset");
      }
      await mutate();
    } catch (err) {
      console.error("[useYouTubeModule] error creating vault asset:", err);
      throw err;
    }
  };

  const deleteVaultAsset = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/resources/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to delete vault asset");
      }
      await mutate();
    } catch (err) {
      console.error("[useYouTubeModule] error deleting vault asset:", err);
      throw err;
    }
  };

  const toggleVaultAssetFavorite = async (id: string, isCurrentlyFavorite: boolean) => {
    try {
      const newPriority = isCurrentlyFavorite ? "MEDIUM" : "HIGH";
      const res = await fetch(`/api/v1/resources`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, priority: newPriority }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to update vault asset");
      }
      await mutate();
    } catch (err) {
      console.error("[useYouTubeModule] error toggling vault asset favorite:", err);
      throw err;
    }
  };

  return {
    profile,
    tasks,
    vaultAssets: data?.vaultAssets || [],
    resources: data?.resources || [],
    notes: data?.notes || [],
    saveProfile,
    createVideoTask,
    updateVideoTaskStage,
    deleteVideoTask,
    addVaultAsset,
    deleteVaultAsset,
    toggleVaultAssetFavorite,
    isLoading: isLoading && !data,
    error,
    refresh: () => mutate(),
  };
}
