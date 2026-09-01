"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCheck,
  Trash2,
  X,
  Flame,
  AlertTriangle,
  Clock,
  Target,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { useNotifications } from "@/hooks/use-notifications";
import { VOSNotification, NotificationType } from "@/types/notification";

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"ALL" | "UNREAD" | "URGENT">("ALL");
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const {
    notifications,
    unreadCount,
    urgentCount,
    markAsRead,
    markAllAsRead,
    dismiss,
    clearAll,
  } = useNotifications();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === "UNREAD") return !n.read;
    if (activeFilter === "URGENT") return n.priority === "CRITICAL" || n.priority === "HIGH";
    return true;
  });

  const handleNotificationClick = (n: VOSNotification) => {
    markAsRead(n.id);
    setIsOpen(false);
    if (n.linkUrl) {
      router.push(n.linkUrl);
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "STREAK":
        return <Flame className="w-4 h-4 text-fuchsia-400 fill-fuchsia-400/20" />;
      case "PRIORITY":
        return <AlertTriangle className="w-4 h-4 text-rose-400 fill-rose-400/20" />;
      case "TIMETABLE":
        return <Clock className="w-4 h-4 text-sky-400" />;
      case "PLACEMENT":
        return <Target className="w-4 h-4 text-purple-400" />;
      case "SYSTEM":
      default:
        return <Sparkles className="w-4 h-4 text-amber-400" />;
    }
  };

  const getPriorityBadgeStyle = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return "bg-rose-500/20 text-rose-300 border-rose-500/30 font-extrabold";
      case "HIGH":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30 font-bold";
      case "MEDIUM":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "INFO":
      default:
        return "bg-slate-500/20 text-slate-300 border-white/[0.08]";
    }
  };

  const formatRelativeTime = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return diffMins + "m ago";
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return diffHours + "h ago";
      return "Today";
    } catch {
      return "Today";
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open Notifications"
        className={
          "relative w-8 h-8 rounded-xl border flex items-center justify-center transition-all cursor-pointer " +
          (isOpen
            ? "bg-purple-600/30 border-purple-500/50 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]"
            : "bg-[#101320] hover:bg-white/[0.06] border-white/[0.08] text-slate-300 hover:text-white")
        }
      >
        <Bell className="w-4 h-4" />

        {/* Dynamic Badge with Pulse when Unread */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[15px] h-[15px] px-1 rounded-full bg-rose-500 text-[8.5px] font-extrabold text-white flex items-center justify-center shadow-md animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Glassmorphic Dropdown Popover */}
      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 top-11 z-[110] w-[340px] sm:w-[390px] rounded-2xl bg-[#101322]/95 border border-purple-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(168,85,247,0.15)] backdrop-blur-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-[#141828] border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-tight">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.2 rounded-full bg-purple-500/25 border border-purple-500/30 text-[10px] font-extrabold text-purple-300">
                  {unreadCount} New
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  title="Mark all as read"
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10.5px] font-semibold text-purple-300 hover:text-white hover:bg-purple-600/20 transition-all cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Read all</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 px-3 py-2 bg-[#0E111C] border-b border-white/[0.06]">
            <button
              type="button"
              onClick={() => setActiveFilter("ALL")}
              className={
                "px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer " +
                (activeFilter === "ALL"
                  ? "bg-purple-600/30 text-white border border-purple-500/40"
                  : "text-slate-400 hover:text-slate-200")
              }
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("UNREAD")}
              className={
                "px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer " +
                (activeFilter === "UNREAD"
                  ? "bg-purple-600/30 text-white border border-purple-500/40"
                  : "text-slate-400 hover:text-slate-200")
              }
            >
              Unread ({unreadCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("URGENT")}
              className={
                "px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer " +
                (activeFilter === "URGENT"
                  ? "bg-rose-600/30 text-rose-200 border border-rose-500/40"
                  : "text-slate-400 hover:text-slate-200")
              }
            >
              Urgent ({urgentCount})
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-white/[0.04] p-1.5 custom-scrollbar">
            {filteredNotifications.length === 0 ? (
              <div className="py-12 px-4 flex flex-col items-center justify-center text-center text-slate-500 gap-2">
                <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-purple-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-300">All caught up!</span>
                <span className="text-[11px] text-slate-500 max-w-[220px]">
                  No notifications matching your filter right now.
                </span>
              </div>
            ) : (
              filteredNotifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={
                    "group relative flex items-start gap-3 p-2.5 rounded-xl transition-all cursor-pointer " +
                    (!item.read
                      ? "bg-purple-600/[0.08] hover:bg-purple-600/[0.14] border border-purple-500/25 shadow-sm"
                      : "bg-transparent hover:bg-white/[0.03] border border-transparent")
                  }
                >
                  {/* Category Icon */}
                  <div className="w-8 h-8 rounded-xl bg-[#161A2B] border border-white/[0.08] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    {getNotificationIcon(item.type)}
                  </div>

                  {/* Body Content */}
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1.5 mb-0.5">
                      <span
                        className={
                          "text-xs font-bold truncate leading-snug " +
                          (!item.read ? "text-white" : "text-slate-300")
                        }
                      >
                        {item.title}
                      </span>
                      {!item.read && (
                        <div className="w-2 h-2 rounded-full bg-purple-400 shrink-0 shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
                      )}
                    </div>

                    <p className="text-[11px] text-slate-400 font-medium line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>

                    {/* Metadata Strip */}
                    <div className="flex items-center gap-2 mt-2">
                      {item.tag && (
                        <span
                          className={
                            "px-1.5 py-0.2 rounded text-[9.5px] border " +
                            getPriorityBadgeStyle(item.priority)
                          }
                        >
                          {item.tag}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-500 font-medium">
                        {formatRelativeTime(item.timestamp)}
                      </span>

                      <div className="ml-auto flex items-center gap-1 text-[10px] font-bold text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>Open</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>

                  {/* Dismiss Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      dismiss(item.id);
                    }}
                    title="Dismiss"
                    className="p-1 rounded text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#0D0F18] border-t border-white/[0.06] text-[11px]">
            <button
              type="button"
              onClick={clearAll}
              className="text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                router.push("/calendar");
              }}
              className="text-purple-300 hover:text-white flex items-center gap-1 font-semibold transition-colors cursor-pointer"
            >
              <span>View Full Schedule</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}