import React, { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { TemplateBlock } from "@/hooks/use-timetable-template";

interface TimetableBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (block: Omit<TemplateBlock, "id">) => void;
  initialData?: TemplateBlock | null;
}

export function TimetableBlockModal({ isOpen, onClose, onSave, initialData }: TimetableBlockModalProps) {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (initialData && initialData.start_time && initialData.end_time) {
      setStartTime(initialData.start_time.slice(0, 5));
      setEndTime(initialData.end_time.slice(0, 5));
      setTitle(initialData.title);
    } else {
      setStartTime("09:00");
      setEndTime("10:00");
      setTitle("");
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!startTime || !endTime || !title.trim()) return;
    onSave({
      time: `${startTime} - ${endTime}`,
      title: title.trim(),
      start_time: startTime,
      end_time: endTime
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-[#090A10] border border-white/10 rounded-2xl shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h2 className="text-base font-bold text-white">
            {initialData ? "Edit Time Block" : "Add Time Block"}
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Start Time *</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-[#10131E] border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-purple-500/50 transition-colors"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">End Time *</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-[#10131E] border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Block Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#10131E] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors"
              placeholder="e.g. Deep Work: DSA"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 flex justify-end gap-2 bg-white/[0.02] rounded-b-2xl">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={!startTime || !endTime || !title.trim()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-500 text-white text-xs font-semibold hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            Save Block
          </button>
        </div>
      </div>
    </div>
  );
}
