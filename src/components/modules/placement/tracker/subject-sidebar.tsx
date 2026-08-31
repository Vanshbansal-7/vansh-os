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
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
} from "lucide-react";
import { PlacementSubject } from "@/types/placement";

interface SubjectSidebarProps {
  subjects: PlacementSubject[];
  selectedSubjectId: string;
  selectedModuleName?: string;
  onSelectSubject: (id: string) => void;
  onSelectModule?: (moduleName: string) => void;
  onAddSubject: (title: string) => void;
  onAddModule?: (subjectId: string, moduleName: string) => void;
  onDeleteModule?: (subjectId: string, moduleName: string) => void;
  onRenameSubject: (id: string, newTitle: string) => void;
  onDeleteSubject: (id: string) => void;
}

export function SubjectSidebar({
  subjects,
  selectedSubjectId,
  selectedModuleName,
  onSelectSubject,
  onSelectModule,
  onAddSubject,
  onAddModule,
  onDeleteModule,
  onRenameSubject,
  onDeleteSubject,
}: SubjectSidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  
  // Track open/collapsed chevron state for each subject (open by default)
  const [openSubjectChevrons, setOpenSubjectChevrons] = useState<Record<string, boolean>>({
    [selectedSubjectId || ""]: true,
  });

  // Modal / Inline input to create a Module in a subject
  const [addingModuleForSubjectId, setAddingModuleForSubjectId] = useState<string | null>(null);
  const [newModuleNameInput, setNewModuleNameInput] = useState("");

  const toggleSubjectChevron = (subjectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenSubjectChevrons((prev) => {
      const isCurrentlyOpen = prev[subjectId] !== undefined ? prev[subjectId] : true;
      return {
        ...prev,
        [subjectId]: !isCurrentlyOpen,
      };
    });
  };

  const isSubjectChevronOpen = (subjectId: string) => {
    return openSubjectChevrons[subjectId] !== undefined
      ? openSubjectChevrons[subjectId]
      : true; // Default to open
  };

  const handleAddModuleSubmit = (subjectId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (newModuleNameInput.trim() && onAddModule) {
      onAddModule(subjectId, newModuleNameInput.trim());
      setNewModuleNameInput("");
      setAddingModuleForSubjectId(null);
      // Ensure chevron is open
      setOpenSubjectChevrons((prev) => ({ ...prev, [subjectId]: true }));
    }
  };

  const handleRenameSubmit = (id: string, e: React.FormEvent) => {
    e.preventDefault();
    if (editTitle.trim()) {
      onRenameSubject(id, editTitle.trim());
      setEditingId(null);
      setOpenMenuId(null);
    }
  };

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

  return (
    <div className="w-full lg:w-[300px] shrink-0 rounded-2xl bg-[#10131E] border border-white/[0.08] p-3 flex flex-col gap-2 shadow-sm">
      {/* Sidebar Header: Subjects title + Create button */}
      <div className="flex items-center justify-between px-2 py-1.5 border-b border-white/[0.06] mb-1">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Subjects & Modules
        </span>
        <button
          onClick={() => onAddSubject("")}
          type="button"
          aria-label="Add Subject"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 text-[10.5px] font-bold transition-all cursor-pointer"
        >
          <Plus className="w-3 h-3" />
          <span>Add Subject</span>
        </button>
      </div>

      {/* Subjects Tree List */}
      <div className="flex flex-col gap-2 pr-0.5 mt-1 max-h-[calc(100vh-260px)] overflow-y-auto custom-scrollbar">
        {subjects.map((sub) => {
          const displayTitle = sub.title || (sub as any).name || "Untitled Subject";
          const isSelected = sub.id === selectedSubjectId;
          const isOpen = isSubjectChevronOpen(sub.id);
          const Icon = getSubjectIcon(displayTitle);
          const iconTheme = getSubjectIconColor(displayTitle);
          const isMenuOpen = openMenuId === sub.id;
          const isAddingModule = addingModuleForSubjectId === sub.id;
          const modules = sub.modules || [];

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
            <div key={sub.id} className="flex flex-col rounded-xl overflow-hidden">
              {/* Main Subject Row */}
              <div
                onClick={() => {
                  onSelectSubject(sub.id);
                  if (modules.length > 0 && onSelectModule && !selectedModuleName) {
                    onSelectModule(modules[0].name);
                  }
                }}
                className={`group relative flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer select-none ${
                  isSelected
                    ? "bg-[#181C2E] border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.12)]"
                    : "bg-transparent border-transparent hover:bg-white/[0.03] text-slate-400 hover:text-slate-200"
                }`}
              >
                {/* Left: Savron Chevron + Subject Icon + Title */}
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {/* Savron Dropdown Toggle */}
                  <button
                    type="button"
                    onClick={(e) => toggleSubjectChevron(sub.id, e)}
                    className="p-1 rounded text-slate-400 hover:text-white transition-colors"
                    title={isOpen ? "Collapse Modules" : "Expand Modules"}
                  >
                    {isOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 text-purple-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>

                  {/* Subject Icon */}
                  <div
                    className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${iconTheme}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  {/* Title & Stats */}
                  <div className="flex flex-col min-w-0">
                    <span
                      className={`text-xs font-bold truncate leading-tight ${
                        isSelected ? "text-white" : "text-slate-200"
                      }`}
                    >
                      {displayTitle}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1.5">
                      <span className="text-purple-400 font-bold">{sub.progress || 0}%</span>
                      <span>•</span>
                      <span>{modules.length} Modules</span>
                    </span>
                  </div>
                </div>

                {/* Right: + Icon (to add Module/Folder) & 3-Dots Menu */}
                <div className="flex items-center gap-1 shrink-0">
                  {/* Plus icon to create module in this subject */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectSubject(sub.id);
                      setAddingModuleForSubjectId(isAddingModule ? null : sub.id);
                      setNewModuleNameInput("");
                      setOpenSubjectChevrons((prev) => ({ ...prev, [sub.id]: true }));
                    }}
                    title="Add Module / Folder in this Subject"
                    className="p-1 rounded-md bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </button>

                  {/* 3-Dots Menu */}
                  <div className="relative">
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
              </div>

              {/* SAVRON DROPDOWN: Modules list rendered in secondary font & text in the same left menu */}
              {isOpen && (
                <div className="flex flex-col ml-5 pl-3 border-l border-purple-500/20 gap-1 my-1">
                  {/* Inline Form to add a new module */}
                  {isAddingModule && (
                    <form
                      onSubmit={(e) => handleAddModuleSubmit(sub.id, e)}
                      className="flex items-center gap-1.5 p-1.5 bg-[#151828] rounded-lg border border-purple-500/30 mb-1"
                    >
                      <input
                        type="text"
                        autoFocus
                        value={newModuleNameInput}
                        onChange={(e) => setNewModuleNameInput(e.target.value)}
                        placeholder="New Module name..."
                        className="w-full bg-transparent text-[11px] text-white font-medium focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="text-[10px] text-purple-300 font-bold px-1.5 py-0.5 bg-purple-600 rounded"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => setAddingModuleForSubjectId(null)}
                        className="text-[10px] text-slate-400 hover:text-white px-1"
                      >
                        ✕
                      </button>
                    </form>
                  )}

                  {modules.length === 0 ? (
                    <div className="py-2 text-[11px] text-slate-500 font-sans italic">
                      No modules yet. Click &ldquo;+&rdquo; above to add one.
                    </div>
                  ) : (
                    modules.map((mod) => {
                      const isModuleActive =
                        isSelected && (selectedModuleName === mod.name || (!selectedModuleName && modules[0]?.name === mod.name));

                      return (
                        <div
                          key={mod.name}
                          onClick={() => {
                            onSelectSubject(sub.id);
                            if (onSelectModule) onSelectModule(mod.name);
                          }}
                          className={`group/mod flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-sans transition-all cursor-pointer ${
                            isModuleActive
                              ? "bg-purple-600/25 text-purple-200 font-semibold border border-purple-500/30"
                              : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                          }`}
                        >
                          {/* Folder Icon + Module Name in Secondary Font */}
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            {isModuleActive ? (
                              <FolderOpen className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                            ) : (
                              <Folder className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            )}
                            <span className="truncate text-[11.5px] tracking-tight">
                              {mod.name}
                            </span>
                          </div>

                          {/* Video count & delete button */}
                          <div className="flex items-center gap-1.5 shrink-0 ml-1">
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/[0.04] text-slate-400 font-medium">
                              {mod.total_topics}
                            </span>
                            {onDeleteModule && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm(`Delete "${mod.name}" and all its videos?`)) {
                                    onDeleteModule(sub.id, mod.name);
                                  }
                                }}
                                className="p-0.5 text-slate-600 hover:text-rose-400 opacity-0 group-hover/mod:opacity-100 transition-opacity"
                                title="Delete Module"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

