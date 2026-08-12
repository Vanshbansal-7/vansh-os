"use client";

import React from "react";
import { Check } from "lucide-react";

interface MilestoneStatusDotProps {
  completed: boolean;
  type: "learned" | "practiced" | "revised" | "mastered";
  onClick?: () => void;
  interactive?: boolean;
}

export function MilestoneStatusDot({
  completed,
  type,
  onClick,
  interactive = true,
}: MilestoneStatusDotProps) {
  const getBadgeStyle = () => {
    if (!completed) {
      return "w-5 h-5 rounded-full border border-slate-700 bg-slate-800/40 hover:border-slate-500 transition-colors";
    }

    switch (type) {
      case "learned":
        return "w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-[0_0_8px_rgba(16,185,129,0.5)]";
      case "practiced":
        return "w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-[0_0_8px_rgba(16,185,129,0.5)]";
      case "revised":
        return "w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-[0_0_8px_rgba(245,158,11,0.5)]";
      case "mastered":
        return "w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-[0_0_8px_rgba(16,185,129,0.5)]";
      default:
        return "w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center";
    }
  };

  return (
    <button
      type="button"
      onClick={interactive ? onClick : undefined}
      disabled={!interactive}
      className={`relative flex items-center justify-center cursor-pointer transition-transform active:scale-90 ${
        interactive ? "hover:scale-110" : ""
      }`}
      aria-label={`Toggle ${type}`}
    >
      <div className={getBadgeStyle()}>
        {completed && <Check className="w-3 h-3 stroke-[3]" />}
      </div>
    </button>
  );
}
