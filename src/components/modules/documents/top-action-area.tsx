"use client";

import React from "react";
import { Upload, FolderPlus, CloudUpload, Link2, ScanLine } from "lucide-react";

interface TopActionAreaProps {
  onNewFolder?: () => void;
  onUploadFile?: () => void;
}

export function TopActionArea({ onNewFolder, onUploadFile }: TopActionAreaProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
      {/* 1. Large Upload Card (Left, 5 cols) */}
      <div
        onClick={onUploadFile}
        className="lg:col-span-5 rounded-2xl p-6 bg-[#10131E] border-2 border-dashed border-purple-500/40 hover:border-purple-500/70 transition-all flex flex-col items-center justify-center text-center shadow-sm group cursor-pointer"
      >
        <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-110 transition-transform">
          <Upload className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-extrabold text-purple-300 tracking-tight">
          Upload or Drag & Drop
        </h3>
        <p className="text-[11.5px] text-slate-400 font-medium mt-1 mb-4">
          Upload files or folders to get started
        </p>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onUploadFile?.(); }}
          className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-[0_0_14px_rgba(168,85,247,0.4)] cursor-pointer"
        >
          Browse Files
        </button>
      </div>

      {/* 2. Right 4 Action Cards (Right, 7 cols, 2x2 Grid) */}
      <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Card 1: New Folder */}
        <div
          onClick={onNewFolder}
          className="p-4 rounded-2xl bg-[#10131E] border border-white/[0.08] hover:border-purple-500/30 transition-all flex items-center gap-3.5 shadow-sm cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-400 shrink-0 group-hover:scale-105 transition-transform">
            <FolderPlus className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
              New Folder
            </h4>
            <span className="text-[11px] text-slate-400 font-medium mt-0.5">
              Create a new folder
            </span>
          </div>
        </div>

        {/* Card 2: Upload Files */}
        <div
          onClick={onUploadFile}
          className="p-4 rounded-2xl bg-[#10131E] border border-white/[0.08] hover:border-purple-500/30 transition-all flex items-center gap-3.5 shadow-sm cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-400 shrink-0 group-hover:scale-105 transition-transform">
            <CloudUpload className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
              Upload Files
            </h4>
            <span className="text-[11px] text-slate-400 font-medium mt-0.5">
              Select files to upload
            </span>
          </div>
        </div>

        {/* Card 3: From URL */}
        <div
          onClick={onUploadFile}
          className="p-4 rounded-2xl bg-[#10131E] border border-white/[0.08] hover:border-purple-500/30 transition-all flex items-center gap-3.5 shadow-sm cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-400 shrink-0 group-hover:scale-105 transition-transform">
            <Link2 className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
              From URL
            </h4>
            <span className="text-[11px] text-slate-400 font-medium mt-0.5">
              Save documents from link
            </span>
          </div>
        </div>

        {/* Card 4: Scan Document */}
        <div
          onClick={onUploadFile}
          className="p-4 rounded-2xl bg-[#10131E] border border-white/[0.08] hover:border-purple-500/30 transition-all flex items-center gap-3.5 shadow-sm cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-400 shrink-0 group-hover:scale-105 transition-transform">
            <ScanLine className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
              Scan Document
            </h4>
            <span className="text-[11px] text-slate-400 font-medium mt-0.5">
              Scan and save documents
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
