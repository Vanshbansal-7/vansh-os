"use client";

import React from "react";
import Link from "next/link";
import { Target, Zap, BookOpen, CheckSquare, ArrowRight } from "lucide-react";

export function GlanceStatsCard() {
  const stats = [
    {
      icon: Target,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/15 border-emerald-500/30",
      title: "Focus Time",
      value: "2h 45m",
      target: "Daily Target 4h",
    },
    {
      icon: Zap,
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/15 border-amber-500/30",
      title: "Deep Work",
      value: "1h 30m",
      target: "Daily Target 2h",
    },
    {
      icon: BookOpen,
      iconColor: "text-sky-400",
      iconBg: "bg-sky-500/15 border-sky-500/30",
      title: "Study Hours",
      value: "5h 20m",
      target: "Daily Target 6h",
    },
    {
      icon: CheckSquare,
      iconColor: "text-purple-400",
      iconBg: "bg-purple-500/15 border-purple-500/30",
      title: "Tasks Done",
      value: "6 / 9",
      target: "Today",
    },
  ];

  return (
    <div className="rounded-2xl p-4 bg-[#10131E] border border-white/[0.08] shadow-sm flex flex-col justify-between">
      <h3 className="text-sm font-bold text-white tracking-tight mb-2.5">Today at a Glance</h3>

      <div className="grid grid-cols-2 gap-2">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="flex flex-col p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-all"
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${s.iconBg}`}>
                  <Icon className={`w-3 h-3 ${s.iconColor}`} />
                </div>
                <span className="text-[10.5px] font-medium text-slate-400 truncate">{s.title}</span>
              </div>
              <span className="text-sm font-extrabold text-white tracking-tight leading-none">
                {s.value}
              </span>
              <span className="text-[9px] font-medium text-slate-500 mt-1">{s.target}</span>
            </div>
          );
        })}
      </div>

      <div className="pt-2.5 mt-2 border-t border-white/[0.06] flex items-center justify-center">
        <Link
          href="/analytics"
          className="text-[11.5px] font-semibold text-slate-400 hover:text-purple-300 transition-colors flex items-center gap-1"
        >
          View Insights
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
