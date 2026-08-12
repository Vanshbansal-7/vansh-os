"use client";

import React from "react";
import { Sparkles } from "lucide-react";

export function MotivationCard() {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-purple-500/30 p-4 shadow-lg group">
      {/* High-res twilight background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40 transition-transform duration-700 group-hover:scale-105"
        style={{
          backgroundImage: "url('/assets/gita_card_bg.png')",
        }}
      />
      {/* Deep twilight gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#140E28]/95 via-[#1A1238]/85 to-[#120B24]/90" />

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-amber-300">
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span className="text-xs font-bold tracking-tight">
            Consistency today, Selection tomorrow.
          </span>
        </div>
        <p className="text-[11px] text-purple-200/90 font-medium pl-5">
          Keep showing up, Vansh! 💜
        </p>
      </div>
    </div>
  );
}
