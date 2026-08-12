"use client";

import React from "react";
import { Link2, BarChart2 } from "lucide-react";
import { PlacementTabId } from "@/types/placement";

interface PlacementTabsNavProps {
  activeTab: PlacementTabId;
  onTabChange: (tab: PlacementTabId) => void;
}

export function PlacementTabsNav({ activeTab, onTabChange }: PlacementTabsNavProps) {
  const tabs = [
    { id: "resources" as PlacementTabId, label: "Resources & Links", icon: Link2 },
    { id: "tracker" as PlacementTabId, label: "Tracker", icon: BarChart2 },
  ];

  return (
    <div className="w-full border-b border-white/[0.08] mb-4">
      <div className="flex items-center justify-center gap-8 max-w-md mx-auto">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onTabChange(t.id)}
              className={`flex items-center gap-2 py-2.5 text-xs font-bold transition-all relative cursor-pointer ${
                isActive ? "text-purple-300" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-purple-400" : "text-slate-400"}`} />
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
