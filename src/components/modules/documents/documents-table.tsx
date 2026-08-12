"use client";

import React, { useState } from "react";
import {
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit2,
  Move,
  Star,
  Pin,
  Image as ImageIcon,
  Archive,
} from "lucide-react";
import { UserDocument } from "@/types/document";

interface DocumentsTableProps {
  documents: UserDocument[];
  onPreviewDoc?: (doc: UserDocument) => void;
  onRenameDoc?: (doc: UserDocument) => void;
  onMoveDoc?: (doc: UserDocument) => void;
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
  onTogglePin?: (id: string, isPinned: boolean) => void;
  onDeleteDoc?: (id: string) => void;
}

export function DocumentsTable({
  documents,
  onPreviewDoc,
  onRenameDoc,
  onMoveDoc,
  onToggleFavorite,
  onTogglePin,
  onDeleteDoc,
}: DocumentsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const itemsPerPage = 5;

  const totalEntries = documents.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalEntries);
  const currentDocs = documents.slice(startIndex, endIndex);

  const getFileBadge = (type: UserDocument["type"]) => {
    switch (type) {
      case "PDF":
        return (
          <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shrink-0 text-rose-400">
            <span className="text-[9px] font-black tracking-widest">PDF</span>
          </div>
        );
      case "DOCX":
        return (
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0 text-blue-400">
            <span className="text-[8px] font-black tracking-widest">DOCX</span>
          </div>
        );
      case "PNG":
      case "JPG":
        return (
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
            <ImageIcon className="w-4 h-4" />
          </div>
        );
      case "ZIP":
      default:
        return (
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
            <Archive className="w-4 h-4" />
          </div>
        );
    }
  };

  const getCategoryStyle = (category: UserDocument["category"]) => {
    switch (category) {
      case "Study Materials":
        return "bg-purple-500/15 border-purple-500/30 text-purple-300";
      case "Placement":
        return "bg-blue-500/15 border-blue-500/30 text-blue-300";
      case "Projects":
        return "bg-emerald-500/15 border-emerald-500/30 text-emerald-300";
      case "College":
        return "bg-amber-500/15 border-amber-500/30 text-amber-300";
      case "Personal":
        return "bg-sky-500/15 border-sky-500/30 text-sky-300";
      case "Certificates":
      default:
        return "bg-rose-500/15 border-rose-500/30 text-rose-300";
    }
  };

  const handleDelete = (id: string) => {
    onDeleteDoc?.(id);
    setDeletingId(null);
  };

  return (
    <>
      {/* Confirm Delete Dialog */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-[#0E101A] border border-rose-500/30 shadow-[0_0_40px_rgba(239,68,68,0.2)] p-6 flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-bold text-white">Delete Document?</h3>
              <p className="text-xs text-slate-400 mt-1">This action cannot be undone.</p>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <button type="button" onClick={() => setDeletingId(null)} className="px-4 py-2 rounded-xl bg-white/[0.06] text-slate-300 text-xs font-semibold cursor-pointer hover:bg-white/[0.1] transition-all">Cancel</button>
              <button type="button" onClick={() => handleDelete(deletingId)} className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col rounded-2xl bg-[#10131E] border border-white/[0.08] overflow-hidden shadow-sm">
        {/* Table Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#141828] border-b border-white/[0.08] text-xs font-bold text-slate-300">
          <div className="w-[30%] min-w-[200px]">
            <span>Name</span>
          </div>
          <div className="w-[10%] min-w-[70px]">
            <span>Type</span>
          </div>
          <div className="w-[15%] min-w-[110px]">
            <span>Category</span>
          </div>
          <div className="w-[10%] min-w-[70px]">
            <span>Size</span>
          </div>
          <div className="w-[14%] min-w-[100px]">
            <span>Modified</span>
          </div>
          <div className="w-[11%] min-w-[90px]">
            <span>Tags</span>
          </div>
          <div className="w-[10%] min-w-[90px] text-right">
            <span>Actions</span>
          </div>
        </div>

        {/* Table Rows */}
        <div className="flex flex-col divide-y divide-white/[0.04] bg-[#0E101A]">
          {currentDocs.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] transition-colors"
            >
              {/* Name Column */}
              <div className="w-[30%] min-w-[200px] flex items-center gap-3 pr-2">
                {getFileBadge(doc.type)}
                <div className="flex flex-col min-w-0">
                  <span
                    onClick={() => onPreviewDoc?.(doc)}
                    className="text-xs font-bold text-white truncate cursor-pointer hover:text-purple-300 transition-colors"
                    title="Click to preview"
                  >
                    {doc.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                    {doc.path}
                  </span>
                </div>
              </div>

              {/* Type Column */}
              <div className="w-[10%] min-w-[70px] pr-2">
                <span className="text-xs font-bold text-slate-300">
                  {doc.type}
                </span>
              </div>

              {/* Category Column */}
              <div className="w-[15%] min-w-[110px] pr-2">
                <span
                  className={`px-2.5 py-1 rounded-xl border text-[10.5px] font-bold tracking-tight inline-flex items-center ${getCategoryStyle(
                    doc.category
                  )}`}
                >
                  {doc.category}
                </span>
              </div>

              {/* Size Column */}
              <div className="w-[10%] min-w-[70px] pr-2">
                <span className="text-xs font-medium text-slate-400">
                  {doc.size}
                </span>
              </div>

              {/* Modified Column */}
              <div className="w-[14%] min-w-[100px] pr-2">
                <span className="text-xs font-medium text-slate-300">
                  {doc.modified_date}
                </span>
              </div>

              {/* Tags Column */}
              <div className="w-[11%] min-w-[90px] flex items-center gap-1 flex-wrap pr-2">
                {doc.tags?.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[10px] font-semibold text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Actions Column (Preview, Rename, Move, Star, Pin, Download, Delete) */}
              <div className="w-[10%] min-w-[90px] flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={() => onPreviewDoc?.(doc)}
                  aria-label="Preview Document"
                  title="Preview"
                  className="p-1 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onRenameDoc?.(doc)}
                  aria-label="Rename Document"
                  title="Rename"
                  className="p-1 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onMoveDoc?.(doc)}
                  aria-label="Move Document"
                  title="Move to Folder"
                  className="p-1 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <Move className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onToggleFavorite?.(doc.id, !doc.is_favorite)}
                  aria-label="Favorite Document"
                  title={doc.is_favorite ? "Unfavorite" : "Favorite"}
                  className={`p-1 rounded transition-colors cursor-pointer ${
                    doc.is_favorite ? "text-amber-400" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${doc.is_favorite ? "fill-amber-400" : ""}`} />
                </button>

                {doc.download_url && (
                  <a
                    href={doc.download_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Download Document"
                    title="Download"
                    className="p-1 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setDeletingId(doc.id)}
                  aria-label="Delete Document"
                  title="Delete"
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
            Showing {totalEntries > 0 ? startIndex + 1 : 0} to {endIndex} of {totalEntries} items
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
