"use client";

import React, { useState } from "react";
import { ApplicationStatus } from "@/types/company";

interface CompanyStatusBadgeProps {
  status: ApplicationStatus;
  onStatusChange?: (newStatus: ApplicationStatus) => void;
}

const ALL_STATUSES: ApplicationStatus[] = [
  "Applied",
  "Assessment",
  "Interview",
  "Selected",
  "Offer Received",
  "Rejected",
  "Withdrawn",
];

export function CompanyStatusBadge({ status, onStatusChange }: CompanyStatusBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getBadgeStyle = (st: ApplicationStatus) => {
    switch (st) {
      case "Applied":
        return "bg-blue-500/20 border-blue-500/40 text-blue-300 hover:bg-blue-500/30";
      case "Assessment":
        return "bg-purple-500/20 border-purple-500/40 text-purple-300 hover:bg-purple-500/30";
      case "Interview":
        return "bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30";
      case "Selected":
      case "Offer Received":
        return "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30";
      case "Rejected":
        return "bg-rose-500/20 border-rose-500/40 text-rose-300 hover:bg-rose-500/30";
      case "Withdrawn":
      default:
        return "bg-slate-500/20 border-slate-500/40 text-slate-300 hover:bg-slate-500/30";
    }
  };

  if (!onStatusChange) {
    return (
      <span
        className={`px-3 py-1 rounded-xl border text-[11px] font-bold tracking-tight inline-flex items-center justify-center ${getBadgeStyle(
          status
        )}`}
      >
        {status}
      </span>
    );
  }

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-1 rounded-xl border text-[11px] font-bold tracking-tight inline-flex items-center justify-center transition-all cursor-pointer ${getBadgeStyle(
          status
        )}`}
      >
        <span>{status}</span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-36 rounded-xl bg-[#0E101A] border border-purple-500/30 shadow-[0_0_20px_rgba(0,0,0,0.5)] py-1 z-50 flex flex-col gap-0.5">
          {ALL_STATUSES.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => {
                onStatusChange(st);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-1.5 text-[11px] font-bold transition-colors cursor-pointer ${
                st === status ? "bg-purple-600/30 text-purple-300" : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
