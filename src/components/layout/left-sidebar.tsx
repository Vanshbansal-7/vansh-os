"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, RefreshCw, PanelLeftClose } from "lucide-react";
import { useNavigation } from "@/hooks/use-navigation";
import { useDashboardRefresh } from "@/hooks/use-dashboard-refresh";
import { MiniCalendarWidget } from "./mini-calendar-widget";
import { useLayoutStore } from "@/store/use-layout-store";

export function LeftSidebar() {
  const pathname = usePathname();
  const { items } = useNavigation();
  const { handleLogoClick, isRefreshing } = useDashboardRefresh();
  const toggleLeftSidebar = useLayoutStore((state) => state.toggleLeftSidebar);

  return (
    <aside className="w-[215px] xl:w-[225px] shrink-0 h-screen sticky top-0 flex flex-col justify-between p-3 bg-[#0A0B12] border-r border-white/[0.07] select-none z-30 overflow-hidden">
      <div className="flex flex-col gap-3 h-full">
        {/* Official VOS Brand Header & Collapse Button */}
        <div className="flex items-center justify-between w-full">
          <button
            onClick={handleLogoClick}
            type="button"
            title="Click to navigate home or refresh dashboard data"
            className="flex items-center gap-2 px-1 py-1 group text-left cursor-pointer focus:outline-none"
          >
            <div className="w-7 h-7 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform relative">
              <img
                src="/assets/v_logo_transparent.png"
                alt="VOS"
                className="w-6 h-6 object-contain drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]"
              />
              {isRefreshing && (
                <RefreshCw className="w-3 h-3 text-purple-400 absolute animate-spin" />
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold text-[14px] tracking-tight text-white leading-none">
                VOS
              </span>
              <span className="text-[8.5px] text-purple-300/80 font-medium tracking-wide mt-0.5 truncate">
                Vansh Operating System
              </span>
            </div>
          </button>

          <button 
            onClick={toggleLeftSidebar}
            className="p-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] text-slate-400 hover:text-white transition-colors flex items-center justify-center cursor-pointer border border-transparent hover:border-white/5"
            title="Collapse Sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

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

        {/* Mini Calendar injected below navigation */}
        <div className="mt-4">
          <MiniCalendarWidget />
        </div>
      </div>
    </aside>
  );
}
