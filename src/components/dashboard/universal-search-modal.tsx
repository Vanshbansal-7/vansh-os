"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Building2,
  FileText,
  Video,
  BookOpen,
  Target,
  ArrowRight,
  X,
  Play,
  Calendar as CalendarIcon,
  BarChart3,
  Settings,
  Flame,
  Folder,
} from "lucide-react";

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: "Module" | "Company" | "Document" | "Exam" | "YouTube" | "Placement" | "Folder" | "Priority";
  url: string;
}

export function UniversalSearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  // Complete VOS Master Search Index
  const searchIndex: SearchResultItem[] = [
    { id: "nav-1", title: "Vijaypath Dashboard", subtitle: "Founder Command Center • Live Timetable & Priorities", category: "Module", url: "/" },
    { id: "nav-2", title: "Companies ATS", subtitle: "Personal ATS • Applications, Status & Documents", category: "Company", url: "/companies" },
    { id: "nav-3", title: "Placement Module", subtitle: "Placement Prep • 4-Milestone Check System", category: "Placement", url: "/modules/placement" },
    { id: "nav-4", title: "Exams Command Center", subtitle: "Exam Hub • AFCAT, Navy SSC, CDS, SSC CGL, CHSL", category: "Exam", url: "/modules/exams" },
    { id: "nav-5", title: "AFCAT 02/2026 Workspace", subtitle: "Exams • Air Force Common Admission Test", category: "Exam", url: "/modules/exams/afcat" },
    { id: "nav-6", title: "Navy SSC IT 2026 Workspace", subtitle: "Exams • Indian Navy Short Service Commission", category: "Exam", url: "/modules/exams/navy-ssc" },
    { id: "nav-7", title: "CDS 02/2026 Strategy", subtitle: "Exams • Combined Defence Services", category: "Exam", url: "/modules/exams/cds" },
    { id: "nav-8", title: "SSC CGL 2026 Tier I/II", subtitle: "CGL • Combined Graduate Level", category: "Exam", url: "/modules/cgl" },
    { id: "nav-9", title: "SSC CHSL 2026 Hub", subtitle: "Exams • Combined Higher Secondary Level", category: "Exam", url: "/modules/exams/chsl" },
    { id: "nav-10", title: "IB ACIO Grade II 2026", subtitle: "Exams • Intelligence Bureau Executive", category: "Exam", url: "/modules/exams/ib-acio" },
    { id: "nav-11", title: "YouTube Creator Workspace", subtitle: "Channel Management & Video Production", category: "YouTube", url: "/modules/youtube" },
    { id: "nav-12", title: "YouTube Content Vault", subtitle: "Creator Workspace • Presets, B-roll & Sound Effects", category: "YouTube", url: "/modules/youtube" },
    { id: "nav-13", title: "YouTube Production Tracker", subtitle: "Creator Workspace • 4-Stage Video Creation Checklist", category: "YouTube", url: "/modules/youtube" },
    { id: "nav-14", title: "Documents Vault", subtitle: "Digital Asset Management • File Storage & Folders", category: "Document", url: "/documents" },
    { id: "nav-15", title: "Study Materials Folder", subtitle: "Documents Vault • 128 Items", category: "Folder", url: "/documents" },
    { id: "nav-16", title: "Placement Folder", subtitle: "Documents Vault • 64 Items", category: "Folder", url: "/documents" },
    { id: "nav-17", title: "Projects Folder", subtitle: "Documents Vault • 37 Items", category: "Folder", url: "/documents" },
    { id: "nav-18", title: "Streak Command Center", subtitle: "Founder Consistency & Check-in Heatmap", category: "Module", url: "/streak" },
    { id: "nav-19", title: "Analytics & Telemetry", subtitle: "System Metrics & Activity Log", category: "Module", url: "/analytics" },
    { id: "nav-20", title: "Calendar & Schedule", subtitle: "Timeblocks & Upcoming Deadlines", category: "Module", url: "/calendar" },
    { id: "nav-21", title: "System Settings", subtitle: "Vansh OS Configuration & Security", category: "Module", url: "/system" },
    { id: "doc-1", title: "DSA Roadmap.pdf", subtitle: "Documents Vault • /Study Materials/DSA", category: "Document", url: "/documents" },
    { id: "doc-2", title: "Resume_Vansh_Bansal.docx", subtitle: "Documents Vault • /Placement/Resume", category: "Document", url: "/documents" },
    { id: "doc-3", title: "System Architecture.png", subtitle: "Documents Vault • /Projects/Vansh OS", category: "Document", url: "/documents" },
    { id: "comp-1", title: "TCS Software Engineer Application", subtitle: "Companies ATS • Applied 04 May 2025", category: "Company", url: "/companies" },
    { id: "comp-2", title: "Infosys Systems Engineer", subtitle: "Companies ATS • Assessment Phase", category: "Company", url: "/companies" },
  ];

  // Global Keyboard Listener for ⌘ K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter Search Index
  useEffect(() => {
    if (!query.trim()) {
      setResults(searchIndex.slice(0, 6));
      return;
    }
    const filtered = searchIndex.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (item: SearchResultItem) => {
    setIsOpen(false);
    setQuery("");
    router.push(item.url);
  };

  const handleKeyDownInModal = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    }
  };

  if (!isOpen) return null;

  const getCategoryIcon = (cat: SearchResultItem["category"]) => {
    switch (cat) {
      case "Company":
        return <Building2 className="w-4 h-4 text-purple-400" />;
      case "Document":
        return <FileText className="w-4 h-4 text-blue-400" />;
      case "Folder":
        return <Folder className="w-4 h-4 text-purple-300" />;
      case "Exam":
        return <BookOpen className="w-4 h-4 text-emerald-400" />;
      case "YouTube":
        return <Play className="w-4 h-4 text-rose-400 fill-rose-400/20" />;
      case "Placement":
        return <Target className="w-4 h-4 text-indigo-400" />;
      case "Module":
      default:
        return <BarChart3 className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div
        onKeyDown={handleKeyDownInModal}
        className="w-full max-w-2xl rounded-2xl bg-[#0E101A] border border-purple-500/40 shadow-[0_0_50px_rgba(168,85,247,0.3)] overflow-hidden flex flex-col"
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.08] bg-[#121524]">
          <Search className="w-4 h-4 text-purple-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all modules, exams, documents, companies, tools..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-medium"
          />
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 flex flex-col gap-1 no-scrollbar">
          {results.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs font-medium">
              No results found for "{query}".
            </div>
          ) : (
            results.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
                    isSelected
                      ? "bg-purple-600/25 border border-purple-500/50 text-white shadow-sm"
                      : "bg-transparent border border-transparent hover:bg-white/[0.03] text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#161828] border border-white/[0.08] flex items-center justify-center shrink-0">
                      {getCategoryIcon(item.category)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-white truncate">
                        {item.title}
                      </span>
                      <span className="text-[10.5px] text-slate-400 font-medium truncate mt-0.5">
                        {item.subtitle}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.08] text-[9.5px] font-bold text-purple-300 uppercase tracking-wider">
                      {item.category}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer Keybind Hints */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#090A10] border-t border-white/[0.06] text-[10.5px] text-slate-500 font-medium">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-slate-300 font-mono">↑↓</kbd> Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-slate-300 font-mono">↵</kbd> Select
            </span>
          </div>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-slate-300 font-mono">ESC</kbd> Close
          </span>
        </div>
      </div>
    </div>
  );
}
