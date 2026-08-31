"use client";

import React, { useState } from "react";
import { PlacementTabId } from "@/types/placement";
import { PlacementTopBar } from "@/components/modules/placement/placement-top-bar";
import { PlacementHeader } from "@/components/modules/placement/placement-header";
import { PlacementTabsNav } from "@/components/modules/placement/placement-tabs-nav";
import { TrackerTab } from "@/components/modules/placement/tabs/tracker-tab";
import { ResourcesTab } from "@/components/modules/placement/tabs/resources-tab";

export default function PlacementModulePage() {
  const [activeTab, setActiveTab] = useState<PlacementTabId>("tracker");
  const [searchQuery, setSearchQuery] = useState("");

  const getSearchPlaceholder = () => {
    switch (activeTab) {
      case "resources":
        return "Search in Resources...";
      case "tracker":
        return "Search in Placement Tracker...";
      default:
        return "Search in Placement...";
    }
  };

  return (
    <div className="flex flex-col w-full pb-12">
      {/* 1. Top Bar */}
      <PlacementTopBar
        searchPlaceholder={getSearchPlaceholder()}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 2. Header */}
      <PlacementHeader />

      {/* 3. Navigation Tabs (Resources & Links, Tracker - default: Tracker) */}
      <PlacementTabsNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 4. Tab Content Area */}
      <div className="w-full mt-1">
        {activeTab === "tracker" && (
          <React.Suspense fallback={<div className="p-8 text-center text-slate-500 text-xs">Loading tracker...</div>}>
            <TrackerTab />
          </React.Suspense>
        )}
        {activeTab === "resources" && <ResourcesTab />}
      </div>
    </div>
  );
}
