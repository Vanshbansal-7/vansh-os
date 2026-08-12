"use client";

import React from "react";
import { FolderPlus, Plus, BookOpen, Layers } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  icon?: "subject" | "resource" | "general";
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon = "subject",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-[#10131E] border border-dashed border-white/[0.12] w-full gap-4">
      <div className="w-14 h-14 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
        {icon === "subject" ? (
          <Layers className="w-7 h-7" />
        ) : icon === "resource" ? (
          <BookOpen className="w-7 h-7" />
        ) : (
          <FolderPlus className="w-7 h-7" />
        )}
      </div>

      <div className="flex flex-col max-w-sm">
        <h3 className="text-base font-bold text-white tracking-tight">
          {title}
        </h3>
        <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={onAction}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)] cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>{actionLabel}</span>
      </button>
    </div>
  );
}
