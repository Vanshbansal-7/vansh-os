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
    <div className="w-full mb-6 mt-2 flex justify-center">
      <div className="flex items-center p-1 bg-[#10131E] border border-white/[0.08] rounded-2xl shadow-sm overflow-x-auto no-scrollbar w-full sm:w-auto">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onTabChange(t.id)}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 relative cursor-pointer whitespace-nowrap shrink-0 ${
                isActive 
                  ? "text-white bg-purple-600 shadow-[0_4px_16px_-4px_rgba(147,51,234,0.5)]" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? "text-purple-100" : "text-slate-400"}`} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
