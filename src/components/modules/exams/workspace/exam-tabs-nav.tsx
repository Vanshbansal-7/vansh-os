"use client";

import React from "react";
import { BookOpen, Link2, FileText, BarChart2 } from "lucide-react";
import { ExamTabId } from "@/types/exams";

interface ExamTabsNavProps {
  activeTab: ExamTabId;
  onTabChange: (tab: ExamTabId) => void;
}

export function ExamTabsNav({ activeTab, onTabChange }: ExamTabsNavProps) {
  const tabs = [
    { id: "overview" as ExamTabId, label: "Overview", icon: BookOpen },
    { id: "resources" as ExamTabId, label: "Resources & Links", icon: Link2 },
    { id: "notes" as ExamTabId, label: "Notes", icon: FileText },
    { id: "tracker" as ExamTabId, label: "Tracker", icon: BarChart2 },
  ];

  return (
    <div className="w-full border-b border-white/[0.08] mb-4">
      <div className="flex items-center justify-center gap-4 sm:gap-8 max-w-xl mx-auto">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onTabChange(t.id)}
              className={`flex items-center gap-2 py-2.5 text-xs sm:text-sm font-bold transition-all relative cursor-pointer ${
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
