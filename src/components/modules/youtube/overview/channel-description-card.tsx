"use client";

import React from "react";
import { Edit2 } from "lucide-react";

interface ChannelDescriptionCardProps {
  description: string;
}

export function ChannelDescriptionCard({ description }: ChannelDescriptionCardProps) {
  return (
    <div className="rounded-2xl p-5 bg-[#10131E] border border-white/[0.08] flex flex-col gap-3 shadow-sm h-full">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white tracking-tight">Channel Description</h3>
        <button
          type="button"
          aria-label="Edit Description"
          className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="text-xs text-slate-300 font-medium leading-relaxed">
        {description}
      </p>
    </div>
  );
}
