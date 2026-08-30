import React, { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { DailyTask, PriorityLevel } from "@/types/dashboard";

interface PriorityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<DailyTask>) => void;
  initialData?: DailyTask | null;
}

export function PriorityModal({ isOpen, onClose, onSave, initialData }: PriorityModalProps) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState("Work");
  const [priorityLevel, setPriorityLevel] = useState<PriorityLevel>("MEDIUM");
  const [deadline, setDeadline] = useState<string>("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setSubtitle(initialData.subtitle || "");
      setCategory(initialData.category);
      setPriorityLevel(initialData.priority_level);
      
      if (initialData.deadline) {
        // deadline is likely an ISO string "YYYY-MM-DDTHH:mm:ss.sssZ"
        // We need it in "YYYY-MM-DDTHH:mm" for the datetime-local input
        try {
          const d = new Date(initialData.deadline);
          // adjust for local timezone offset for the input
          const tzOffset = d.getTimezoneOffset() * 60000;
          const localISOTime = (new Date(d.getTime() - tzOffset)).toISOString().slice(0, 16);
          setDeadline(localISOTime);
        } catch {
          setDeadline("");
        }
      } else {
        setDeadline("");
      }
    } else {
      setTitle("");
      setSubtitle("");
      setCategory("Work");
      setPriorityLevel("MEDIUM");
      setDeadline("");
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title.trim()) return;
    
    let parsedDeadline: string | undefined = undefined;
    if (deadline) {
      parsedDeadline = new Date(deadline).toISOString();
    }

    onSave({
      title,
      subtitle: subtitle.trim() || undefined,
      category,
      priority_level: priorityLevel,
      deadline: parsedDeadline,
      completed: initialData ? initialData.completed : false,
      due_date: initialData ? initialData.due_date : new Date().toISOString().split("T")[0],
      source: "manual",
      is_active: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#090A10] border border-white/10 rounded-2xl shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h2 className="text-base font-bold text-white">
            {initialData ? "Edit Priority" : "Add Priority"}
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Task Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#10131E] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors"
              placeholder="e.g. Complete System Design Chapter"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Subtitle / Note (Optional)</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full bg-[#10131E] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors"
              placeholder="e.g. Focus on scalability"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#10131E] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors appearance-none"
              >
                <option value="Work">Work</option>
                <option value="Study">Study</option>
                <option value="Career">Career</option>
                <option value="Health">Health</option>
                <option value="Network">Network</option>
                <option value="Defense">Defense</option>
                <option value="CGL">CGL</option>
                <option value="General">General</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Priority</label>
              <select
                value={priorityLevel}
                onChange={(e) => setPriorityLevel(e.target.value as PriorityLevel)}
                className="w-full bg-[#10131E] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors appearance-none"
              >
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Deadline (Optional)</label>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full bg-[#10131E] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors"
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
            disabled={!title.trim()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-500 text-white text-xs font-semibold hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            Save Task
          </button>
        </div>
      </div>
    </div>
  );
}
