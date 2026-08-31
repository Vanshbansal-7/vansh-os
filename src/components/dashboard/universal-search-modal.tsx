"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Loader2,
} from "lucide-react";

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: "Module" | "Company" | "Document" | "Exam" | "YouTube" | "Placement" | "Folder" | "Priority" | "Topic";
  url: string;
}

export function UniversalSearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Complete VOS Master Static Search Index (Functions, Pages, Modules & Options)
  const staticIndex: SearchResultItem[] = [
    // Core Modules & Pages
    { id: "nav-1", title: "Vijaypath Dashboard", subtitle: "Founder Command Center • Live Timetable & Priorities", category: "Module", url: "/" },
    { id: "nav-2", title: "Placement & DSA Preparation", subtitle: "Placement Roadmap • 48 Modules, 518 Videos & Milestones", category: "Placement", url: "/modules/placement" },
    { id: "nav-3", title: "Companies ATS & Applications", subtitle: "Personal ATS • Applications, Stages, Salaries & Docs", category: "Company", url: "/companies" },
    { id: "nav-4", title: "Documents Vault & Resumes", subtitle: "Digital Asset Storage • Folders, Resumes & Media", category: "Document", url: "/documents" },
    { id: "nav-5", title: "Exams Command Center", subtitle: "Exam Hub • AFCAT, Navy SSC, CDS, SSC CGL, CHSL, IB ACIO", category: "Exam", url: "/modules/exams" },
    { id: "nav-6", title: "SSC CGL 2026 Strategy Workspace", subtitle: "CGL Tier I & II Preparation Tracker & Resources", category: "Exam", url: "/modules/cgl" },
    { id: "nav-7", title: "AFCAT 02/2026 Strategy Hub", subtitle: "Air Force Common Admission Test Workspace", category: "Exam", url: "/modules/exams/afcat" },
    { id: "nav-8", title: "Navy SSC IT 2026 Workspace", subtitle: "Indian Navy Short Service Commission Hub", category: "Exam", url: "/modules/exams/navy-ssc" },
    { id: "nav-9", title: "CDS 02/2026 Strategy Hub", subtitle: "Combined Defence Services Workspace", category: "Exam", url: "/modules/exams/cds" },
    { id: "nav-10", title: "SSC CHSL 2026 Workspace", subtitle: "Combined Higher Secondary Level Hub", category: "Exam", url: "/modules/exams/chsl" },
    { id: "nav-11", title: "IB ACIO Grade II 2026", subtitle: "Intelligence Bureau Executive Workspace", category: "Exam", url: "/modules/exams/ib-acio" },
    { id: "nav-12", title: "YouTube Creator Hub", subtitle: "Video Production Pipeline & Channel Analytics", category: "YouTube", url: "/modules/youtube" },
    { id: "nav-13", title: "YouTube Content Vault", subtitle: "Presets, B-Rolls, Sound Effects & Stock Assets", category: "YouTube", url: "/modules/youtube" },
    { id: "nav-14", title: "YouTube Production Tracker", subtitle: "4-Stage Video Creation Workflow & Checklist", category: "YouTube", url: "/modules/youtube" },
    { id: "nav-15", title: "Streak Command Center", subtitle: "Founder Daily Consistency & Activity Heatmap", category: "Module", url: "/streak" },
    { id: "nav-16", title: "Daily Timetable & Schedule", subtitle: "Timeblocks, Routines & Study Timetable", category: "Module", url: "/calendar" },
    { id: "nav-17", title: "System Settings & Configuration", subtitle: "Security, Database Sync & App Preferences", category: "Module", url: "/system" },
    { id: "nav-18", title: "Analytics & Telemetry", subtitle: "Deep Productivity Analytics & System Stats", category: "Module", url: "/analytics" },

    // Direct Action & Function Shortcuts
    { id: "act-1", title: "Add New Subject or Module", subtitle: "Placement Tracker • Create New Subject / Folder", category: "Placement", url: "/modules/placement" },
    { id: "act-2", title: "Add Job Application / Company", subtitle: "Companies ATS • Track New Applied Company", category: "Company", url: "/companies" },
    { id: "act-3", title: "Upload New Document / Resume", subtitle: "Documents Vault • Upload PDF, Docs or Media", category: "Document", url: "/documents" },
    { id: "act-4", title: "View Daily Gita Shlok & Wisdom", subtitle: "Dashboard • 24-Hour Rotating Shlok Card", category: "Module", url: "/" },
    { id: "act-5", title: "Today's Priorities & Tasks", subtitle: "Dashboard • Critical Tasks Checklist", category: "Priority", url: "/" },
  ];

  // Listen for ⌘/Ctrl K, Slash (/), and custom event 'open-universal-search'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if active element is an editable input or textarea
      const isInput =
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA" ||
        (document.activeElement as HTMLElement)?.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "/" && !isInput && !isOpen) {
        e.preventDefault();
        setIsOpen(true);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => {
      setIsOpen(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-universal-search", handleCustomOpen);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-universal-search", handleCustomOpen);
    };
  }, [isOpen]);

  // Filter & Search Engine
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!query.trim()) {
      setResults(staticIndex.slice(0, 8));
      setIsSearching(false);
      return;
    }

    const trimmedQuery = query.trim().toLowerCase();

    // 1. Instantly filter static results
    const filteredStatic = staticIndex.filter(
      (item) =>
        item.title.toLowerCase().includes(trimmedQuery) ||
        item.subtitle.toLowerCase().includes(trimmedQuery) ||
        item.category.toLowerCase().includes(trimmedQuery)
    );

    // If query is 1 character, show filtered static
    if (trimmedQuery.length < 2) {
      setResults(filteredStatic);
      setIsSearching(false);
      return;
    }

    // 2. Deep backend search with debounce
    setIsSearching(true);
    setResults(filteredStatic); // show instant local matches while querying DB

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/v1/search?q=${encodeURIComponent(trimmedQuery)}`);
        if (res.ok) {
          const dynamicResults: SearchResultItem[] = await res.json();
          // Merge static + dynamic, removing duplicate IDs
          const merged = [...filteredStatic, ...dynamicResults];
          const uniqueIds = new Set();
          const finalResults = merged.filter((item) => {
            if (uniqueIds.has(item.id)) return false;
            uniqueIds.add(item.id);
            return true;
          });
          setResults(finalResults);
        }
      } catch (err) {
        console.error("Deep search failed:", err);
      } finally {
        setIsSearching(false);
        setSelectedIndex(0);
      }
    }, 300);
  }, [query]);

  const handleSelect = (item: SearchResultItem) => {
    setIsOpen(false);
    setQuery("");
    if (item.url) {
      router.push(item.url);
    }
  };

  const handleKeyDownInModal = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (results.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % (results.length || 1));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    }
  };

  if (!isOpen) return null;

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "Company":
        return <Building2 className="w-4 h-4 text-cyan-400" />;
      case "Document":
        return <FileText className="w-4 h-4 text-blue-400" />;
      case "Folder":
        return <Folder className="w-4 h-4 text-purple-300" />;
      case "Exam":
        return <BookOpen className="w-4 h-4 text-emerald-400" />;
      case "YouTube":
        return <Play className="w-4 h-4 text-rose-400 fill-rose-400/20" />;
      case "Placement":
        return <Target className="w-4 h-4 text-purple-400" />;
      case "Topic":
        return <Target className="w-4 h-4 text-amber-400" />;
      case "Priority":
        return <Flame className="w-4 h-4 text-orange-400" />;
      case "Module":
      default:
        return <BarChart3 className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div
        onKeyDown={handleKeyDownInModal}
        className="w-full max-w-2xl rounded-2xl bg-[#0E101A] border border-purple-500/40 shadow-[0_0_50px_rgba(168,85,247,0.3)] overflow-hidden flex flex-col"
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.08] bg-[#121524]">
          {isSearching ? (
            <Loader2 className="w-4 h-4 text-purple-400 shrink-0 animate-spin" />
          ) : (
            <Search className="w-4 h-4 text-purple-400 shrink-0" />
          )}
          
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all modules, notes, vault assets, scripts, companies..."
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
        <div className="max-h-[380px] overflow-y-auto p-2 flex flex-col gap-1 no-scrollbar relative min-h-[100px]">
          {results.length === 0 && !isSearching ? (
            <div className="p-8 text-center text-slate-500 text-xs font-medium">
              No results found for "{query}". Try a different keyword.
            </div>
          ) : results.length === 0 && isSearching ? (
            <div className="p-8 text-center text-slate-500 text-xs font-medium animate-pulse">
              Searching database deeply...
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
