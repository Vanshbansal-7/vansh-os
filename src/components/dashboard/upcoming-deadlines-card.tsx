"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Award, Cpu, GraduationCap } from "lucide-react";

export function UpcomingDeadlinesCard() {
  const deadlines = [
    {
      title: "Amazon OA",
      date: "15 May 2025",
      daysLeft: "2 Days Left",
      daysColor: "text-rose-400 font-bold",
      icon: ShoppingBag,
      iconBg: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    },
    {
      title: "TCS NQT",
      date: "20 May 2025",
      daysLeft: "7 Days Left",
      daysColor: "text-amber-400 font-bold",
      icon: Award,
      iconBg: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    },
    {
      title: "System Design Project",
      date: "25 May 2025",
      daysLeft: "12 Days Left",
      daysColor: "text-yellow-400 font-bold",
      icon: Cpu,
      iconBg: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    },
    {
      title: "College Assignment",
      date: "30 May 2025",
      daysLeft: "17 Days Left",
      daysColor: "text-sky-400 font-bold",
      icon: GraduationCap,
      iconBg: "bg-sky-500/20 text-sky-400 border-sky-500/30",
    },
  ];

  return (
    <div className="rounded-2xl p-4 bg-[#10131E] border border-white/[0.08] shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="text-sm font-bold text-white tracking-tight">Upcoming Deadlines</h3>
        <Link href="/career" className="text-[11px] font-semibold text-slate-400 hover:text-white transition-colors">
          View All
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {deadlines.map((d, idx) => {
          const Icon = d.icon;
          return (
            <div
              key={idx}
              className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.06] transition-all"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${d.iconBg}`}>
                  <Icon className="w-3 h-3" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11.5px] font-bold text-white leading-tight truncate">
                    {d.title}
                  </span>
                  <span className="text-[9px] font-medium text-slate-400 mt-0.5">
                    {d.date}
                  </span>
                </div>
              </div>

              <span className={`text-[10.5px] shrink-0 ${d.daysColor}`}>
                {d.daysLeft}
              </span>
            </div>
          );
        })}
      </div>

      <div className="pt-2.5 mt-2 border-t border-white/[0.06] flex items-center justify-center">
        <Link
          href="/career"
          className="text-[11.5px] font-semibold text-slate-400 hover:text-purple-300 transition-colors flex items-center gap-1"
        >
          View All Deadlines
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
