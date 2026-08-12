"use client";

import React from "react";
import { PanelRightClose } from "lucide-react";
import { DailyTimetableTemplate } from "@/components/dashboard/daily-timetable-template";
import { useLayoutStore } from "@/store/use-layout-store";

export function RightSidebar() {
  const toggleRightSidebar = useLayoutStore((state) => state.toggleRightSidebar);

  return (
    <aside className="w-[260px] xl:w-[275px] shrink-0 h-screen sticky top-0 flex flex-col gap-2 p-3 bg-[#0A0B12] border-l border-white/[0.07] select-none z-20 overflow-hidden">
      <div className="flex justify-end shrink-0">
        <button 
          onClick={toggleRightSidebar}
          className="p-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] text-slate-400 hover:text-white transition-colors flex items-center justify-center cursor-pointer border border-transparent hover:border-white/5"
          title="Collapse Sidebar"
        >
          <PanelRightClose className="w-4 h-4" />
        </button>
      </div>
      
      {/* 2. Master Template Timetable */}
      <div className="flex-1 min-h-0">
        <DailyTimetableTemplate />
      </div>
    </aside>
  );
}
