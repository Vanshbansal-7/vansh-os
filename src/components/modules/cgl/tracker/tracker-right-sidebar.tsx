"use client";

import React from "react";
import { CheckCircle2, RotateCcw, Upload, Check } from "lucide-react";
import { MotivationCard } from "../shared/motivation-card";
import { CGLSubject, CGLTrackerMetrics } from "@/types/cgl";

interface TrackerRightSidebarProps {
  subjects?: CGLSubject[];
  metrics?: CGLTrackerMetrics;
  onMarkAllLearned?: () => void;
  onMarkAllPracticed?: () => void;
  onResetProgress?: () => void;
}

export function TrackerRightSidebar({
  subjects = [],
  metrics,
  onMarkAllLearned,
  onMarkAllPracticed,
  onResetProgress,
}: TrackerRightSidebarProps) {
  // Compute subject progress dynamically from real subjects state
  const subjectsProgress = subjects.map((sub) => ({
    name: sub.title,
    progress: sub.progress || (sub.total_topics > 0 ? Math.round((sub.completed_topics / sub.total_topics) * 100) : 0),
    color: "from-purple-500 to-indigo-500",
  }));

  const overallProgress = metrics?.overall_progress ?? 0;

  const milestonesGuide = [
    {
      num: 1,
      title: "Learned",
      desc: "Concept understood",
      iconBg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    },
    {
      num: 2,
      title: "Practiced",
      desc: "Solved questions",
      iconBg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    },
    {
      num: 3,
      title: "Revised",
      desc: "Reviewed after some time",
      iconBg: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    },
    {
      num: 4,
      title: "Mastered",
      desc: "Confident & accurate",
      iconBg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    },
  ];

  return (
    <aside className="w-full lg:w-[280px] xl:w-[300px] shrink-0 flex flex-col gap-3.5 select-none">
      {/* 1. Subject Progress Card */}
      <div className="rounded-2xl p-4 bg-[#10131E] border border-white/[0.08] shadow-sm flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white tracking-tight">Subject Progress</h3>
          <span className="text-[10px] font-semibold text-purple-400">Tracker</span>
        </div>

        <div className="flex flex-col gap-2 mt-1">
          {subjectsProgress.length === 0 ? (
            <p className="text-[10.5px] text-slate-500 text-center py-2">No subjects yet</p>
          ) : (
            subjectsProgress.map((sub, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-[10.5px]">
                  <span className="text-slate-300 font-medium">{sub.name}</span>
                  <span className="font-bold text-white">{sub.progress}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#181D2B] overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${sub.color} transition-all duration-500`}
                    style={{ width: `${sub.progress}%` }}
                  />
                </div>
              </div>
            ))
          )}

          {/* Divider */}
          <div className="border-t border-white/[0.06] my-1" />

          {/* Overall Progress — real computed value */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-white">Overall Progress</span>
              <span className="text-emerald-400">{overallProgress}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#181D2B] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Milestone Guide Card */}
      <div className="rounded-2xl p-4 bg-[#10131E] border border-white/[0.08] shadow-sm flex flex-col gap-2.5">
        <h3 className="text-xs font-bold text-white tracking-tight">Milestone Guide</h3>

        <div className="flex flex-col gap-2 mt-1">
          {milestonesGuide.map((m) => (
            <div key={m.num} className="flex items-center gap-2.5">
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold shrink-0 ${m.iconBg}`}
              >
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-bold text-white leading-tight">
                  {m.num}. {m.title}
                </span>
                <span className="text-[9.5px] text-slate-400 font-medium">
                  {m.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Quick Actions Card */}
      <div className="rounded-2xl p-4 bg-[#10131E] border border-white/[0.08] shadow-sm flex flex-col gap-2">
        <h3 className="text-xs font-bold text-white tracking-tight mb-1">Quick Actions</h3>

        <button
          onClick={onMarkAllLearned}
          type="button"
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-emerald-300 text-xs font-semibold transition-all cursor-pointer"
        >
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>Mark All as Learned</span>
        </button>

        <button
          onClick={onMarkAllPracticed}
          type="button"
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/25 text-sky-300 text-xs font-semibold transition-all cursor-pointer"
        >
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>Mark All as Practiced</span>
        </button>

        <button
          onClick={onResetProgress}
          type="button"
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-300 text-xs font-semibold transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 shrink-0" />
          <span>Reset Progress</span>
        </button>

        <button
          type="button"
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5 shrink-0 text-slate-400" />
          <span>Import Progress</span>
        </button>
      </div>

      {/* 4. Motivation Card */}
      <MotivationCard />
    </aside>
  );
}
