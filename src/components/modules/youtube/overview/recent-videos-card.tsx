"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import { YouTubeChannelProfile } from "@/types/youtube";

interface RecentVideosCardProps {
  videos: YouTubeChannelProfile["recent_videos"];
}

export function RecentVideosCard({ videos }: RecentVideosCardProps) {
  return (
    <div className="rounded-2xl p-5 bg-[#10131E] border border-white/[0.08] flex flex-col gap-4 shadow-sm h-full">
      {/* Header + View All */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white tracking-tight">Recent Videos</h3>
        <button
          type="button"
          className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Horizontal Scrollable Video Cards Grid */}
      <div className="flex items-center gap-3.5 overflow-x-auto pb-1 no-scrollbar">
        {(videos || []).map((vid) => (
          <div
            key={vid.id}
            className="group flex flex-col gap-2 min-w-[200px] w-[200px] shrink-0 cursor-pointer"
          >
            {/* Thumbnail Box */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-[#151828] border border-white/[0.08] group-hover:border-purple-500/40 transition-all">
              <img
                src={vid.thumbnail_url}
                alt={vid.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 text-[9.5px] font-mono font-bold text-white backdrop-blur-sm">
                {vid.duration}
              </span>
            </div>

            {/* Video Metadata */}
            <div className="flex flex-col min-w-0">
              <h4 className="text-xs font-bold text-white line-clamp-2 leading-tight group-hover:text-purple-300 transition-colors">
                {vid.title}
              </h4>
              <div className="flex items-center gap-1.5 text-[10.5px] text-slate-400 font-medium mt-1">
                <span>{vid.views}</span>
                <span>•</span>
                <span>{vid.upload_date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
