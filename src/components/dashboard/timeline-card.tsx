"use client";

import React from "react";
import Link from "next/link";
import { Play, Calendar } from "lucide-react";
import { useTimeline } from "@/hooks/use-timeline";
import { WidgetState } from "@/components/shared/widget-state";
import { TimetableEntry } from "@/types/dashboard";

const CATEGORY_COLORS: Record<string, string> = {
  "Deep Work":   "bg-purple-500/20 text-purple-300 border-purple-400/30",
  "Career":      "bg-blue-500/20 text-blue-300 border-blue-400/30",
  "Learning":    "bg-sky-500/20 text-sky-300 border-sky-400/30",
  "Health":      "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
  "CGL":         "bg-sky-500/20 text-sky-300 border-sky-400/30",
  "Defense":     "bg-teal-500/20 text-teal-300 border-teal-400/30",
  "Life":        "bg-amber-500/20 text-amber-300 border-amber-400/30",
  "Review":      "bg-slate-500/20 text-slate-300 border-slate-400/30",
  "General":     "bg-slate-500/20 text-slate-300 border-slate-400/30",
};

function getTagColor(category: string): string {
  return CATEGORY_COLORS[category] || "bg-purple-500/20 text-purple-300 border-purple-400/30";
}

export function TimelineCard() {
  const { entries, isLoading, error, refresh } = useTimeline();

  // Show max 6 entries for the card
  const visible = entries.slice(0, 6);

  return (
    <div className="rounded-2xl p-4 bg-[#10131E] border border-white/[0.08] shadow-sm flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="text-sm font-bold text-white tracking-tight">
          Today&apos;s Timeline
        </h3>
        {entries.some((e) => e.status === "in_progress") && (
          <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest animate-pulse">
            ● Live
          </span>
        )}
      </div>

      {isLoading ? (
        <WidgetState state="loading" compact />
      ) : error ? (
        <WidgetState
          state="error"
          title="Timeline unavailable"
          message="Could not load your timetable."
          onRetry={refresh}
          compact
        />
      ) : visible.length === 0 ? (
        <WidgetState
          state="empty"
          title="No schedule today"
          message="Add entries to your daily timetable."
          compact
        />
      ) : (
        <div className="relative flex flex-col gap-2 pl-0.5">
          {/* Continuous Ruler Line */}
          <div className="absolute left-[42px] top-2 bottom-3 w-[1.5px] bg-white/[0.08] pointer-events-none" />

          {visible.map((evt: TimetableEntry, idx) => (
            <div key={evt.id || idx} className="relative z-10 flex items-center justify-between gap-2.5 text-xs py-0.5">
              {/* Left: Time & Node */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="w-8 text-[10px] font-mono font-semibold text-slate-400 text-right">
                  {evt.start_time.slice(0, 5)}
                </span>
                <div
                  className={`w-2 h-2 rounded-full border border-[#10131E] shrink-0 ${
                    evt.status === "in_progress"
                      ? "bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.9)] ring-2 ring-purple-500/40"
                      : evt.status === "completed"
                      ? "bg-emerald-500"
                      : "bg-slate-600"
                  }`}
                />
              </div>

              {/* Event Info */}
              <div className="flex-1 flex flex-col min-w-0 ml-1">
                <span className="text-[9px] text-slate-400 font-medium leading-none">
                  {evt.window || `${evt.start_time.slice(0, 5)} – ${evt.end_time.slice(0, 5)}`}
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span
                    className={`font-bold text-[12px] truncate ${
                      evt.status === "completed" ? "text-slate-500 line-through" : "text-white"
                    }`}
                  >
                    {evt.title}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-semibold border ${getTagColor(evt.category)}`}>
                    {evt.category}
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="shrink-0 flex items-center gap-2">
                {evt.status === "in_progress" ? (
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25">
                    <div className="flex flex-col text-right">
                      <span className="text-[9px] font-bold text-emerald-400 leading-none">In Progress</span>
                      {evt.elapsed && (
                        <span className="text-[8.5px] font-mono text-emerald-400/90 mt-0.5">{evt.elapsed}</span>
                      )}
                    </div>
                    <div className="w-4 h-4 rounded-full bg-purple-600 flex items-center justify-center text-white shadow-[0_0_6px_rgba(139,92,246,0.6)]">
                      <Play className="w-2 h-2 fill-white ml-0.5" />
                    </div>
                  </div>
                ) : evt.status === "completed" ? (
                  <span className="text-[10px] font-medium text-emerald-500">Done</span>
                ) : (
                  <span className="text-[10px] font-medium text-slate-400">Upcoming</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="pt-2.5 mt-2 border-t border-white/[0.06] flex items-center justify-center">
        <Link
          href="/calendar"
          className="text-[11.5px] font-semibold text-slate-400 hover:text-purple-300 transition-colors flex items-center gap-1.5"
        >
          <Calendar className="w-3.5 h-3.5" />
          View Full Calendar →
        </Link>
      </div>
    </div>
  );
}
