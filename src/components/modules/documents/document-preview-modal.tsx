"use client";

import React from "react";
import { X, Download, FileText, ExternalLink, Calendar, HardDrive, Tag } from "lucide-react";
import { UserDocument } from "@/types/document";

interface DocumentPreviewModalProps {
  isOpen: boolean;
  doc: UserDocument | null;
  onClose: () => void;
}

export function DocumentPreviewModal({ isOpen, doc, onClose }: DocumentPreviewModalProps) {
  if (!isOpen || !doc) return null;

  const isImage = doc.type === "PNG" || doc.type === "JPG";
  const isPdf = doc.type === "PDF";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-3xl rounded-2xl bg-[#0E101A] border border-purple-500/30 shadow-[0_0_60px_rgba(168,85,247,0.25)] overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#131626] border-b border-white/[0.08]">
          <div className="flex items-center gap-3 min-w-0 pr-4">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <h3 className="text-sm font-bold text-white tracking-tight truncate">{doc.name}</h3>
              <span className="text-[10.5px] text-slate-400 font-medium truncate">{doc.path}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {doc.download_url && (
              <a
                href={doc.download_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body / Viewer */}
        <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-5">
          {/* Main Visual Preview Area */}
          <div className="w-full min-h-[220px] rounded-xl bg-[#141828] border border-white/[0.08] flex items-center justify-center p-4 overflow-hidden relative">
            {isImage && doc.download_url ? (
              <img src={doc.download_url} alt={doc.name} className="max-h-[350px] object-contain rounded-lg" />
            ) : isPdf && doc.download_url ? (
              <iframe src={doc.download_url} className="w-full h-[350px] rounded-lg border-0" title={doc.name} />
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
                <FileText className="w-12 h-12 text-purple-400 opacity-60" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">{doc.name}</span>
                  <span className="text-[11px] text-slate-400 mt-0.5">Preview not embedded for {doc.type} files</span>
                </div>
                {doc.download_url && (
                  <a
                    href={doc.download_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-semibold cursor-pointer"
                  >
                    <span>Open External Link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Document Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[#131626] border border-white/[0.06]">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1">
                <HardDrive className="w-3 h-3 text-purple-400" /> Size
              </span>
              <span className="text-xs font-bold text-white mt-0.5">{doc.size}</span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3 h-3 text-purple-400" /> Modified
              </span>
              <span className="text-xs font-bold text-white mt-0.5">{doc.modified_date}</span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1">
                <Tag className="w-3 h-3 text-purple-400" /> Category
              </span>
              <span className="text-xs font-bold text-white mt-0.5">{doc.category}</span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1">
                Type
              </span>
              <span className="text-xs font-bold text-white mt-0.5">{doc.type}</span>
            </div>
          </div>

          {/* Tags */}
          {doc.tags && doc.tags.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">Tags:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {doc.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
