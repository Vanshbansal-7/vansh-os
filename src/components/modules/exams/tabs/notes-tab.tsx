"use client";

import React, { useState } from "react";
import {
  LayoutTemplate,
  Plus,
  Search,
  Grid,
  List,
  Pin,
  FileText,
  Clock,
  MoreVertical,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { useExamNotes } from "@/hooks/use-exam-notes";
import { Pagination } from "@/components/modules/cgl/shared/pagination";

interface NotesTabProps {
  examSlug: string;
  examId?: string;
}

export function NotesTab({ examSlug, examId }: NotesTabProps) {
  const {
    notes,
    searchQuery,
    setSearchQuery,
    selectedFolder,
    setSelectedFolder,
    selectedTag,
    setSelectedTag,
    selectedType,
    setSelectedType,
    selectedSort,
    setSelectedSort,
    viewMode,
    setViewMode,
    currentPage,
    setCurrentPage,
    addNote,
    deleteNote,
    togglePin,
  } = useExamNotes(examSlug, examId);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [addError, setAddError] = useState("");

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");
    if (!newTitle.trim()) { setAddError("Title is required"); return; }
    try {
      await addNote({ title: newTitle.trim(), content: newContent.trim(), category: selectedFolder !== "All" ? selectedFolder : "General" });
      setNewTitle("");
      setNewContent("");
      setIsAddingNote(false);
    } catch (err: any) {
      setAddError(err?.message || "Failed to create note");
    }
  };

  const getDocColor = (folder: string) => {
    switch (folder) {
      case "Strategy & Planning":
        return "text-purple-400 bg-purple-500/15 border-purple-500/25";
      case "Reasoning":
        return "text-amber-400 bg-amber-500/15 border-amber-500/25";
      case "English":
        return "text-emerald-400 bg-emerald-500/15 border-emerald-500/25";
      case "GK & Current Affairs":
        return "text-rose-400 bg-rose-500/15 border-rose-500/25";
      case "Maths":
        return "text-sky-400 bg-sky-500/15 border-sky-500/25";
      default:
        return "text-purple-400 bg-purple-500/15 border-purple-500/25";
    }
  };

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.max(1, Math.ceil(notes.length / ITEMS_PER_PAGE));

  return (
    <div className="flex flex-col w-full mt-4">
      {/* Center Main Workspace */}
      <div className="flex flex-col gap-3 min-w-0 w-full">
        {/* 1. Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight leading-none">
              My Notes
            </h2>
            <p className="text-[11.5px] text-slate-400 font-medium mt-1">
              Create, organize and manage your study notes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
            >
              <LayoutTemplate className="w-3.5 h-3.5 text-slate-400" />
              <span>Templates</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAddingNote(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-[0_0_12px_rgba(168,85,247,0.4)] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Note</span>
            </button>
          </div>
        </div>

        {/* Inline Add Note Form */}
        {isAddingNote && (
          <form
            onSubmit={handleAddNote}
            className="flex flex-col gap-2 p-4 rounded-2xl bg-[#10131E] border border-purple-500/30"
          >
            {addError && (
              <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold">
                <AlertCircle className="w-4 h-4" />
                <span>{addError}</span>
              </div>
            )}
            <input
              type="text"
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Note title..."
              className="w-full bg-[#151828] border border-purple-500/40 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Note content (optional)..."
              rows={3}
              className="w-full bg-[#151828] border border-white/[0.06] rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none resize-none"
            />
            <div className="flex items-center gap-2">
              <button type="submit" className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl cursor-pointer">
                Save Note
              </button>
              <button type="button" onClick={() => setIsAddingNote(false)} className="px-3 py-1.5 text-slate-400 text-xs hover:text-white cursor-pointer">
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* 2. Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 p-2 rounded-2xl bg-[#10131E] border border-white/[0.08]">
          <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
            {/* Search Input */}
            <div className="relative min-w-[160px] sm:min-w-[200px] flex-1">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="w-full bg-[#151828] border border-white/[0.06] hover:border-white/[0.12] focus:border-purple-500/50 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
              />
            </div>

            {/* Dropdowns */}
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              aria-label="Filter by folder"
              className="bg-[#151828] border border-white/[0.06] hover:border-white/[0.12] rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="All">All Folders</option>
              <option value="Strategy & Planning">Strategy & Planning</option>
              <option value="Reasoning">Reasoning</option>
              <option value="Maths">Maths</option>
              <option value="English">English</option>
              <option value="GK & Current Affairs">GK & Current Affairs</option>
            </select>

            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              aria-label="Filter by tag"
              className="bg-[#151828] border border-white/[0.06] hover:border-white/[0.12] rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none cursor-pointer hidden sm:block"
            >
              <option value="All">All Tags</option>
              <option value="Strategy">Strategy</option>
              <option value="Important">Important</option>
              <option value="Formulas">Formulas</option>
              <option value="Vocabulary">Vocabulary</option>
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              aria-label="Filter by type"
              className="bg-[#151828] border border-white/[0.06] hover:border-white/[0.12] rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none cursor-pointer hidden md:block"
            >
              <option value="All">All Types</option>
              <option value="Markdown">Markdown</option>
              <option value="RichText">Rich Text</option>
            </select>

            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              aria-label="Sort notes"
              className="bg-[#151828] border border-white/[0.06] hover:border-white/[0.12] rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="Last Updated">Last Updated</option>
              <option value="Created Date">Created Date</option>
              <option value="Alphabetical">Alphabetical</option>
            </select>
          </div>

          {/* View Mode Toggles */}
          <div className="flex items-center gap-1 p-0.5 rounded-xl bg-[#151828] border border-white/[0.06]">
            <button
              onClick={() => setViewMode("list")}
              type="button"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === "list"
                  ? "bg-purple-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              type="button"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === "grid"
                  ? "bg-purple-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3. Note Cards List */}
        <div className="flex flex-col gap-2.5">
          {notes.map((n) => (
            <div
              key={n.id}
              className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 p-3.5 rounded-2xl bg-[#10131E] border border-white/[0.08] hover:border-white/[0.14] transition-all cursor-pointer group"
            >
              {/* Left Details */}
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <div
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${getDocColor(
                    n.folder
                  )}`}
                >
                  <FileText className="w-5 h-5" />
                </div>

                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight group-hover:text-purple-300 transition-colors">
                      {n.title}
                    </h3>
                    {n.is_pinned && (
                      <Pin className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 font-medium line-clamp-2 mt-1 leading-relaxed">
                    {n.description}
                  </p>

                  {/* Tags */}
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    {n.tags.map((tag: string, tIdx: number) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[10px] font-medium text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Metadata */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0 border-t sm:border-t-0 border-white/[0.04] pt-2 sm:pt-0">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-purple-500/15 border border-purple-500/25 text-purple-300 text-[9.5px] font-bold">
                    {n.format}
                  </span>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === n.id ? null : n.id); }}
                      className="p-1 rounded text-slate-500 hover:text-slate-300 cursor-pointer"
                    >
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>
                    {openMenuId === n.id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 top-6 z-20 w-36 rounded-xl bg-[#151828] border border-white/[0.1] shadow-xl py-1 flex flex-col text-xs"
                      >
                        <button
                          onClick={async () => { setOpenMenuId(null); try { await togglePin(n.id); } catch {} }}
                          className="flex items-center gap-2 px-3 py-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 transition-colors text-left"
                        >
                          <Pin className="w-3 h-3" />
                          <span>{n.is_pinned ? "Unpin" : "Pin"}</span>
                        </button>
                        <button
                          onClick={async () => { setOpenMenuId(null); try { await deleteNote(n.id); } catch {} }}
                          className="flex items-center gap-2 px-3 py-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-0.5 mt-1 text-[10px] text-slate-500 font-medium">
                  <div className="flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    <span>{n.updated_date}</span>
                  </div>
                  <span className="font-mono text-slate-400">
                    {n.word_count.toLocaleString()} words
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 4. Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          showingText={notes.length === 0 ? "No notes yet" : `Showing ${Math.min((currentPage-1)*ITEMS_PER_PAGE+1, notes.length)} to ${Math.min(currentPage*ITEMS_PER_PAGE, notes.length)} of ${notes.length} note${notes.length !== 1 ? 's' : ''}`}
        />
      </div>
    </div>
  );
}
