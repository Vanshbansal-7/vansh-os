"use client";

import React, { useState } from "react";
import {
  X, Plus, Award, Globe, Calendar, Tag, Bookmark, AlertCircle, Loader2,
} from "lucide-react";

export interface RegisterExamFormData {
  name: string;
  short_name: string;
  category: "Defense" | "SSC" | "Banking" | "UPSC" | "State PCS" | "";
  conducting_body: string;
  official_website: string;
  target_year: string;
  priority: "High" | "Medium" | "Low";
  notes: string;
}

interface RegisterExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (exam: any) => Promise<void> | void;
}

const INITIAL_FORM: RegisterExamFormData = {
  name: "",
  short_name: "",
  category: "",
  conducting_body: "",
  official_website: "",
  target_year: new Date().getFullYear().toString(),
  priority: "High",
  notes: "",
};

export function RegisterExamModal({ isOpen, onClose, onSuccess }: RegisterExamModalProps) {
  const [form, setForm] = useState<RegisterExamFormData>(INITIAL_FORM);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ name?: boolean; category?: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = <K extends keyof RegisterExamFormData>(
    key: K,
    value: RegisterExamFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errorMsg) setErrorMsg("");
    if (fieldErrors[key as keyof typeof fieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setFieldErrors({});

    const newFieldErrors: { name?: boolean; category?: boolean } = {};
    if (!form.name.trim()) newFieldErrors.name = true;
    if (!form.category) newFieldErrors.category = true;

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      setErrorMsg("Please fill out all required fields marked with *.");
      return;
    }

    setIsSubmitting(true);

    try {
      const baseSlug = form.short_name.trim()
        ? form.short_name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")
        : form.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const slug = `${baseSlug}-${Math.floor(Math.random() * 1000)}`;

      const payload = {
        slug,
        name: form.name.trim(),
        short_name: form.short_name.trim() || form.name.trim().substring(0, 8).toUpperCase(),
        category: form.category,
        conducting_body: form.conducting_body.trim() || "Official Body",
        official_website: form.official_website.trim() || "",
        description: form.notes.trim() || `Target exam: ${form.name.trim()}`,
        logo_icon: "Award",
        prep_progress: 0,
        is_active: true,
      };

      const res = await fetch("/api/v1/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        console.error("[RegisterExamModal] API Error:", json.error);
        setErrorMsg(json.error?.message || "Failed to register exam in database.");
        return;
      }

      await onSuccess(json.data);
      setForm(INITIAL_FORM);
      setErrorMsg("");
      setFieldErrors({});
      onClose();
    } catch (err: any) {
      console.error("[RegisterExamModal] Submit failed:", err);
      setErrorMsg(err?.message || "Failed to submit exam registration to server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setForm(INITIAL_FORM);
      setErrorMsg("");
      setFieldErrors({});
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="w-full max-w-lg rounded-2xl bg-[#0E101A] border border-purple-500/30 shadow-[0_0_60px_rgba(168,85,247,0.25)] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#131626] border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Register New Exam</h3>
              <p className="text-[10.5px] text-slate-400 font-medium mt-0.5 font-sans">Add a competitive exam to your command center</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-2 text-rose-300 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Row 1: Exam Name + Short Name */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">
                Exam Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                autoFocus
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g. AFCAT, SSC CGL, GATE"
                className={`bg-[#151828] border rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all font-medium ${
                  fieldErrors.name ? "border-rose-500 bg-rose-950/20" : "border-white/[0.08] focus:border-purple-500/50"
                }`}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">Short Name / Acronym</label>
              <input
                type="text"
                value={form.short_name}
                onChange={(e) => handleChange("short_name", e.target.value)}
                placeholder="e.g. AFCAT"
                className="bg-[#151828] border border-white/[0.08] focus:border-purple-500/50 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all font-medium"
              />
            </div>
          </div>

          {/* Row 2: Category + Conducting Body */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">
                Category <span className="text-rose-400">*</span>
              </label>
              <select
                required
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value as any)}
                className={`bg-[#151828] border rounded-xl px-3.5 py-2.5 text-xs text-slate-300 focus:outline-none transition-all cursor-pointer appearance-none ${
                  fieldErrors.category ? "border-rose-500 bg-rose-950/20" : "border-white/[0.08] focus:border-purple-500/50"
                }`}
              >
                <option value="">Select category...</option>
                <option value="Defense">🎖️ Defense</option>
                <option value="SSC">📋 SSC</option>
                <option value="Banking">🏦 Banking</option>
                <option value="UPSC">🏛️ UPSC</option>
                <option value="State PCS">🗺️ State PCS</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">Conducting Body</label>
              <input
                type="text"
                value={form.conducting_body}
                onChange={(e) => handleChange("conducting_body", e.target.value)}
                placeholder="e.g. IAF, SSC, UPSC, IBPS"
                className="bg-[#151828] border border-white/[0.08] focus:border-purple-500/50 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all font-medium"
              />
            </div>
          </div>

          {/* Row 3: Official Website + Target Year */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Globe className="w-3 h-3 text-slate-400" />
                Official Website
              </label>
              <input
                type="url"
                value={form.official_website}
                onChange={(e) => handleChange("official_website", e.target.value)}
                placeholder="https://afcat.cdac.in"
                className="bg-[#151828] border border-white/[0.08] focus:border-purple-500/50 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all font-medium"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-slate-400" />
                Target Year
              </label>
              <select
                value={form.target_year}
                onChange={(e) => handleChange("target_year", e.target.value)}
                className="bg-[#151828] border border-white/[0.08] focus:border-purple-500/50 rounded-xl px-3.5 py-2.5 text-xs text-slate-300 focus:outline-none transition-all cursor-pointer appearance-none"
              >
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
              </select>
            </div>
          </div>

          {/* Row 4: Priority */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Bookmark className="w-3 h-3 text-slate-400" />
              Priority
            </label>
            <div className="flex items-center gap-2">
              {(["High", "Medium", "Low"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handleChange("priority", p)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    form.priority === p
                      ? p === "High"
                        ? "bg-rose-500/20 border-rose-500/40 text-rose-300"
                        : p === "Medium"
                        ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                        : "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                      : "bg-white/[0.04] border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  {p === "High" ? "🔴 High" : p === "Medium" ? "🟡 Medium" : "🟢 Low"}
                </button>
              ))}
            </div>
          </div>

          {/* Row 5: Notes */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Tag className="w-3 h-3 text-slate-400" />
              Notes
            </label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Why this exam? Any specific goals or strategy notes..."
              className="bg-[#151828] border border-white/[0.08] focus:border-purple-500/50 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all font-medium resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !form.name.trim() || !form.category}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-[0_0_14px_rgba(168,85,247,0.4)]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Register Exam</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
