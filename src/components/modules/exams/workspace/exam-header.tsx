"use client";

import React from "react";
import { Award, Calendar, CheckCircle2, Globe } from "lucide-react";
import { ExamMaster } from "@/types/exams";

interface ExamHeaderProps {
  exam: ExamMaster;
}

export function ExamHeader({ exam }: ExamHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 p-4 rounded-2xl bg-[#10131E] border border-white/[0.08] shadow-sm">
      <div className="flex items-start sm:items-center gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
          <Award className="w-6 h-6" />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-none">
              {exam.name}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10px] font-bold uppercase tracking-wider">
              {exam.category}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-2">
            <span>{exam.conducting_body}</span>
            {exam.official_website && (
              <>
                <span>•</span>
                <a
                  href={exam.official_website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:underline flex items-center gap-1"
                >
                  <Globe className="w-3 h-3" />
                  <span>Official Website</span>
                </a>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Progress Telemetry */}
      <div className="flex items-center gap-4 border-t md:border-t-0 border-white/[0.06] pt-3 md:pt-0 shrink-0">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Preparation</span>
            <span className="text-sm font-extrabold text-purple-300">{exam.prep_progress}%</span>
          </div>
          <div className="w-32 sm:w-40 h-2 rounded-full bg-[#181D2B] overflow-hidden mt-1">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
              style={{ width: `${exam.prep_progress}%` }}
            />
          </div>
        </div>

        {exam.last_updated && (
          <div className="hidden sm:flex flex-col text-right pl-3 border-l border-white/[0.08]">
            <span className="text-[10px] text-slate-500 font-semibold uppercase">Last Sync</span>
            <span className="text-xs text-slate-300 font-bold mt-0.5">{exam.last_updated}</span>
          </div>
        )}
      </div>
    </div>
  );
}
