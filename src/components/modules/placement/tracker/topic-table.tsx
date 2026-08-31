"use client";

import React, { useState, useMemo } from "react";
import {
  Plus,
  MoreVertical,
  Trash2,
  Edit2,
  AlertCircle,
  Folder,
  FolderOpen,
  ChevronDown,
  ChevronRight,
  Search,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { PlacementSubject, PlacementMilestone, PlacementModuleGroup } from "@/types/placement";
import { MilestoneStatusDot } from "@/components/modules/cgl/shared/milestone-status-dot";

interface TopicTableProps {
  subject: PlacementSubject;
  onToggleMilestone: (subjectId: string, topicId: string, milestone: PlacementMilestone) => Promise<void> | void;
  onAddTopic: (subjectId: string, title: string, moduleName?: string) => Promise<void> | void;
  onAddModule?: (subjectId: string, moduleName: string) => Promise<void> | void;
  onDeleteModule?: (subjectId: string, moduleName: string) => Promise<void> | void;
  onRenameTopic: (subjectId: string, topicId: string, newTitle: string) => Promise<void> | void;
  onDeleteTopic: (subjectId: string, topicId: string) => Promise<void> | void;
}

export function TopicTable({
  subject,
  onToggleMilestone,
  onAddTopic,
  onAddModule,
  onDeleteModule,
  onRenameTopic,
  onDeleteTopic,
}: TopicTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [isAddModuleModalOpen, setIsAddModuleModalOpen] = useState(false);
  const [newModuleName, setNewModuleName] = useState("");

  // Adding topic to specific module
  const [addingToModule, setAddingToModule] = useState<string | null>(null);
  const [newTopicTitle, setNewTopicTitle] = useState("");

  // Editing topic
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editTopicTitle, setEditTopicTitle] = useState("");
  const [openMenuTopicId, setOpenMenuTopicId] = useState<string | null>(null);
  const [openMenuModule, setOpenMenuModule] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const modules: PlacementModuleGroup[] = subject.modules || [];

  // Initialize first module expanded by default
  const isModuleExpanded = (modName: string) => {
    if (searchQuery.trim().length > 0) return true; // auto expand on search
    return expandedModules[modName] !== undefined ? expandedModules[modName] : true;
  };

  const toggleModuleExpand = (modName: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [modName]: !isModuleExpanded(modName),
    }));
  };

  const handleExpandAll = () => {
    const next: Record<string, boolean> = {};
    modules.forEach((m) => {
      next[m.name] = true;
    });
    setExpandedModules(next);
  };

  const handleCollapseAll = () => {
    const next: Record<string, boolean> = {};
    modules.forEach((m) => {
      next[m.name] = false;
    });
    setExpandedModules(next);
  };

  // Filter modules and topics by search query
  const filteredModules = useMemo(() => {
    if (!searchQuery.trim()) return modules;
    const q = searchQuery.toLowerCase();
    return modules
      .map((mod) => {
        const matchesMod = mod.name.toLowerCase().includes(q);
        const matchedTopics = mod.topics.filter((t) =>
          t.title.toLowerCase().includes(q)
        );
        if (matchesMod || matchedTopics.length > 0) {
          return {
            ...mod,
            topics: matchesMod ? mod.topics : matchedTopics,
          };
        }
        return null;
      })
      .filter(Boolean) as PlacementModuleGroup[];
  }, [modules, searchQuery]);

  const handleCreateModuleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleName.trim()) return;
    try {
      setErrorMsg("");
      if (onAddModule) {
        await onAddModule(subject.id, newModuleName.trim());
      } else {
        await onAddTopic(subject.id, `1. Introduction to ${newModuleName.trim()}`, newModuleName.trim());
      }
      setNewModuleName("");
      setIsAddModuleModalOpen(false);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to create module");
    }
  };

  const handleAddTopicSubmit = async (modName: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle.trim()) return;
    try {
      setErrorMsg("");
      await onAddTopic(subject.id, newTopicTitle.trim(), modName);
      setNewTopicTitle("");
      setAddingToModule(null);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to add video topic");
    }
  };

  const handleRenameSubmit = async (topicId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!editTopicTitle.trim()) return;
    try {
      setErrorMsg("");
      await onRenameTopic(subject.id, topicId, editTopicTitle.trim());
      setEditingTopicId(null);
      setOpenMenuTopicId(null);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to rename topic");
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 rounded-2xl bg-[#10131E] border border-white/[0.08] shadow-sm">
      {/* Top Header: Subject Title, Stats, Search & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 bg-[#131625] border-b border-white/[0.08] rounded-t-2xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-tight">
              {subject.title}
            </h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {modules.length} Modules
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {subject.total_topics || 0} Videos
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Organized module-wise curriculum roadmap &bull; {subject.progress}% Mastered
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search videos in modules..."
              className="w-44 sm:w-56 bg-[#0E101A] border border-white/[0.1] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
            />
          </div>

          {/* Expand / Collapse All */}
          <button
            type="button"
            onClick={handleExpandAll}
            title="Expand All Modules"
            className="p-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-slate-300 hover:text-white transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleCollapseAll}
            title="Collapse All Modules"
            className="p-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-slate-300 hover:text-white transition-colors"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>

          {/* + Add Module Button */}
          <button
            type="button"
            onClick={() => {
              setErrorMsg("");
              setIsAddModuleModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Module</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="px-5 py-2.5 bg-rose-500/15 border-b border-rose-500/30 flex items-center gap-2 text-rose-300 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Add Module Modal */}
      {isAddModuleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#131625] border border-purple-500/30 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-white mb-1">Create New Module / Folder</h3>
            <p className="text-xs text-slate-400 mb-4">
              Add a new module to organize topics under {subject.title}.
            </p>
            <form onSubmit={handleCreateModuleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                autoFocus
                value={newModuleName}
                onChange={(e) => setNewModuleName(e.target.value)}
                placeholder="e.g. Module 49: Advanced Segment Trees"
                className="w-full bg-[#0E101A] border border-white/[0.12] rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModuleModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-white rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Create Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modules List Container */}
      <div className="flex flex-col p-4 gap-3 bg-[#0E101A] rounded-b-2xl min-h-[400px]">
        {filteredModules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500 text-xs">
            <Folder className="w-8 h-8 text-slate-600 mb-2" />
            <span>No modules found.</span>
            <button
              onClick={() => setIsAddModuleModalOpen(true)}
              className="mt-2 text-purple-400 hover:underline font-semibold"
            >
              + Create First Module
            </button>
          </div>
        ) : (
          filteredModules.map((mod) => {
            const expanded = isModuleExpanded(mod.name);
            const isAddingTopic = addingToModule === mod.name;
            const isModuleMenuOpen = openMenuModule === mod.name;

            return (
              <div
                key={mod.name}
                className="flex flex-col rounded-xl bg-[#131625] border border-white/[0.06] overflow-hidden transition-all duration-200"
              >
                {/* Module Header Bar */}
                <div
                  onClick={() => toggleModuleExpand(mod.name)}
                  className="flex items-center justify-between px-4 py-3 bg-[#161A2D] hover:bg-[#1A1F36] cursor-pointer select-none transition-colors"
                >
                  {/* Left: Folder Icon + Module Name + Count */}
                  <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
                    <div className="p-1.5 rounded-lg bg-purple-500/15 text-purple-400 border border-purple-500/20">
                      {expanded ? <FolderOpen className="w-4 h-4" /> : <Folder className="w-4 h-4" />}
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-slate-100 truncate">
                      {mod.name}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] shrink-0">
                      {mod.total_topics} {mod.total_topics === 1 ? "video" : "videos"}
                    </span>
                  </div>

                  {/* Right: Progress Pill + Actions + Chevron */}
                  <div
                    className="flex items-center gap-2 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Progress Indicator */}
                    <div className="hidden sm:flex items-center gap-2 mr-2">
                      <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full transition-all duration-500"
                          style={{ width: `${mod.progress}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-purple-300 w-8 text-right">
                        {mod.progress}%
                      </span>
                    </div>

                    {/* Quick + Add Video Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setAddingToModule(isAddingTopic ? null : mod.name);
                        setNewTopicTitle("");
                        if (!expanded) toggleModuleExpand(mod.name);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 text-[11px] font-bold transition-all"
                    >
                      <Plus className="w-3 h-3" />
                      <span className="hidden sm:inline">Add Video</span>
                    </button>

                    {/* Module 3-Dots Menu */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setOpenMenuModule(isModuleMenuOpen ? null : mod.name)}
                        className="p-1 rounded text-slate-400 hover:text-white transition-colors"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>

                      {isModuleMenuOpen && (
                        <div className="absolute right-0 top-6 z-20 w-36 rounded-xl bg-[#1A1F36] border border-white/[0.1] shadow-2xl py-1 flex flex-col text-xs">
                          <button
                            onClick={async () => {
                              if (confirm(`Delete all videos in "${mod.name}"?`)) {
                                try {
                                  setErrorMsg("");
                                  if (onDeleteModule) {
                                    await onDeleteModule(subject.id, mod.name);
                                  }
                                  setOpenMenuModule(null);
                                } catch (err: any) {
                                  setErrorMsg(err?.message || "Failed to delete module");
                                }
                              }
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete Module</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Chevron Toggle */}
                    <button
                      type="button"
                      onClick={() => toggleModuleExpand(mod.name)}
                      className="p-1 text-slate-400 hover:text-white transition-transform"
                    >
                      {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Module Body: Video Topics Table */}
                {expanded && (
                  <div className="flex flex-col divide-y divide-white/[0.04] bg-[#0E101A] border-t border-white/[0.06]">
                    {/* Inline Add Video Form */}
                    {isAddingTopic && (
                      <form
                        onSubmit={(e) => handleAddTopicSubmit(mod.name, e)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#151828] border-b border-purple-500/20"
                      >
                        <input
                          type="text"
                          autoFocus
                          value={newTopicTitle}
                          onChange={(e) => setNewTopicTitle(e.target.value)}
                          placeholder={`New video title for ${mod.name}...`}
                          className="flex-1 bg-[#0E101A] border border-purple-500/40 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl cursor-pointer"
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => setAddingToModule(null)}
                          className="px-2 py-1.5 text-slate-400 text-xs hover:text-white"
                        >
                          Cancel
                        </button>
                      </form>
                    )}

                    {/* Topics Table Header */}
                    <div className="flex items-center justify-between px-4 py-2 bg-[#121422] text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                      <div className="flex-1">Video / Lecture Title</div>
                      <div className="grid grid-cols-4 gap-3 sm:gap-6 w-[220px] sm:w-[280px] text-center shrink-0">
                        <span>Learned</span>
                        <span>Practiced</span>
                        <span>Revised</span>
                        <span>Mastered</span>
                      </div>
                      <div className="w-7 shrink-0 text-right">
                        <span>•</span>
                      </div>
                    </div>

                    {/* Topic Rows */}
                    {mod.topics.length === 0 ? (
                      <div className="px-4 py-6 text-center text-xs text-slate-500">
                        No videos in this module yet. Click "+ Add Video" above.
                      </div>
                    ) : (
                      mod.topics.map((topic) => {
                        const isEditing = editingTopicId === topic.id;
                        const isMenuOpen = openMenuTopicId === topic.id;

                        if (isEditing) {
                          return (
                            <form
                              key={topic.id}
                              onSubmit={(e) => handleRenameSubmit(topic.id, e)}
                              className="flex items-center gap-2 px-4 py-2 bg-[#151828]"
                            >
                              <input
                                type="text"
                                autoFocus
                                value={editTopicTitle}
                                onChange={(e) => setEditTopicTitle(e.target.value)}
                                className="flex-1 bg-[#0E101A] border border-purple-500/40 rounded-lg px-2.5 py-1 text-xs text-white font-semibold focus:outline-none"
                              />
                              <button
                                type="submit"
                                className="px-2.5 py-1 bg-purple-600 text-white text-xs font-bold rounded-lg cursor-pointer"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingTopicId(null)}
                                className="px-2 py-1 text-slate-400 text-xs hover:text-white"
                              >
                                Cancel
                              </button>
                            </form>
                          );
                        }

                        return (
                          <div
                            key={topic.id}
                            className="flex items-center justify-between px-4 py-2.5 hover:bg-white/[0.02] transition-colors group"
                          >
                            {/* Video Title */}
                            <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-3">
                              <div
                                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                  topic.is_mastered
                                    ? "bg-emerald-400"
                                    : topic.is_learned
                                    ? "bg-purple-400"
                                    : "bg-slate-600"
                                }`}
                              />
                              <span
                                className={`text-xs font-semibold truncate ${
                                  topic.is_mastered
                                    ? "text-emerald-200/90 font-bold"
                                    : "text-slate-200"
                                }`}
                              >
                                {topic.title}
                              </span>
                            </div>

                            {/* 4 Interactive Milestone Dots */}
                            <div className="grid grid-cols-4 gap-3 sm:gap-6 w-[220px] sm:w-[280px] justify-items-center shrink-0">
                              <MilestoneStatusDot
                                type="learned"
                                completed={topic.is_learned}
                                onClick={async () => {
                                  try {
                                    setErrorMsg("");
                                    await onToggleMilestone(subject.id, topic.id, "is_learned");
                                  } catch (err: any) {
                                    setErrorMsg(err?.message || "Milestone update failed");
                                  }
                                }}
                              />
                              <MilestoneStatusDot
                                type="practiced"
                                completed={topic.is_practiced}
                                onClick={async () => {
                                  try {
                                    setErrorMsg("");
                                    await onToggleMilestone(subject.id, topic.id, "is_practiced");
                                  } catch (err: any) {
                                    setErrorMsg(err?.message || "Milestone update failed");
                                  }
                                }}
                              />
                              <MilestoneStatusDot
                                type="revised"
                                completed={topic.is_revised}
                                onClick={async () => {
                                  try {
                                    setErrorMsg("");
                                    await onToggleMilestone(subject.id, topic.id, "is_revised");
                                  } catch (err: any) {
                                    setErrorMsg(err?.message || "Milestone update failed");
                                  }
                                }}
                              />
                              <MilestoneStatusDot
                                type="mastered"
                                completed={topic.is_mastered}
                                onClick={async () => {
                                  try {
                                    setErrorMsg("");
                                    await onToggleMilestone(subject.id, topic.id, "is_mastered");
                                  } catch (err: any) {
                                    setErrorMsg(err?.message || "Milestone update failed");
                                  }
                                }}
                              />
                            </div>

                            {/* 3-Dots Menu */}
                            <div className="relative shrink-0 w-7 flex justify-end">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMenuTopicId(isMenuOpen ? null : topic.id);
                                }}
                                className="p-1 rounded text-slate-500 hover:text-slate-300 transition-colors"
                              >
                                <MoreVertical className="w-3.5 h-3.5" />
                              </button>

                              {isMenuOpen && (
                                <div className="absolute right-0 top-6 z-20 w-32 rounded-xl bg-[#181D30] border border-white/[0.1] shadow-2xl py-1 flex flex-col text-xs">
                                  <button
                                    onClick={() => {
                                      setEditingTopicId(topic.id);
                                      setEditTopicTitle(topic.title);
                                      setOpenMenuTopicId(null);
                                    }}
                                    className="flex items-center gap-2 px-3 py-1.5 text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors text-left"
                                  >
                                    <Edit2 className="w-3 h-3 text-slate-400" />
                                    <span>Rename</span>
                                  </button>
                                  <button
                                    onClick={async () => {
                                      try {
                                        setErrorMsg("");
                                        await onDeleteTopic(subject.id, topic.id);
                                        setOpenMenuTopicId(null);
                                      } catch (err: any) {
                                        setErrorMsg(err?.message || "Failed to delete topic");
                                      }
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
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

