"use client";

import React, { useState } from "react";
import { Plus, Calendar, Upload, ChevronDown, AlertCircle } from "lucide-react";
import { ApplicationStatus, ApplicationMode } from "@/types/company";

interface AddCompanyCardProps {
  onAddCompany?: (newComp: any) => Promise<void> | void;
}

export function AddCompanyCard({ onAddCompany }: AddCompanyCardProps) {
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [dateApplied, setDateApplied] = useState("");
  const [appMode, setAppMode] = useState<ApplicationMode | "">("");
  const [jobLink, setJobLink] = useState("");
  const [status, setStatus] = useState<ApplicationStatus | "">("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ companyName?: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    if (!companyName.trim()) {
      setErrorMessage("Company Name is required.");
      setFieldErrors({ companyName: true });
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddCompany?.({
        company_name: companyName.trim(),
        role: role.trim() || "Software Engineer",
        applied_date: dateApplied.trim() || new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
        application_mode: appMode || "Off Campus",
        job_link: jobLink.trim(),
        status: status || "Applied",
        location: location.trim() || "Remote",
        notes: notes.trim(),
      });

      // Clear input only on success
      setCompanyName("");
      setRole("");
      setDateApplied("");
      setAppMode("");
      setJobLink("");
      setStatus("");
      setLocation("");
      setNotes("");
      setErrorMessage(null);
      setFieldErrors({});
    } catch (err: any) {
      console.error("[AddCompanyCard] Submit failed:", err);
      setErrorMessage(err?.message || "Failed to create company record in database.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl p-5 bg-[#10131E] border border-white/[0.08] flex flex-col gap-4 shadow-sm">
      <h2 className="text-sm font-bold text-white tracking-tight">
        Add New Company Application
      </h2>

      {errorMessage && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Row 1: 4 Columns (Company Name, Role / Position, Date Applied, Application Mode) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Company Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => {
                setCompanyName(e.target.value);
                if (fieldErrors.companyName) setFieldErrors({});
              }}
              placeholder="e.g. TCS"
              className={`bg-[#151828] border rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-all ${
                fieldErrors.companyName
                  ? "border-rose-500 focus:border-rose-400 bg-rose-950/20"
                  : "border-white/[0.08] hover:border-white/[0.14] focus:border-purple-500/50"
              }`}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Role / Position
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Software Engineer"
              className="bg-[#151828] border border-white/[0.08] hover:border-white/[0.14] focus:border-purple-500/50 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Date Applied
            </label>
            <div className="relative">
              <input
                type="text"
                value={dateApplied}
                onChange={(e) => setDateApplied(e.target.value)}
                placeholder="dd/mm/yyyy"
                className="w-full bg-[#151828] border border-white/[0.08] hover:border-white/[0.14] focus:border-purple-500/50 rounded-xl pl-3 pr-9 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
              />
              <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Application Mode
            </label>
            <div className="relative">
              <select
                value={appMode}
                onChange={(e) => setAppMode(e.target.value as ApplicationMode)}
                aria-label="Application Mode"
                className="w-full bg-[#151828] border border-white/[0.08] hover:border-white/[0.14] focus:border-purple-500/50 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none appearance-none cursor-pointer transition-all"
              >
                <option value="">Select mode</option>
                <option value="On Campus">On Campus</option>
                <option value="Off Campus">Off Campus</option>
                <option value="Referral">Referral</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Careers Page">Careers Page</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Row 2: 3 Columns (Job / Application Link, Status, Location) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Job / Application Link
            </label>
            <input
              type="text"
              value={jobLink}
              onChange={(e) => setJobLink(e.target.value)}
              placeholder="Paste job or application link"
              className="bg-[#151828] border border-white/[0.08] hover:border-white/[0.14] focus:border-purple-500/50 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Status
            </label>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                aria-label="Application Status"
                className="w-full bg-[#151828] border border-white/[0.08] hover:border-white/[0.14] focus:border-purple-500/50 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none appearance-none cursor-pointer transition-all"
              >
                <option value="">Select status</option>
                <option value="Applied">Applied</option>
                <option value="Assessment">Assessment</option>
                <option value="Interview">Interview</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
                <option value="Offer Received">Offer Received</option>
                <option value="Withdrawn">Withdrawn</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Bangalore"
              className="bg-[#151828] border border-white/[0.08] hover:border-white/[0.14] focus:border-purple-500/50 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Row 3: 2 Columns (Notes Textarea + Screenshots Box) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any important details..."
              rows={4}
              className="bg-[#151828] border border-white/[0.08] hover:border-white/[0.14] focus:border-purple-500/50 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none resize-none transition-all h-full min-h-[110px]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Screenshots / Documents
            </label>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/[0.1] hover:border-purple-500/50 rounded-xl p-4 bg-[#151828]/50 text-center cursor-pointer transition-all h-full min-h-[110px] group">
              <Upload className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform mb-1.5" />
              <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">
                Upload files or drag & drop
              </span>
              <span className="text-[10px] text-slate-500 font-medium mt-0.5">
                PNG, JPG, PDF up to 10MB
              </span>
            </div>
          </div>
        </div>

        {/* Row 4: Primary Button (+ Add Company) */}
        <div className="flex items-center justify-start mt-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-[0_0_14px_rgba(168,85,247,0.4)] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isSubmitting ? "Saving to Database..." : "Add Company"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
