"use client";

import React, { useState } from "react";
import { X, Upload, FileText, AlertCircle } from "lucide-react";
import { UserDocument, FileType, DocumentCategory } from "@/types/document";

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (doc: Omit<UserDocument, "id">) => Promise<any> | any;
}

export function UploadDocumentModal({ isOpen, onClose, onSuccess }: UploadDocumentModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<FileType>("PDF");
  const [category, setCategory] = useState<DocumentCategory>("Study Materials");
  const [size, setSize] = useState("2.4 MB");
  const [url, setUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim()) {
      setErrorMsg("Document name is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSuccess({
        name: name.trim(),
        path: `/Root/${category}/${name.trim()}`,
        type,
        category,
        size,
        modified_date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
        tags: [category, type],
        download_url: url.trim() || undefined,
      });

      setName("");
      setUrl("");
      setErrorMsg("");
      onClose();
    } catch (err: any) {
      console.error("[UploadDocumentModal] Submit failed:", err);
      setErrorMsg(err?.message || "Failed to save document record in database.");
    } finally {
      setIsSubmitting(false);
    }
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
              <Upload className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-tight">Upload / Add Document</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-2 text-rose-300 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">
              Document Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Operating Systems Cheat Sheet.pdf"
              className={`bg-[#151828] border rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all font-medium ${
                errorMsg ? "border-rose-500 bg-rose-950/20" : "border-white/[0.08] focus:border-purple-500/50"
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                className="bg-[#151828] border border-white/[0.08] focus:border-purple-500/50 rounded-xl px-3.5 py-2 text-xs text-slate-300 focus:outline-none cursor-pointer appearance-none"
              >
                <option value="Study Materials">Study Materials</option>
                <option value="Placement">Placement</option>
                <option value="Projects">Projects</option>
                <option value="Certificates">Certificates</option>
                <option value="Personal">Personal</option>
                <option value="College">College</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as FileType)}
                className="bg-[#151828] border border-white/[0.08] focus:border-purple-500/50 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none cursor-pointer appearance-none"
              >
                <option value="PDF">PDF</option>
                <option value="DOCX">DOCX</option>
                <option value="PNG">PNG</option>
                <option value="JPG">JPG</option>
                <option value="ZIP">ZIP</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">Download / File Link (URL)</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://drive.google.com/... or direct link"
              className="bg-[#151828] border border-white/[0.08] focus:border-purple-500/50 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none font-medium"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.06]">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 text-xs font-semibold transition-all cursor-pointer">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_12px_rgba(168,85,247,0.4)]"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Uploading..." : "Upload Document"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
