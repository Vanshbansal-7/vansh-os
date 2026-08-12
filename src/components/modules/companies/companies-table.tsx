"use client";

import React, { useState } from "react";
import { Eye, Trash2, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { CompanyApplication } from "@/types/company";
import { CompanyStatusBadge } from "./company-status-badge";

interface CompaniesTableProps {
  companies: CompanyApplication[];
  onDelete?: (id: string) => void;
  onUpdateStatus?: (id: string, status: CompanyApplication["status"]) => void;
  onViewCompanyDetails?: (company: CompanyApplication) => void;
}

export function CompaniesTable({
  companies,
  onDelete,
  onUpdateStatus,
  onViewCompanyDetails,
}: CompaniesTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const itemsPerPage = 5;

  const totalEntries = companies.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalEntries);
  const currentCompanies = companies.slice(startIndex, endIndex);

  const handleDelete = (id: string) => {
    onDelete?.(id);
    setDeletingId(null);
  };

  return (
    <>
      {/* Confirm Delete Dialog */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-[#0E101A] border border-rose-500/30 shadow-[0_0_40px_rgba(239,68,68,0.2)] p-6 flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-bold text-white">Delete Company Application?</h3>
              <p className="text-xs text-slate-400 mt-1">
                This will permanently remove this application entry. This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl bg-white/[0.06] text-slate-300 text-xs font-semibold cursor-pointer hover:bg-white/[0.1] transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deletingId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col rounded-2xl bg-[#10131E] border border-white/[0.08] overflow-hidden shadow-sm">
        {/* Table Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#141828] border-b border-white/[0.08] text-xs font-bold text-slate-300">
          <div className="w-[20%] min-w-[140px]">
            <span>Company</span>
          </div>
          <div className="w-[18%] min-w-[130px]">
            <span>Role</span>
          </div>
          <div className="w-[15%] min-w-[110px]">
            <span>Date Applied</span>
          </div>
          <div className="w-[15%] min-w-[110px]">
            <span>Status</span>
          </div>
          <div className="w-[14%] min-w-[100px]">
            <span>Location</span>
          </div>
          <div className="w-[10%] min-w-[80px]">
            <span>Documents</span>
          </div>
          <div className="w-[8%] min-w-[70px] text-right">
            <span>Actions</span>
          </div>
        </div>

        {/* Table Rows */}
        <div className="flex flex-col divide-y divide-white/[0.04] bg-[#0E101A]">
          {currentCompanies.map((comp) => (
            <div
              key={comp.id}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] transition-colors"
            >
              {/* Company Column */}
              <div className="w-[20%] min-w-[140px] flex items-center gap-3 pr-2">
                <div className="w-8 h-8 rounded-lg bg-[#151828] border border-white/[0.08] flex items-center justify-center shrink-0 overflow-hidden">
                  {comp.logo_url ? (
                    <img
                      src={comp.logo_url}
                      alt={comp.company_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-extrabold text-purple-300">
                      {comp.company_name.substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <span
                  onClick={() => onViewCompanyDetails?.(comp)}
                  className="text-xs font-bold text-white truncate cursor-pointer hover:text-purple-300 transition-colors"
                  title="Click to view details"
                >
                  {comp.company_name}
                </span>
              </div>

              {/* Role Column */}
              <div className="w-[18%] min-w-[130px] pr-2">
                <span className="text-xs font-medium text-slate-300 truncate block">
                  {comp.role}
                </span>
              </div>

              {/* Date Applied Column */}
              <div className="w-[15%] min-w-[110px] pr-2">
                <span className="text-xs font-medium text-slate-400">
                  {comp.applied_date}
                </span>
              </div>

              {/* Status Column */}
              <div className="w-[15%] min-w-[110px] pr-2">
                <CompanyStatusBadge
                  status={comp.status}
                  onStatusChange={(newStatus) => onUpdateStatus?.(comp.id, newStatus)}
                />
              </div>

              {/* Location Column */}
              <div className="w-[14%] min-w-[100px] pr-2">
                <span className="text-xs font-medium text-slate-300 truncate block">
                  {comp.location || "Remote / Hybrid"}
                </span>
              </div>

              {/* Documents Column */}
              <div className="w-[10%] min-w-[80px] flex items-center gap-1.5 pr-2">
                {comp.documents && comp.documents.length > 0 ? (
                  <>
                    <div className="w-6 h-7 rounded bg-[#161828] border border-white/[0.1] overflow-hidden shrink-0 flex items-center justify-center">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    {comp.documents.length > 1 && (
                      <span className="px-1.5 py-0.5 rounded bg-white/[0.06] text-[10px] font-bold text-slate-300 border border-white/[0.08]">
                        +{comp.documents.length - 1}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-[11px] text-slate-500 font-medium">—</span>
                )}
              </div>

              {/* Actions Column (View, Delete) */}
              <div className="w-[8%] min-w-[70px] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => onViewCompanyDetails?.(comp)}
                  aria-label="View Application"
                  title="View Details & Notes"
                  className="p-1 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingId(comp.id)}
                  aria-label="Delete Application"
                  title="Delete Application"
                  className="p-1 rounded text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3 bg-[#131625] border-t border-white/[0.08]">
          <span className="text-xs text-slate-400 font-medium">
            Showing {totalEntries > 0 ? startIndex + 1 : 0} to {endIndex} of {totalEntries} entries
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-40 border border-white/[0.06] flex items-center justify-center text-slate-300 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => {
              const isActive = pg === currentPage;
              return (
                <button
                  key={pg}
                  type="button"
                  onClick={() => setCurrentPage(pg)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                      : "bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.06]"
                  }`}
                >
                  {pg}
                </button>
              );
            })}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-40 border border-white/[0.06] flex items-center justify-center text-slate-300 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
