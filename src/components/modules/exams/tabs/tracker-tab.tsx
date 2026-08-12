"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useExamTracker } from "@/hooks/use-exam-tracker";
import { ProgressSummary } from "@/components/modules/placement/tracker/progress-summary";
import { SubjectSidebar } from "@/components/modules/placement/tracker/subject-sidebar";
import { TopicTable } from "@/components/modules/placement/tracker/topic-table";
import { EmptyState } from "@/components/crud/empty-state";
import { AddSubjectModal } from "@/components/crud/add-subject-modal";

interface TrackerTabProps {
  examSlug: string;
  examName: string;
  examId: string;
}

export function TrackerTab({ examSlug, examName, examId }: TrackerTabProps) {
  const {
    subjects,
    selectedSubject,
    selectedSubjectId,
    setSelectedSubjectId,
    stats,
    toggleMilestone,
    addSubject,
    renameSubject,
    deleteSubject,
    addTopic,
    deleteTopic,
    renameTopic,
  } = useExamTracker(examSlug, examId);

  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);

  return (
    <div className="flex flex-col w-full">
      {/* Add Subject Modal */}
      <AddSubjectModal
        isOpen={isAddSubjectModalOpen}
        module={examSlug.toUpperCase()}
        onClose={() => setIsAddSubjectModalOpen(false)}
        onSuccess={async (subj) => {
          await addSubject(subj.name, subj.description);
        }}
      />

      {/* Tracker Top Header Row */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight leading-none">
            {examName} Tracker
          </h2>
          <p className="text-[11.5px] text-slate-400 font-medium mt-1">
            Track all your {examName} preparation subjects and topics
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddSubjectModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 text-xs font-bold transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Create Subject</span>
        </button>
      </div>

      {subjects.length === 0 ? (
        <EmptyState
          title="No subjects created yet"
          description={`Build your ${examName} preparation roadmap by creating your first subject.`}
          actionLabel="Create Subject"
          onAction={() => setIsAddSubjectModalOpen(true)}
          icon="subject"
        />
      ) : (
        <>
          {/* SECTION 1: Full-Width Horizontal Tracker Progress Summary */}
          <ProgressSummary
            overallPercentage={stats.progress}
            totalTopics={stats.totalTopics}
            completedTopics={stats.completedTopics}
            subjects={subjects}
            selectedSubjectId={selectedSubjectId}
            onSelectSubject={setSelectedSubjectId}
          />

          {/* SECTION 2: Side-by-Side Tracker */}
          <div className="flex flex-col lg:flex-row gap-4 items-start w-full mt-4">
            {/* Left Side: Subjects List */}
            <SubjectSidebar
              subjects={subjects}
              selectedSubjectId={selectedSubjectId}
              onSelectSubject={setSelectedSubjectId}
              onAddSubject={() => setIsAddSubjectModalOpen(true)}
              onRenameSubject={renameSubject}
              onDeleteSubject={deleteSubject}
            />

            {/* Right Side: Topics Table */}
            {selectedSubject && (
              <TopicTable
                subject={selectedSubject}
                onToggleMilestone={toggleMilestone}
                onAddTopic={addTopic}
                onRenameTopic={renameTopic}
                onDeleteTopic={deleteTopic}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
