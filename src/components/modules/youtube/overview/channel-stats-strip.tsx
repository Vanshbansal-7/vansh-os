"use client";

import React from "react";
import { Users, Video, Eye, Clock, Calendar, Globe } from "lucide-react";
import { YouTubeChannelProfile } from "@/types/youtube";

interface ChannelStatsStripProps {
  profile: YouTubeChannelProfile;
}

export function ChannelStatsStrip({ profile }: ChannelStatsStripProps) {
  const stats = [
    { label: "Subscribers", value: profile.subscribers, icon: Users },
    { label: "Videos", value: profile.total_videos, icon: Video },
    { label: "Total Views", value: profile.total_views, icon: Eye },
    { label: "Total Watch Time (hrs)", value: profile.watch_time_hrs, icon: Clock },
    { label: "First Video", value: profile.first_video_date, icon: Calendar },
    { label: "Top Country", value: profile.top_country, icon: Globe },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {stats.map((st, idx) => {
        const Icon = st.icon;
        return (
          <div
            key={idx}
            className="p-3.5 rounded-2xl bg-[#10131E] border border-white/[0.08] flex items-center gap-3 shadow-sm hover:border-purple-500/30 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-400 shrink-0">
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-extrabold text-white tracking-tight truncate">
                {st.value}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 truncate">
                {st.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
