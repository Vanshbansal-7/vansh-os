"use client";

import React from "react";
import Link from "next/link";
import { Search, Bell, Flame, ChevronRight } from "lucide-react";
import { useDashboard } from "@/hooks/use-dashboard";
import { useStreakStore, getISTDate, getISTDateString, getTodayIST } from "@/hooks/use-streak-store";

export function TopHeader() {
  const { greeting, userName, currentDateFormatted } = useDashboard();
  const { currentStreak, loginDateSet, checkedInToday } = useStreakStore();

  const weeklyPattern = React.useMemo(() => {
    const today = getISTDate();
    const currentDay = today.getDay(); // 0 is Sunday, 1 is Monday in IST
    const diffToMonday = currentDay === 0 ? 6 : currentDay - 1; 
    
    const monday = new Date(today);
    monday.setDate(today.getDate() - diffToMonday);
    
    const pattern = [];
    const dayNames = ["M", "T", "W", "T", "F", "S", "S"];
    
    const todayStr = getTodayIST();
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = getISTDateString(d);
      
      let status = "pending";
      if (loginDateSet.has(dateStr)) {
        status = "completed";
      } else if (dateStr === todayStr) {
        status = "active";
      }
      
      pattern.push({ day: dayNames[i], status });
    }
    
    return pattern;
  }, [loginDateSet]);

  return (
    <header className="flex flex-col gap-3 pt-0.5 pb-1">
      {/* Top Search & Notifications Bar */}
      <div className="flex items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            readOnly
            onClick={() => {
              // Trigger ⌘ K modal event
              window.dispatchEvent(
                new KeyboardEvent("keydown", { key: "k", metaKey: true })
              );
            }}
            placeholder="Search anything... ( ⌘ K )"
            className="w-full h-9 pl-9 pr-4 rounded-xl bg-[#101320] border border-white/[0.08] text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-purple-500/50 transition-all shadow-sm cursor-pointer"
          />
        </div>

        {/* Top Right Utilities */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="relative w-8 h-8 rounded-xl bg-[#101320] hover:bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-[8.5px] font-extrabold text-white flex items-center justify-center shadow-sm">
              3
            </span>
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-purple-400/40 shadow-sm cursor-pointer hover:scale-105 transition-transform">
            <img
              src="/assets/founder_avatar.png"
              alt="Vansh"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Dynamic Greeting & Live Streak Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-col">
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-1.5 leading-tight">
            {greeting}, {userName}! <span className="inline-block">👋</span>
          </h1>
          <p className="text-xs font-medium text-slate-400 mt-0.5">
            {currentDateFormatted}
          </p>
        </div>

        {/* Live Streak Widget with Chevron Dropdown Navigation to /streak */}
        <Link
          href="/streak"
          className="flex items-center gap-3.5 px-3.5 py-1.5 rounded-xl bg-[#101320] hover:bg-[#141828] border border-white/[0.08] hover:border-purple-500/40 transition-all shadow-sm group cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 fill-fuchsia-500 text-fuchsia-500 group-hover:scale-110 transition-transform" />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white leading-none">
                {currentStreak}
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5 flex items-center gap-0.5">
                <span>Day Streak</span>
                <ChevronRight className="w-3 h-3 text-fuchsia-500 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>

          <div className="h-5 w-[1px] bg-white/[0.08]" />

          {/* 7-Day Cycle Dots from real streak data */}
          <div className="flex items-center gap-1.5">
            {weeklyPattern.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <span className="text-[9px] font-bold text-slate-400">{item.day}</span>
                <div
                  className={`w-3 h-3 rounded-full flex items-center justify-center transition-all ${
                    item.status === "active"
                      ? "border-2 border-fuchsia-500 bg-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,0.6)]"
                      : item.status === "completed"
                      ? "bg-purple-500 border border-purple-400"
                      : "bg-white/[0.05] border border-white/[0.1]"
                  }`}
                >
                  {item.status === "completed" && (
                    <div className="w-1 h-1 rounded-full bg-[#101320]" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </Link>
      </div>
    </header>
  );
}
