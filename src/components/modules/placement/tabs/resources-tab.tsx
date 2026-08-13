"use client";

import React, { useState } from "react";
import { Plus, Search, Globe, ExternalLink, Trash2 } from "lucide-react";
import { usePlacementResources } from "@/hooks/use-placement-resources";
import { EmptyState } from "@/components/crud/empty-state";
import { AddResourceModal } from "@/components/crud/add-resource-modal";

export function ResourcesTab() {
  const {
    resources,
    filteredResources,
    searchQuery,
    setSearchQuery,
    categories,
    activeCategory,
    setActiveCategory,
    activePriority,
    setActivePriority,
    addResource,
    deleteResource,
  } = usePlacementResources();

  const [isAddResourceModalOpen, setIsAddResourceModalOpen] = useState(false);

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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-[#10131E] border border-white/[0.08]">
            {/* Search */}
            <div className="relative w-full sm:w-[320px]">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resources, tags, URLs..."
                className="w-full bg-[#151828] border border-white/[0.06] focus:border-purple-500/40 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="bg-[#151828] border border-white/[0.06] text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500/40 cursor-pointer flex-1 sm:flex-none appearance-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c === "ALL" ? "All Categories" : c}</option>
                ))}
              </select>

              <select
                value={activePriority}
                onChange={(e) => setActivePriority(e.target.value)}
                className="bg-[#151828] border border-white/[0.06] text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500/40 cursor-pointer flex-1 sm:flex-none appearance-none"
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
            {filteredResources.map((res) => (
              <div
                key={res.id}
                className="p-3.5 rounded-xl bg-[#10131E] border border-white/[0.08] hover:border-purple-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                {/* Left: Icon & Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-400 shrink-0">
                    <Globe className="w-4.5 h-4.5" />
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
                    <button
                      type="button"
                      onClick={() => deleteResource(res.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
