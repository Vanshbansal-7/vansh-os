"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages?: number;
  onPageChange: (page: number) => void;
  showingText?: string;
}

export function Pagination({
  currentPage = 1,
  totalPages = 5,
  onPageChange,
  showingText = "Showing 1 to 6 of 27 topics",
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-3 border-t border-white/[0.04] mt-3">
      {/* Left/Center Showing Text */}
      <span className="text-[11px] text-slate-500 font-medium order-2 sm:order-1">
        {showingText}
      </span>

      {/* Right Pagination Pills */}
      <div className="flex items-center gap-1.5 order-1 sm:order-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          type="button"
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#10131E] border border-white/[0.08] hover:border-white/[0.14] text-slate-400 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Prev</span>
        </button>

        {pages.map((p) => {
          const isActive = p === currentPage;
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              type="button"
              className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                isActive
                  ? "bg-purple-600 text-white shadow-[0_0_12px_rgba(147,51,234,0.6)] border border-purple-400/40"
                  : "bg-[#10131E] border border-white/[0.08] text-slate-400 hover:text-white hover:border-white/[0.14]"
              }`}
            >
              {p}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          type="button"
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#10131E] border border-white/[0.08] hover:border-white/[0.14] text-slate-400 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
