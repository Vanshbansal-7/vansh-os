"use client";

import React from "react";
import { CheckCircle2, RefreshCw, ListFilter, Clock, Activity } from "lucide-react";
import { CGLTrackerMetrics } from "@/types/cgl";

interface TrackerMetricsProps {
  metrics: CGLTrackerMetrics;
}

export function TrackerMetrics({ metrics }: TrackerMetricsProps) {
  const cards = [
    {
      label: "Overall Progress",
      value: `${metrics.overall_progress}%`,
      icon: Activity,
      iconBg: "bg-purple-500/15 text-purple-400 border-purple-500/20",
      barColor: "bg-gradient-to-r from-purple-500 to-indigo-500",
      percentage: metrics.overall_progress,
    },
    {
      label: "Topics Completed",
      value: `${metrics.topics_completed} / ${metrics.total_topics}`,
      icon: CheckCircle2,
      iconBg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
      barColor: "bg-gradient-to-r from-emerald-500 to-teal-400",
      percentage: metrics.total_topics > 0 ? Math.round((metrics.topics_completed / metrics.total_topics) * 100) : 0,
    },
    {
      label: "Revision Pending",
      value: `${metrics.revision_pending}`,
      icon: RefreshCw,
      iconBg: "bg-amber-500/15 text-amber-400 border-amber-500/20",
      barColor: "bg-gradient-to-r from-amber-500 to-orange-400",
      percentage: metrics.total_topics > 0 ? Math.round((metrics.revision_pending / metrics.total_topics) * 100) : 0,
    },
    {
      label: "Remaining Topics",
      value: `${metrics.remaining_topics}`,
      icon: ListFilter,
      iconBg: "bg-indigo-500/15 text-indigo-400 border-indigo-500/20",
      barColor: "bg-gradient-to-r from-indigo-500 to-purple-500",
      percentage: metrics.total_topics > 0 ? Math.round((metrics.remaining_topics / metrics.total_topics) * 100) : 0,
    },
    {
      label: "Total Study Time",
      value: metrics.total_study_time,
      icon: Clock,
      iconBg: "bg-sky-500/15 text-sky-400 border-sky-500/20",
      barColor: "bg-gradient-to-r from-sky-500 to-blue-500",
      percentage: 0,
    },
  ];

  return (
    <div className="flex flex-col gap-3 mb-4">
      {/* Title & Subtitle */}
      <div>
        <h2 className="text-base font-bold text-white tracking-tight leading-none">
          Tracker Overview
        </h2>
        <p className="text-[11.5px] text-slate-400 font-medium mt-1">
          Track your preparation topic-wise and stay consistent.
        </p>
      </div>

      {/* 5 Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {cards.map((c, idx) => {
          const Icon = c.icon;
          return (
            <div
              key={idx}
              className="flex flex-col justify-between p-3.5 rounded-2xl bg-[#10131E] border border-white/[0.08] shadow-sm hover:border-white/[0.14] transition-all min-h-[90px]"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-semibold text-slate-400 leading-tight truncate">
                  {c.label}
                </span>
                <div
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 ${c.iconBg}`}
                >
                  <Icon className="w-3 h-3" />
                </div>
              </div>

              <div className="mt-2">
                <span className="text-sm sm:text-base font-extrabold text-white leading-none">
                  {c.value}
                </span>
                <div className="w-full h-1 rounded-full bg-[#181D2B] overflow-hidden mt-2">
                  <div
                    className={`h-full rounded-full ${c.barColor}`}
                    style={{ width: `${c.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
