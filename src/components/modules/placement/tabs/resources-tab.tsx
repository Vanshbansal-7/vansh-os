"use client";

import React, { useState } from "react";
import { Plus, Search, Globe, ExternalLink, Trash2, Pin, PlayCircle, FileText, Send, Target, MoreVertical, Calendar } from "lucide-react";
import { usePlacementResources } from "@/hooks/use-placement-resources";
import { EmptyState } from "@/components/crud/empty-state";
import { AddResourceModal } from "@/components/crud/add-resource-modal";
import { Pagination } from "@/components/modules/cgl/shared/pagination";

export function ResourcesTab() {
  const {
    resources,
    filteredResources,
    searchQuery,
    setSearchQuery,
    categories,
    activeCategory,
    setActiveCategory,
    activeType,
    setActiveType,
    activePriority,
    setActivePriority,
    currentPage,
    setCurrentPage,
    addResource,
    deleteResource,
    togglePin,
  } = usePlacementResources();

  const [isAddResourceModalOpen, setIsAddResourceModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.max(1, Math.ceil(filteredResources.length / ITEMS_PER_PAGE));
  const currentItems = filteredResources.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const showingText = filteredResources.length === 0
    ? "No resources yet"
    : `Showing ${Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredResources.length)} to ${Math.min(currentPage * ITEMS_PER_PAGE, filteredResources.length)} of ${filteredResources.length} resource${filteredResources.length !== 1 ? 's' : ''}`;

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "youtube": return <PlayCircle className="w-4.5 h-4.5" />;
      case "document": return <FileText className="w-4.5 h-4.5" />;
      case "telegram": return <Send className="w-4.5 h-4.5" />;
      case "mock_test": return <Target className="w-4.5 h-4.5" />;
      default: return <Globe className="w-4.5 h-4.5" />;
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Add Resource Modal */}
      <AddResourceModal
        isOpen={isAddResourceModalOpen}
        module="PLACEMENT"
        onClose={() => setIsAddResourceModalOpen(false)}
        onSuccess={(res) => addResource(res)}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight leading-none">
            Placement Resources & Links
          </h2>
          <p className="text-[11.5px] text-slate-400 font-medium mt-1">
            Store and organize all your placement preparation materials and links
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddResourceModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Resource</span>
        </button>
      </div>

      {resources.length === 0 ? (
        <EmptyState
          title="No resources added yet"
          description="Build your personal study vault by adding your first placement resource or link."
          actionLabel="Add Resource"
          onAction={() => setIsAddResourceModalOpen(true)}
          icon="resource"
        />
      ) : (
        <div className="flex flex-col gap-4">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 p-2 rounded-2xl bg-[#10131E] border border-white/[0.08]">
            <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
              {/* Search */}
              <div className="relative min-w-[160px] sm:min-w-[200px] flex-1">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search resources, tags, URLs..."
                  className="w-full bg-[#151828] border border-white/[0.06] hover:border-white/[0.12] focus:border-purple-500/50 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
                />
              </div>

              {/* Filters */}
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                aria-label="Filter by category"
                className="bg-[#151828] border border-white/[0.06] hover:border-white/[0.12] rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c === "ALL" ? "All Categories" : c}</option>
                ))}
              </select>

              <select
                value={activeType}
                onChange={(e) => setActiveType(e.target.value)}
                aria-label="Filter by type"
                className="bg-[#151828] border border-white/[0.06] hover:border-white/[0.12] rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Types</option>
                <option value="youtube">YouTube</option>
                <option value="document">Documents</option>
                <option value="website">Websites</option>
                <option value="telegram">Telegram</option>
                <option value="mock_test">Mock Tests</option>
              </select>

              <select
                value={activePriority}
                onChange={(e) => setActivePriority(e.target.value)}
                aria-label="Filter by priority"
                className="bg-[#151828] border border-white/[0.06] hover:border-white/[0.12] rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Priorities</option>
                <option value="HIGH">High Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="LOW">Low Priority</option>
              </select>
            </div>
          </div>

          {/* List of Resource Rows */}
          <div className="flex flex-col gap-2.5">
            {currentItems.map((res) => (
              <div
                key={res.id}
                className={`p-3.5 rounded-xl bg-[#10131E] border hover:border-white/[0.14] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group ${
                  res.is_pinned ? "border-purple-500/40 bg-[#181C2E]" : "border-white/[0.08]"
                }`}
              >
                {/* Left: Icon & Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0 relative">
                  {res.is_pinned && (
                    <div className="absolute -top-5 -left-1 text-purple-400 rotate-45">
                      <Pin className="w-3 h-3 fill-purple-400" />
                    </div>
                  )}
                  <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-400 shrink-0">
                    {getResourceIcon(res.type)}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-white truncate group-hover:text-purple-300 transition-colors">
                      {res.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400 font-medium">
                      <span className="truncate max-w-[200px] sm:max-w-[300px]">{res.display_url}</span>
                      {res.tags && res.tags.length > 0 && (
                        <>
                          <span className="text-slate-600">•</span>
                          <span className="truncate flex gap-1.5">
                            {res.tags.map((t, i) => (
                              <span key={i} className="text-slate-500">#{t}</span>
                            ))}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Badges & Actions */}
                <div className="flex items-center gap-4 shrink-0 pl-14 sm:pl-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-white/[0.04] text-[10px] font-bold text-slate-300 border border-white/[0.08]">
                      {res.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      res.priority === "HIGH" ? "bg-rose-500/15 text-rose-300 border-rose-500/30" :
                      res.priority === "MEDIUM" ? "bg-amber-500/15 text-amber-300 border-amber-500/30" :
                      "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                    }`}>
                      {res.priority}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg text-purple-400 hover:bg-purple-500/15 transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    <div className="relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === res.id ? null : res.id);
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 transition-all cursor-pointer"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {openMenuId === res.id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 top-8 z-20 w-32 rounded-xl bg-[#151828] border border-white/[0.1] shadow-xl py-1 flex flex-col text-xs"
                        >
                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              togglePin(res.id, !!res.is_pinned);
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors text-left"
                          >
                            <Pin className={`w-3 h-3 ${res.is_pinned ? "text-purple-400 fill-purple-400" : ""}`} />
                            <span>{res.is_pinned ? "Unpin" : "Pin"}</span>
                          </button>
                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              deleteResource(res.id);
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
                </div>
              </div>
            ))}
          </div>
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showingText={showingText}
          />
        </div>
      )}
    </div>
  );
}
