"use client";

import React from "react";
import { Briefcase } from "lucide-react";

export function PlacementHeader() {
  return (
    <div className="flex items-center gap-3.5 mb-4">
      <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
        <Briefcase className="w-5 h-5" />
      </div>
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-none">
          Placement
        </h1>
        <p className="text-xs text-slate-400 font-medium mt-1">
          Track your preparation across all essential subjects and topics
        </p>
      </div>
    </div>
  );
}
