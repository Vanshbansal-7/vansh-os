"use client";

import React from "react";
import { Filter, ChevronDown, LayoutGrid, List } from "lucide-react";

interface CompaniesToolbarProps {
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  sortValue: string;
  onSortChange: (sort: string) => void;
}

export function CompaniesToolbar({
  viewMode,
  onViewModeChange,
  sortValue,
  onSortChange,
}: CompaniesToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-3 w-full">
      <h2 className="text-base font-bold text-white tracking-tight leading-none">
        My Companies
      </h2>

      <div className="flex items-center gap-2.5">
        {/* Filter Button */}
        <button
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
        >
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Filter</span>
        </button>

        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={sortValue}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort Companies"
            className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl pl-3 pr-8 py-1.5 text-xs font-semibold text-slate-300 focus:outline-none appearance-none cursor-pointer transition-all"
          >
            <option value="Latest">Sort: Latest</option>
            <option value="Oldest">Sort: Oldest</option>
            <option value="Company">Sort: Company</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 p-0.5 rounded-xl bg-[#151828] border border-white/[0.06]">
          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            aria-label="Grid View"
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === "grid"
                ? "bg-purple-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("list")}
            aria-label="List View"
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === "list"
                ? "bg-purple-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
