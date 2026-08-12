"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";

export function MiniCalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => {
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Make Monday=0, Sunday=6
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const daysInPrevMonth = getDaysInMonth(year, month - 1);
  
  const calendarDays = [];
  
  // Previous month trailing days
  for (let i = 0; i < firstDay; i++) {
    calendarDays.unshift({ day: daysInPrevMonth - i, isCurrentMonth: false, isToday: false });
  }
  
  // Current month days
  const today = new Date();
  for (let i = 1; i <= daysInMonth; i++) {
    const isToday = today.getDate() === i && today.getMonth() === month && today.getFullYear() === year;
    calendarDays.push({ day: i, isCurrentMonth: true, isToday });
  }
  
  // Next month leading days
  const totalSlots = calendarDays.length > 35 ? 42 : 35;
  const remaining = totalSlots - calendarDays.length;
  for (let i = 1; i <= remaining; i++) {
    calendarDays.push({ day: i, isCurrentMonth: false, isToday: false });
  }

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  if (!isClient) return null;

  return (
    <div className="rounded-2xl p-3 bg-[#10131E] border border-white/[0.08] shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <Link 
          href="/calendar"
          className="text-xs font-bold text-white tracking-tight hover:text-purple-400 transition-colors"
        >
          {monthName}
        </Link>
        <div className="flex items-center gap-0.5">
          <button 
            onClick={() => changeMonth(-1)}
            className="w-5 h-5 rounded hover:bg-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => changeMonth(1)}
            className="w-5 h-5 rounded hover:bg-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => setCurrentDate(new Date())}
            className="px-1.5 py-0.5 rounded-md bg-white/[0.06] hover:bg-white/[0.1] text-[8.5px] font-bold text-slate-300 transition-colors cursor-pointer ml-0.5"
          >
            Today
          </button>
        </div>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
          <span key={d} className="text-[9px] font-semibold text-slate-500">
            {d}
          </span>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-0.5 text-center">
        {calendarDays.map((c, idx) => (
          <div
            key={idx}
            className={`h-6 flex items-center justify-center text-[10.5px] font-semibold rounded-lg cursor-pointer transition-all ${
              c.isToday
                ? "bg-purple-500 text-white font-bold shadow-[0_0_10px_rgba(168,85,247,0.4)]"
                : c.isCurrentMonth
                ? "text-slate-300 hover:bg-white/[0.08]"
                : "text-slate-600 hover:text-slate-400"
            }`}
          >
            {c.day}
          </div>
        ))}
      </div>

      {/* Upcoming Deadline Pill - Empty State for now */}
      <div className="mt-3 pt-3 border-t border-white/[0.06] flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-1.5 text-slate-400 font-medium">
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            <span>Upcoming Deadlines</span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-2 px-1.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <span className="text-[10px] text-slate-500 font-medium text-center">
            No upcoming deadlines.
          </span>
          <span className="text-[8.5px] text-slate-600 mt-0.5 text-center px-2">
            (Syncs in V3)
          </span>
        </div>
      </div>
    </div>
  );
}
