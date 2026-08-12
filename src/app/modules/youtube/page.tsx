"use client";

import React, { useState } from "react";
import { YouTubeTabId } from "@/types/youtube";
import { useYouTubeModule } from "@/hooks/use-youtube-module";
import { YouTubeHeader } from "@/components/modules/youtube/youtube-header";
import { YouTubeTabs } from "@/components/modules/youtube/youtube-tabs";
import { OverviewTab } from "@/components/modules/youtube/tabs/overview-tab";
import { VaultTab } from "@/components/modules/youtube/tabs/vault-tab";
import { ResourcesTab } from "@/components/modules/exams/tabs/resources-tab";
import { NotesTab } from "@/components/modules/exams/tabs/notes-tab";
import { TrackerTab } from "@/components/modules/youtube/tabs/tracker-tab";

export default function YouTubeModulePage() {
  const { profile, vaultAssets, resources, notes, isLoading } = useYouTubeModule();
  const [activeTab, setActiveTab] = useState<YouTubeTabId>("overview");
  const [searchQuery, setSearchQuery] = useState("");

  const getSearchPlaceholder = () => {
    switch (activeTab) {
      case "vault":
        return "Search in Content Vault...";
      case "resources":
        return "Search in Resources...";
      case "notes":
        return "Search in Notes & Scripts...";
      case "tracker":
        return "Search in Production Pipeline...";
      default:
        return "Search in YouTube...";
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 w-full p-6 animate-pulse">
        <div className="h-10 bg-[#10131E] rounded-xl w-48" />
        <div className="h-48 bg-[#10131E] rounded-2xl w-full" />
        <div className="h-64 bg-[#10131E] rounded-2xl w-full" />
      </div>
    );
  }


  return (
    <div className="flex flex-col w-full pb-16 min-h-screen">
      {/* 1. Top Header Bar */}
      <YouTubeHeader
        searchPlaceholder={getSearchPlaceholder()}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 2. 5 Tabs Switcher */}
      <YouTubeTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 3. Active Tab Content Workspace */}
      <div className="w-full mt-1">
        {activeTab === "overview" && <OverviewTab profile={profile} />}
        {activeTab === "vault" && <VaultTab assets={vaultAssets} />}
        {activeTab === "resources" && <ResourcesTab examSlug="youtube" />}
        {activeTab === "notes" && <NotesTab examSlug="youtube" />}
        {activeTab === "tracker" && <TrackerTab />}
      </div>
    </div>
  );
}
