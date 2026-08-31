"use client";

import React, { useState, useMemo } from "react";
import {
  Plus,
  MoreVertical,
  Trash2,
  Edit2,
  AlertCircle,
  FolderOpen,
  Search,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { PlacementSubject, PlacementMilestone, PlacementModuleGroup } from "@/types/placement";
import { MilestoneStatusDot } from "@/components/modules/cgl/shared/milestone-status-dot";

interface TopicTableProps {
  subject: PlacementSubject;
  selectedModuleName?: string;
  onSelectModule?: (modName: string) => void;
  onToggleMilestone: (subjectId: string, topicId: string, milestone: PlacementMilestone) => Promise<void> | void;
  onAddTopic: (subjectId: string, title: string, moduleName?: string) => Promise<void> | void;
  onAddModule?: (subjectId: string, moduleName: string) => Promise<void> | void;
  onDeleteModule?: (subjectId: string, moduleName: string) => Promise<void> | void;
  onRenameTopic: (subjectId: string, topicId: string, newTitle: string) => Promise<void> | void;
  onDeleteTopic: (subjectId: string, topicId: string) => Promise<void> | void;
}

export function TopicTable({
  subject,
  selectedModuleName,
  onSelectModule,
  onToggleMilestone,
  onAddTopic,
  onRenameTopic,
  onDeleteTopic,
}: TopicTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState("");

  // Editing topic
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editTopicTitle, setEditTopicTitle] = useState("");
  const [openMenuTopicId, setOpenMenuTopicId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const modules: PlacementModuleGroup[] = subject.modules || [];

  // Determine active module
  const activeModule = useMemo(() => {
    if (!modules || modules.length === 0) return null;
    if (selectedModuleName) {
      return modules.find((m) => m.name === selectedModuleName) || modules[0];
    }
    return modules[0];
  }, [modules, selectedModuleName]);

  const topicsInActiveModule = activeModule ? activeModule.topics : [];

  // Filter topics by search query
  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return topicsInActiveModule;
    const q = searchQuery.toLowerCase();
    return topicsInActiveModule.filter((t) => t.title.toLowerCase().includes(q));
  }, [topicsInActiveModule, searchQuery]);

  const handleAddTopicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle.trim() || !activeModule) return;
    try {
      setErrorMsg("");
      await onAddTopic(subject.id, newTopicTitle.trim(), activeModule.name);
      setNewTopicTitle("");
      setIsAddingTopic(false);
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

  if (!activeModule) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 rounded-2xl bg-[#10131E] border border-white/[0.08] text-slate-400 text-xs">
        <FolderOpen className="w-8 h-8 text-slate-600 mb-2" />
        <span>No modules found in {subject.title}.</span>
        <span className="text-[11px] text-slate-500 mt-1">
          Use the &ldquo;+&rdquo; icon on the left menu next to {subject.title} to create your first module.
        </span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 rounded-2xl bg-[#10131E] border border-white/[0.08] shadow-sm">
      {/* Top Header: Active Module Info & Right-side Add Topic Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 bg-[#131625] border-b border-white/[0.08] rounded-t-2xl">
        {/* Left: Breadcrumb & Active Module Title */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400">
            <span>{subject.title}</span>
            <span>&bull;</span>
            <span className="text-purple-300 font-bold flex items-center gap-1.5 truncate">
              <FolderOpen className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              {activeModule.name}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <h2 className="text-base font-bold text-white tracking-tight truncate">
              {activeModule.name}
            </h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">
              {activeModule.total_topics} Videos
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
              {activeModule.progress}% Done
            </span>
          </div>
        </div>

        {/* Right: Search & + Add Topic Button */}
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          {/* Search in Module */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter videos..."
              className="w-36 sm:w-48 bg-[#0E101A] border border-white/[0.1] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
            />
          </div>

          {/* + Add Topic Button (Right Side) */}
          <button
            type="button"
            onClick={() => {
              setErrorMsg("");
              setIsAddingTopic(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Topic</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="px-5 py-2.5 bg-rose-500/15 border-b border-rose-500/30 flex items-center gap-2 text-rose-300 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Inline Form to Add New Topic */}
      {isAddingTopic && (
        <form
          onSubmit={handleAddTopicSubmit}
          className="flex items-center gap-2 px-5 py-3 bg-[#151828] border-b border-purple-500/30"
        >
          <input
            type="text"
            autoFocus
            value={newTopicTitle}
            onChange={(e) => setNewTopicTitle(e.target.value)}
            placeholder={`Add video topic in "${activeModule.name}"...`}
            className="flex-1 bg-[#0E101A] border border-purple-500/40 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Add Topic
          </button>
          <button
            type="button"
            onClick={() => setIsAddingTopic(false)}
            className="px-2.5 py-2 text-slate-400 text-xs hover:text-white"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Column Headers */}
      <div className="flex items-center justify-between px-5 py-2.5 bg-[#141726] border-b border-white/[0.06] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
        <div className="flex-1">Video / Lecture Title</div>
        <div className="grid grid-cols-4 gap-4 sm:gap-8 w-[240px] sm:w-[320px] text-center shrink-0">
          <span>Learned</span>
          <span>Practiced</span>
          <span>Revised</span>
          <span>Mastered</span>
        </div>
        <div className="w-8 shrink-0 text-right">
          <span>•</span>
        </div>
      </div>

      {/* Topics List Rows */}
      <div className="flex flex-col divide-y divide-white/[0.04] bg-[#0E101A] rounded-b-2xl min-h-[300px]">
        {filteredTopics.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500 text-xs">
            <span>No topics in this module yet.</span>
            <button
              onClick={() => setIsAddingTopic(true)}
              className="mt-2 text-purple-400 hover:underline font-semibold"
            >
              + Add first video topic
            </button>
          </div>
        ) : (
          filteredTopics.map((topic) => {
            const isEditing = editingTopicId === topic.id;
            const isMenuOpen = openMenuTopicId === topic.id;

            if (isEditing) {
              return (
                <form
                  key={topic.id}
                  onSubmit={(e) => handleRenameSubmit(topic.id, e)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#151828]"
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
                className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition-colors group"
              >
                {/* Left: Indicator Dot & Topic Title */}
                <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-4">
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
                        ? "text-emerald-200/95 font-bold"
                        : "text-slate-200"
                    }`}
                  >
                    {topic.title}
                  </span>
                </div>

                {/* Center: 4 Interactive Milestone Dots */}
                <div className="grid grid-cols-4 gap-4 sm:gap-8 w-[240px] sm:w-[320px] justify-items-center shrink-0">
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

                {/* Right: 3-Dots Action Menu */}
                <div className="relative shrink-0 w-8 flex justify-end">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuTopicId(isMenuOpen ? null : topic.id);
                    }}
                    className="p-1 rounded text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  >
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>

                  {/* Dropdown Menu */}
                  {isMenuOpen && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 top-6 z-20 w-32 rounded-xl bg-[#181D30] border border-white/[0.1] shadow-2xl py-1 flex flex-col text-xs"
                    >
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
    </div>
  );
}


