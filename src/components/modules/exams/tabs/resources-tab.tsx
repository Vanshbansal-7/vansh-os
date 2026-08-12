"use client";

import React, { useState } from "react";
import {
  Upload,
  Plus,
  Search,
  Grid,
  List,
  PlayCircle,
  FileText,
  Globe,
  Send,
  Target,
  ExternalLink,
  MoreVertical,
  Calendar,
  Trash2,
} from "lucide-react";
import { useExamResources } from "@/hooks/use-exam-resources";
import { Pagination } from "@/components/modules/cgl/shared/pagination";
import { AddResourceModal } from "@/components/crud/add-resource-modal";

interface ResourcesTabProps {
  examSlug: string;
  examId?: string;
}

export function ResourcesTab({ examSlug, examId }: ResourcesTabProps) {
  const {
    resources,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedType,
    setSelectedType,
    selectedTag,
    setSelectedTag,
    selectedPriority,
    setSelectedPriority,
    viewMode,
    setViewMode,
    currentPage,
    setCurrentPage,
    addResource,
    deleteResource,
    mutate,
  } = useExamResources(examSlug, examId);

  const [isAddResourceOpen, setIsAddResourceOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.max(1, Math.ceil(resources.length / ITEMS_PER_PAGE));
  const showingText = resources.length === 0
    ? "No resources yet"
    : `Showing ${Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, resources.length)} to ${Math.min(currentPage * ITEMS_PER_PAGE, resources.length)} of ${resources.length} resource${resources.length !== 1 ? 's' : ''}`;

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "youtube":
        return (
          <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center text-rose-400 shrink-0">
            <PlayCircle className="w-5 h-5" />
          </div>
        );
      case "document":
        return (
          <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/25 flex items-center justify-center text-red-400 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
        );
      case "website":
        return (
          <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/25 flex items-center justify-center text-sky-400 shrink-0">
            <Globe className="w-5 h-5" />
          </div>
        );
      case "telegram":
        return (
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center text-blue-400 shrink-0">
            <Send className="w-5 h-5" />
          </div>
        );
      case "mock_test":
        return (
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400 shrink-0">
            <Target className="w-5 h-5" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-400 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
        );
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return (
          <span className="px-2 py-0.5 rounded-md bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10px] font-bold">
            HIGH
          </span>
        );
      case "MEDIUM":
        return (
          <span className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-bold">
            MEDIUM
          </span>
        );
      case "LOW":
        return (
          <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
            LOW
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Add Resource Modal */}
      <AddResourceModal
        isOpen={isAddResourceOpen}
        module={examSlug.toUpperCase()}
        examId={examId}
        onClose={() => setIsAddResourceOpen(false)}
        onSuccess={() => {
          mutate();
          setIsAddResourceOpen(false);
        }}
      />
      
      {/* Center Main Workspace */}
      <div className="flex flex-col gap-3 min-w-0 w-full mt-4">
        {/* 1. Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight leading-none">
              Resources & Links
            </h2>
            <p className="text-[11.5px] text-slate-400 font-medium mt-1">
              Organize and manage your study resources, links, and materials.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-slate-400" />
              <span>Import Links</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAddResourceOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-[0_0_12px_rgba(168,85,247,0.4)] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Resource</span>
            </button>
          </div>
        </div>

        {/* 2. Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 p-2 rounded-2xl bg-[#10131E] border border-white/[0.08]">
          <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
            {/* Search Input */}
            <div className="relative min-w-[160px] sm:min-w-[200px] flex-1">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resources..."
                className="w-full bg-[#151828] border border-white/[0.06] hover:border-white/[0.12] focus:border-purple-500/50 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
              />
            </div>

            {/* Dropdowns */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter by category"
              className="bg-[#151828] border border-white/[0.06] hover:border-white/[0.12] rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Reasoning">Reasoning</option>
              <option value="Quant">Quant</option>
              <option value="English">English</option>
              <option value="GK">GK</option>
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              aria-label="Filter by type"
              className="bg-[#151828] border border-white/[0.06] hover:border-white/[0.12] rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="All">All Types</option>
              <option value="youtube">YouTube</option>
              <option value="document">Documents</option>
              <option value="website">Websites</option>
              <option value="telegram">Telegram</option>
              <option value="mock_test">Mock Tests</option>
            </select>

            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              aria-label="Filter by priority"
              className="bg-[#151828] border border-white/[0.06] hover:border-white/[0.12] rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="All">Priority</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>

        {/* 3. Resources Cards List */}
        <div className="flex flex-col gap-2.5">
          {resources.map((res) => (
            <div
              key={res.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#10131E] border border-white/[0.08] hover:border-white/[0.14] transition-all"
            >
              {/* Left Details */}
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                {getResourceIcon(res.type)}

                <div className="flex flex-col min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">
                    {res.title}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium mt-0.5">
                    {res.metadata}
                  </span>

                  {/* Tags Row */}
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    {res.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[10px] font-medium text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Metadata & Action */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 border-white/[0.04] pt-2 sm:pt-0">
                <div className="flex items-center gap-2">
                  {getPriorityBadge(res.priority)}

                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-slate-300 hover:text-white text-[11px] font-medium transition-all cursor-pointer"
                  >
                    <span className="truncate max-w-[110px]">{res.display_url}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === res.id ? null : res.id);
                      }}
                      className="p-1 rounded text-slate-500 hover:text-slate-300 cursor-pointer"
                    >
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>
                    {openMenuId === res.id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 top-6 z-20 w-32 rounded-xl bg-[#151828] border border-white/[0.1] shadow-xl py-1 flex flex-col text-xs"
                      >
                        <button
                          onClick={async () => {
                            setOpenMenuId(null);
                            try { await deleteResource(res.id); } catch {}
                          }}
                          className="flex items-center gap-2 px-3 py-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                  <Calendar className="w-2.5 h-2.5" />
                  <span>{res.added_date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 4. Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          showingText={showingText}
        />
      </div>
    </div>
  );
}
