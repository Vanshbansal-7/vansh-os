"use client";

import React from "react";
import Link from "next/link";
import { Briefcase, Landmark, Award, Play, ArrowRight } from "lucide-react";
import { usePlacementTracker } from "@/hooks/use-placement-tracker";

export function DomainCardsGrid() {
  const { stats: placementStats } = usePlacementTracker();

  // Compute live progress percentages (0% default on clean state)
  const placementProgress = placementStats.progress;
  const cglProgress = 0;
  const examsProgress = 0;
  const youtubeProgress = 0;

  const domains = [
    {
      title: "Placement",
      progress: placementProgress,
      hasProgress: true,
      icon: Briefcase,
      iconBg: "bg-purple-500/15 border-purple-500/25 text-purple-300",
      barColor: "bg-gradient-to-r from-purple-500 to-indigo-500",
      btnBg: "bg-purple-500/15 hover:bg-purple-500/30 text-purple-300 border-purple-500/30",
      href: "/modules/placement",
    },
    {
      title: "CGL",
      progress: cglProgress,
      hasProgress: true,
      icon: Landmark,
      iconBg: "bg-sky-500/15 border-sky-500/25 text-sky-300",
      barColor: "bg-gradient-to-r from-sky-400 to-blue-500",
      btnBg: "bg-sky-500/15 hover:bg-sky-500/30 text-sky-300 border-sky-500/30",
      href: "/modules/cgl",
    },
    {
      title: "Exams",
      progress: examsProgress,
      hasProgress: true,
      icon: Award,
      iconBg: "bg-emerald-500/15 border-emerald-500/25 text-emerald-300",
      barColor: "bg-gradient-to-r from-emerald-400 to-teal-500",
      btnBg: "bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/30",
      href: "/modules/exams",
    },
    {
      title: "YouTube",
      progress: youtubeProgress,
      hasProgress: true,
      icon: Play,
      iconBg: "bg-rose-500/15 border-rose-500/25 text-rose-400",
      barColor: "bg-gradient-to-r from-rose-500 to-red-500",
      btnBg: "bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 border-rose-500/30",
      href: "/modules/youtube",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {domains.map((d) => {
        const Icon = d.icon;
        return (
          <Link
            key={d.title}
            href={d.href}
            className="group relative rounded-2xl p-4 bg-[#10131E] hover:bg-[#131724] border border-white/[0.08] hover:border-white/[0.14] transition-all duration-200 flex flex-col justify-between gap-3 shadow-sm min-h-[105px]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${d.iconBg}`}>
                  <Icon className={`w-4 h-4 ${d.title === "YouTube" ? "fill-rose-400 ml-0.5" : ""}`} />
                </div>
                <h3 className="text-sm font-bold text-white tracking-tight">{d.title}</h3>
              </div>
              <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-transform group-hover:translate-x-0.5 shrink-0 ${d.btnBg}`}>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            <div className="flex flex-col gap-1 mt-0.5">
              <div className="w-full h-1.5 rounded-full bg-[#181D2B] overflow-hidden">
                <div
                  className={`h-full rounded-full ${d.barColor} transition-all duration-500`}
                  style={{ width: `${d.progress}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10.5px] font-bold text-slate-400 leading-tight">
                <span>{d.progress}% Completed</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
