"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Flame, Award, Calendar, CheckCircle2, Zap, Trophy, ShieldCheck } from "lucide-react";
import { useStreak } from "@/hooks/use-streak";

export default function StreakDashboardPage() {
  const { currentStreak, weeklyPattern } = useStreak();
  const [hasCheckedInToday, setHasCheckedInToday] = useState(true);

  const bestStreak = 42;
  const totalCheckins = 42;

  // 30-Day Heatmap Data
  const heatmapDays = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    isCompleted: i < 28,
  }));

  const badges = [
    { title: "7-Day Pioneer", desc: "Maintained a 7-day streak", icon: Zap, unlocked: true },
    { title: "30-Day Discipline", desc: "30 consecutive days logged in", icon: ShieldCheck, unlocked: true },
    { title: "100-Day Legend", desc: "Century streak master", icon: Trophy, unlocked: false },
    { title: "Early Riser", desc: "Checked in before 7:00 AM IST", icon: Award, unlocked: true },
  ];

  return (
    <div className="flex flex-col gap-5 w-full pb-20 min-h-screen">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 py-2 border-b border-white/[0.04]">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition-all text-xs font-semibold group cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Dashboard</span>
          </Link>
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400 shrink-0">
            <Flame className="w-4 h-4 fill-amber-400" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-white tracking-tight leading-none">
              Streak Command Center
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Track daily founder consistency and log-in momentum.
            </p>
          </div>
        </div>

        <button
          onClick={() => setHasCheckedInToday(true)}
          disabled={hasCheckedInToday}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
            hasCheckedInToday
              ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
              : "bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_12px_rgba(251,191,36,0.5)]"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{hasCheckedInToday ? "Checked In Today ✓" : "Check In Now"}</span>
        </button>
      </div>

      {/* Top Telemetry Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Current Streak */}
        <div className="p-5 rounded-2xl bg-[#10131E] border border-amber-500/30 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Flame className="w-6 h-6 fill-amber-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold text-white tracking-tight">
              {currentStreak} Days
            </span>
            <span className="text-xs font-semibold text-slate-400 mt-0.5">
              Current Active Streak
            </span>
          </div>
        </div>

        {/* Card 2: Longest Streak */}
        <div className="p-5 rounded-2xl bg-[#10131E] border border-white/[0.08] flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold text-white tracking-tight">
              {bestStreak} Days
            </span>
            <span className="text-xs font-semibold text-slate-400 mt-0.5">
              Best Personal Record
            </span>
          </div>
        </div>

        {/* Card 3: Total Check-ins */}
        <div className="p-5 rounded-2xl bg-[#10131E] border border-white/[0.08] flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold text-white tracking-tight">
              {totalCheckins} Days
            </span>
            <span className="text-xs font-semibold text-slate-400 mt-0.5">
              Total Logged Days
            </span>
          </div>
        </div>
      </div>

      {/* Monthly Consistency Heatmap Grid */}
      <div className="rounded-2xl p-5 bg-[#10131E] border border-white/[0.08] flex flex-col gap-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white tracking-tight">
            30-Day Consistency Heatmap
          </h2>
          <span className="text-xs text-amber-400 font-bold">
            93.3% Consistency Rate
          </span>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-10 gap-2.5">
          {heatmapDays.map((d) => (
            <div
              key={d.day}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                d.isCompleted
                  ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                  : "bg-white/[0.03] border-white/[0.06] text-slate-500"
              }`}
            >
              <span className="text-[10px] font-bold">Day {d.day}</span>
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  d.isCompleted ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" : "bg-white/20"
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Founder Achievements & Badges */}
      <div className="rounded-2xl p-5 bg-[#10131E] border border-white/[0.08] flex flex-col gap-4 shadow-sm">
        <h2 className="text-sm font-bold text-white tracking-tight">
          Streak Badges & Milestones
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {badges.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border flex items-center gap-3.5 transition-all ${
                  b.unlocked
                    ? "bg-[#141728] border-amber-500/30 text-white"
                    : "bg-white/[0.02] border-white/[0.06] opacity-50"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    b.unlocked
                      ? "bg-amber-500/20 border border-amber-500/30 text-amber-400"
                      : "bg-white/[0.05] text-slate-500"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <h4 className="text-xs font-bold truncate">{b.title}</h4>
                  <span className="text-[10.5px] text-slate-400 font-medium mt-0.5 line-clamp-1">
                    {b.desc}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
