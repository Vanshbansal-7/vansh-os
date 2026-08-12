"use client";

import React from "react";
import {
  Building2,
  Globe2,
  Calendar,
  GraduationCap,
  Users,
  Layers,
  FileText,
  ChevronDown,
  Info,
} from "lucide-react";
import { OverviewRightSidebar } from "../overview/overview-right-sidebar";

export function OverviewTab() {
  const examOverviewItems = [
    {
      label: "Conducting Body",
      value: "Staff Selection Commission (SSC)",
      icon: Building2,
      iconBg: "bg-purple-500/15 text-purple-400 border-purple-500/20",
    },
    {
      label: "Exam Level",
      value: "National Level",
      icon: Globe2,
      iconBg: "bg-sky-500/15 text-sky-400 border-sky-500/20",
    },
    {
      label: "Frequency",
      value: "Once a Year",
      icon: Calendar,
      iconBg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    },
    {
      label: "Eligibility",
      value: "Graduate from Recognized University",
      icon: GraduationCap,
      iconBg: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    },
    {
      label: "Age Limit",
      value: "18 – 32 Years",
      icon: Users,
      iconBg: "bg-rose-500/15 text-rose-400 border-rose-500/20",
      hasInfo: true,
    },
    {
      label: "Selection Process",
      value: "Tier I → Tier II → Tier III → DV",
      icon: Layers,
      iconBg: "bg-indigo-500/15 text-indigo-400 border-indigo-500/20",
      hasInfo: true,
    },
  ];

  const importantDates = [
    { label: "Notification Release", date: "02 Jun 2025", dotColor: "bg-purple-500" },
    { label: "Application Start", date: "03 Jun 2025", dotColor: "bg-sky-500" },
    { label: "Application Last Date", date: "24 Jun 2025", dateColor: "text-amber-400", dotColor: "bg-amber-500" },
    { label: "Tier I Exam", date: "13 Aug – 30 Aug 2025", dateColor: "text-emerald-400", dotColor: "bg-emerald-500" },
    { label: "Tier I Result", date: "Oct 2025 (Tentative)", dotColor: "bg-teal-500" },
    { label: "Tier II Exam", date: "Dec 2025 (Tentative)", dotColor: "bg-purple-500" },
    { label: "Final Result", date: "Mar 2026 (Tentative)", dotColor: "bg-emerald-500" },
  ];

  const syllabusProgress = [
    { name: "Quantitative Aptitude", topics: "25 Topics", progress: 72, color: "from-sky-400 to-blue-500" },
    { name: "Reasoning Ability", topics: "27 Topics", progress: 64, color: "from-purple-500 to-indigo-500" },
    { name: "English Language", topics: "18 Topics", progress: 58, color: "from-emerald-400 to-teal-500" },
    { name: "General Awareness", topics: "32 Topics", progress: 68, color: "from-amber-400 to-orange-500" },
    { name: "General Intelligence & Computer", topics: "12 Topics", progress: 75, color: "from-cyan-400 to-blue-500" },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-start w-full">
      {/* Center Main Workspace */}
      <div className="flex-1 flex flex-col gap-4 min-w-0 w-full">
        {/* Top 2 Cards Grid: Exam Overview & Important Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. Exam Overview Card */}
          <div className="rounded-2xl p-4 bg-[#10131E] border border-white/[0.08] shadow-sm flex flex-col gap-3">
            <h2 className="text-sm font-bold text-white tracking-tight">Exam Overview</h2>
            <div className="flex flex-col divide-y divide-white/[0.04]">
              {examOverviewItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 ${item.iconBg}`}
                      >
                        <Icon className="w-3 h-3" />
                      </div>
                      <span className="text-slate-400 font-medium truncate">
                        {item.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-right pl-2 shrink-0">
                      <span className="text-white font-semibold">{item.value}</span>
                      {item.hasInfo && (
                        <Info className="w-3 h-3 text-slate-500" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Important Dates Timeline Card */}
          <div className="rounded-2xl p-4 bg-[#10131E] border border-white/[0.08] shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white tracking-tight">
                Important Dates
              </h2>
              <span className="text-[10px] font-semibold text-slate-400">2025 – 26</span>
            </div>

            {/* Vertical Timeline */}
            <div className="relative flex flex-col gap-2 pl-2">
              {/* Connecting line */}
              <div className="absolute left-[9px] top-2 bottom-2 w-[1.5px] bg-white/[0.08]" />

              {importantDates.map((d, idx) => (
                <div key={idx} className="relative flex items-center justify-between pl-5 text-xs py-0.5">
                  {/* Dot */}
                  <div
                    className={`absolute left-[5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full ${d.dotColor} border-2 border-[#10131E] shadow-[0_0_6px_rgba(255,255,255,0.2)]`}
                  />
                  <span className="text-slate-300 font-medium">{d.label}</span>
                  <span
                    className={`font-semibold ${
                      d.dateColor || "text-slate-400"
                    } font-mono text-[11px]`}
                  >
                    {d.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Complete Syllabus Progress Card */}
        <div className="rounded-2xl p-4 bg-[#10131E] border border-white/[0.08] shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white tracking-tight">
              Complete Syllabus
            </h2>
            <span className="text-[10px] font-semibold text-slate-400">
              5 Sections • 114 Topics
            </span>
          </div>

          <div className="flex flex-col divide-y divide-white/[0.04]">
            {syllabusProgress.map((sec, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-2.5 hover:bg-white/[0.01] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
                  <span className="text-xs font-bold text-white tracking-tight truncate">
                    {sec.name}
                  </span>
                  <span className="text-[10.5px] text-slate-400 font-medium">
                    {sec.topics} | {sec.progress}%
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-24 sm:w-36 h-1.5 rounded-full bg-[#181D2B] overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${sec.color}`}
                      style={{ width: `${sec.progress}%` }}
                    />
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-white/[0.04] flex justify-end">
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              <span>View Detailed Syllabus</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Column Context Telemetry */}
      <OverviewRightSidebar />
    </div>
  );
}
