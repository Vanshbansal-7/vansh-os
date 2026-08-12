"use client";

import React, { useState } from "react";
import { X, Building2, MapPin, ExternalLink, Calendar, FileText, Check, Edit2 } from "lucide-react";
import { CompanyApplication } from "@/types/company";
import { CompanyStatusBadge } from "./company-status-badge";

interface CompanyDetailsModalProps {
  isOpen: boolean;
  company: CompanyApplication | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: CompanyApplication["status"]) => void;
  onUpdateDetails: (id: string, updates: Partial<CompanyApplication>) => void;
}

export function CompanyDetailsModal({
  isOpen,
  company,
  onClose,
  onUpdateStatus,
  onUpdateDetails,
}: CompanyDetailsModalProps) {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState("");

  if (!isOpen || !company) return null;

  const handleSaveNotes = () => {
    onUpdateDetails(company.id, { notes: notesValue });
    setIsEditingNotes(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-2xl rounded-2xl bg-[#0E101A] border border-purple-500/30 shadow-[0_0_60px_rgba(168,85,247,0.25)] overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#131626] border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 overflow-hidden font-bold text-sm">
              {company.logo_url ? (
                <img src={company.logo_url} alt={company.company_name} className="w-full h-full object-cover" />
              ) : (
                company.company_name.charAt(0)
              )}
            </div>
            <div className="flex flex-col">
              <h3 className="text-base font-bold text-white tracking-tight">{company.company_name}</h3>
              <span className="text-xs text-slate-400 font-medium">{company.role}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CompanyStatusBadge
              status={company.status}
              onStatusChange={(newStatus) => onUpdateStatus(company.id, newStatus)}
            />
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-5">
          {/* Metadata Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[#131626] border border-white/[0.06]">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3 h-3 text-purple-400" /> Applied Date
              </span>
              <span className="text-xs font-bold text-white mt-0.5">{company.applied_date}</span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3 h-3 text-purple-400" /> Location
              </span>
              <span className="text-xs font-bold text-white mt-0.5">{company.location || "Remote / Hybrid"}</span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1">
                Mode
              </span>
              <span className="text-xs font-bold text-white mt-0.5">{company.application_mode}</span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1">
                Job URL
              </span>
              {company.job_link ? (
                <a
                  href={company.job_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-purple-400 hover:text-purple-300 truncate flex items-center gap-1 mt-0.5"
                >
                  <span>Open Job Posting</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-xs font-medium text-slate-500 mt-0.5">Not provided</span>
              )}
            </div>
          </div>

          {/* Interview & Application Notes */}
          <div className="flex flex-col gap-2 p-4 rounded-xl bg-[#131626] border border-white/[0.06]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-purple-400" /> Interview & Application Notes
              </span>
              {isEditingNotes ? (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    className="p-1 rounded text-emerald-400 hover:text-emerald-300 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingNotes(false)}
                    className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setNotesValue(company.notes || "");
                    setIsEditingNotes(true);
                  }}
                  className="p-1 rounded text-slate-400 hover:text-purple-300 transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit Notes
                </button>
              )}
            </div>

            {isEditingNotes ? (
              <textarea
                value={notesValue}
                onChange={(e) => setNotesValue(e.target.value)}
                placeholder="Add round details, OA questions, technical interview prep notes..."
                className="w-full bg-[#0E101A] border border-purple-500/40 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none min-h-[100px] resize-none font-mono"
              />
            ) : (
              <p className="text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-wrap">
                {company.notes || "No interview or application notes added yet. Click Edit Notes above to add notes."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
