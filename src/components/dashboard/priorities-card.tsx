"use client";

import React, { useState } from "react";
import {
  Flag,
  Shield,
  Network,
  BookOpen,
  Heart,
  CheckCircle2,
  Circle,
  Plus,
  Briefcase,
  Dumbbell,
  Zap,
  MoreVertical,
  Edit2,
  Trash2
} from "lucide-react";
import { usePriorities } from "@/hooks/use-priorities";
import { WidgetState } from "@/components/shared/widget-state";
import { DailyTask } from "@/types/dashboard";
import { PriorityModal } from "./priority-modal";

const CATEGORY_ICON: Record<string, React.ElementType> = {
  Career:   Flag,
  Study:    BookOpen,
  Health:   Heart,
  Network:  Network,
  Defense:  Shield,
  CGL:      BookOpen,
  Work:     Briefcase,
  Fitness:  Dumbbell,
  General:  Zap,
};

const CATEGORY_BORDER: Record<string, string> = {
  Career:   "border-l-amber-500",
  Study:    "border-l-purple-500",
  Health:   "border-l-emerald-500",
  Network:  "border-l-sky-500",
  Defense:  "border-l-teal-500",
  CGL:      "border-l-sky-500",
  Work:     "border-l-blue-500",
  General:  "border-l-slate-500",
};

const CATEGORY_ICON_COLOR: Record<string, string> = {
  Career:   "text-amber-400",
  Study:    "text-purple-400",
  Health:   "text-emerald-400",
  Network:  "text-sky-400",
  Defense:  "text-teal-400",
  CGL:      "text-sky-400",
  Work:     "text-blue-400",
  General:  "text-slate-400",
};

function getIcon(category: string): React.ElementType {
  return CATEGORY_ICON[category] || Flag;
}
function getBorder(category: string): string {
  return CATEGORY_BORDER[category] || "border-l-slate-500";
}
function getIconColor(category: string): string {
  return CATEGORY_ICON_COLOR[category] || "text-slate-400";
}

export function PrioritiesCard() {
  const { tasks, isLoading, error, toggleComplete, refresh, addTask, editTask, deleteTask } = usePriorities();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<DailyTask | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const handleSave = (taskData: Partial<DailyTask>) => {
    if (editingTask) {
      editTask(editingTask.id, taskData);
    } else {
      addTask(taskData as any);
    }
  };

  const openAddModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task: DailyTask) => {
    setEditingTask(task);
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this priority?")) {
      deleteTask(id);
    }
    setActiveMenuId(null);
  };

  return (
    <>
      <div className="rounded-2xl p-5 bg-[#10131E] border border-white/[0.08] shadow-sm flex flex-col h-full max-h-[550px]">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h3 className="text-[15px] font-bold text-white tracking-tight">
            Today&apos;s Priorities
          </h3>
          {tasks.length > 0 && (
            <span className="text-[11px] font-semibold text-slate-400 bg-white/5 px-2 py-0.5 rounded-full">
              {tasks.filter((t) => t.completed).length} / {tasks.length} done
            </span>
          )}
        </div>

        {isLoading ? (
          <WidgetState state="loading" compact />
        ) : error ? (
          <WidgetState
            state="error"
            title="Priorities unavailable"
            message="Could not load today's tasks."
            onRetry={refresh}
            compact
          />
        ) : tasks.length === 0 ? (
          <WidgetState
            state="empty"
            title="No priorities today"
            message="Add tasks to your daily list."
            compact
          />
        ) : (
          <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto no-scrollbar pb-2">
            {tasks.map((item: DailyTask, idx: number) => {
              const Icon = getIcon(item.category);
              const isMenuOpen = activeMenuId === item.id;
              const isNearBottom = idx >= Math.max(0, tasks.length - 2);
              
              return (
                <div
                  key={item.id}
                  className={`relative flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] border-l-[4px] ${getBorder(
                    item.category
                  )} transition-all group`}
                >
                  <div 
                    className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                    onClick={() => toggleComplete(item.id, item.completed)}
                  >
                    <div className={`shrink-0 ${getIconColor(item.category)}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span
                        className={`text-[13px] font-bold text-white leading-tight truncate transition-colors ${
                          item.completed ? "line-through text-slate-500 opacity-60" : ""
                        }`}
                      >
                        {item.title}
                      </span>
                      {item.subtitle && (
                        <span className={`text-[10px] font-medium text-slate-400 mt-0.5 truncate transition-opacity ${item.completed ? 'opacity-40' : ''}`}>
                          {item.subtitle}
                        </span>
                      )}
                      {item.deadline && (
                        <span className={`text-[9px] font-mono mt-0.5 transition-opacity ${item.completed ? 'text-slate-500 opacity-40' : 'text-amber-400'}`}>
                          Due: {new Date(item.deadline).toLocaleString('en-IN', { hour: 'numeric', minute: '2-digit', day: 'numeric', month: 'short' })}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2.5 pl-2">
                    {item.priority_level === "HIGH" && !item.completed && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[9px] font-extrabold uppercase tracking-widest">
                        High
                      </span>
                    )}
                    
                    <button 
                      onClick={() => toggleComplete(item.id, item.completed)}
                      className="cursor-pointer p-0.5"
                    >
                      {item.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20 transition-transform hover:scale-110" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-500 hover:text-slate-300 transition-colors" />
                      )}
                    </button>

                    <div className="relative ml-1">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(isMenuOpen ? null : item.id);
                        }}
                        className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {isMenuOpen && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setActiveMenuId(null)} />
                          <div 
                            className={`absolute right-0 ${
                              isNearBottom ? "bottom-full mb-1.5" : "top-full mt-1.5"
                            } w-32 rounded-xl bg-[#1A1D2B] border border-white/10 shadow-2xl z-50 overflow-hidden py-1`}
                          >
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(item);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-white hover:bg-white/10 transition-colors text-left cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-blue-400" />
                              Edit
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(item.id);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-400/10 transition-colors text-left cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add Priority */}
        <div className="pt-3 mt-2 shrink-0">
          <button 
            onClick={openAddModal}
            className="w-full py-2 rounded-xl border border-dashed border-white/[0.15] hover:border-purple-500/50 bg-white/[0.02] hover:bg-purple-500/10 text-[13px] font-semibold text-slate-300 hover:text-purple-300 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Priority
          </button>
        </div>
      </div>

      <PriorityModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingTask}
      />
    </>
  );
}
