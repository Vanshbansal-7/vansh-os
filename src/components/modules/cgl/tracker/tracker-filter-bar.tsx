"use client";

import React from "react";
import { Search, RotateCcw, ChevronsUpDown, Download } from "lucide-react";

interface TrackerFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedSubject: string;
  onSubjectChange: (s: string) => void;
  selectedStatus: string;
  onStatusChange: (s: string) => void;
  selectedMilestone: string;
  onMilestoneChange: (m: string) => void;
  onReset: () => void;
  onExpandAll: () => void;
}

export function TrackerFilterBar({
  searchQuery,
  onSearchChange,
  selectedSubject,
  onSubjectChange,
  selectedStatus,
  onStatusChange,
  selectedMilestone,
  onMilestoneChange,
  onReset,
  onExpandAll,
}: TrackerFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2.5 p-2 rounded-2xl bg-[#10131E] border border-white/[0.08] mb-3">
      {/* Left Filter Controls */}
      <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
        {/* Search Input */}
        <div className="relative min-w-[160px] sm:min-w-[200px] flex-1">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search topics..."
            className="w-full bg-[#151828] border border-white/[0.06] hover:border-white/[0.12] focus:border-purple-500/50 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
          />
        </div>

        {/* Subjects Dropdown */}
        <select
          value={selectedSubject}
          onChange={(e) => onSubjectChange(e.target.value)}
          aria-label="Filter by subject"
          className="bg-[#151828] border border-white/[0.06] hover:border-white/[0.12] rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none cursor-pointer"
        >
          <option value="All">All Subjects</option>
          <option value="Reasoning Ability">Reasoning Ability</option>
          <option value="Quantitative Aptitude">Quantitative Aptitude</option>
          <option value="English Language">English Language</option>
          <option value="General Awareness">General Awareness</option>
          <option value="General Intelligence & Computer">G.I. & Computer</option>
        </select>

        {/* Status Dropdown */}
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          aria-label="Filter by status"
          className="bg-[#151828] border border-white/[0.06] hover:border-white/[0.12] rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none cursor-pointer"
        >
          <option value="All">All Status</option>
          <option value="Completed">Completed</option>
          <option value="In Progress">In Progress</option>
          <option value="Pending">Pending</option>
        </select>

        {/* Milestones Dropdown */}
        <select
          value={selectedMilestone}
          onChange={(e) => onMilestoneChange(e.target.value)}
          aria-label="Filter by milestone"
          className="bg-[#151828] border border-white/[0.06] hover:border-white/[0.12] rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none cursor-pointer hidden md:block"
        >
          <option value="All">All Milestones</option>
          <option value="Learned">1. Learned</option>
          <option value="Practiced">2. Practiced</option>
          <option value="Revised">3. Revised</option>
          <option value="Mastered">4. Mastered</option>
        </select>

        {/* Reset Button */}
        <button
          onClick={onReset}
          type="button"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] text-slate-400 hover:text-white text-xs font-semibold transition-all cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onExpandAll}
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#151828] hover:bg-[#1C2035] border border-white/[0.08] text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
        >
          <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span>Expand All</span>
        </button>

        <button
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 text-xs font-semibold transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
}
