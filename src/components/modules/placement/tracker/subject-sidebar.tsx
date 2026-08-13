"use client";

import React, { useState } from "react";
import {
  Code,
  BookOpen,
  BarChart3,
  Layers,
  Database,
  Monitor,
  Globe,
  Box,
  UserCheck,
  FileText,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
} from "lucide-react";
import { PlacementSubject } from "@/types/placement";

interface SubjectSidebarProps {
  subjects: PlacementSubject[];
  selectedSubjectId: string;
  onSelectSubject: (id: string) => void;
  onAddSubject: (title: string) => void;
  onRenameSubject: (id: string, newTitle: string) => void;
  onDeleteSubject: (id: string) => void;
}

export function SubjectSidebar({
  subjects,
  selectedSubjectId,
  onSelectSubject,
  onAddSubject,
  onRenameSubject,
  onDeleteSubject,
}: SubjectSidebarProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const getSubjectIcon = (title?: string) => {
    const t = (title || "").toLowerCase();
    if (t.includes("dsa") || t.includes("coding")) return Code;
    if (t.includes("core") || t.includes("computer")) return BookOpen;
    if (t.includes("aptitude")) return BarChart3;
    if (t.includes("design")) return Layers;
    if (t.includes("dbms") || t.includes("sql")) return Database;
    if (t.includes("operating") || t.includes("os")) return Monitor;
    if (t.includes("network")) return Globe;
    if (t.includes("oop")) return Box;
    if (t.includes("hr") || t.includes("behavioral")) return UserCheck;
    if (t.includes("resume") || t.includes("project")) return FileText;
    return Code;
  };

  const getSubjectIconColor = (title?: string) => {
    const t = (title || "").toLowerCase();
    if (t.includes("dsa")) return "bg-purple-500/15 text-purple-400 border-purple-500/25";
    if (t.includes("core")) return "bg-blue-500/15 text-blue-400 border-blue-500/25";
    if (t.includes("aptitude")) return "bg-amber-500/15 text-amber-400 border-amber-500/25";
    if (t.includes("design")) return "bg-purple-500/15 text-purple-400 border-purple-500/25";
    if (t.includes("dbms") || t.includes("sql")) return "bg-cyan-500/15 text-cyan-400 border-cyan-500/25";
    if (t.includes("operating")) return "bg-emerald-500/15 text-emerald-400 border-emerald-500/25";
    if (t.includes("network")) return "bg-blue-500/15 text-blue-400 border-blue-500/25";
    if (t.includes("oop")) return "bg-sky-500/15 text-sky-400 border-sky-500/25";
    if (t.includes("hr")) return "bg-rose-500/15 text-rose-400 border-rose-500/25";
    if (t.includes("resume")) return "bg-teal-500/15 text-teal-400 border-teal-500/25";
    return "bg-purple-500/15 text-purple-400 border-purple-500/25";
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      onAddSubject(newTitle);
      setNewTitle("");
      setIsAdding(false);
    }
  };

  const handleRenameSubmit = (id: string, e: React.FormEvent) => {
    e.preventDefault();
    if (editTitle.trim()) {
      onRenameSubject(id, editTitle);
      setEditingId(null);
      setOpenMenuId(null);
    }
  };

  return (
    <div className="w-full lg:w-[280px] shrink-0 rounded-2xl bg-[#10131E] border border-white/[0.08] p-3 flex flex-col gap-2 shadow-sm">
      {/* Sidebar Header: Subjects title + Create button */}
      <div className="flex items-center justify-between px-2 py-1.5 border-b border-white/[0.06] mb-1">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Subjects
        </span>
        <button
          onClick={() => onAddSubject("")}
          type="button"
          aria-label="Add Subject"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 text-[10px] font-bold transition-all cursor-pointer"
        >
          <Plus className="w-3 h-3" />
          <span>Create Subject</span>
        </button>
      </div>



      {/* Subjects List Grouped by Folder */}
      <div className="flex flex-col gap-3 pr-0.5 mt-1 overflow-y-auto no-scrollbar">
        {Object.entries(
          subjects.reduce((acc, sub) => {
            const folder = (sub as any).folder || "Uncategorized";
            if (!acc[folder]) acc[folder] = [];
            acc[folder].push(sub);
            return acc;
          }, {} as Record<string, PlacementSubject[]>)
        ).map(([folderName, folderSubjects]) => (
          <div key={folderName} className="flex flex-col gap-1.5">
            {/* Folder Header */}
            <div className="flex items-center gap-2 px-2 py-0.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex-1">
                {folderName}
              </span>
              <span className="text-[10px] font-medium text-slate-600 bg-white/[0.03] px-1.5 py-0.5 rounded">
                {folderSubjects.length}
              </span>
            </div>
            
            {/* Folder Subjects */}
            <div className="flex flex-col gap-1">
              {folderSubjects.map((sub) => {
                const displayTitle = sub.title || (sub as any).name || "Untitled Subject";
                const isSelected = sub.id === selectedSubjectId;
                const Icon = getSubjectIcon(displayTitle);
                const iconTheme = getSubjectIconColor(displayTitle);
                const isMenuOpen = openMenuId === sub.id;

                if (editingId === sub.id) {
                  return (
                    <form
                      key={sub.id}
                      onSubmit={(e) => handleRenameSubmit(sub.id, e)}
                      className="flex items-center gap-1.5 p-2 bg-[#151828] rounded-xl border border-purple-500/40"
                    >
                      <input
                        type="text"
                        autoFocus
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full bg-transparent text-xs text-white font-bold focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="text-xs text-purple-400 font-bold px-1.5 cursor-pointer"
                      >
                        Save
                      </button>
                    </form>
                  );
                }

                return (
                  <div
                    key={sub.id}
                    onClick={() => onSelectSubject(sub.id)}
                    className={`group relative flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#181C2E] border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.15)]"
                        : "bg-transparent border-transparent hover:bg-white/[0.03] text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {/* Left: Icon + Title & Topics Count */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div
                        className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${iconTheme}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span
                          className={`text-xs font-bold truncate leading-tight ${
                            isSelected ? "text-white" : "text-slate-200"
                          }`}
                        >
                          {displayTitle}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium mt-0.5 flex items-center gap-1.5">
                          <span className="text-purple-400 font-bold">{sub.progress || 0}%</span>
                          <span>•</span>
                          <span>{sub.topics?.length || 0} Topics</span>
                        </span>
                      </div>
                    </div>

                    {/* Right: 3-Dots Menu */}
                    <div className="relative shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(isMenuOpen ? null : sub.id);
                        }}
                        className="p-1 rounded text-slate-500 hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>

                      {/* Dropdown Menu */}
                      {isMenuOpen && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 top-6 z-20 w-32 rounded-xl bg-[#151828] border border-white/[0.1] shadow-xl py-1 flex flex-col text-xs"
                        >
                          <button
                            onClick={() => {
                              setEditingId(sub.id);
                              setEditTitle(displayTitle);
                              setOpenMenuId(null);
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors text-left"
                          >
                            <Edit2 className="w-3 h-3 text-slate-400" />
                            <span>Rename</span>
                          </button>
                          <button
                            onClick={() => {
                              onDeleteSubject(sub.id);
                              setOpenMenuId(null);
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
