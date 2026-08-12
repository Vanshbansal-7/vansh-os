"use client";

import React, { useState } from "react";
import { X, Plus, BookOpen, AlertCircle } from "lucide-react";
import { CreateTopicInput } from "@/lib/validations/tracker.schema";

interface AddTopicModalProps {
  isOpen: boolean;
  subjectId: string;
  subjectName: string;
  onClose: () => void;
  onSuccess: (topic: any) => void;
}

export function AddTopicModal({
  isOpen,
  subjectId,
  subjectName,
  onClose,
  onSuccess,
}: AddTopicModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [estimatedHours, setEstimatedHours] = useState(2.0);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim()) {
      setErrorMsg("Topic name is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: CreateTopicInput = {
        subject_id: subjectId,
        name,
        description,
        difficulty,
        estimated_hours: estimatedHours,
        is_learned: false,
        is_practiced: false,
        is_revised: false,
        is_mastered: false,
      };

      const res = await fetch("/api/v1/tracker/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        onSuccess(json.data);
        onClose();
        setName("");
        setDescription("");
      } else {
        setErrorMsg(json.error?.message || "Failed to create topic");
      }
    } catch (_) {
      setErrorMsg("Server connection failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-2xl bg-[#0E101A] border border-purple-500/30 shadow-[0_0_40px_rgba(168,85,247,0.3)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#131626] border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Add Topic to {subjectName}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-2 text-rose-300 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">
              Topic Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Binary Search & Sliding Window"
              className="w-full bg-[#151828] border border-white/[0.08] focus:border-purple-500/50 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-all font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full bg-[#151828] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">Estimated Hours</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="50"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(parseFloat(e.target.value) || 2.0)}
                className="w-full bg-[#151828] border border-white/[0.08] focus:border-purple-500/50 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none font-medium"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 text-xs font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Adding..." : "Add Topic"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
