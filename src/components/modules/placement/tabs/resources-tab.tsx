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
          <div className="flex items-center justify-between gap-3 p-2 rounded-2xl bg-[#10131E] border border-white/[0.08]">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resources..."
                className="w-full bg-[#151828] border border-white/[0.06] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Grid of Resource Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredResources.map((res) => (
              <div
                key={res.id}
                className="p-4 rounded-2xl bg-[#10131E] border border-white/[0.08] hover:border-purple-500/30 transition-all flex flex-col justify-between gap-3 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-400">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <h4 className="text-xs font-bold text-white truncate group-hover:text-purple-300 transition-colors">
                        {res.title}
                      </h4>
                      <span className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                        {res.display_url}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteResource(res.id)}
                    className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
                  <span className="px-2 py-0.5 rounded-md bg-purple-500/15 border border-purple-500/30 text-[10px] font-bold text-purple-300">
                    {res.category}
                  </span>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[11px] font-bold text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <span>Open</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
