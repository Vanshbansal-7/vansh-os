"use client";

import React, { useState } from "react";
import { Play, Pause, Square, MoreVertical, Sheet, Plus } from "lucide-react";
import { useTimeline } from "@/hooks/use-timeline";
import { WidgetState } from "@/components/shared/widget-state";
import { TimetableEntry } from "@/types/dashboard";
import { useTimeTracker } from "@/hooks/use-time-tracker";
import { TimeSheetModal } from "./time-sheet-modal";
import { TimelineEntryModal } from "./timeline-entry-modal";

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
  const { entries, isLoading, error, refresh, addEntry } = useTimeline();
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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddEntry = (entry: Omit<TimetableEntry, "id" | "user_id" | "status" | "elapsed" | "window">) => {
    if (addEntry) {
      addEntry(entry);
    }
  };

  const isCollegeDay = React.useMemo(() => {
    const nowIST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    const day = nowIST.getDay();
    return day === 1 || day === 2;
  }, []);

  const dayLabel = React.useMemo(() => {
    const nowIST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    const day = nowIST.getDay();
    if (day === 1 || day === 2) return { text: "College Day", style: "bg-amber-500/15 text-amber-300 border-amber-500/30" };
    if (day === 3 || day === 5) return { text: "Learning + Aptitude", style: "bg-purple-500/15 text-purple-300 border-purple-500/30" };
    if (day === 4 || day === 6) return { text: "Learning + English", style: "bg-sky-500/15 text-sky-300 border-sky-500/30" };
    return { text: "Revision + Test", style: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" };
  }, []);

  return (
    <>
      <div className="rounded-2xl p-4 bg-[#10131E] border border-white/[0.08] shadow-sm flex flex-col h-full max-h-[550px]">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="text-[15px] font-bold text-white tracking-tight">
              Today&apos;s Timeline
            </h3>
            <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold tracking-wide ${dayLabel.style}`}>
              {dayLabel.text}
            </span>
            {activeSession && (
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-400 uppercase tracking-widest">
                <div className={`w-1.5 h-1.5 rounded-full bg-emerald-400 ${!activeSession.isPaused ? 'animate-pulse' : ''}`} />
                {activeSession.isPaused ? 'PAUSED' : 'LIVE'}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 relative">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="p-1 rounded-lg hover:bg-white/5 text-purple-400 transition-colors"
              title="Add Timeline Entry"
            >
              <Plus className="w-4 h-4" />
            </button>
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
              <div className="absolute left-[45px] top-2 bottom-3 w-[2px] bg-white/[0.08] pointer-events-none" />

              <div className="flex flex-col gap-3 pb-4">
                {entries.map((evt: TimetableEntry, idx) => {
                  const isActive = activeSession?.taskId === evt.id;
                  const isLast = idx === entries.length - 1;
                  
                  return (
                    <div key={evt.id || idx} className={`border-b border-white/[0.04] last:border-0 ${!isLast ? 'pb-3' : ''}`}>
                      <div className={`relative z-10 flex items-center justify-between gap-3 text-xs py-2 px-3 rounded-xl transition-all ${isActive ? 'bg-purple-500/10 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]' : 'hover:bg-white/[0.04]'}`}>
                        
                        {/* Left: Time & Node */}
                        <div className="flex items-center gap-2.5 shrink-0">
                          <span className="w-10 text-[11px] font-mono font-semibold text-slate-400 text-right">
                            {evt.start_time.slice(0, 5)}
                          </span>
                          <div
                            className={`w-2.5 h-2.5 rounded-full border border-[#10131E] shrink-0 ${
                              isActive
                                ? "bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.9)] ring-2 ring-purple-500/50"
                                : "bg-slate-600"
                            }`}
                          />
                        </div>

                        {/* Event Info */}
                        <div className="flex-1 flex flex-col min-w-0 ml-1.5">
                          <span className="text-[10px] text-slate-400 font-medium leading-none">
                            {evt.window || `${evt.start_time.slice(0, 5)} – ${evt.end_time.slice(0, 5)}`}
                          </span>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className={`font-bold text-[13.5px] truncate ${isActive ? 'text-purple-300' : 'text-white'}`}>
                              {evt.title}
                            </span>
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold border ${getTagColor(evt.category)}`}>
                              {evt.category}
                            </span>
                          </div>
                        </div>

                        {/* Action Area */}
                        <div className="shrink-0 flex items-center gap-2">
                          {isActive ? (
                            <div className="flex items-center gap-2">
                              <span className="text-[13px] font-mono font-bold text-emerald-400 w-16 text-right drop-shadow-md">
                                {formatTimer(currentElapsed)}
                              </span>
                              <div className="flex items-center gap-1.5">
                                {activeSession.isPaused ? (
                                  <button onClick={resumeSession} className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-all hover:scale-105">
                                    <Play className="w-4 h-4 fill-current" />
                                  </button>
                                ) : (
                                  <button onClick={pauseSession} className="p-2 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-all hover:scale-105">
                                    <Pause className="w-4 h-4 fill-current" />
                                  </button>
                                )}
                                <button onClick={endSession} className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all hover:scale-105">
                                  <Square className="w-4 h-4 fill-current" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button 
                              onClick={() => startSession(evt.id, evt.title)}
                              className="p-1.5 rounded-md bg-white/5 text-slate-400 hover:bg-emerald-500/20 hover:text-emerald-400 transition-colors"
                            >
                              <Play className="w-4 h-4 fill-current" />
                            </button>
                          )}
                        </div>
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
      <TimelineEntryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddEntry}
      />
    </>
  );
}
