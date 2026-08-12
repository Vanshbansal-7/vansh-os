"use client";

import React from "react";
import { Search, Filter, ChevronDown, LayoutGrid, List } from "lucide-react";

interface DocumentsToolbarProps {
  searchValue: string;
  onSearchChange: (val: string) => void;
  typeFilter: string;
  onTypeFilterChange: (val: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (val: string) => void;
  sortValue: string;
  onSortChange: (val: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

export function DocumentsToolbar({
  searchValue,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  sortValue,
  onSortChange,
  viewMode,
  onViewModeChange,
}: DocumentsToolbarProps) {
  return (
    <div className="flex flex-col gap-3 w-full">
      <h2 className="text-base font-bold text-white tracking-tight leading-none">
        All Documents
      </h2>

      <div className="flex flex-wrap items-center justify-between gap-2.5 p-2 rounded-2xl bg-[#10131E] border border-white/[0.08]">
        {/* Left Controls: Search + Filters */}
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[180px]">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search documents..."
              className="w-full bg-[#151828] border border-white/[0.06] hover:border-white/[0.12] focus:border-purple-500/50 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
            />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => onTypeFilterChange(e.target.value)}
              aria-label="Filter by Type"
              className="bg-[#151828] border border-white/[0.06] hover:border-white/[0.12] rounded-xl pl-3 pr-7 py-1.5 text-xs text-slate-300 focus:outline-none appearance-none cursor-pointer"
            >
              <option value="All">Type</option>
              <option value="PDF">PDF</option>
              <option value="DOCX">DOCX</option>
              <option value="PNG">PNG</option>
              <option value="ZIP">ZIP</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => onCategoryFilterChange(e.target.value)}
              aria-label="Filter by Category"
              className="bg-[#151828] border border-white/[0.06] hover:border-white/[0.12] rounded-xl pl-3 pr-7 py-1.5 text-xs text-slate-300 focus:outline-none appearance-none cursor-pointer"
            >
              <option value="All">Category</option>
              <option value="Study Materials">Study Materials</option>
              <option value="Placement">Placement</option>
              <option value="Projects">Projects</option>
              <option value="College">College</option>
              <option value="Personal">Personal</option>
              <option value="Certificates">Certificates</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Tags Filter */}
          <div className="relative">
            <select
              aria-label="Filter by Tags"
              className="bg-[#151828] border border-white/[0.06] hover:border-white/[0.12] rounded-xl pl-3 pr-7 py-1.5 text-xs text-slate-300 focus:outline-none appearance-none cursor-pointer"
            >
              <option value="All">Tags</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* More Filters Purple Button */}
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 text-xs font-semibold transition-all cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5 text-purple-400" />
            <span>More Filters</span>
          </button>
        </div>

        {/* Right Controls: Sort & View Toggle */}
        <div className="flex items-center gap-2">
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortValue}
              onChange={(e) => onSortChange(e.target.value)}
              aria-label="Sort Documents"
              className="bg-[#151828] border border-white/[0.06] hover:border-white/[0.12] rounded-xl pl-3 pr-7 py-1.5 text-xs font-semibold text-slate-300 focus:outline-none appearance-none cursor-pointer"
            >
              <option value="Latest">Sort: Latest</option>
              <option value="Oldest">Sort: Oldest</option>
              <option value="Name">Sort: Name</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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
    </div>
  );
}
