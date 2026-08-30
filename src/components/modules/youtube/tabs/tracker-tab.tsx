"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Plus, Search, MoreVertical, Edit2, Trash2, Video, FolderOpen, PlaySquare } from "lucide-react";
import { MilestoneStatusDot } from "@/components/modules/cgl/shared/milestone-status-dot";
import { useYouTubeModule } from "@/hooks/use-youtube-module";
import { EmptyState } from "@/components/ui/empty-state";

export function TrackerTab() {
  const { tasks, createVideoTask, updateVideoTaskStage, deleteVideoTask } = useYouTubeModule();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("Content");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [newVideoTitle, setNewVideoTitle] = useState("");
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const categories = useMemo(() => {
    const unique = new Set(tasks.map((t) => t.category || "Content"));
    // Ensure "Content" always exists
    if (!unique.has("Content")) unique.add("Content");
    return Array.from(unique).sort();
  }, [tasks]);

  // If active category gets deleted or is not there, default to first
  useEffect(() => {
    if (!categories.includes(activeCategory) && categories.length > 0) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  const filteredVideos = useMemo(() => {
    return tasks
      .filter((v) => (v.category || "Content") === activeCategory)
      .filter((v) =>
        searchQuery ? v.title.toLowerCase().includes(searchQuery.toLowerCase()) : true
      );
  }, [tasks, activeCategory, searchQuery]);

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

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoTitle.trim()) return;
    await createVideoTask(newVideoTitle.trim(), activeCategory);
    setNewVideoTitle("");
    setIsAddingVideo(false);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    // We add a category by creating a dummy video in that category, or just setting the active category
    // Since categories are derived from tasks, we just set it active and let the user add videos to it.
    setActiveCategory(newCategoryName.trim());
    setIsAddingCategory(false);
    setNewCategoryName("");
  };

  const handleRenameSubmit = async (id: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim()) return;
    await updateVideoTaskStage(id, { title: editTitle.trim() });
    setEditingId(null);
    setOpenMenuId(null);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleGlobalClick = () => setOpenMenuId(null);
    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full">
      
      {/* Top Full-Width Progress Summary Bar */}
      <div className="flex flex-col gap-3 p-4 rounded-2xl bg-[#10131E] border border-white/[0.08] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-white tracking-tight">Channel Production Pipeline</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-extrabold">
              {stats.prog}% Published
            </span>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {stats.published} / {stats.total} videos completed
          </span>
        </div>

        <div className="w-full h-2 rounded-full bg-[#181D2B] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${stats.prog}%` }}
          />
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold text-slate-400 pt-1">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-500" /> Ideas: {stats.ideas}</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-400" /> Scripting: {stats.scripting}</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-400" /> In Editing: {stats.editing}</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Published: {stats.published}</span>
        </div>
      </div>

      {/* Main Split-Pane Layout */}
      <div className="flex flex-col lg:flex-row gap-4 items-start w-full min-h-[60vh]">
        
        {/* Left Sidebar: Categories */}
        <div className="w-full lg:w-64 shrink-0 flex flex-col gap-3 p-3 rounded-2xl bg-[#10131E] border border-white/[0.08]">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Playlists / Formats</h3>
            <button
              onClick={() => setIsAddingCategory(true)}
              className="text-slate-400 hover:text-white p-1 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {isAddingCategory && (
            <form onSubmit={handleAddCategory} className="flex flex-col gap-2">
              <input
                type="text"
                autoFocus
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="New category..."
                className="w-full bg-[#151828] border border-purple-500/40 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
              <div className="flex items-center gap-2">
                <button type="submit" className="flex-1 py-1 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer">Add</button>
                <button type="button" onClick={() => setIsAddingCategory(false)} className="flex-1 py-1 text-slate-400 hover:text-white text-xs cursor-pointer">Cancel</button>
              </div>
            </form>
          )}

          <div className="flex flex-col gap-1 overflow-y-auto max-h-[500px] no-scrollbar">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              const count = tasks.filter((t) => (t.category || "Content") === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                    isActive
                      ? "bg-purple-600/20 border border-purple-500/40 text-white"
                      : "text-slate-400 border border-transparent hover:bg-white/[0.03] hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FolderOpen className={`w-3.5 h-3.5 ${isActive ? "text-purple-400" : "text-slate-500"}`} />
                    <span className="truncate">{cat}</span>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded-md ${isActive ? "bg-purple-500/20 text-purple-300" : "bg-white/[0.05] text-slate-500"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Area: Pipeline Table */}
        <div className="flex-1 w-full flex flex-col rounded-2xl bg-[#10131E] border border-white/[0.08] overflow-hidden">
          
          {/* Toolbar */}
          <div className="flex items-center justify-between p-3 border-b border-white/[0.08] bg-[#141828]">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">{activeCategory}</h3>
              <span className="text-[10px] text-slate-500 font-semibold px-2 py-0.5 rounded-full bg-white/[0.05]">
                {filteredVideos.length} Videos
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search videos..."
                  className="w-48 bg-[#0E101A] border border-white/[0.08] focus:border-purple-500/50 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
                />
              </div>
              <button
                onClick={() => setIsAddingVideo(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Video</span>
              </button>
            </div>
          </div>

          {/* Add Video Inline Form */}
          {isAddingVideo && (
            <form
              onSubmit={handleAddVideo}
              className="flex items-center gap-2 p-3 bg-[#151828] border-b border-white/[0.08]"
            >
              <input
                type="text"
                autoFocus
                value={newVideoTitle}
                onChange={(e) => setNewVideoTitle(e.target.value)}
                placeholder="Video title (e.g. VOS Devlog #4)..."
                className="flex-1 bg-[#0E101A] border border-white/[0.1] rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setIsAddingVideo(false)}
                className="px-2.5 py-1.5 text-slate-400 hover:text-white text-xs cursor-pointer transition-colors"
              >
                Cancel
              </button>
            </form>
          )}

          {/* Videos Table */}
          {filteredVideos.length === 0 ? (
            <div className="py-16">
              <EmptyState
                icon={PlaySquare}
                title="No videos in this category"
                description="Start tracking your content pipeline by adding a new video."
                actionLabel="New Video"
                onAction={() => setIsAddingVideo(true)}
              />
            </div>
          ) : (
            <div className="flex flex-col">
              {/* Table Header */}
              <div className="flex items-center justify-between px-5 py-2.5 bg-[#0E101A] border-b border-white/[0.04] text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <div className="flex-1">Title</div>
                <div className="grid grid-cols-4 gap-4 sm:gap-10 w-[240px] sm:w-[320px] text-center shrink-0">
                  <span>Idea</span>
                  <span>Script</span>
                  <span>Edit</span>
                  <span>Live</span>
                </div>
                <div className="w-8 shrink-0 text-right"></div>
              </div>

              {/* Rows */}
              <div className="flex flex-col divide-y divide-white/[0.04]">
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
                      className="group flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Title */}
                      <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
                        <Video className="w-4 h-4 text-purple-400 shrink-0" />
                        <span className="text-xs font-bold text-white truncate group-hover:text-purple-300 transition-colors">
                          {video.title}
                        </span>
                      </div>

                      {/* Milestones */}
                      <div className="grid grid-cols-4 gap-4 sm:gap-10 w-[240px] sm:w-[320px] justify-items-center shrink-0">
                        <MilestoneStatusDot type="learned" completed={video.is_idea} onClick={() => toggleMilestone(video.id, "is_idea")} />
                        <MilestoneStatusDot type="practiced" completed={video.is_script} onClick={() => toggleMilestone(video.id, "is_script")} />
                        <MilestoneStatusDot type="revised" completed={video.is_editing} onClick={() => toggleMilestone(video.id, "is_editing")} />
                        <MilestoneStatusDot type="mastered" completed={video.is_published} onClick={() => toggleMilestone(video.id, "is_published")} />
                      </div>

                      {/* Actions */}
                      <div className="relative shrink-0 w-8 flex justify-end">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(isMenuOpen ? null : video.id);
                          }}
                          className="p-1 rounded text-slate-500 hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>

                        {isMenuOpen && (
                          <div className="absolute right-0 top-6 z-20 w-32 rounded-xl bg-[#151828] border border-white/[0.1] shadow-xl py-1 flex flex-col text-xs">
                            <button
                              onClick={() => { setEditingId(video.id); setEditTitle(video.title); setOpenMenuId(null); }}
                              className="flex items-center gap-2 px-3 py-1.5 text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors text-left cursor-pointer"
                            >
                              <Edit2 className="w-3 h-3 text-slate-400" />
                              <span>Rename</span>
                            </button>
                            <button
                              onClick={() => { deleteVideoTask(video.id); setOpenMenuId(null); }}
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
          )}
        </div>
      </div>
    </div>
  );
}
