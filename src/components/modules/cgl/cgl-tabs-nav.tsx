"use client";

import React from "react";
import { LayoutDashboard, Link2, FileText, Activity } from "lucide-react";
import { CGLTabId } from "@/types/cgl";

interface CGLTabsNavProps {
  activeTab: CGLTabId;
  onTabChange: (tab: CGLTabId) => void;
}

export function CGLTabsNav({ activeTab, onTabChange }: CGLTabsNavProps) {
  const tabs: { id: CGLTabId; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "resources", label: "Resources & Links", icon: Link2 },
    { id: "notes", label: "Notes", icon: FileText },
    { id: "tracker", label: "Tracker", icon: Activity },
  ];

  return (
    <div className="flex items-center gap-2 border-b border-white/[0.08] mt-1 mb-4">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            type="button"
            className={`relative flex items-center gap-2 px-5 py-2.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
              isActive
                ? "text-white font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? "text-purple-400" : "text-slate-400"}`} />
            <span>{tab.label}</span>

            {/* Active Purple Underline Pill Indicator */}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-400 rounded-t-full shadow-[0_-2px_8px_rgba(168,85,247,0.6)]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
