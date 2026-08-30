import React, { useState } from "react";
import { X, Save } from "lucide-react";
import { TimetableEntry } from "@/types/dashboard";

interface TimelineEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Omit<TimetableEntry, "id" | "user_id" | "status" | "elapsed" | "window">) => void;
}

export function TimelineEntryModal({ isOpen, onClose, onSave }: TimelineEntryModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Deep Work");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title.trim() || !startTime.trim() || !endTime.trim()) return;
    onSave({
      title: title.trim(),
      category,
      start_time: startTime,
      end_time: endTime,
      priority: "MEDIUM",
      recurring: false,
      day_of_week: [new Date().getDay()],
      is_active: true,
      color_tag: "purple",
    });
    setTitle("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#090A10] border border-white/10 rounded-2xl shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h2 className="text-base font-bold text-white">Add Timeline Entry</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Task Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#10131E] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors"
              placeholder="e.g. System Design Revision"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Start Time *</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-[#10131E] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">End Time *</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-[#10131E] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#10131E] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors appearance-none"
            >
              <option value="Deep Work">Deep Work</option>
              <option value="Career">Career</option>
              <option value="Learning">Learning</option>
              <option value="Health">Health</option>
              <option value="CGL">CGL</option>
              <option value="Defense">Defense</option>
              <option value="Life">Life</option>
              <option value="Review">Review</option>
              <option value="General">General</option>
            </select>
          </div>
        </div>

        <div className="p-4 border-t border-white/5 flex justify-end gap-2 bg-white/[0.02] rounded-b-2xl">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={!title.trim() || !startTime || !endTime}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-500 text-white text-xs font-semibold hover:bg-purple-600 disabled:opacity-50 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
