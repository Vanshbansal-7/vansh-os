"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { ExamTabId } from "@/types/exams";
import { useExamModule } from "@/hooks/use-exam-module";
import { ExamTopBar } from "@/components/modules/exams/workspace/exam-top-bar";
import { ExamHeader } from "@/components/modules/exams/workspace/exam-header";
import { ExamTabsNav } from "@/components/modules/exams/workspace/exam-tabs-nav";
import { OverviewTab } from "@/components/modules/exams/tabs/overview-tab";
import { ResourcesTab } from "@/components/modules/exams/tabs/resources-tab";
import { NotesTab } from "@/components/modules/exams/tabs/notes-tab";
import { TrackerTab } from "@/components/modules/exams/tabs/tracker-tab";

export default function DynamicExamWorkspacePage() {
  const params = useParams();
  const slug = (params?.slug as string) || "afcat";

  const {
    exam,
    overview,
    isLoading,
  } = useExamModule(slug);

  const [activeTab, setActiveTab] = useState<ExamTabId>("overview");
  const [searchQuery, setSearchQuery] = useState("");

  if (isLoading || !exam) {
    return (
      <div className="flex flex-col gap-4 w-full p-6 animate-pulse">
        <div className="h-10 bg-[#10131E] rounded-xl w-48" />
        <div className="h-28 bg-[#10131E] rounded-2xl w-full" />
        <div className="h-64 bg-[#10131E] rounded-2xl w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full pb-16 min-h-screen">
      {/* 1. Top Bar */}
      <ExamTopBar
        examName={exam.name}
        searchPlaceholder={`Search in ${exam.short_name}...`}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 2. Main Exam Header Telemetry */}
      <ExamHeader exam={exam} />

      {/* 3. 4 Navigation Tabs Switcher */}
      <ExamTabsNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 4. Active Tab Content Area */}
      <div className="w-full mt-1">
        {activeTab === "overview" && <OverviewTab overview={overview} />}
        {activeTab === "resources" && <ResourcesTab examSlug={slug} examId={exam.id} />}
        {activeTab === "notes" && <NotesTab examSlug={slug} examId={exam.id} />}
        {activeTab === "tracker" && <TrackerTab examSlug={slug} examName={exam.name} examId={exam.id} />}
      </div>
    </div>
  );
}
