"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, Calendar, FileText, ArrowRight, ShieldCheck } from "lucide-react";
import { ExamApplication } from "@/types/exams";

interface FormsFilledSectionProps {
  applications: ExamApplication[];
}

export function FormsFilledSection({ applications }: FormsFilledSectionProps) {
  if (!applications || applications.length === 0) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Submitted":
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Submitted
          </span>
        );
      case "Admit Card Out":
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10px] font-bold animate-pulse">
            <ShieldCheck className="w-3 h-3 text-purple-400" />
            Admit Card Out
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-slate-500/15 border border-slate-500/30 text-slate-300 text-[10px] font-bold">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col gap-3 mt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>Applications / Forms Filled</span>
            <span className="px-2 py-0.5 rounded-md bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-extrabold">
              {applications.length} Active
            </span>
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Track submitted forms, admit card releases, and examination dates
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {applications.map((app) => (
          <Link
            key={app.id}
            href={`/modules/exams/${app.exam_slug}`}
            className="group flex flex-col justify-between p-4 rounded-2xl bg-[#10131E] hover:bg-[#131724] border border-white/[0.08] hover:border-purple-500/40 transition-all duration-200 shadow-sm gap-3 cursor-pointer"
          >
            {/* Header: Name + Status */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white tracking-tight group-hover:text-purple-300 transition-colors">
                    {app.exam_name}
                  </h3>
                </div>
                {app.app_number && (
                  <span className="text-[10px] font-mono text-slate-400 mt-0.5">
                    Reg No: {app.app_number}
                  </span>
                )}
              </div>

              {getStatusBadge(app.status)}
            </div>

            {/* Current Stage Highlight */}
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Current Stage:</span>
              <span className="font-bold text-white tracking-tight truncate max-w-[200px]">
                {app.current_stage}
              </span>
            </div>

            {/* Dates & Details */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold pt-1 border-t border-white/[0.04]">
              <div className="flex items-center gap-1 text-slate-400">
                <Calendar className="w-3 h-3 text-slate-500" />
                <span>Exam: <strong className="text-white">{app.exam_date}</strong></span>
              </div>
              <div className="flex items-center gap-1 text-purple-300 group-hover:translate-x-0.5 transition-transform">
                <span>View Exam Workspace</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
