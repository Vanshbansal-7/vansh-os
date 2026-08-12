"use client";

import React from "react";
import {
  Layers,
  PlayCircle,
  FileText,
  Globe,
  Target,
  Book,
  Send,
} from "lucide-react";

interface ResourcesRightSidebarProps {
  categoriesCount: { label: string; count: number; active?: boolean; icon?: string }[];
  summaryStats: { label: string; count: number; color: string }[];
}

export function ResourcesRightSidebar({
  categoriesCount,
  summaryStats,
}: ResourcesRightSidebarProps) {
  const getCategoryIcon = (iconName?: string) => {
    switch (iconName) {
      case "youtube":
        return <PlayCircle className="w-3.5 h-3.5 text-rose-400" />;
      case "file-text":
        return <FileText className="w-3.5 h-3.5 text-red-400" />;
      case "globe":
        return <Globe className="w-3.5 h-3.5 text-sky-400" />;
      case "target":
        return <Target className="w-3.5 h-3.5 text-amber-400" />;
      case "book":
        return <Book className="w-3.5 h-3.5 text-emerald-400" />;
      case "send":
        return <Send className="w-3.5 h-3.5 text-blue-400" />;
      default:
        return <Layers className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  return (
    <aside className="w-full lg:w-[280px] xl:w-[300px] shrink-0 flex flex-col gap-3.5 select-none">
      {/* 1. Quick Categories */}
      <div className="rounded-2xl p-4 bg-[#10131E] border border-white/[0.08] shadow-sm flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white tracking-tight">Quick Categories</h3>
          <span className="text-[10px] font-semibold text-purple-400 cursor-pointer hover:underline">
            Manage
          </span>
        </div>

        <div className="flex flex-col gap-1 mt-1">
          {categoriesCount.map((cat, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-colors cursor-pointer ${
                cat.active
                  ? "bg-purple-600/15 border border-purple-500/30 text-white font-bold"
                  : "text-slate-300 hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center gap-2">
                {getCategoryIcon(cat.icon)}
                <span>{cat.label}</span>
              </div>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                  cat.active
                    ? "bg-purple-500 text-white"
                    : "bg-white/[0.06] text-slate-400"
                }`}
              >
                {cat.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Resources Summary */}
      <div className="rounded-2xl p-4 bg-[#10131E] border border-white/[0.08] shadow-sm flex flex-col gap-2.5">
        <h3 className="text-xs font-bold text-white tracking-tight">Resources Summary</h3>

        <div className="flex flex-col divide-y divide-white/[0.04] mt-1">
          {summaryStats.map((stat, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-2 text-xs"
            >
              <span className="text-slate-400 font-medium">{stat.label}</span>
              <span className={`font-bold ${stat.color}`}>{stat.count}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
