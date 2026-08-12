import React from "react";
import { X, Clock, Trash2, CalendarDays } from "lucide-react";
import { TimeLog } from "@/hooks/use-time-tracker";

interface TimeSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: TimeLog[];
  onClear: () => void;
}

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  
  if (h > 0) {
    return `${h}h ${m}m ${s}s`;
  }
  return `${m}m ${s}s`;
}

export function TimeSheetModal({ isOpen, onClose, logs, onClear }: TimeSheetModalProps) {
  if (!isOpen) return null;

  // Group logs by date
  const groupedLogs = logs.reduce((acc, log) => {
    if (!acc[log.date]) acc[log.date] = [];
    acc[log.date].push(log);
    return acc;
  }, {} as Record<string, TimeLog[]>);

  const totalSecondsAllTime = logs.reduce((sum, log) => sum + log.durationSeconds, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-[#090A10] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Daily Time Sheet</h2>
              <p className="text-xs text-slate-400">Total Tracked: {formatDuration(totalSecondsAllTime)}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Clock className="w-12 h-12 opacity-20 mb-4" />
              <p className="text-sm">No time sessions recorded yet.</p>
              <p className="text-xs opacity-60 mt-1">Start a task from your timeline to track time.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedLogs).map(([date, dayLogs]) => {
                const dayTotal = dayLogs.reduce((sum, l) => sum + l.durationSeconds, 0);
                return (
                  <div key={date}>
                    <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                      <h3 className="text-sm font-semibold text-slate-300">{date}</h3>
                      <span className="text-xs font-mono text-purple-400">{formatDuration(dayTotal)}</span>
                    </div>
                    
                    <div className="space-y-2">
                      {dayLogs.map(log => (
                        <div key={log.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors">
                          <span className="text-sm font-medium text-white">{log.taskTitle}</span>
                          <span className="text-xs font-mono text-emerald-400">{formatDuration(log.durationSeconds)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {logs.length > 0 && (
          <div className="p-4 border-t border-white/5 flex justify-end">
            <button 
              onClick={() => {
                if(confirm("Are you sure you want to clear all time logs?")) {
                  onClear();
                }
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear Sheet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
