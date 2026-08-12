"use client";

import React from "react";
import { Folder, Plus } from "lucide-react";

interface NotesRightSidebarProps {
  foldersCount: { label: string; count: number; color?: string }[];
  notesStats: { label: string; value: string }[];
}

export function NotesRightSidebar({
  foldersCount,
  notesStats,
}: NotesRightSidebarProps) {
  return (
    <aside className="w-full lg:w-[280px] xl:w-[300px] shrink-0 flex flex-col gap-3.5 select-none">
      {/* 1. Notes Folders */}
      <div className="rounded-2xl p-4 bg-[#10131E] border border-white/[0.08] shadow-sm flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white tracking-tight">Notes Folders</h3>
          <button
            type="button"
            className="flex items-center gap-1 text-[10px] font-semibold text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>New Folder</span>
          </button>
        </div>

        <div className="flex flex-col gap-1 mt-1">
          {foldersCount.map((f, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-colors cursor-pointer ${
                idx === 0
                  ? "bg-purple-600/15 border border-purple-500/30 text-white font-bold"
                  : "text-slate-300 hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <Folder className={`w-3.5 h-3.5 shrink-0 ${f.color || "text-purple-400"}`} />
                <span className="truncate">{f.label}</span>
              </div>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold shrink-0 ${
                  idx === 0
                    ? "bg-purple-500 text-white"
                    : "bg-white/[0.06] text-slate-400"
                }`}
              >
                {f.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Notes Overview */}
      <div className="rounded-2xl p-4 bg-[#10131E] border border-white/[0.08] shadow-sm flex flex-col gap-2.5">
        <h3 className="text-xs font-bold text-white tracking-tight">Notes Overview</h3>

        <div className="flex flex-col divide-y divide-white/[0.04] mt-1">
          {notesStats.map((stat, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-2 text-xs"
            >
              <span className="text-slate-400 font-medium">{stat.label}</span>
              <span className="font-bold text-white font-mono text-[11.5px]">
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
