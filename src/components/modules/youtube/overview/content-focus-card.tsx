"use client";

import React from "react";
import { Edit2 } from "lucide-react";

interface ContentFocusCardProps {
  tags: string[];
}

export function ContentFocusCard({ tags }: ContentFocusCardProps) {
  return (
    <div className="rounded-2xl p-5 bg-[#10131E] border border-white/[0.08] flex flex-col gap-3 shadow-sm h-full">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white tracking-tight">Content Focus</h3>
        <button
          type="button"
          aria-label="Edit Content Focus"
          className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className="px-3 py-1 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
