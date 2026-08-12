"use client";

import React, { useState } from "react";
import { X, Folder, Move, Check } from "lucide-react";
import { DocumentFolder } from "@/types/document";

interface MoveDocumentModalProps {
  isOpen: boolean;
  docName: string;
  folders: DocumentFolder[];
  onClose: () => void;
  onSuccess: (targetFolderId: string | null) => void;
}

export function MoveDocumentModal({
  isOpen,
  docName,
  folders,
  onClose,
  onSuccess,
}: MoveDocumentModalProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess(selectedFolderId);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-2xl bg-[#0E101A] border border-purple-500/30 shadow-[0_0_40px_rgba(168,85,247,0.25)] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 bg-[#131626] border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <Move className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-tight">Move "{docName}"</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <span className="text-xs text-slate-300 font-semibold">Select Destination Folder:</span>

          <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto pr-1">
            {/* Root / Unfolder option */}
            <div
              onClick={() => setSelectedFolderId(null)}
              className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                selectedFolderId === null
                  ? "bg-purple-600/20 border-purple-500/50 text-white font-bold"
                  : "bg-[#141828] border-white/[0.06] hover:bg-white/[0.04] text-slate-300"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Folder className="w-4 h-4 text-purple-400" />
                <span className="text-xs">Root Directory</span>
              </div>
              {selectedFolderId === null && <Check className="w-4 h-4 text-purple-400" />}
            </div>

            {/* Folder list */}
            {folders.map((folder) => {
              const isSelected = selectedFolderId === folder.id;
              return (
                <div
                  key={folder.id}
                  onClick={() => setSelectedFolderId(folder.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? "bg-purple-600/20 border-purple-500/50 text-white font-bold"
                      : "bg-[#141828] border-white/[0.06] hover:bg-white/[0.04] text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Folder className="w-4 h-4 text-purple-400" />
                    <span className="text-xs truncate">{folder.name}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-purple-400" />}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 text-xs font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer"
            >
              Move File
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
