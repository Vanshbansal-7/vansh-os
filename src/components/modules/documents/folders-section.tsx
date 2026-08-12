"use client";

import React from "react";
import { Folder, MoreVertical, Plus } from "lucide-react";
import { DocumentFolder } from "@/types/document";

interface FoldersSectionProps {
  folders: DocumentFolder[];
  selectedFolderId?: string;
  onSelectFolder?: (id: string) => void;
  onNewFolder?: () => void;
}

export function FoldersSection({
  folders,
  selectedFolderId,
  onSelectFolder,
  onNewFolder,
}: FoldersSectionProps) {
  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-white tracking-tight leading-none">
          My Folders
        </h2>
        <button
          type="button"
          onClick={onNewFolder}
          className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
        >
          + New Folder
        </button>
      </div>

      {/* Folders Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {folders.map((folder) => {
          const isSelected = selectedFolderId === folder.id;
          return (
            <div
              key={folder.id}
              onClick={() => onSelectFolder?.(folder.id)}
              className={`p-3.5 rounded-2xl bg-[#10131E] border transition-all flex flex-col justify-between gap-3 shadow-sm cursor-pointer group ${
                isSelected
                  ? "border-purple-500/50 bg-[#141728] shadow-[0_0_12px_rgba(168,85,247,0.3)]"
                  : "border-white/[0.08] hover:border-purple-500/30 hover:bg-[#131626]"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                  <Folder className="w-5 h-5 fill-purple-400/20" />
                </div>
                <button
                  type="button"
                  aria-label="Folder Actions"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1 rounded text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                >
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex flex-col min-w-0">
                <h4 className="text-xs font-bold text-white truncate group-hover:text-purple-300 transition-colors">
                  {folder.name}
                </h4>
                <span className="text-[10px] text-slate-400 font-semibold mt-0.5">
                  {folder.item_count} items
                </span>
              </div>
            </div>
          );
        })}

        {/* 7th Card: + New Folder */}
        <div
          onClick={onNewFolder}
          className="p-3.5 rounded-2xl bg-[#10131E] border-2 border-dashed border-purple-500/30 hover:border-purple-500/60 transition-all flex flex-col items-center justify-center text-center shadow-sm cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-1.5 group-hover:scale-110 transition-transform">
            <Plus className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-purple-300 group-hover:text-white transition-colors">
            New Folder
          </span>
        </div>
      </div>
    </div>
  );
}
