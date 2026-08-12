"use client";

import React, { useState } from "react";
import { Play, Pause, Square, MoreVertical, Sheet } from "lucide-react";
import { useTimeline } from "@/hooks/use-timeline";
import { WidgetState } from "@/components/shared/widget-state";
import { TimetableEntry } from "@/types/dashboard";
import { useTimeTracker } from "@/hooks/use-time-tracker";
import { TimeSheetModal } from "./time-sheet-modal";

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

function formatTimer(seconds: number) {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export function TimelineCard() {
  const { entries, isLoading, error, refresh } = useTimeline();
  const { 
    logs, 
    activeSession, 
    currentElapsed, 
    startSession, 
    pauseSession, 
    resumeSession, 
    endSession, 
    clearLogs 
  } = useTimeTracker();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div className="rounded-2xl p-4 bg-[#10131E] border border-white/[0.08] shadow-sm flex flex-col h-full max-h-[400px]">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-2.5 shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white tracking-tight">
              Today&apos;s Timeline
            </h3>
            {activeSession && (
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-400 uppercase tracking-widest">
                <div className={`w-1.5 h-1.5 rounded-full bg-emerald-400 ${!activeSession.isPaused ? 'animate-pulse' : ''}`} />
                {activeSession.isPaused ? 'PAUSED' : 'LIVE'}
              </span>
            )}
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 rounded-lg hover:bg-white/5 text-slate-400 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {isMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-1 w-40 rounded-xl bg-[#1A1D2B] border border-white/10 shadow-xl z-50 overflow-hidden">
                  <button 
                    onClick={() => {
                      setIsSheetOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-white hover:bg-white/5 transition-colors text-left"
                  >
                    <Sheet className="w-4 h-4 text-purple-400" />
                    Daily Time Sheet
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative pl-0.5">
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
          ) : entries.length === 0 ? (
            <WidgetState
              state="empty"
              title="No schedule today"
              message="Add entries to your daily timetable."
              compact
            />
          ) : (
            <>
              {/* Continuous Ruler Line */}
              <div className="absolute left-[42px] top-2 bottom-3 w-[1.5px] bg-white/[0.08] pointer-events-none" />

              <div className="flex flex-col gap-2 pb-4">
                {entries.map((evt: TimetableEntry, idx) => {
                  const isActive = activeSession?.taskId === evt.id;
                  
                  return (
                    <div key={evt.id || idx} className={`relative z-10 flex items-center justify-between gap-2.5 text-xs py-1.5 px-2 rounded-xl transition-colors ${isActive ? 'bg-purple-500/5 border border-purple-500/20' : 'hover:bg-white/[0.02]'}`}>
                      
                      {/* Left: Time & Node */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="w-8 text-[10px] font-mono font-semibold text-slate-400 text-right">
                          {evt.start_time.slice(0, 5)}
                        </span>
                        <div
                          className={`w-2 h-2 rounded-full border border-[#10131E] shrink-0 ${
                            isActive
                              ? "bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.9)] ring-2 ring-purple-500/40"
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
                          <span className={`font-bold text-[12px] truncate ${isActive ? 'text-purple-300' : 'text-white'}`}>
                            {evt.title}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-semibold border ${getTagColor(evt.category)}`}>
                            {evt.category}
                          </span>
                        </div>
                      </div>

                      {/* Action Area */}
                      <div className="shrink-0 flex items-center gap-2">
                        {isActive ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-emerald-400 w-16 text-right">
                              {formatTimer(currentElapsed)}
                            </span>
                            <div className="flex items-center gap-1">
                              {activeSession.isPaused ? (
                                <button onClick={resumeSession} className="p-1.5 rounded-md bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors">
                                  <Play className="w-3.5 h-3.5 fill-current" />
                                </button>
                              ) : (
                                <button onClick={pauseSession} className="p-1.5 rounded-md bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors">
                                  <Pause className="w-3.5 h-3.5 fill-current" />
                                </button>
                              )}
                              <button onClick={endSession} className="p-1.5 rounded-md bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
                                <Square className="w-3.5 h-3.5 fill-current" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button 
                            onClick={() => startSession(evt.id, evt.title)}
                            className="p-1.5 rounded-md bg-white/5 text-slate-400 hover:bg-emerald-500/20 hover:text-emerald-400 transition-colors"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      <TimeSheetModal 
        isOpen={isSheetOpen} 
        onClose={() => setIsSheetOpen(false)} 
        logs={logs}
        onClear={clearLogs}
      />
    </>
  );
}
