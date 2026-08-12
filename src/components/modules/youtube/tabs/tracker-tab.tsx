"use client";

import React, { useState, useMemo } from "react";
import { Plus, Search, MoreVertical, Edit2, Trash2, Video } from "lucide-react";
import { MilestoneStatusDot } from "@/components/modules/cgl/shared/milestone-status-dot";
import { useYouTubeModule } from "@/hooks/use-youtube-module";

export function TrackerTab() {
  const { tasks, createVideoTask, updateVideoTaskStage, deleteVideoTask } = useYouTubeModule();

  const [searchQuery, setSearchQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filteredVideos = useMemo(() => {
    return tasks.filter((v) =>
      searchQuery ? v.title.toLowerCase().includes(searchQuery.toLowerCase()) : true
    );
  }, [tasks, searchQuery]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const published = tasks.filter((v) => v.is_published).length;
    const editing = tasks.filter((v) => v.is_editing && !v.is_published).length;
    const scripting = tasks.filter((v) => v.is_script && !v.is_editing).length;
    const ideas = tasks.filter((v) => v.is_idea && !v.is_script).length;
    const prog = total > 0 ? Math.round((published / total) * 100) : 0;
    return { total, published, editing, scripting, ideas, prog };
  }, [tasks]);

  const toggleMilestone = (id: string, field: "is_idea" | "is_script" | "is_editing" | "is_published") => {
    const task = tasks.find((v) => v.id === id);
    if (!task) return;
    updateVideoTaskStage(id, { [field]: !task[field] });
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await createVideoTask(newTitle.trim(), "Content");
    setNewTitle("");
    setIsAdding(false);
  };

  const handleRenameSubmit = async (id: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim()) return;
    await updateVideoTaskStage(id, { title: editTitle.trim() });
    setEditingId(null);
    setOpenMenuId(null);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header & Add Video Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight leading-none">
            YouTube Content Pipeline Tracker
          </h2>
          <p className="text-[11.5px] text-slate-400 font-medium mt-1">
            4-Stage Content Creation Milestone Checklist: Idea → Script → Editing → Published
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-[0_0_12px_rgba(168,85,247,0.4)] cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Video Task</span>
        </button>
      </div>

      {/* Top Full-Width Progress Summary Bar */}
      <div className="flex flex-col gap-3 p-4 rounded-2xl bg-[#10131E] border border-white/[0.08] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-white tracking-tight">Overall Channel Pipeline Progress</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-extrabold">
              {stats.prog}%
            </span>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {stats.published} / {stats.total} videos published
          </span>
        </div>

        <div className="w-full h-2 rounded-full bg-[#181D2B] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${stats.prog}%` }}
          />
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold text-slate-400 pt-1">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Published: {stats.published}</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-400" /> In Editing: {stats.editing}</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-400" /> Scripting: {stats.scripting}</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-500" /> Ideas: {stats.ideas}</span>
        </div>
      </div>

      {/* Search Toolbar & Inline Add Form */}
      <div className="flex items-center justify-between gap-3 p-2 rounded-2xl bg-[#10131E] border border-white/[0.08]">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search video title..."
            className="w-full bg-[#151828] border border-white/[0.06] hover:border-white/[0.12] focus:border-purple-500/50 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
          />
        </div>
      </div>

      {isAdding && (
        <form
          onSubmit={handleAddSubmit}
          className="flex items-center gap-2 p-3 rounded-2xl bg-[#151828] border border-purple-500/40"
        >
          <input
            type="text"
            autoFocus
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Video title (e.g. Devlog #3, How to Master DSA)..."
            className="flex-1 bg-[#0E101A] border border-white/[0.1] rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Add Video
          </button>
          <button
            type="button"
            onClick={() => setIsAdding(false)}
            className="px-2.5 py-1.5 text-slate-400 hover:text-white text-xs cursor-pointer"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Main 4-Check Table */}
      <div className="flex flex-col rounded-2xl bg-[#10131E] border border-white/[0.08] overflow-hidden shadow-sm">
        {/* Table Header: Video | Idea | Script | Editing | Published */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#141828] border-b border-white/[0.08] text-xs font-bold text-slate-300">
          <div className="flex-1">
            <span>Video</span>
          </div>
          <div className="grid grid-cols-4 gap-4 sm:gap-10 w-[260px] sm:w-[360px] text-center shrink-0">
            <span>Idea</span>
            <span>Script</span>
            <span>Editing</span>
            <span>Published</span>
          </div>
          <div className="w-8 shrink-0 text-right">
            <span>Actions</span>
          </div>
        </div>

        {/* Video Tasks Rows */}
        <div className="flex flex-col divide-y divide-white/[0.04] bg-[#0E101A]">
          {filteredVideos.map((video) => {
            const isEditingRow = editingId === video.id;
            const isMenuOpen = openMenuId === video.id;

            if (isEditingRow) {
              return (
                <form
                  key={video.id}
                  onSubmit={(e) => handleRenameSubmit(video.id, e)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#151828]"
                >
                  <input
                    type="text"
                    autoFocus
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1 bg-[#0E101A] border border-purple-500/40 rounded-lg px-2.5 py-1 text-xs text-white font-semibold focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-2.5 py-1 bg-purple-600 text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Save
                  </button>
                </form>
              );
            }

            return (
              <div
                key={video.id}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] transition-colors"
              >
                {/* Left: Video Title */}
                <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
                  <Video className="w-4 h-4 text-purple-400 shrink-0" />
                  <span className="text-xs font-bold text-white truncate">
                    {video.title}
                  </span>
                </div>

                {/* Center: 4 Interactive Milestone Check Dots */}
                <div className="grid grid-cols-4 gap-4 sm:gap-10 w-[260px] sm:w-[360px] justify-items-center shrink-0">
                  {/* 1. Idea */}
                  <MilestoneStatusDot
                    type="learned"
                    completed={video.is_idea}
                    onClick={() => toggleMilestone(video.id, "is_idea")}
                  />
                  {/* 2. Script */}
                  <MilestoneStatusDot
                    type="practiced"
                    completed={video.is_script}
                    onClick={() => toggleMilestone(video.id, "is_script")}
                  />
                  {/* 3. Editing */}
                  <MilestoneStatusDot
                    type="revised"
                    completed={video.is_editing}
                    onClick={() => toggleMilestone(video.id, "is_editing")}
                  />
                  {/* 4. Published */}
                  <MilestoneStatusDot
                    type="mastered"
                    completed={video.is_published}
                    onClick={() => toggleMilestone(video.id, "is_published")}
                  />
                </div>

                {/* Right Actions Menu */}
                <div className="relative shrink-0 w-8 flex justify-end">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(isMenuOpen ? null : video.id);
                    }}
                    className="p-1 rounded text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  >
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 top-6 z-20 w-32 rounded-xl bg-[#151828] border border-white/[0.1] shadow-xl py-1 flex flex-col text-xs">
                      <button
                        onClick={() => {
                          setEditingId(video.id);
                          setEditTitle(video.title);
                          setOpenMenuId(null);
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors text-left cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3 text-slate-400" />
                        <span>Rename</span>
                      </button>
                      <button
                        onClick={() => {
                          deleteVideoTask(video.id);
                          setOpenMenuId(null);
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left cursor-pointer"
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
    </div>
  );
}
