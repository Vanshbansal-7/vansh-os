"use client";

import React from "react";
import { Edit2, Calendar } from "lucide-react";

interface UploadFrequencyCardProps {
  frequency: string | { title: string; subtitle: string };
}

export function UploadFrequencyCard({ frequency }: UploadFrequencyCardProps) {
  const title = typeof frequency === "string" ? frequency : frequency.title;
  const subtitle = typeof frequency === "string" ? "Regular publishing schedule" : frequency.subtitle;

  return (
    <div className="rounded-2xl p-5 bg-[#10131E] border border-white/[0.08] flex flex-col gap-3 shadow-sm h-full">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white tracking-tight">Upload Frequency</h3>
        <button
          type="button"
          aria-label="Edit Upload Frequency"
          className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-3.5 mt-1">
        <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-300 shrink-0">
          <Calendar className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-extrabold text-white tracking-tight">
            {title}
          </span>
          <span className="text-[11px] text-slate-400 font-medium mt-0.5">
            {subtitle}
          </span>
        </div>
      </div>
    </div>
  );
}
