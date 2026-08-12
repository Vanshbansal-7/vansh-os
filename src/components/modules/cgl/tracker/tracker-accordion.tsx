"use client";

import React from "react";
import {
  ChevronDown,
  ChevronRight,
  Cpu,
  Calculator,
  BookOpen,
  Compass,
  Monitor,
  MoreVertical,
} from "lucide-react";
import { CGLSubject } from "@/types/cgl";
import { MilestoneStatusDot } from "../shared/milestone-status-dot";

interface TrackerAccordionProps {
  subjects: CGLSubject[];
  expandedSubjects: Record<string, boolean>;
  onToggleAccordion: (id: string) => void;
  onToggleMilestone: (
    subjectId: string,
    topicId: string,
    milestone: "is_learned" | "is_practiced" | "is_revised" | "is_mastered"
  ) => void;
}

export function TrackerAccordion({
  subjects,
  expandedSubjects,
  onToggleAccordion,
  onToggleMilestone,
}: TrackerAccordionProps) {
  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case "Cpu":
        return Cpu;
      case "Calculator":
        return Calculator;
      case "BookOpen":
        return BookOpen;
      case "Compass":
        return Compass;
      case "Monitor":
        return Monitor;
      default:
        return Cpu;
    }
  };

  const getSubjectTheme = (color: string) => {
    switch (color) {
      case "purple":
        return {
          iconBg: "bg-purple-500/15 text-purple-400 border-purple-500/20",
          barColor: "bg-gradient-to-r from-purple-500 to-indigo-500",
        };
      case "blue":
        return {
          iconBg: "bg-blue-500/15 text-blue-400 border-blue-500/20",
          barColor: "bg-gradient-to-r from-sky-400 to-blue-500",
        };
      case "emerald":
        return {
          iconBg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
          barColor: "bg-gradient-to-r from-emerald-400 to-teal-500",
        };
      case "amber":
        return {
          iconBg: "bg-amber-500/15 text-amber-400 border-amber-500/20",
          barColor: "bg-gradient-to-r from-amber-400 to-orange-500",
        };
      case "cyan":
        return {
          iconBg: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
          barColor: "bg-gradient-to-r from-cyan-400 to-blue-500",
        };
      default:
        return {
          iconBg: "bg-purple-500/15 text-purple-400 border-purple-500/20",
          barColor: "bg-purple-500",
        };
    }
  };

  return (
    <div className="flex flex-col rounded-2xl bg-[#10131E] border border-white/[0.08] overflow-hidden shadow-sm">
      {/* Table Column Headers */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#141828] border-b border-white/[0.08] text-[11px] font-bold text-slate-400">
        <div className="flex-1">
          <span>Subject / Topic</span>
        </div>
        <div className="grid grid-cols-4 gap-4 sm:gap-8 w-[240px] sm:w-[320px] text-center shrink-0">
          <span>1. Learned</span>
          <span>2. Practiced</span>
          <span>3. Revised</span>
          <span>4. Mastered</span>
        </div>
        <div className="w-8 shrink-0" />
      </div>

      {/* Accordion Subject Groups */}
      <div className="flex flex-col divide-y divide-white/[0.06]">
        {subjects.map((subject) => {
          const isExpanded = !!expandedSubjects[subject.id];
          const Icon = getSubjectIcon(subject.icon_name);
          const theme = getSubjectTheme(subject.color);

          return (
            <div key={subject.id} className="flex flex-col">
              {/* Subject Accordion Header Row */}
              <div
                onClick={() => onToggleAccordion(subject.id)}
                className="flex items-center justify-between px-4 py-3 bg-[#111422] hover:bg-[#15192C] transition-colors cursor-pointer select-none"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
                  {/* Chevron Toggle */}
                  <div className="text-slate-400">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-purple-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </div>

                  {/* Subject Icon */}
                  <div
                    className={`w-7 h-7 rounded-xl border flex items-center justify-center shrink-0 ${theme.iconBg}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  {/* Title & Progress */}
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <span className="text-xs sm:text-sm font-bold text-white tracking-tight">
                      {subject.order_num}. {subject.title}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[10px] font-bold text-slate-300">
                      {subject.progress}% ({subject.completed_topics} / {subject.total_topics})
                    </span>
                  </div>
                </div>

                {/* Progress Bar on right */}
                <div className="w-28 sm:w-44 h-1.5 rounded-full bg-[#181D2B] overflow-hidden shrink-0">
                  <div
                    className={`h-full rounded-full ${theme.barColor}`}
                    style={{ width: `${subject.progress}%` }}
                  />
                </div>
              </div>

              {/* Nested Topic Rows (When Subject is Expanded) */}
              {isExpanded && (
                <div className="flex flex-col divide-y divide-white/[0.04] bg-[#0E101A]">
                  {subject.topics.map((topic) => (
                    <div
                      key={topic.id}
                      className="flex items-center justify-between px-4 sm:px-6 py-2.5 hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Left: Topic Title & Progress */}
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 pr-4">
                        <span className="text-xs font-semibold text-slate-200 truncate">
                          {topic.code} {topic.title}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            topic.progress === 100
                              ? "text-emerald-400 bg-emerald-500/10"
                              : topic.progress >= 50
                              ? "text-amber-400 bg-amber-500/10"
                              : "text-slate-400 bg-slate-800/40"
                          }`}
                        >
                          {topic.progress}% ({topic.completed_milestones} / 4)
                        </span>
                      </div>

                      {/* Right: 4 Interactive Milestone Check Dots */}
                      <div className="grid grid-cols-4 gap-4 sm:gap-8 w-[240px] sm:w-[320px] justify-items-center shrink-0">
                        <MilestoneStatusDot
                          type="learned"
                          completed={topic.is_learned}
                          onClick={() =>
                            onToggleMilestone(subject.id, topic.id, "is_learned")
                          }
                        />
                        <MilestoneStatusDot
                          type="practiced"
                          completed={topic.is_practiced}
                          onClick={() =>
                            onToggleMilestone(subject.id, topic.id, "is_practiced")
                          }
                        />
                        <MilestoneStatusDot
                          type="revised"
                          completed={topic.is_revised}
                          onClick={() =>
                            onToggleMilestone(subject.id, topic.id, "is_revised")
                          }
                        />
                        <MilestoneStatusDot
                          type="mastered"
                          completed={topic.is_mastered}
                          onClick={() =>
                            onToggleMilestone(subject.id, topic.id, "is_mastered")
                          }
                        />
                      </div>

                      {/* 3-Dots Action Menu */}
                      <button
                        type="button"
                        className="w-8 flex items-center justify-end text-slate-500 hover:text-slate-300 transition-colors shrink-0 cursor-pointer"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
