"use client";

import React from "react";
import { Monitor, Archive, Link2, FileText, BarChart2 } from "lucide-react";
import { YouTubeTabId } from "@/types/youtube";

interface YouTubeTabsProps {
  activeTab: YouTubeTabId;
  onTabChange: (tab: YouTubeTabId) => void;
}

export function YouTubeTabs({ activeTab, onTabChange }: YouTubeTabsProps) {
  const tabs = [
    { id: "overview" as YouTubeTabId, label: "Overview", icon: Monitor },
    { id: "vault" as YouTubeTabId, label: "Content Vault", icon: Archive },
    { id: "resources" as YouTubeTabId, label: "Resources", icon: Link2 },
    { id: "notes" as YouTubeTabId, label: "Notes", icon: FileText },
    { id: "tracker" as YouTubeTabId, label: "Tracker", icon: BarChart2 },
  ];

  return (
    <div className="w-full border-b border-white/[0.08] mb-4">
      <div className="flex items-center justify-center gap-4 sm:gap-8 max-w-2xl mx-auto overflow-x-auto no-scrollbar">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onTabChange(t.id)}
              className={`flex items-center gap-2 py-2.5 text-xs sm:text-sm font-bold transition-all relative shrink-0 cursor-pointer ${
                isActive ? "text-purple-300" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-purple-400" : "text-slate-400"}`} />
              <span>{t.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
