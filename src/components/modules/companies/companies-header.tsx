"use client";

import React from "react";
import { Search, Bell, Briefcase } from "lucide-react";
import { useFounderProfile } from "@/hooks/use-founder-profile";

interface CompaniesHeaderProps {
  searchValue: string;
  onSearchChange: (val: string) => void;
}

export function CompaniesHeader({
  searchValue,
  onSearchChange,
}: CompaniesHeaderProps) {
  const { profile } = useFounderProfile();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-white/[0.04] mb-3">
      {/* Title & Badge */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-400 shrink-0">
          <Briefcase className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-white tracking-tight leading-none">
            Companies
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Track all the companies you have applied to.
          </p>
        </div>
      </div>

      {/* Right Controls: Search, Notification Bell, Avatar */}
      <div className="flex items-center gap-3">
        <div className="relative w-64 sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search companies..."
            className="w-full bg-[#10131E] border border-white/[0.08] hover:border-white/[0.14] focus:border-purple-500/50 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
          />
        </div>

        {/* Notifications Icon with Badge */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative w-8 h-8 rounded-xl bg-[#10131E] border border-white/[0.08] hover:border-white/[0.14] flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <Bell className="w-3.5 h-3.5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-[#090A10]">
            3
          </span>
        </button>

        {/* User Profile Avatar */}
        <div className="w-8 h-8 rounded-xl overflow-hidden border border-purple-500/30 bg-[#151726] flex items-center justify-center shrink-0">
          {profile?.resolved_avatar_url ? (
            <img src={profile.resolved_avatar_url} alt="Vansh" className="w-full h-full object-cover" />
          ) : (
            <span className="text-[11px] font-bold text-purple-300">VB</span>
          )}
        </div>
      </div>
    </div>
  );
}
