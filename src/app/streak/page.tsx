"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Flame, Zap, Trophy, Heart } from "lucide-react";
import { useStreakStore } from "@/hooks/use-streak-store";

// ─── SVG Circular Progress Ring ──────────────────────────────────────
function CircularProgress({ percentage }: { percentage: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-32 h-32">
      {/* Background Track */}
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="64"
          cy="64"
          r={radius}
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth="10"
          fill="none"
        />
        {/* Progress Fill */}
        <circle
          cx="64"
          cy="64"
          r={radius}
          stroke="url(#purpleGradient)"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d946ef" /> {/* Fuchsia */}
            <stop offset="100%" stopColor="#7c3aed" /> {/* Violet */}
          </linearGradient>
        </defs>
      </svg>
      
      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-full shadow-[0_0_40px_rgba(168,85,247,0.3)] pointer-events-none" />

      {/* Inner Icon */}
      <div className="absolute flex items-center justify-center">
        <Flame className="w-10 h-10 text-amber-500 fill-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]" />
      </div>
    </div>
  );
}

// Formats a Date object to YYYY-MM-DD using its local values
function formatDateLocal(d: Date) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDaysDiff(d1Str: string, d2Str: string) {
  const d1 = new Date(`${d1Str}T00:00:00Z`);
  const d2 = new Date(`${d2Str}T00:00:00Z`);
  return Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}

// ─── Yearly Consistency Graph (Month-by-Month Style) ───────────────────────
function YearlyConsistencyGraph({ loginDateSet }: { loginDateSet: Set<string> }) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const daysOfWeek = ["Mon", "", "Wed", "", "Fri", "", "Sun"];
  const viewYear = new Date().getFullYear();

  // Calculate actual streak history for exact milestone rendering
  const streakHistory = new Map<string, number>();
  const sortedDates = Array.from(loginDateSet).sort();
  let runningStreak = 0;
  let lastDateStr: string | null = null;
  for (const d of sortedDates) {
    if (!lastDateStr) {
      runningStreak = 1;
    } else {
      const diff = getDaysDiff(lastDateStr, d);
      if (diff === 1) {
        runningStreak++;
      } else if (diff > 1) {
        runningStreak = 1;
      }
    }
    streakHistory.set(d, runningStreak);
    lastDateStr = d;
  }

  // Generate 12 distinct month grids
  const monthsData = Array.from({ length: 12 }, (_, monthIndex) => {
    const daysInMonth = new Date(viewYear, monthIndex + 1, 0).getDate();
    const firstDay = new Date(viewYear, monthIndex, 1).getDay();
    // Monday = 0, Sunday = 6
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;
    
    const weeks: ({ date: string; hasLogin: boolean } | null)[][] = [];
    let currentWeek: ({ date: string; hasLogin: boolean } | null)[] = Array(7).fill(null);
    
    let currentDayIndex = startOffset;
    for (let date = 1; date <= daysInMonth; date++) {
      const dateStr = formatDateLocal(new Date(viewYear, monthIndex, date));
      currentWeek[currentDayIndex] = {
        date: dateStr,
        hasLogin: loginDateSet.has(dateStr),
      };
      
      currentDayIndex++;
      if (currentDayIndex === 7) {
        weeks.push(currentWeek);
        currentWeek = Array(7).fill(null);
        currentDayIndex = 0;
      }
    }
    
    if (currentDayIndex > 0) {
      weeks.push(currentWeek);
    }
    
    return {
      name: months[monthIndex],
      weeks
    };
  });

  const getCellState = (hasLogin: boolean, dateStr: string) => {
    const today = formatDateLocal(new Date());
    
    // Future and Empty past dates use the same empty box style
    if (dateStr > today || !hasLogin) {
      return { color: "bg-[#1A1625] border-[#2A2338]", milestone: 0 };
    }
    
    // Exact milestones based on real streak
    const streakOnDate = streakHistory.get(dateStr) || 0;
    const milestoneDays = [7, 14, 30, 60, 100, 365];
    
    if (milestoneDays.includes(streakOnDate)) {
      return { color: "bg-[#F59E0B] shadow-[0_0_8px_rgba(245,158,11,0.5)] border-[#F59E0B]", milestone: streakOnDate };
    }
    
    return { color: "bg-[#6D28D9] border-[#6D28D9]", milestone: 0 }; // Logged In (Dark Purple)
  };

  return (
    <div className="w-full rounded-2xl bg-[#0B0912] border border-[#221636] p-7 mt-6 shadow-xl overflow-hidden">
      <div className="flex items-baseline gap-4 mb-8">
        <h2 className="text-[15px] font-bold text-white tracking-tight">Yearly Consistency</h2>
        <span className="text-xs text-slate-500 font-medium">Jan — Dec {viewYear}</span>
      </div>

      <div className="overflow-x-auto no-scrollbar pb-2">
        <div className="min-w-max flex gap-2">
          
          {/* Y-Axis Labels */}
          <div className="flex flex-col gap-[4px] shrink-0 pt-6">
            {daysOfWeek.map((d, i) => (
              <span key={i} className="text-[10px] font-medium text-slate-500 h-[11px] leading-[11px] flex items-center justify-end w-6 pr-1">
                {d}
              </span>
            ))}
          </div>

          {/* 12 Month Blocks */}
          <div className="flex gap-4">
            {monthsData.map((month, mi) => (
              <div key={mi} className="flex flex-col gap-2">
                <span className="text-[10px] font-medium text-slate-500 pl-1">{month.name}</span>
                <div className="flex gap-[4px]">
                  {month.weeks.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-[4px]">
                      {week.map((cell, di) => {
                        if (!cell) return <div key={di} className="w-[11px] h-[11px]" />;
                        const state = getCellState(cell.hasLogin, cell.date);
                        
                        // Beautiful Custom Tooltip
                        const dateFormatted = new Date(cell.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                        
                        return (
                          <div key={di} className="w-[11px] h-[11px] relative group cursor-pointer">
                            <div
                              className={`w-[11px] h-[11px] rounded-[3px] border transition-all ${state.color}`}
                            />
                            {/* Hover Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center z-50 pointer-events-none">
                              <div className="bg-[#120F1D] border border-[#3A225A] shadow-[0_4px_20px_rgba(0,0,0,0.5)] rounded-lg px-3 py-2 flex flex-col items-center gap-1 whitespace-nowrap">
                                <span className="text-white text-[11px] font-bold tracking-wide">{dateFormatted}</span>
                                {cell.hasLogin ? (
                                  state.milestone > 0 ? (
                                    <span className="text-[#F59E0B] text-[10px] font-bold uppercase tracking-widest">{state.milestone} Day Milestone! 🏆</span>
                                  ) : (
                                    <span className="text-purple-400 text-[10px] font-medium">Logged In 🔥</span>
                                  )
                                ) : (
                                  <span className="text-slate-500 text-[10px] font-medium">No Activity</span>
                                )}
                              </div>
                              <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-[#3A225A] mt-[1px]" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-6 ml-8 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-[3px] bg-[#1A1625] border border-[#2A2338]" />
          <span className="text-[11px] text-slate-500 font-medium">No Activity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-[3px] bg-[#6D28D9]" />
          <span className="text-[11px] text-slate-500 font-medium">Logged In</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-[3px] bg-[#F59E0B]" />
          <span className="text-[11px] text-slate-500 font-medium">Milestone</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────
export default function StreakDashboardPage() {
  const { currentStreak, longestStreak, totalDays, isLoading, loginDateSet, checkIn, checkedInToday } = useStreakStore();

  const milestones = [
    { days: 7, label: "First Step", title: "7 Days" },
    { days: 14, label: "Building", title: "14 Days" },
    { days: 30, label: "Consistent", title: "30 Days" },
    { days: 60, label: "Dedicated", title: "60 Days" },
    { days: 100, label: "Unstoppable", title: "100 Days" },
    { days: 365, label: "Legend", title: "365 Days" },
  ];

  if (isLoading) {
    return <div className="min-h-screen bg-[#07050A]" />;
  }

  // Calculate visual progress along the timeline nodes
  const calculateTimelineProgress = (streak: number) => {
    if (streak === 0) return 0;
    if (streak >= 365) return 100;
    
    for (let i = 0; i < milestones.length - 1; i++) {
      if (streak >= milestones[i].days && streak < milestones[i + 1].days) {
        const segmentStart = i * 20; // 5 segments total = 20% each
        const segmentLength = 20;
        const streakDiff = streak - milestones[i].days;
        const milestoneDiff = milestones[i+1].days - milestones[i].days;
        return segmentStart + (streakDiff / milestoneDiff) * segmentLength;
      }
    }
    // If it's less than first milestone (7)
    return (streak / milestones[0].days) * 20;
  };
  
  const timelineProgressPercent = calculateTimelineProgress(currentStreak);
  
  // Calculate progress percentage based on next milestone for the circular ring
  const nextMilestone = milestones.find(m => m.days > currentStreak)?.days || 365;
  const ringProgressPercent = (currentStreak / nextMilestone) * 100;

  return (
    <div className="min-h-screen bg-[#07050A] text-white p-4 sm:p-8 font-sans selection:bg-purple-500/30">
      <div className="max-w-6xl mx-auto flex flex-col pb-16">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-5">
            <Link 
              href="/"
              className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center hover:bg-white/[0.08] text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex flex-col">
              <h1 className="text-[22px] font-bold tracking-tight text-white leading-tight">Streak</h1>
              <p className="text-[13px] text-slate-400 font-medium">Consistency is built one day at a time.</p>
            </div>
          </div>
          
          <button 
            onClick={checkIn}
            disabled={checkedInToday}
            className={`px-4 py-2 rounded-full border flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(109,40,217,0.15)] ${
              checkedInToday 
                ? "bg-[#1A1225] border-[#3A225A]" 
                : "bg-[#d946ef]/20 border-[#d946ef]/50 hover:bg-[#d946ef]/30 cursor-pointer shadow-[0_0_20px_rgba(217,70,239,0.3)] animate-pulse"
            }`}
          >
            <Flame className={`w-4 h-4 ${checkedInToday ? "fill-amber-500 text-amber-500" : "fill-white text-white"}`} />
            <span className="text-[13px] font-bold text-white tracking-wide">
              {checkedInToday ? `${currentStreak} day streak` : "Check In Now"}
            </span>
          </button>
        </div>

        {/* Hero Card */}
        <div className="w-full rounded-[20px] bg-gradient-to-br from-[#0D0B14] to-[#120F1D] border border-[#221636] p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
          {/* Subtle bg glow */}
          <div className="absolute -left-32 -top-32 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="flex items-center gap-8 relative z-10">
            <CircularProgress percentage={ringProgressPercent} />
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                CURRENT STREAK
              </span>
              <div className="flex items-baseline gap-2.5">
                <span className="text-[64px] font-black text-white tracking-tighter leading-none">
                  {currentStreak}
                </span>
                <span className="text-lg font-bold text-slate-400">days</span>
              </div>
              <span className="text-[13px] font-bold text-[#A855F7] mt-2">
                You're on a roll.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-12 pr-4 sm:pr-8 mt-8 sm:mt-0 relative z-10">
            <div className="flex flex-col items-center">
              <span className="text-[40px] font-extrabold text-white leading-none">{longestStreak}</span>
              <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mt-2">
                Longest Streak
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[40px] font-extrabold text-white leading-none">{totalDays}</span>
              <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mt-2">
                Active Days
              </span>
            </div>
          </div>
        </div>

        {/* Yearly Consistency Grid */}
        <YearlyConsistencyGraph loginDateSet={loginDateSet} />

        {/* Consistency Milestones */}
        <div className="w-full rounded-2xl bg-[#0B0912] border border-[#221636] p-7 sm:p-9 mt-6 shadow-xl relative overflow-hidden">
          <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-10">
            CONSISTENCY MILESTONES
          </h2>
          
          <div className="relative w-full px-2 sm:px-8">
            {/* Track Line */}
            <div className="absolute left-8 right-8 top-5 h-[2px] bg-[#1A1625]" />
            {/* Active Track Line */}
            <div 
              className="absolute left-8 top-5 h-[2px] bg-gradient-to-r from-fuchsia-500 to-purple-600 transition-all duration-1000 shadow-[0_0_10px_rgba(168,85,247,0.5)]" 
              style={{ width: `calc(${Math.min(timelineProgressPercent, 100)}% - 4rem)` }} 
            />

            <div className="relative flex justify-between">
              {milestones.map((m, idx) => {
                const isUnlocked = currentStreak >= m.days;
                return (
                  <div key={idx} className="flex flex-col items-center relative group">
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10 transition-all duration-500 ${
                        isUnlocked 
                          ? "bg-gradient-to-br from-fuchsia-500 to-purple-600 shadow-[0_0_20px_rgba(168,85,247,0.5)] scale-110" 
                          : "bg-[#0B0912] border-2 border-[#2A2338]"
                      }`}
                    >
                      {isUnlocked ? (
                        <Check className="w-5 h-5 text-white" />
                      ) : (
                        <span className="text-[11px] font-bold text-slate-500">{m.days}</span>
                      )}
                    </div>
                    <div className="absolute top-14 flex flex-col items-center w-24 text-center">
                      <span className={`text-[13px] font-bold ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                        {m.title}
                      </span>
                      <span className={`text-[11px] font-medium mt-0.5 ${isUnlocked ? 'text-[#A855F7]' : 'text-slate-600'}`}>
                        {m.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Pad bottom for absolute text */}
          <div className="h-12" />
        </div>



        {/* Footer Motif */}
        <div className="flex flex-col items-center justify-center py-16 mt-4 text-center">
          <h2 className="text-lg font-bold text-[#A855F7] mb-2 tracking-tight">Don't break the chain.</h2>
          <p className="text-[13px] text-slate-400 font-medium">Every day you show up is another day added to your story.</p>
        </div>

      </div>
    </div>
  );
}
