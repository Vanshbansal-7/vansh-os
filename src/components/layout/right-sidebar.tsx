"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Droplet,
  Flame,
  Footprints,
  BookOpen,
  Target,
  Smartphone,
  Plus,
  Compass,
  TrendingUp,
  Calendar as CalendarIcon,
  Play,
  FileEdit,
  CheckCircle,
  Sparkles,
} from "lucide-react";

export function RightSidebar() {
  const calendarDays = [
    { day: 28, isCurrentMonth: false },
    { day: 29, isCurrentMonth: false },
    { day: 30, isCurrentMonth: false },
    { day: 1, isCurrentMonth: true },
    { day: 2, isCurrentMonth: true },
    { day: 3, isCurrentMonth: true },
    { day: 4, isCurrentMonth: true },
    { day: 5, isCurrentMonth: true },
    { day: 6, isCurrentMonth: true },
    { day: 7, isCurrentMonth: true },
    { day: 8, isCurrentMonth: true },
    { day: 9, isCurrentMonth: true },
    { day: 10, isCurrentMonth: true },
    { day: 11, isCurrentMonth: true },
    { day: 12, isCurrentMonth: true },
    { day: 13, isCurrentMonth: true, isToday: true },
    { day: 14, isCurrentMonth: true },
    { day: 15, isCurrentMonth: true },
    { day: 16, isCurrentMonth: true },
    { day: 17, isCurrentMonth: true },
    { day: 18, isCurrentMonth: true },
    { day: 19, isCurrentMonth: true },
    { day: 20, isCurrentMonth: true },
    { day: 21, isCurrentMonth: true },
    { day: 22, isCurrentMonth: true },
    { day: 23, isCurrentMonth: true },
    { day: 24, isCurrentMonth: true },
    { day: 25, isCurrentMonth: true },
    { day: 26, isCurrentMonth: true },
    { day: 27, isCurrentMonth: true },
    { day: 28, isCurrentMonth: true },
    { day: 29, isCurrentMonth: true },
    { day: 30, isCurrentMonth: true },
    { day: 31, isCurrentMonth: true },
    { day: 1, isCurrentMonth: false },
  ];

  const timetable = [
    { time: "07:00 - 08:00", title: "Wake Up & Fresh" },
    { time: "08:00 - 09:30", title: "DSA – Graphs & DP" },
    { time: "09:30 - 10:00", title: "Break" },
    { time: "10:00 - 11:30", title: "Core Subjects – OS Unit 4" },
    { time: "11:30 - 12:00", title: "Break" },
    { time: "12:00 - 13:00", title: "Apply to 2 Companies" },
    { time: "13:00 - 14:00", title: "Lunch & Rest" },
    { time: "14:00 - 15:00", title: "SSC CGL – Quant Practice" },
    { time: "15:00 - 16:30", title: "DBMS Revision & Practice" },
    { time: "16:30 - 17:00", title: "Break" },
    { time: "17:00 - 19:00", title: "Defense Prep – Navy" },
    { time: "19:00 - 20:00", title: "Football Training" },
    { time: "20:00 - 21:00", title: "Dinner & Family" },
    { time: "21:00 - 22:00", title: "Read + Journal" },
    { time: "22:00 - 22:30", title: "Plan Tomorrow" },
    { time: "22:30", title: "Sleep" },
  ];

  const progressMetrics = [
    {
      label: "Water",
      value: "2.2 / 3 L",
      percentage: 73,
      icon: Droplet,
      color: "from-sky-500 to-blue-600",
      textColor: "text-sky-400",
    },
    {
      label: "Calories",
      value: "1,680 / 2,400",
      percentage: 70,
      icon: Flame,
      color: "from-amber-500 to-orange-600",
      textColor: "text-amber-400",
    },
    {
      label: "Steps",
      value: "7,532 / 10K",
      percentage: 75,
      icon: Footprints,
      color: "from-teal-500 to-emerald-600",
      textColor: "text-teal-400",
    },
    {
      label: "Study Hrs",
      value: "5h 20m",
      percentage: 87,
      icon: BookOpen,
      color: "from-purple-500 to-indigo-600",
      textColor: "text-purple-400",
    },
    {
      label: "Focus Hrs",
      value: "2h 45m",
      percentage: 68,
      icon: Target,
      color: "from-rose-500 to-pink-600",
      textColor: "text-rose-400",
    },
    {
      label: "Screen Time",
      value: "4h 15m",
      percentage: 60,
      icon: Smartphone,
      color: "from-yellow-500 to-amber-600",
      textColor: "text-yellow-400",
    },
  ];

  const quickActions = [
    { label: "Add Task", icon: Plus, bg: "bg-amber-500/20 text-amber-300 border-amber-400/30" },
    { label: "Add Goal", icon: Compass, bg: "bg-pink-500/20 text-pink-300 border-pink-400/30" },
    { label: "Log Progress", icon: TrendingUp, bg: "bg-sky-500/20 text-sky-300 border-sky-400/30" },
    { label: "Add Deadline", icon: CalendarIcon, bg: "bg-rose-500/20 text-rose-300 border-rose-400/30" },
    { label: "Start Focus", icon: Target, bg: "bg-purple-500/20 text-purple-300 border-purple-400/30" },
    { label: "Notes", icon: FileEdit, bg: "bg-yellow-500/20 text-yellow-300 border-yellow-400/30" },
    { label: "Habit Tracker", icon: CheckCircle, bg: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30" },
    { label: "AI Assistant", icon: Sparkles, bg: "bg-indigo-500/20 text-indigo-300 border-indigo-400/30" },
  ];

  return (
    <aside className="w-[260px] xl:w-[275px] shrink-0 h-screen sticky top-0 flex flex-col gap-3 p-3 bg-[#0A0B12] border-l border-white/[0.07] select-none z-20 overflow-y-auto">
      {/* 1. Mini-Calendar Widget */}
      <div className="rounded-2xl p-3 bg-[#10131E] border border-white/[0.08] shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-white tracking-tight">May 2025</span>
          <div className="flex items-center gap-1">
            <button className="w-4 h-4 rounded hover:bg-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white transition-colors">
              <ChevronLeft className="w-3 h-3" />
            </button>
            <button className="w-4 h-4 rounded hover:bg-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white transition-colors">
              <ChevronRight className="w-3 h-3" />
            </button>
            <span className="px-1.5 py-0.5 rounded-md bg-white/[0.06] text-[8.5px] font-bold text-slate-300">
              Today
            </span>
          </div>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-0.5 text-center mb-0.5">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <span key={d} className="text-[8.5px] font-semibold text-slate-500">
              {d}
            </span>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-0.5 text-center">
          {calendarDays.map((c, idx) => (
            <div
              key={idx}
              className={`h-5 flex items-center justify-center text-[10px] font-semibold rounded-full cursor-pointer transition-all ${
                c.isToday
                  ? "bg-purple-600 text-white font-bold shadow-[0_0_8px_rgba(139,92,246,0.8)]"
                  : c.isCurrentMonth
                  ? "text-slate-300 hover:bg-white/[0.08]"
                  : "text-slate-600"
              }`}
            >
              {c.day}
            </div>
          ))}
        </div>

        {/* Upcoming Deadline Pill */}
        <div className="mt-2.5 pt-2 border-t border-white/[0.06] flex flex-col gap-1">
          <div className="flex items-center justify-between text-[9.5px]">
            <div className="flex items-center gap-1 text-slate-400 font-medium">
              <Clock className="w-3 h-3 text-purple-400" />
              <span>Upcoming Deadline</span>
            </div>
            <Link href="/career" className="text-slate-400 hover:text-white font-semibold">
              View All
            </Link>
          </div>
          <div className="flex items-center justify-between p-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-bold text-white leading-tight truncate">
                Navy Form Submission
              </span>
              <span className="text-[8.5px] font-medium text-slate-400 mt-0.5">May 15, 2025</span>
            </div>
            <span className="px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[8.5px] font-bold border border-rose-500/30">
              2 Days Left
            </span>
          </div>
        </div>
      </div>

      {/* 2. Daily Timetable - Complete Visibility Without Internal Scrolling */}
      <div className="rounded-2xl p-3.5 bg-[#10131E] border border-white/[0.08] shadow-sm flex flex-col">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs font-bold text-white tracking-tight">Daily Timetable</h3>
          <span className="text-[9.5px] font-semibold text-slate-400 cursor-pointer hover:text-white">
            Today ▾
          </span>
        </div>

        <div className="flex flex-col divide-y divide-white/[0.04]">
          {timetable.map((t, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-[11px] py-1 text-slate-300 hover:text-white transition-colors"
            >
              <span className="text-[9.5px] font-mono text-slate-400 shrink-0">{t.time}</span>
              <span className="font-medium text-[10.5px] truncate text-right ml-2 text-slate-200">
                {t.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Daily Progress Telemetry */}
      <div className="rounded-2xl p-3 bg-[#10131E] border border-white/[0.08] shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-white tracking-tight">Daily Progress</h3>
          <span className="text-[9.5px] font-semibold text-slate-400">Today</span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {progressMetrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div key={idx} className="flex flex-col p-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center gap-1 mb-0.5">
                  <Icon className={`w-2.5 h-2.5 ${m.textColor}`} />
                  <span className="text-[8.5px] font-medium text-slate-400 truncate">{m.label}</span>
                </div>
                <span className="text-[10px] font-bold text-white leading-tight">{m.value}</span>
                <div className="w-full h-1 rounded-full bg-[#181D2B] overflow-hidden mt-1">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${m.color}`}
                    style={{ width: `${m.percentage}%` }}
                  />
                </div>
                <span className="text-[8px] font-bold text-slate-500 text-right mt-0.5">
                  {m.percentage}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Quick Actions (4x2 Grid) */}
      <div className="rounded-2xl p-3 bg-[#10131E] border border-white/[0.08] shadow-sm mb-2">
        <h3 className="text-xs font-bold text-white tracking-tight mb-2.5">Quick Actions</h3>
        <div className="grid grid-cols-4 gap-2 text-center">
          {quickActions.map((qa, idx) => {
            const Icon = qa.icon;
            return (
              <button
                key={idx}
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
              >
                <div
                  className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-105 ${qa.bg}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[8.5px] font-medium text-slate-400 group-hover:text-slate-200 transition-colors leading-tight text-center">
                  {qa.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
