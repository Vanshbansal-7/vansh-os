"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, RefreshCw } from "lucide-react";
import { useNavigation } from "@/hooks/use-navigation";
import { useFounderProfile } from "@/hooks/use-founder-profile";
import { useDashboardRefresh } from "@/hooks/use-dashboard-refresh";

export function LeftSidebar() {
  const pathname = usePathname();
  const { items } = useNavigation();
  const { profile } = useFounderProfile();
  const { handleLogoClick, isRefreshing } = useDashboardRefresh();

  return (
    <aside className="w-[215px] xl:w-[225px] shrink-0 h-screen sticky top-0 flex flex-col justify-between p-3 bg-[#0A0B12] border-r border-white/[0.07] select-none z-30 overflow-y-auto">
      <div className="flex flex-col gap-3">
        {/* Official VOS Brand Header — Interactive SPA Logo with Refresh */}
        <button
          onClick={handleLogoClick}
          type="button"
          title="Click to navigate home or refresh dashboard data"
          className="flex items-center gap-2.5 px-1 py-1 group text-left w-full cursor-pointer focus:outline-none"
        >
          <div className="w-8 h-8 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform relative">
            <img
              src="/assets/v_logo_transparent.png"
              alt="VOS"
              className="w-7 h-7 object-contain drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]"
            />
            {isRefreshing && (
              <RefreshCw className="w-3.5 h-3.5 text-purple-400 absolute animate-spin" />
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-extrabold text-[15px] tracking-tight text-white leading-none">
              VOS
            </span>
            <span className="text-[9.5px] text-purple-300/80 font-medium tracking-wide mt-0.5 truncate">
              Vansh Operating System
            </span>
          </div>
        </button>

        {/* Dynamic Config-Driven Navigation Items */}
        <nav className="flex flex-col gap-0.5 mt-1">
          {items.map((item) => {
            const isActive =
              pathname === item.route ||
              (item.route !== "/" && pathname.startsWith(item.route));
            const Icon = item.icon;

            return (
              <Link
                key={item.id}
                href={item.route}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12.5px] font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_2px_12px_rgba(124,58,237,0.4)] border border-purple-400/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent"
                }`}
              >
                <div
                  className={`flex items-center justify-center shrink-0 ${
                    isActive ? "text-white" : "text-slate-400"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="truncate">{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section — Natural Reflow with Founder Profile Card */}
      <div className="flex flex-col gap-2 mt-4 pt-2 border-t border-white/[0.04]">
        <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.07] transition-colors cursor-pointer group">
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative shrink-0">
              <div className="w-7 h-7 rounded-full overflow-hidden border border-purple-400/40 shadow-sm flex items-center justify-center bg-[#151726]">
                {profile?.resolved_avatar_url ? (
                  <img
                    src={profile.resolved_avatar_url}
                    alt={profile.display_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <span className="text-[10px] font-bold text-purple-200 tracking-wider">
                    {profile?.initials || "VB"}
                  </span>
                )}
              </div>
              <span className="absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full bg-emerald-500 border border-[#0A0B12]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11.5px] font-bold text-white truncate leading-tight">
                {profile?.display_name || "Vansh Bansal"}
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[8.5px] font-extrabold text-purple-300 uppercase tracking-widest px-1.5 py-0.2 rounded bg-purple-500/20 border border-purple-400/30">
                  {profile?.role || "FOUNDER"}
                </span>
              </div>
            </div>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all shrink-0" />
        </div>
      </div>
    </aside>
  );
}
