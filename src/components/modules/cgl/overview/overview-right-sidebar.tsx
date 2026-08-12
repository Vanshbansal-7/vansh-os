"use client";

import React from "react";
import {
  Check,
  Crown,
  Globe,
  ExternalLink,
  Info,
} from "lucide-react";

export function OverviewRightSidebar() {
  const examPatternRows = [
    { tier: "Tier I", subjects: "4 Subjects", marks: "200", duration: "60 Min" },
    { tier: "Tier II", subjects: "4 Papers", marks: "800", duration: "2 Hr 15 Min" },
    { tier: "Tier III", subjects: "Descriptive Paper", marks: "100", duration: "60 Min" },
    { tier: "DV", subjects: "Document Verification", marks: "-", duration: "-" },
  ];

  const strategyItems = [
    "Understand the complete syllabus and exam pattern.",
    "Create a realistic study plan and follow it consistently.",
    "Focus on concepts, practice daily and solve PYQs.",
    "Take regular mock tests and analyze performance.",
    "Revise multiple times and strengthen weak areas.",
  ];

  return (
    <aside className="w-full lg:w-[280px] xl:w-[300px] shrink-0 flex flex-col gap-3.5 select-none">
      {/* 1. Exam Pattern Card */}
      <div className="rounded-2xl p-4 bg-[#10131E] border border-white/[0.08] shadow-sm flex flex-col gap-3">
        <h3 className="text-xs font-bold text-white tracking-tight">Exam Pattern</h3>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#0E101A]">
          <div className="grid grid-cols-4 px-2.5 py-1.5 bg-[#141828] text-[9.5px] font-bold text-slate-400 border-b border-white/[0.06]">
            <span>Tier</span>
            <span>Subjects</span>
            <span className="text-center">Marks</span>
            <span className="text-right">Duration</span>
          </div>

          <div className="flex flex-col divide-y divide-white/[0.04] text-[10px]">
            {examPatternRows.map((row, idx) => (
              <div key={idx} className="grid grid-cols-4 px-2.5 py-1.5 text-slate-300">
                <span className="font-bold text-purple-300">{row.tier}</span>
                <span className="truncate text-slate-400">{row.subjects}</span>
                <span className="text-center font-semibold text-white">{row.marks}</span>
                <span className="text-right text-slate-400 font-mono text-[9px]">
                  {row.duration}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Negative Marking & Mode */}
        <div className="flex items-center justify-between pt-1 text-[10.5px]">
          <div className="flex items-center gap-1 text-slate-400">
            <Info className="w-3 h-3 text-slate-500" />
            <span>Negative Marking:</span>
            <span className="font-bold text-rose-400">0.50 Marks</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-slate-400">Mode:</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-bold text-[9.5px] border border-emerald-500/25">
              Online
            </span>
          </div>
        </div>
      </div>

      {/* 2. Preparation Strategy Card */}
      <div className="rounded-2xl p-4 bg-[#10131E] border border-white/[0.08] shadow-sm flex flex-col gap-3">
        <h3 className="text-xs font-bold text-white tracking-tight">
          Preparation Strategy
        </h3>

        <div className="flex flex-col gap-2">
          {strategyItems.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 text-[10.5px] text-slate-300 leading-snug">
              <div className="w-4 h-4 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span>{item}</span>
            </div>
          ))}
        </div>

        {/* Crown Badge */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 mt-1">
          <Crown className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-[10.5px] font-bold">
            Consistency today, Selection tomorrow.
          </span>
        </div>
      </div>

      {/* 3. Official Website Card */}
      <div className="rounded-2xl p-4 bg-[#10131E] border border-white/[0.08] shadow-sm flex flex-col gap-2.5">
        <h3 className="text-xs font-bold text-white tracking-tight">Official Website</h3>
        <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#141828] border border-white/[0.06]">
          <div className="flex items-center gap-2 min-w-0">
            <Globe className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="text-xs font-medium text-slate-300 truncate">
              https://ssc.nic.in
            </span>
          </div>
          <a
            href="https://ssc.nic.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 text-[10.5px] font-semibold transition-all shrink-0 cursor-pointer"
          >
            <span>Visit</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </aside>
  );
}
