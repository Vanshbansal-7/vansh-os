"use client";

import React from "react";
import { Edit2, Play, Globe, MessageSquare, Code, Share2 } from "lucide-react";
import { YouTubeChannelProfile } from "@/types/youtube";

interface ImportantLinksCardProps {
  profile: YouTubeChannelProfile;
}

export function ImportantLinksCard({ profile }: ImportantLinksCardProps) {
  const getBrandIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("youtube")) return <Play className="w-4 h-4 text-rose-500 fill-rose-500" />;
    if (n.includes("instagram")) return <Share2 className="w-4 h-4 text-pink-400" />;
    if (n.includes("discord")) return <MessageSquare className="w-4 h-4 text-indigo-400" />;
    if (n.includes("github")) return <Code className="w-4 h-4 text-slate-200" />;
    if (n.includes("twitter") || n.includes("x")) return <Share2 className="w-4 h-4 text-sky-400" />;
    return <Globe className="w-4 h-4 text-emerald-400" />;
  };

  return (
    <div className="rounded-2xl p-5 bg-[#10131E] border border-white/[0.08] flex flex-col gap-4 shadow-sm h-full">
      {/* Header + Edit Button */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white tracking-tight">Important Links</h3>
        <button
          type="button"
          aria-label="Edit Links"
          className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Links Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {(profile.important_links || []).map((link, idx) => (
          <a
            key={idx}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#141726] border border-white/[0.06] hover:border-purple-500/40 hover:bg-[#181C2E] transition-all cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              {getBrandIcon(link.name)}
            </div>
            <span className="text-xs font-bold text-slate-200 group-hover:text-white truncate">
              {link.name}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
