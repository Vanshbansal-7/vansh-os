"use client";

import React, { useState } from "react";
import { X, Plus, Link2, AlertCircle } from "lucide-react";
import { CreateResourceInput } from "@/lib/validations/resource.schema";

interface AddResourceModalProps {
  isOpen: boolean;
  module: string;
  examId?: string;
  onClose: () => void;
  onSuccess: (resource: any) => void;
}

export function AddResourceModal({
  isOpen,
  module,
  examId,
  onClose,
  onSuccess,
}: AddResourceModalProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("General");
  const [type, setType] = useState<string>("website");
  const [priority, setPriority] = useState<"HIGH" | "MEDIUM" | "LOW">("MEDIUM");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!title.trim()) {
      setErrorMsg("Title is required");
      return;
    }

    if (!url.trim().startsWith("http")) {
      setErrorMsg("Please enter a valid URL starting with http:// or https://");
      return;
    }

    setIsSubmitting(true);

    try {
      const normalizedPriority = String(priority).toUpperCase() as "HIGH" | "MEDIUM" | "LOW";

      const payload: CreateResourceInput = {
        module,
        exam_id: examId,
        title: title.trim(),
        url: url.trim(),
        category: category.trim() || "General",
        type: type.toLowerCase(),
        priority: normalizedPriority,
        tags: [category.trim().toLowerCase()],
      };

      const res = await fetch("/api/v1/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        onSuccess(json.data);
        onClose();
        setTitle("");
        setUrl("");
      } else {
        setErrorMsg(json.error?.message || "Failed to create resource");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Server connection failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-[#0E101A] border border-purple-500/30 shadow-[0_0_40px_rgba(168,85,247,0.3)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#131626] border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <Link2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Add New Resource — {module}
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

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">
              Resource Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Striver's A2Z DSA Sheet"
              className="w-full bg-[#151828] border border-white/[0.08] focus:border-purple-500/50 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-all font-medium"
            />
          </div>

          {/* URL */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">
              Resource URL <span className="text-rose-400">*</span>
            </label>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://takeuforward.org/strivers-a2z-dsa-course/"
              className="w-full bg-[#151828] border border-white/[0.08] focus:border-purple-500/50 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-all font-medium"
            />
          </div>

          {/* Category, Type & Priority Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. DSA"
                className="w-full bg-[#151828] border border-white/[0.08] focus:border-purple-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-medium"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">Resource Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-[#151828] border border-white/[0.08] rounded-xl px-2.5 py-2 text-xs text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="website">Website</option>
                <option value="video">Video</option>
                <option value="pdf">PDF</option>
                <option value="course">Course</option>
                <option value="repo">GitHub Repo</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-[#151828] border border-white/[0.08] rounded-xl px-2.5 py-2 text-xs text-slate-300 focus:outline-none cursor-pointer font-bold"
              >
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>
          </div>

          {/* Footer Submit */}
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
              <span>{isSubmitting ? "Saving..." : "Save Resource"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
