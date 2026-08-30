"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Pin,
  FileText,
  Clock,
  MoreVertical,
  Trash2,
  FolderOpen,
} from "lucide-react";
import { useExamNotes } from "@/hooks/use-exam-notes";
import { CGLNote } from "@/types/cgl";
import { RichTextEditor } from "../shared/rich-text-editor";
import { EmptyState } from "@/components/ui/empty-state";

interface NotesTabProps {
  examSlug: string;
  examId?: string;
}

const getDocColor = (folder: string) => {
  switch (folder) {
    case "Strategy & Planning":
      return "text-amber-400 bg-amber-400/10 border-amber-400/20";
    case "Reasoning":
      return "text-purple-400 bg-purple-400/10 border-purple-400/20";
    case "Maths":
      return "text-blue-400 bg-blue-400/10 border-blue-400/20";
    case "English":
      return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
    case "GK & Current Affairs":
      return "text-orange-400 bg-orange-400/10 border-orange-400/20";
    default:
      return "text-purple-400 bg-purple-400/10 border-purple-400/20";
  }
};

export function NotesTab({ examSlug, examId }: NotesTabProps) {
  const {
    notes,
    searchQuery,
    setSearchQuery,
    selectedFolder,
    setSelectedFolder,
    addNote,
    updateNote,
    deleteNote,
    togglePin,
    foldersCount,
  } = useExamNotes(examSlug, examId);

  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Editor states
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editFolder, setEditFolder] = useState("General");
  const [isSaving, setIsSaving] = useState(false);

  const activeNote = notes.find((n) => n.id === activeNoteId);

  // Sync editor when active note changes
  useEffect(() => {
    if (activeNote && !isAddingNote) {
      setEditTitle(activeNote.title || "");
      setEditContent(activeNote.content || activeNote.description || "");
      setEditFolder(activeNote.folder || "General");
    }
  }, [activeNote, isAddingNote]);

  const handleCreateNew = () => {
    setActiveNoteId(null);
    setIsAddingNote(true);
    setEditTitle("");
    setEditContent("");
    setEditFolder(selectedFolder !== "All" ? selectedFolder : "General");
  };

  const handleSaveNote = async () => {
    if (!editTitle.trim() && !editContent.trim()) return;
    setIsSaving(true);
    try {
      if (isAddingNote) {
        const newNote = await addNote({
          title: editTitle.trim() || "Untitled Note",
          content: editContent,
          description: editContent.substring(0, 200).replace(/<[^>]*>?/gm, ''), // Stripped text for snippet
          folder: editFolder,
        });
        setIsAddingNote(false);
        if (newNote?.id) setActiveNoteId(newNote.id);
      } else if (activeNoteId) {
        await updateNote(activeNoteId, {
          title: editTitle.trim() || "Untitled Note",
          content: editContent,
          description: editContent.substring(0, 200).replace(/<[^>]*>?/gm, ''),
          folder: editFolder,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleGlobalClick = () => setOpenMenuId(null);
    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-[75vh] gap-4 w-full text-white">
      
      {/* LEFT SIDEBAR: Notes List */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4 border-r-0 lg:border-r border-white/[0.08] lg:pr-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white tracking-tight">Your Notes</h2>
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-[0_0_12px_rgba(168,85,247,0.4)] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Note</span>
          </button>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#10131E] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {foldersCount.map((f, idx) => {
              if (f.label === 'Archived Notes') return null;
              const isActive = selectedFolder === f.label;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedFolder(f.label)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all border ${
                    isActive
                      ? "bg-purple-600 border-purple-500 text-white"
                      : "bg-[#10131E] border-white/[0.08] text-slate-400 hover:text-white"
                  }`}
                >
                  <FolderOpen className="w-3 h-3" />
                  <span>{f.label === 'All Notes' ? 'All' : f.label}</span>
                  <span className={`px-1.5 py-0.5 rounded-md bg-black/20 ${isActive ? "text-purple-100" : "text-slate-500"}`}>
                    {f.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Notes List */}
        <div className="flex flex-col gap-2 overflow-y-auto pr-1 pb-32">
          {notes.length === 0 ? (
            <div className="py-10">
              <EmptyState
                icon={FileText}
                title="No notes found"
                description="Create a new note to start writing."
                actionLabel="Create Note"
                onAction={handleCreateNew}
              />
            </div>
          ) : (
            notes.map((n) => {
              const isActive = activeNoteId === n.id && !isAddingNote;
              return (
                <div
                  key={n.id}
                  onClick={() => { setActiveNoteId(n.id); setIsAddingNote(false); }}
                  className={`relative flex flex-col p-3.5 rounded-xl border transition-all cursor-pointer group ${
                    isActive 
                      ? "bg-purple-600/10 border-purple-500/40" 
                      : "bg-[#10131E] border-white/[0.08] hover:border-white/[0.15]"
                  }`}
                >
                  {n.is_pinned && (
                    <div className="absolute top-3 right-3">
                      <Pin className="w-3.5 h-3.5 text-purple-400 fill-purple-400" />
                    </div>
                  )}
                  
                  <div className="pr-6">
                    <h3 className={`text-sm font-bold truncate ${isActive ? "text-purple-300" : "text-white"}`}>
                      {n.title || "Untitled Note"}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium line-clamp-2 mt-1 mb-2">
                      {n.description || "No preview available..."}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/[0.04]">
                    <div className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold border ${getDocColor(n.folder)}`}>
                      <span>{n.folder === 'All' ? 'General' : n.folder}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>{n.updated_date}</span>
                      </div>
                      
                      <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => setOpenMenuId(openMenuId === n.id ? null : n.id)}
                          className="p-1 rounded text-slate-500 hover:text-white transition-colors cursor-pointer"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                        {openMenuId === n.id && (
                          <div className="absolute right-0 top-6 z-50 w-32 rounded-xl bg-[#151828] border border-white/[0.1] shadow-xl py-1 flex flex-col text-xs">
                            <button
                              onClick={async () => { setOpenMenuId(null); await togglePin(n.id); }}
                              className="flex items-center gap-2 px-3 py-1.5 text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors text-left"
                            >
                              <Pin className="w-3.5 h-3.5" />
                              <span>{n.is_pinned ? "Unpin" : "Pin Note"}</span>
                            </button>
                            <button
                              onClick={async () => { setOpenMenuId(null); await deleteNote(n.id); if (activeNoteId === n.id) setActiveNoteId(null); }}
                              className="flex items-center gap-2 px-3 py-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT MAIN AREA: Note Editor */}
      <div className="flex-1 flex flex-col h-full bg-[#090A10] rounded-2xl">
        {(!activeNote && !isAddingNote) ? (
          <div className="flex-1 flex items-center justify-center border border-dashed border-white/[0.08] rounded-2xl p-10">
            <div className="flex flex-col items-center text-center max-w-sm">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No Note Selected</h3>
              <p className="text-sm text-slate-400 font-medium mb-6">
                Select a note from the left sidebar to view and edit it, or create a brand new note to get started.
              </p>
              <button
                onClick={handleCreateNew}
                className="px-6 py-2.5 rounded-xl bg-white text-black hover:bg-slate-200 text-sm font-bold transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)] cursor-pointer"
              >
                Create New Note
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex flex-col gap-3 mb-4">
              <input
                type="text"
                placeholder="Note Title..."
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full bg-transparent text-3xl font-bold text-white placeholder-slate-600 focus:outline-none"
              />
              <div className="flex items-center justify-between">
                <select
                  value={editFolder}
                  onChange={(e) => setEditFolder(e.target.value)}
                  className="bg-[#10131E] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-300 focus:outline-none focus:border-purple-500/50 cursor-pointer"
                >
                  <option value="General">General</option>
                  <option value="Strategy & Planning">Strategy & Planning</option>
                  <option value="Reasoning">Reasoning</option>
                  <option value="Maths">Maths</option>
                  <option value="English">English</option>
                  <option value="GK & Current Affairs">GK & Current Affairs</option>
                </select>
                
                <button
                  onClick={handleSaveNote}
                  disabled={isSaving || (!editTitle.trim() && !editContent.trim())}
                  className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-[0_0_12px_rgba(168,85,247,0.4)] cursor-pointer"
                >
                  {isSaving ? "Saving..." : "Save Note"}
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <RichTextEditor
                content={editContent}
                onChange={setEditContent}
                placeholder="Write your brilliant note here..."
              />
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
