"use client";

import React from "react";
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
} from "lucide-react";
import { usePriorities } from "@/hooks/use-priorities";
import { WidgetState } from "@/components/shared/widget-state";
import { DailyTask } from "@/types/dashboard";

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
  const { tasks, isLoading, error, toggleComplete, refresh } = usePriorities();

  return (
    <div className="rounded-2xl p-4 bg-[#10131E] border border-white/[0.08] shadow-sm flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-white tracking-tight">
          Today&apos;s Priorities
        </h3>
        {tasks.length > 0 && (
          <span className="text-[10px] font-semibold text-slate-400">
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
        <div className="flex flex-col gap-2">
          {tasks.map((item: DailyTask) => {
            const Icon = getIcon(item.category);
            return (
              <div
                key={item.id}
                onClick={() => toggleComplete(item.id, item.completed)}
                className={`flex items-center justify-between p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.06] border-l-[3px] ${getBorder(
                  item.category
                )} transition-all cursor-pointer group`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`shrink-0 ${getIconColor(item.category)}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span
                      className={`text-[12px] font-bold text-white leading-tight truncate ${
                        item.completed ? "line-through text-slate-500" : ""
                      }`}
                    >
                      {item.title}
                    </span>
                    {item.subtitle && (
                      <span className="text-[9.5px] font-medium text-slate-400 mt-0.5">
                        {item.subtitle}
                      </span>
                    )}
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {item.priority_level === "HIGH" && !item.completed && (
                    <span className="px-1.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[8.5px] font-bold uppercase tracking-wide">
                      High
                    </span>
                  )}
                  {item.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-500/20" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Priority */}
      <div className="pt-2 mt-1 flex items-center justify-center">
        <button className="w-full py-1.5 rounded-xl border border-dashed border-white/[0.12] hover:border-purple-500/50 bg-white/[0.02] hover:bg-purple-500/10 text-xs font-semibold text-slate-400 hover:text-purple-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer">
          <Plus className="w-3.5 h-3.5" />
          Add Priority
        </button>
      </div>
    </div>
  );
}
