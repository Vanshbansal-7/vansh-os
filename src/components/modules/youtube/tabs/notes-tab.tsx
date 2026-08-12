"use client";

import React, { useState, useRef } from "react";
import { Plus, Pin, PinOff, Search, Trash2, Edit2, Check, X, FileText, AlignLeft } from "lucide-react";
import { YouTubeNote } from "@/types/youtube";

interface NotesTabProps {
  notes: YouTubeNote[];
}

interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (note: Omit<YouTubeNote, "id">) => void;
}

function CreateNoteModal({ isOpen, onClose, onSuccess }: CreateNoteModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Video Ideas");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSuccess({
      title: title.trim(),
      content: "### Video Outline & Hook\n1. Hook (0-10s)\n2. Problem Statement\n3. Core Solution",
      category,
      tags: [category],
      is_pinned: false,
      updated_at: new Date().toISOString(),
    });
    setTitle("");
    setCategory("Video Ideas");
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
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-tight">New Script / Note</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">Title <span className="text-rose-400">*</span></label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Devlog #3 Script, DSA Arrays Hook..."
              className="bg-[#151828] border border-white/[0.08] focus:border-purple-500/50 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all font-medium"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-[#151828] border border-white/[0.08] focus:border-purple-500/50 rounded-xl px-3.5 py-2.5 text-xs text-slate-300 focus:outline-none cursor-pointer appearance-none"
            >
              <option>Video Ideas</option>
              <option>Scripts</option>
              <option>Titles & Hooks</option>
              <option>Thumbnails</option>
              <option>Research</option>
              <option>General</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.06]">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 text-xs font-semibold transition-all cursor-pointer">Cancel</button>
            <button type="submit" disabled={!title.trim()} className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              <span>Create Note</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function NotesTab({ notes: initialNotes }: NotesTabProps) {
  const [notes, setNotes] = useState<YouTubeNote[]>(initialNotes);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState<string>(initialNotes[0]?.id || "");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [editTitleValue, setEditTitleValue] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const selectedNote = notes.find((n) => n.id === selectedNoteId) || notes[0];

  const filteredNotes = notes.filter((n) =>
    searchQuery ? n.title.toLowerCase().includes(searchQuery.toLowerCase()) : true
  );

  const handleCreateNote = (data: Omit<YouTubeNote, "id">) => {
    const newNote: YouTubeNote = { ...data, id: crypto.randomUUID() };
    setNotes((prev) => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);
  };

  const handleContentChange = (id: string, val: string) => {
    setNotes((prev) => prev.map((n) => n.id === id ? { ...n, content: val, updated_at: new Date().toISOString() } : n));
  };

  const togglePin = (id: string) => {
    setNotes((prev) => prev.map((n) => n.id === id ? { ...n, is_pinned: !n.is_pinned } : n));
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (selectedNoteId === id) {
      const remaining = notes.filter((n) => n.id !== id);
      setSelectedNoteId(remaining[0]?.id || "");
    }
    setDeletingId(null);
  };

  const startRenaming = (note: YouTubeNote) => {
    setEditingTitleId(note.id);
    setEditTitleValue(note.title);
    setTimeout(() => titleInputRef.current?.focus(), 50);
  };

  const commitRename = () => {
    if (!editTitleValue.trim() || !editingTitleId) { setEditingTitleId(null); return; }
    setNotes((prev) => prev.map((n) => n.id === editingTitleId ? { ...n, title: editTitleValue.trim() } : n));
    setEditingTitleId(null);
  };

  const sortedNotes = [...filteredNotes].sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0));

  return (
    <div className="flex flex-col gap-3.5 w-full">
      <CreateNoteModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={handleCreateNote}
      />

      {/* Confirm Delete */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-[#0E101A] border border-rose-500/30 shadow-[0_0_40px_rgba(239,68,68,0.2)] p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-bold text-white">Delete Note?</h3>
              <p className="text-xs text-slate-400">This action cannot be undone.</p>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <button type="button" onClick={() => setDeletingId(null)} className="px-4 py-2 rounded-xl bg-white/[0.06] text-slate-300 text-xs font-semibold cursor-pointer hover:bg-white/[0.1] transition-all">Cancel</button>
              <button type="button" onClick={() => deleteNote(deletingId)} className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight leading-none">Creator Notes & Scripts</h2>
          <p className="text-[11.5px] text-slate-400 font-medium mt-1">Write scripts, hooks, title brainstorms, and video outlines.</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer shadow-[0_0_12px_rgba(168,85,247,0.4)]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Note</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-start w-full">
        {/* Left Side: Notes List */}
        <div className="w-full lg:w-72 shrink-0 flex flex-col gap-2 p-3 rounded-2xl bg-[#10131E] border border-white/[0.08]">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scripts & ideas..."
              className="w-full bg-[#151828] border border-white/[0.06] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          {notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
              <AlignLeft className="w-6 h-6 text-slate-600" />
              <p className="text-[10.5px] text-slate-500 font-medium">No notes yet</p>
              <button onClick={() => setIsCreateOpen(true)} className="text-[10.5px] text-purple-400 hover:text-purple-300 font-semibold cursor-pointer">Create your first note</button>
            </div>
          ) : (
            <div className="flex flex-col gap-1 mt-1">
              {sortedNotes.map((note) => {
                const isSelected = note.id === selectedNoteId;
                return (
                  <div
                    key={note.id}
                    onClick={() => { setSelectedNoteId(note.id); setEditingTitleId(null); }}
                    className={`p-2.5 rounded-xl border flex flex-col gap-1 transition-all cursor-pointer group ${
                      isSelected
                        ? "bg-[#181C2E] border-purple-500/40 text-white shadow-sm"
                        : "bg-transparent border-transparent hover:bg-white/[0.03] text-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold truncate flex-1">{note.title}</span>
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); togglePin(note.id); }}
                          className="p-0.5 rounded text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                          title={note.is_pinned ? "Unpin" : "Pin"}
                        >
                          {note.is_pinned ? <PinOff className="w-3 h-3" /> : <Pin className="w-3 h-3" />}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); startRenaming(note); }}
                          className="p-0.5 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                          title="Rename"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setDeletingId(note.id); }}
                          className="p-0.5 rounded text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    {note.is_pinned && <Pin className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />}
                    <span className="text-[10px] text-slate-500 font-medium">{note.category}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Note Content Editor */}
        <div className="flex-1 w-full rounded-2xl bg-[#10131E] border border-white/[0.08] min-h-[400px] flex flex-col overflow-hidden">
          {selectedNote ? (
            <>
              {/* Note Header */}
              <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3 bg-[#131626]">
                {editingTitleId === selectedNote.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      ref={titleInputRef}
                      type="text"
                      value={editTitleValue}
                      onChange={(e) => setEditTitleValue(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") commitRename(); if (e.key === "Escape") setEditingTitleId(null); }}
                      className="flex-1 bg-[#0E101A] border border-purple-500/40 rounded-lg px-2.5 py-1 text-sm font-bold text-white focus:outline-none"
                    />
                    <button type="button" onClick={commitRename} className="p-1 rounded-lg text-emerald-400 hover:text-emerald-300 cursor-pointer"><Check className="w-4 h-4" /></button>
                    <button type="button" onClick={() => setEditingTitleId(null)} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
                  </div>
                ) : (
                  <>
                    <h3
                      className="text-base font-bold text-white tracking-tight cursor-pointer hover:text-purple-300 transition-colors"
                      onClick={() => startRenaming(selectedNote)}
                      title="Click to rename"
                    >
                      {selectedNote.title}
                    </h3>
                    <span className="text-[10px] text-slate-500 font-semibold">{selectedNote.category}</span>
                  </>
                )}
              </div>

              {/* Content Editor */}
              <textarea
                value={selectedNote.content}
                onChange={(e) => handleContentChange(selectedNote.id, e.target.value)}
                placeholder="Start writing your script, ideas, or notes..."
                className="w-full flex-1 bg-transparent text-xs text-slate-200 font-mono leading-relaxed focus:outline-none resize-none p-5 min-h-[340px]"
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center gap-3">
              <AlignLeft className="w-8 h-8 text-slate-600" />
              <p className="text-sm text-slate-400 font-medium">No note selected</p>
              <button onClick={() => setIsCreateOpen(true)} className="text-xs text-purple-400 hover:text-purple-300 font-semibold cursor-pointer">Create your first note →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
