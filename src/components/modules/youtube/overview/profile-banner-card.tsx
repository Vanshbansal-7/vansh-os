"use client";

import React from "react";
import { CheckCircle2, Edit2, Code2 } from "lucide-react";
import { YouTubeChannelProfile } from "@/types/youtube";

interface ProfileBannerCardProps {
  profile: YouTubeChannelProfile;
}

export function ProfileBannerCard({ profile }: ProfileBannerCardProps) {
  return (
    <div className="relative rounded-2xl bg-[#10131E] border border-white/[0.08] overflow-hidden flex flex-col min-h-[220px] shadow-sm group">
      {/* Top Banner Image */}
      <div className="h-24 w-full bg-cover bg-center relative overflow-hidden">
        <img
          src={profile.cover_banner_url}
          alt="Cover Banner"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#10131E]" />

        {/* Edit Button top right */}
        <button
          type="button"
          aria-label="Edit Profile"
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-lg bg-black/60 hover:bg-black/80 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer z-10"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Avatar & Channel Details Row */}
      <div className="px-5 pb-5 pt-0 flex flex-col sm:flex-row items-start gap-4 -mt-10 relative z-10">
        {/* Avatar */}
        <div className="relative w-20 h-20 rounded-full border-4 border-[#10131E] bg-[#16132b] flex flex-col items-center justify-center shrink-0 shadow-lg overflow-hidden group">
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-950 p-2 text-center">
            <span className="text-xl font-extrabold text-white tracking-tight leading-none">V</span>
            <span className="text-[8px] font-bold text-purple-300 tracking-widest uppercase">VANSH</span>
          </div>
          <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-purple-600 flex items-center justify-center text-white border border-[#10131E]">
            <Code2 className="w-2.5 h-2.5" />
          </div>
        </div>

        {/* Channel Details */}
        <div className="flex flex-col min-w-0 mt-2 sm:mt-10">
          <div className="flex items-center gap-1.5">
            <h2 className="text-lg font-bold text-white tracking-tight">{profile.name}</h2>
            {profile.is_verified && (
              <CheckCircle2 className="w-4 h-4 text-purple-400 fill-purple-400/20" />
            )}
          </div>
          <span className="text-xs text-slate-400 font-medium">{profile.handle}</span>
          <p className="text-xs text-slate-300 font-medium mt-2 leading-relaxed max-w-lg">
            {profile.bio}{" "}
            <span className="text-purple-400 cursor-pointer font-semibold hover:underline">
              ...more
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
