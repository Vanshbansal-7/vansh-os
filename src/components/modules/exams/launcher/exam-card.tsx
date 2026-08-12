"use client";

import React from "react";
import Link from "next/link";
import { Award, Anchor, Shield, Landmark, BookOpen, ShieldAlert, ArrowRight, Calendar } from "lucide-react";
import { ExamMaster } from "@/types/exams";

interface ExamCardProps {
  exam: ExamMaster;
}

export function ExamCard({ exam }: ExamCardProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Award":
        return Award;
      case "Anchor":
        return Anchor;
      case "Shield":
        return Shield;
      case "Landmark":
        return Landmark;
      case "BookOpen":
        return BookOpen;
      case "ShieldAlert":
        return ShieldAlert;
      default:
        return Award;
    }
  };

  const Icon = getIcon(exam.logo_icon);

  return (
    <Link
      href={`/modules/exams/${exam.slug}`}
      className="group relative rounded-2xl p-4 sm:p-5 bg-[#10131E] hover:bg-[#131724] border border-white/[0.08] hover:border-purple-500/40 transition-all duration-300 flex flex-col justify-between gap-4 shadow-sm hover:shadow-[0_0_24px_rgba(168,85,247,0.15)] overflow-hidden cursor-pointer"
    >
      {/* Top Row: Icon + Title & Category Badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-300 group-hover:scale-105 transition-transform shrink-0">
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight group-hover:text-purple-200 transition-colors">
                {exam.short_name}
              </h3>
              <span className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[9.5px] font-bold text-slate-300 uppercase tracking-wider">
                {exam.category}
              </span>
            </div>
            <span className="text-[11px] font-semibold text-slate-400 mt-0.5">
              {exam.conducting_body}
            </span>
          </div>
        </div>

        <div className="w-7 h-7 rounded-full border border-purple-500/30 bg-purple-500/10 flex items-center justify-center text-purple-300 group-hover:translate-x-0.5 group-hover:bg-purple-600 group-hover:text-white transition-all shrink-0">
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-300 font-medium line-clamp-2 leading-relaxed">
        {exam.description}
      </p>

      {/* Progress & Last Updated */}
      <div className="flex flex-col gap-2 pt-2 border-t border-white/[0.04]">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-slate-400">Preparation</span>
          <span className="text-purple-300">{exam.prep_progress}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-[#181D2B] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
            style={{ width: `${exam.prep_progress}%` }}
          />
        </div>

        {/* Bottom Metadata */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold mt-1">
          {exam.last_updated && (
            <span>Updated {exam.last_updated}</span>
          )}
          {exam.upcoming_date && (
            <span className="flex items-center gap-1 text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              <Calendar className="w-2.5 h-2.5" />
              {exam.upcoming_date}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
