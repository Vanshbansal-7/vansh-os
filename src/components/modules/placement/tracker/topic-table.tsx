"use client";

import React, { useState } from "react";
import { Plus, MoreVertical, Trash2, Edit2, AlertCircle } from "lucide-react";
import { PlacementSubject, PlacementMilestone } from "@/types/placement";
import { MilestoneStatusDot } from "@/components/modules/cgl/shared/milestone-status-dot";

interface TopicTableProps {
  subject: PlacementSubject;
  onToggleMilestone: (subjectId: string, topicId: string, milestone: PlacementMilestone) => Promise<void> | void;
  onAddTopic: (subjectId: string, title: string) => Promise<void> | void;
  onRenameTopic: (subjectId: string, topicId: string, newTitle: string) => Promise<void> | void;
  onDeleteTopic: (subjectId: string, topicId: string) => Promise<void> | void;
}

export function TopicTable({
  subject,
  onToggleMilestone,
  onAddTopic,
  onRenameTopic,
  onDeleteTopic,
}: TopicTableProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editTopicTitle, setEditTopicTitle] = useState("");
  const [openMenuTopicId, setOpenMenuTopicId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (newTitle.trim()) {
      try {
        await onAddTopic(subject.id, newTitle);
        setNewTitle("");
        setIsAdding(false);
      } catch (err: any) {
        setErrorMsg(err?.message || "Failed to add topic to database");
      }
    }
  };

  const handleRenameSubmit = async (topicId: string, e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (editTopicTitle.trim()) {
      try {
        await onRenameTopic(subject.id, topicId, editTopicTitle);
        setEditingTopicId(null);
        setOpenMenuTopicId(null);
      } catch (err: any) {
        setErrorMsg(err?.message || "Failed to rename topic in database");
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 rounded-2xl bg-[#10131E] border border-white/[0.08] shadow-sm">
      {/* Table Top Header: Selected Subject Name & Topic Count + Add Topic button */}
      <div className="flex items-center justify-between px-5 py-4 bg-[#131625] border-b border-white/[0.08] rounded-t-2xl">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            {subject.title}
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {subject.topics?.length || 0} Topics
          </p>
        </div>

        <button
          onClick={() => {
            setErrorMsg("");
            setIsAdding(true);
          }}
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 text-xs font-bold transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Topic</span>
        </button>
      </div>

      {errorMsg && (
        <div className="px-5 py-2.5 bg-rose-500/15 border-b border-rose-500/30 flex items-center gap-2 text-rose-300 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Inline Form to Add New Topic */}
      {isAdding && (
        <form
          onSubmit={handleAddSubmit}
          className="flex items-center gap-2 px-5 py-3 bg-[#151828] border-b border-white/[0.06]"
        >
          <input
            type="text"
            autoFocus
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="New topic title..."
            className="flex-1 bg-[#0E101A] border border-purple-500/40 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Add Topic
          </button>
          <button
            type="button"
            onClick={() => setIsAdding(false)}
            className="px-2 py-1.5 text-slate-400 text-xs hover:text-white cursor-pointer"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Column Headers */}
      <div className="flex items-center justify-between px-5 py-2.5 bg-[#141726] border-b border-white/[0.06] text-[11px] font-bold text-slate-400">
        <div className="flex-1">
          <span>Topics</span>
        </div>
        <div className="grid grid-cols-4 gap-4 sm:gap-8 w-[240px] sm:w-[320px] text-center shrink-0">
          <span>Learned</span>
          <span>Practiced</span>
          <span>Revised</span>
          <span>Mastered</span>
        </div>
        <div className="w-8 shrink-0 text-right">
          <span>Actions</span>
        </div>
      </div>

      {/* Topics Rows */}
      <div className="flex flex-col divide-y divide-white/[0.04] bg-[#0E101A] rounded-b-2xl">
        {(!subject.topics || subject.topics.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500 text-xs">
            <span>No topics added to {subject.title} yet.</span>
            <button
              onClick={() => setIsAdding(true)}
              className="mt-2 text-purple-400 hover:underline font-semibold"
            >
              + Add first topic
            </button>
          </div>
        ) : (
          subject.topics.map((topic) => {
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
                </form>
              );
            }

            return (
              <div
                key={topic.id}
                className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition-colors"
              >
                {/* Left: Purple Dot + Topic Title */}
                <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                  <span className="text-xs font-semibold text-slate-200 truncate">
                    {topic.title}
                  </span>
                </div>

                {/* Center: 4 Interactive Milestone Check Dots */}
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
                    <div className="absolute right-0 top-6 z-20 w-32 rounded-xl bg-[#151828] border border-white/[0.1] shadow-xl py-1 flex flex-col text-xs">
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
