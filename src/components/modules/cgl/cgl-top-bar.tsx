"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Search, Bell } from "lucide-react";
import { useFounderProfile } from "@/hooks/use-founder-profile";

interface CGLTopBarProps {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
}

export function CGLTopBar({
  searchPlaceholder = "Search in CGL...",
  searchValue = "",
  onSearchChange,
}: CGLTopBarProps) {
  const { profile } = useFounderProfile();

  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-white/[0.04] mb-3">
      {/* Back to Dashboard Navigation */}
      <Link
        href="/"
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition-all text-xs font-semibold group cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
        <span>CGL Module</span>
      </Link>

      {/* Center Search Input & Context Controls */}
      <div className="flex items-center gap-3">
        <div className="relative w-64 sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full bg-[#10131E] border border-white/[0.08] hover:border-white/[0.14] focus:border-purple-500/50 rounded-xl pl-9 pr-12 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-slate-400 border border-white/[0.08]">
            ⌘ F
          </kbd>
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
            <img
              src={profile.resolved_avatar_url}
              alt="Vansh"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-[11px] font-bold text-purple-300">VB</span>
          )}
        </div>
      </div>
    </div>
  );
}
