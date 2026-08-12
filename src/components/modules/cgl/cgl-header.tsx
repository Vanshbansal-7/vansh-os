"use client";

import React from "react";
import { Landmark, Calendar } from "lucide-react";

interface CGLHeaderProps {
  progress?: number;
  lastUpdatedDate?: string;
  lastUpdatedTime?: string;
}

export function CGLHeader({
  progress = 68,
  lastUpdatedDate = "May 13, 2025",
  lastUpdatedTime = "09:45 AM",
}: CGLHeaderProps) {
  // SVG Circular progress calculations
  const radius = 15;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3">
      {/* Left Title & Monument Icon */}
      <div className="flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-2xl bg-[#121626] border border-white/[0.1] flex items-center justify-center text-white shadow-sm shrink-0">
          <Landmark className="w-5 h-5 text-sky-400" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl font-extrabold text-white tracking-tight leading-none">
            CGL
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Staff Selection Commission Combined Graduate Level Examination
          </p>
        </div>
      </div>

      {/* Right Telemetry Cards */}
      <div className="flex items-center gap-3">
        {/* Last Updated Pill Card */}
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#10131E] border border-white/[0.08] shadow-sm">
          <div className="w-7 h-7 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-slate-400 shrink-0">
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9.5px] font-medium text-slate-400 leading-tight">
              Last Updated
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xs font-bold text-white leading-none">
                {lastUpdatedDate}
              </span>
              <span className="text-[9px] text-slate-400 font-medium">
                {lastUpdatedTime}
              </span>
            </div>
          </div>
        </div>

        {/* Overall Progress Circular Card */}
        <div className="flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-[#10131E] border border-white/[0.08] shadow-sm">
          <div className="flex flex-col">
            <span className="text-[9.5px] font-medium text-slate-400 leading-tight">
              Overall Progress
            </span>
            <span className="text-sm font-extrabold text-white leading-none mt-1">
              {progress}%
            </span>
          </div>

          {/* Radial Progress Ring */}
          <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="3.5"
                fill="none"
              />
              <circle
                cx="18"
                cy="18"
                r={radius}
                className="stroke-emerald-400 transition-all duration-1000 ease-out"
                strokeWidth="3.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
