"use client";

import React, { useState } from "react";
import { Search, Plus, PlayCircle, FileText, Globe, ExternalLink } from "lucide-react";
import { YouTubeResource } from "@/types/youtube";

interface ResourcesTabProps {
  resources: YouTubeResource[];
}

export function ResourcesTab({ resources }: ResourcesTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filtered = resources.filter((res) => {
    if (searchQuery && !res.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedCategory !== "All" && res.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-3.5 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight leading-none">
            Creator Resources & Links
          </h2>
          <p className="text-[11.5px] text-slate-400 font-medium mt-1">
            Editing tutorials, YouTube SEO, thumbnail design guides, and gear setups.
          </p>
        </div>

        <button
          type="button"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-[0_0_12px_rgba(168,85,247,0.4)] cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Resource</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2.5 p-2 rounded-2xl bg-[#10131E] border border-white/[0.08]">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search creator resources..."
            className="w-full bg-[#151828] border border-white/[0.06] hover:border-white/[0.12] focus:border-purple-500/50 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          aria-label="Filter by category"
          className="bg-[#151828] border border-white/[0.06] hover:border-white/[0.12] rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none cursor-pointer"
        >
          <option value="All">All Categories</option>
          <option value="DaVinci Resolve">DaVinci Resolve</option>
          <option value="Storytelling">Storytelling</option>
          <option value="Thumbnail Design">Thumbnail Design</option>
        </select>
      </div>

      <div className="flex flex-col gap-2.5">
        {filtered.map((res) => (
          <div
            key={res.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#10131E] border border-white/[0.08] hover:border-white/[0.14] transition-all"
          >
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center text-rose-400 shrink-0">
                <PlayCircle className="w-5 h-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">
                  {res.title}
                </h3>
                <span className="text-[11px] text-slate-400 font-medium mt-0.5">
                  {res.metadata}
                </span>

                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  {res.tags?.map((tag, tIdx) => (
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

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-slate-300 hover:text-white text-[11px] font-semibold transition-all cursor-pointer"
              >
                <span>{res.display_url}</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
