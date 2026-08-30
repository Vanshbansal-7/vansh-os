"use client";

import React from "react";
import { PlacementSubject } from "@/types/placement";

interface ProgressSummaryProps {
  overallPercentage: number;
  totalTopics: number;
  completedTopics: number;
  subjects: PlacementSubject[];
  selectedSubjectId: string;
  onSelectSubject: (id: string) => void;
}

export function ProgressSummary({
  overallPercentage,
  totalTopics,
  completedTopics,
  subjects,
  selectedSubjectId,
  onSelectSubject,
}: ProgressSummaryProps) {
  return (
    <div className="flex flex-col gap-3 p-4 rounded-2xl bg-[#10131E] border border-white/[0.08] shadow-sm mb-4">
      {/* Top Header: Title + Overall % & Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-bold text-white tracking-tight">
            Overall Tracker Progress
          </h2>
          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-extrabold">
            {overallPercentage}%
          </span>
        </div>
      </div>

      {/* Main Full-width Progress Bar */}
      <div className="w-full h-2 rounded-full bg-[#181D2B] overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-sky-400 transition-all duration-500"
          style={{ width: `${overallPercentage}%` }}
        />
      </div>

      {/* Horizontal Subject Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-0.5 no-scrollbar">
        {subjects.map((sub) => {
          const isSelected = sub.id === selectedSubjectId;
          return (
            <button
              key={sub.id}
              onClick={() => onSelectSubject(sub.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                isSelected
                  ? "bg-purple-600/20 border-purple-500/50 text-white shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                  : "bg-[#151828] border-white/[0.06] hover:border-white/[0.14] text-slate-300 hover:text-white"
              }`}
            >
              <span>{sub.title}</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                  sub.progress === 100
                    ? "bg-emerald-500/20 text-emerald-300"
                    : sub.progress > 0
                    ? "bg-purple-500/20 text-purple-300"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {sub.progress}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
