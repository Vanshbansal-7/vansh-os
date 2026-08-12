"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RadialProgress } from "../ui/radial-progress";

export function GoalsOverviewCard() {
  const goals = [
    {
      label: "Yearly Goals",
      percentage: 72,
      sublabel: "13 / 18 Done",
      color: "#06B6D4", // Cyan
    },
    {
      label: "Monthly Goals",
      percentage: 65,
      sublabel: "13 / 20 Done",
      color: "#10B981", // Emerald
    },
    {
      label: "Weekly Goals",
      percentage: 80,
      sublabel: "8 / 10 Done",
      color: "#38BDF8", // Sky blue
    },
    {
      label: "Daily Goals",
      percentage: 60,
      sublabel: "6 / 10 Done",
      color: "#4ADE80", // Green
    },
  ];

  return (
    <div className="rounded-2xl p-4 bg-[#10131E] border border-white/[0.08] shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="text-sm font-bold text-white tracking-tight">Goals Overview</h3>
        <Link href="/goals" className="text-[11px] font-semibold text-slate-400 hover:text-white transition-colors">
          View All
        </Link>
      </div>

      {/* 4 Radial Dials */}
      <div className="grid grid-cols-4 gap-1 py-1">
        {goals.map((g) => (
          <RadialProgress
            key={g.label}
            label={g.label}
            percentage={g.percentage}
            sublabel={g.sublabel}
            color={g.color}
            size={58}
            strokeWidth={5}
          />
        ))}
      </div>

      <div className="pt-2.5 mt-2 border-t border-white/[0.06] flex items-center justify-center">
        <Link
          href="/goals"
          className="text-[11.5px] font-semibold text-slate-400 hover:text-purple-300 transition-colors flex items-center gap-1"
        >
          Manage Goals
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
