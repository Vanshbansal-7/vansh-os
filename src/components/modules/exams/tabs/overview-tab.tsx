"use client";

import React, { useState } from "react";
import {
  BookOpen,
  UserCheck,
  Award,
  Calendar,
  DollarSign,
  TrendingUp,
  FileText,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Activity,
  Heart,
  CheckCircle,
} from "lucide-react";
import { ExamOverviewData } from "@/types/exams";

interface OverviewTabProps {
  overview: ExamOverviewData | null;
}

export function OverviewTab({ overview }: OverviewTabProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    pattern: true,
    selection: true,
    eligibility: true,
    salary: true,
    cutoffs: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  if (!overview) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs">
        No overview data available.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 w-full pb-16">
      {/* 1. Introduction Banner */}
      <div className="p-5 rounded-2xl bg-[#10131E] border border-white/[0.08] shadow-sm flex flex-col gap-2">
        <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-purple-400" />
          <span>Exam Introduction & Scope</span>
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed font-medium">
          {overview.introduction}
        </p>
      </div>

      {/* 2. Key Specs Quick Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-[#10131E] border border-white/[0.08] flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Notification Cycle</span>
          <span className="text-xs font-bold text-white mt-0.5">{overview.notification_cycle}</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#10131E] border border-white/[0.08] flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Age Criteria</span>
          <span className="text-xs font-bold text-purple-300 mt-0.5">{overview.eligibility_age}</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#10131E] border border-white/[0.08] flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Qualification</span>
          <span className="text-xs font-bold text-sky-300 mt-0.5">{overview.eligibility_qualification}</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#10131E] border border-white/[0.08] flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Starting Pay</span>
          <span className="text-xs font-bold text-emerald-300 mt-0.5">{overview.salary_pay_scale}</span>
        </div>
      </div>

      {/* 3. Selection Process Section */}
      {overview.selection_process && overview.selection_process.length > 0 && (
        <div className="rounded-2xl bg-[#10131E] border border-white/[0.08] overflow-hidden shadow-sm">
          <button
            onClick={() => toggleSection("selection")}
            className="w-full flex items-center justify-between p-4 bg-[#131625] text-left cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white">Selection Process & Stages</h3>
            </div>
            {openSections.selection ? (
              <ChevronDown className="w-4 h-4 text-purple-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {openSections.selection && (
            <div className="p-4 flex flex-col gap-3 bg-[#0E101A]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {overview.selection_process.map((stage, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#141726] border border-white/[0.06] flex flex-col gap-1.5"
                  >
                    <span className="px-2 py-0.5 rounded bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[9.5px] font-extrabold w-fit uppercase">
                      {stage.stage}
                    </span>
                    <h4 className="text-xs font-bold text-white mt-1">{stage.title}</h4>
                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                      {stage.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Exam Pattern & Marks Breakdown */}
      {overview.exam_pattern && overview.exam_pattern.length > 0 && (
        <div className="rounded-2xl bg-[#10131E] border border-white/[0.08] overflow-hidden shadow-sm">
          <button
            onClick={() => toggleSection("pattern")}
            className="w-full flex items-center justify-between p-4 bg-[#131625] text-left cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white">Exam Pattern & Marks Structure</h3>
            </div>
            {openSections.pattern ? (
              <ChevronDown className="w-4 h-4 text-purple-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {openSections.pattern && (
            <div className="p-4 bg-[#0E101A]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/[0.08] text-slate-400 font-bold text-[11px]">
                      <th className="pb-2.5">Subject / Section</th>
                      <th className="pb-2.5 text-center">No. of Questions</th>
                      <th className="pb-2.5 text-center">Total Marks</th>
                      <th className="pb-2.5 text-right">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {overview.exam_pattern.map((pat, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02]">
                        <td className="py-2.5 font-bold text-white">{pat.subject}</td>
                        <td className="py-2.5 text-center text-slate-300">{pat.questions || "--"}</td>
                        <td className="py-2.5 text-center text-purple-300 font-bold">{pat.marks}</td>
                        <td className="py-2.5 text-right text-slate-400 font-medium">{pat.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. Physical, Medical & SSB Standards (if applicable) */}
      {(overview.physical_standards || overview.ssb_info) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {overview.physical_standards && (
            <div className="p-4 rounded-2xl bg-[#10131E] border border-white/[0.08] flex flex-col gap-2">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>Physical & Medical Standards</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {overview.physical_standards}
              </p>
            </div>
          )}
          {overview.ssb_info && (
            <div className="p-4 rounded-2xl bg-[#10131E] border border-white/[0.08] flex flex-col gap-2">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                <span>SSB / Interview Evaluation</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {overview.ssb_info}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 6. Previous Year Cutoffs */}
      {overview.previous_year_cutoffs && overview.previous_year_cutoffs.length > 0 && (
        <div className="rounded-2xl bg-[#10131E] border border-white/[0.08] overflow-hidden shadow-sm">
          <button
            onClick={() => toggleSection("cutoffs")}
            className="w-full flex items-center justify-between p-4 bg-[#131625] text-left cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white">Previous Year Cutoff Trends</h3>
            </div>
            {openSections.cutoffs ? (
              <ChevronDown className="w-4 h-4 text-purple-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {openSections.cutoffs && (
            <div className="p-4 bg-[#0E101A]">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {overview.previous_year_cutoffs.map((cut, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#141726] border border-white/[0.06] flex flex-col justify-between gap-1"
                  >
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{cut.year}</span>
                    <span className="text-xs font-semibold text-slate-300">{cut.exam_stage}</span>
                    <span className="text-sm font-extrabold text-amber-300 mt-1">{cut.cutoff_marks}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 7. Important Links */}
      {overview.important_links && overview.important_links.length > 0 && (
        <div className="p-4 rounded-2xl bg-[#10131E] border border-white/[0.08] flex flex-col gap-2.5">
          <h3 className="text-xs font-bold text-white flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
            <span>Official Portals & Downloads</span>
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            {overview.important_links.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-purple-300 hover:text-white transition-all cursor-pointer"
              >
                <span>{link.title}</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
