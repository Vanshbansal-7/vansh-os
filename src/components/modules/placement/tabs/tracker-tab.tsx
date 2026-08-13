"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { usePlacementTracker } from "@/hooks/use-placement-tracker";
import { ProgressSummary } from "../tracker/progress-summary";
import { SubjectSidebar } from "../tracker/subject-sidebar";
import { TopicTable } from "../tracker/topic-table";
import { EmptyState } from "@/components/crud/empty-state";
import { AddSubjectModal } from "@/components/crud/add-subject-modal";

export function TrackerTab() {
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
  } = usePlacementTracker();

  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);

  return (
    <div className="flex flex-col w-full">
      {/* Add Subject Modal */}
      <AddSubjectModal
        isOpen={isAddSubjectModalOpen}
        module="PLACEMENT"
        onClose={() => setIsAddSubjectModalOpen(false)}
        onSuccess={async (subj) => {
          await addSubject(subj.name, subj.description);
        }}
      />



      {subjects.length === 0 ? (
        <EmptyState
          title="No subjects created yet"
          description="Build your placement preparation roadmap by creating your first subject."
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

          {/* SECTION 2: Side-by-Side Placement Tracker */}
          <div className="flex flex-col lg:flex-row gap-4 items-start w-full">
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
            <TopicTable
              subject={selectedSubject}
              onToggleMilestone={toggleMilestone}
              onAddTopic={addTopic}
              onRenameTopic={renameTopic}
              onDeleteTopic={deleteTopic}
            />
          </div>
        </>
      )}
    </div>
  );
}
