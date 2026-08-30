"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Bell, Award, Plus } from "lucide-react";
import { useExamsLauncher } from "@/hooks/use-exams-launcher";
import { ExamCard } from "@/components/modules/exams/launcher/exam-card";
import { FormsFilledSection } from "@/components/modules/exams/launcher/forms-filled-section";
import { RegisterExamModal } from "@/components/modules/exams/launcher/register-exam-modal";
import { useFounderProfile } from "@/hooks/use-founder-profile";
import { EmptyState } from "@/components/crud/empty-state";
import { ExamMaster } from "@/types/exams";

export default function ExamsLauncherPage() {
  const { exams, setExams, applications, isLoading } = useExamsLauncher();
  const { profile } = useFounderProfile();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const filteredExams = exams.filter((e) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !e.name.toLowerCase().includes(q) &&
        !e.short_name.toLowerCase().includes(q) &&
        !e.category.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    if (selectedCategory !== "All" && e.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  const handleExamRegistered = (newExam: ExamMaster) => {
    setExams((prev) => [newExam, ...prev]);
  };

  return (
    <div className="flex flex-col w-full pb-16 min-h-screen">
      {/* Register Exam Modal — premium, no browser dialogs */}
      <RegisterExamModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={handleExamRegistered}
      />

      {/* 1. Top Bar */}
      <div className="flex items-center justify-between gap-4 py-2 border-b border-white/[0.04] mb-4">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition-all text-xs font-semibold group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Dashboard</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="relative w-64 sm:w-80">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search competitive exams..."
              className="w-full bg-[#10131E] border border-white/[0.08] hover:border-white/[0.14] focus:border-purple-500/50 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
            />
          </div>

          <button
            type="button"
            aria-label="Notifications"
            className="relative w-8 h-8 rounded-xl bg-[#10131E] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5" />
          </button>

          <div className="w-8 h-8 rounded-xl overflow-hidden border border-purple-500/30 bg-[#151726] flex items-center justify-center shrink-0">
            {profile?.resolved_avatar_url ? (
              <img src={profile.resolved_avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-[11px] font-bold text-purple-300">VB</span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0 shadow-[0_0_24px_rgba(168,85,247,0.2)]">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none flex items-center gap-2">
              Exams Command Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
              Track and manage all your competitive examination preparation from one place.
            </p>
          </div>
        </div>

        {/* Category filter chips */}
        <div className="flex items-center gap-2 flex-wrap">
          {["All", "Defense", "SSC", "Banking", "UPSC", "State PCS"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                selectedCategory === cat
                  ? "bg-purple-600 border-purple-500 text-white"
                  : "bg-white/[0.04] border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.08]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setIsRegisterOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer shadow-sm shrink-0 shadow-[0_0_14px_rgba(168,85,247,0.4)]"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Exam</span>
        </button>
      </div>

      {/* 3. Competitive Exams Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-44 rounded-2xl bg-[#10131E] border border-white/[0.06]" />
          ))}
        </div>
      ) : exams.length === 0 ? (
        <EmptyState
          title="No competitive exams registered yet"
          description="Register your target competitive exams (AFCAT, CDS, SSC CGL, GATE, UPSC) to unlock your preparation workspace, syllabus tracker, resources, and milestone tracker."
          actionLabel="Register Your First Exam"
          onAction={() => setIsRegisterOpen(true)}
          icon="general"
        />
      ) : filteredExams.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm font-semibold text-slate-400">No exams match your search</p>
          <button
            type="button"
            onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
            className="mt-3 text-xs text-purple-400 hover:text-purple-300 transition-colors cursor-pointer font-semibold"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      )}

      {/* 4. Applications / Forms Filled Section */}
      <FormsFilledSection applications={applications} />
    </div>
  );
}
