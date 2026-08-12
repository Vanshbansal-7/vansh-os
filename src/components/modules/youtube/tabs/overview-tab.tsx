"use client";

import React, { useState } from "react";
import {
  X, PlayCircle, Plus, Globe, Users, Video, Loader2, AlertCircle,
} from "lucide-react";

interface SetupChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: any) => void;
}

function SetupChannelModal({ isOpen, onClose, onSuccess }: SetupChannelModalProps) {
  const [channelName, setChannelName] = useState("");
  const [channelHandle, setChannelHandle] = useState("");
  const [channelUrl, setChannelUrl] = useState("");
  const [niche, setNiche] = useState("");
  const [subscribers, setSubscribers] = useState("");
  const [totalVideos, setTotalVideos] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!channelName.trim()) {
      setError("Channel name is required.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 600)); // simulate save

    onSuccess({
      channel_name: channelName.trim(),
      channel_handle: channelHandle.trim() || `@${channelName.trim().replace(/\s+/g, "")}`,
      channel_url: channelUrl.trim() || `https://youtube.com/@${channelName.trim().replace(/\s+/g, "")}`,
      niche: niche.trim() || "General",
      subscribers: subscribers.trim() || "0",
      total_videos: parseInt(totalVideos) || 0,
      description: `YouTube channel: ${channelName.trim()}`,
      watch_time_hrs: "0",
      total_views: "0",
      first_video_date: new Date().getFullYear().toString(),
      top_country: "India",
      upload_frequency: "Weekly",
      content_focus_tags: niche ? [niche] : ["Content"],
      recent_videos: [],
      important_links: [],
    });

    setLoading(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg rounded-2xl bg-[#0E101A] border border-purple-500/30 shadow-[0_0_60px_rgba(168,85,247,0.25)] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-[#131626] border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <PlayCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Setup Creator Profile</h3>
              <p className="text-[10.5px] text-slate-400 font-medium">Connect your YouTube channel to unlock the dashboard</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-2 text-rose-300 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <PlayCircle className="w-3 h-3 text-rose-400" />
                Channel Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                autoFocus
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                placeholder="e.g. Vansh Bansal"
                className="bg-[#151828] border border-white/[0.08] focus:border-purple-500/50 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all font-medium"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">Channel Handle</label>
              <input
                type="text"
                value={channelHandle}
                onChange={(e) => setChannelHandle(e.target.value)}
                placeholder="@VanshBansal"
                className="bg-[#151828] border border-white/[0.08] focus:border-purple-500/50 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-slate-400" />
              Channel URL
            </label>
            <input
              type="url"
              value={channelUrl}
              onChange={(e) => setChannelUrl(e.target.value)}
              placeholder="https://youtube.com/@VanshBansal"
              className="bg-[#151828] border border-white/[0.08] focus:border-purple-500/50 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all font-medium"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">Niche / Topic</label>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g. Tech, DSA"
                className="bg-[#151828] border border-white/[0.08] focus:border-purple-500/50 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all font-medium"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Users className="w-3 h-3 text-slate-400" />
                Subscribers
              </label>
              <input
                type="text"
                value={subscribers}
                onChange={(e) => setSubscribers(e.target.value)}
                placeholder="e.g. 1.2K"
                className="bg-[#151828] border border-white/[0.08] focus:border-purple-500/50 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all font-medium"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Video className="w-3 h-3 text-slate-400" />
                Total Videos
              </label>
              <input
                type="number"
                min="0"
                value={totalVideos}
                onChange={(e) => setTotalVideos(e.target.value)}
                placeholder="0"
                className="bg-[#151828] border border-white/[0.08] focus:border-purple-500/50 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.06]">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 text-xs font-semibold transition-all cursor-pointer">Cancel</button>
            <button
              type="submit"
              disabled={loading || !channelName.trim()}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-[0_0_14px_rgba(168,85,247,0.4)]"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{loading ? "Setting up..." : "Setup Channel"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Main OverviewTab export
import { YouTubeChannelProfile } from "@/types/youtube";
import { ProfileBannerCard } from "../overview/profile-banner-card";
import { ChannelDetailsCard } from "../overview/channel-details-card";
import { ChannelStatsStrip } from "../overview/channel-stats-strip";
import { ImportantLinksCard } from "../overview/important-links-card";
import { RecentVideosCard } from "../overview/recent-videos-card";
import { ChannelDescriptionCard } from "../overview/channel-description-card";
import { ContentFocusCard } from "../overview/content-focus-card";
import { UploadFrequencyCard } from "../overview/upload-frequency-card";

interface OverviewTabProps {
  profile: YouTubeChannelProfile | null;
  onProfileSetup?: (profile: YouTubeChannelProfile) => void;
}

export function OverviewTab({ profile, onProfileSetup }: OverviewTabProps) {
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [localProfile, setLocalProfile] = useState<YouTubeChannelProfile | null>(profile);

  const activeProfile = localProfile || profile;

  const handleProfileSetup = (data: any) => {
    const builtProfile: YouTubeChannelProfile = {
      ...data,
      id: crypto.randomUUID(),
    };
    setLocalProfile(builtProfile);
    onProfileSetup?.(builtProfile);
    setIsSetupOpen(false);
  };

  if (!activeProfile) {
    return (
      <div className="flex flex-col gap-4 w-full py-4">
        <SetupChannelModal
          isOpen={isSetupOpen}
          onClose={() => setIsSetupOpen(false)}
          onSuccess={handleProfileSetup}
        />

        <div className="flex flex-col items-center justify-center p-16 text-center rounded-2xl bg-[#10131E] border border-dashed border-white/[0.12] w-full gap-5">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <PlayCircle className="w-8 h-8" />
          </div>
          <div className="flex flex-col max-w-sm">
            <h3 className="text-base font-bold text-white tracking-tight">No YouTube Channel Connected Yet</h3>
            <p className="text-xs text-slate-400 font-medium mt-2 leading-relaxed">
              Connect your YouTube channel to track subscribers, manage your content vault, script pipeline, and production tracker — all in one place.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsSetupOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Setup Creator Profile</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full pb-16">
      {/* Top Row: Profile Banner Card (Left) + Channel Details Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <div className="lg:col-span-6">
          <ProfileBannerCard profile={activeProfile} />
        </div>
        <div className="lg:col-span-6">
          <ChannelDetailsCard profile={activeProfile} />
        </div>
      </div>

      {/* Middle Row 1: 6 Statistics Cards Strip */}
      <ChannelStatsStrip profile={activeProfile} />

      {/* Middle Row 2: Important Links Card (1/3) + Recent Videos Card (2/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <div className="lg:col-span-5">
          <ImportantLinksCard profile={activeProfile} />
        </div>
        <div className="lg:col-span-7">
          <RecentVideosCard videos={activeProfile.recent_videos} />
        </div>
      </div>

      {/* Bottom Row: 3 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        <ChannelDescriptionCard description={activeProfile.description} />
        <ContentFocusCard tags={activeProfile.content_focus_tags} />
        <UploadFrequencyCard frequency={activeProfile.upload_frequency} />
      </div>
    </div>
  );
}
