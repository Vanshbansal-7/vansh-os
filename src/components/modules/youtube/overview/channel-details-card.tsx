"use client";

import React from "react";
import {
  Edit2,
  Calendar,
  Layers,
  Globe,
  Languages,
  Video,
  ExternalLink,
  Users,
  Eye,
  Mail,
  Lock,
  Music2,
} from "lucide-react";
import { YouTubeChannelProfile } from "@/types/youtube";

interface ChannelDetailsCardProps {
  profile: YouTubeChannelProfile;
}

export function ChannelDetailsCard({ profile }: ChannelDetailsCardProps) {
  return (
    <div className="rounded-2xl p-5 bg-[#10131E] border border-white/[0.08] flex flex-col gap-4 shadow-sm relative">
      {/* Card Header + Edit Button */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white tracking-tight">Channel Details</h3>
        <button
          type="button"
          aria-label="Edit Channel Details"
          className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 text-xs">
        {/* Left Column */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-400 font-medium">
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              Channel Created
            </span>
            <span className="font-bold text-white">{profile.created_date}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-400 font-medium">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              Category
            </span>
            <span className="font-bold text-white">{profile.category}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-400 font-medium">
              <Globe className="w-3.5 h-3.5 text-purple-400" />
              Country
            </span>
            <span className="font-bold text-white">{profile.country}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-400 font-medium">
              <Languages className="w-3.5 h-3.5 text-purple-400" />
              Language
            </span>
            <span className="font-bold text-white">{profile.language}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-400 font-medium">
              <Video className="w-3.5 h-3.5 text-purple-400" />
              Channel Type
            </span>
            <span className="font-bold text-white">{profile.channel_type}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-400 font-medium">
              <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
              Links
            </span>
            <a
              href={`https://${profile.channel_url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-purple-400 hover:underline flex items-center gap-1"
            >
              <span>{profile.channel_url}</span>
              <ExternalLink className="w-3 h-3 text-purple-400" />
            </a>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-400 font-medium">
              <Users className="w-3.5 h-3.5 text-purple-400" />
              Current Subscribers
            </span>
            <span className="font-bold text-white">{profile.subscribers}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-400 font-medium">
              <Video className="w-3.5 h-3.5 text-purple-400" />
              Total Videos
            </span>
            <span className="font-bold text-white">{profile.total_videos}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-400 font-medium">
              <Eye className="w-3.5 h-3.5 text-purple-400" />
              Total Views
            </span>
            <span className="font-bold text-white">{profile.total_views}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-400 font-medium">
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              Joined
            </span>
            <span className="font-bold text-white">{profile.created_date}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-400 font-medium">
              <Lock className="w-3.5 h-3.5 text-purple-400" />
              Default Uploads
            </span>
            <span className="font-bold text-white">{profile.default_uploads_visibility}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-400 font-medium">
              <Mail className="w-3.5 h-3.5 text-purple-400" />
              Business Email
            </span>
            <span className="font-bold text-slate-300 truncate max-w-[140px]" title={profile.business_email}>
              {profile.business_email}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
