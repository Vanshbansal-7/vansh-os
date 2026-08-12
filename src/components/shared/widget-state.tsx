"use client";

import React from "react";
import { AlertCircle, WifiOff, RefreshCw, Inbox } from "lucide-react";

interface WidgetStateProps {
  state: "loading" | "empty" | "error" | "offline";
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
  compact?: boolean;
}

export function WidgetState({
  state,
  title,
  message,
  onRetry,
  className = "",
  compact = false,
}: WidgetStateProps) {
  const padding = compact ? "py-4" : "py-8";

  if (state === "loading") {
    return (
      <div className={`flex flex-col gap-2.5 ${padding} ${className}`}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 animate-pulse">
            <div className="w-8 h-2 rounded-full bg-white/[0.06]" />
            <div className="h-2 rounded-full bg-white/[0.06] flex-1" style={{ opacity: 1 - i * 0.15 }} />
            <div className="w-16 h-2 rounded-full bg-white/[0.04]" />
          </div>
        ))}
      </div>
    );
  }

  if (state === "offline") {
    return (
      <div className={`flex flex-col items-center justify-center gap-2 ${padding} ${className}`}>
        <WifiOff className="w-6 h-6 text-slate-500" />
        <span className="text-xs font-semibold text-slate-500">
          {title || "You're offline"}
        </span>
        <span className="text-[11px] text-slate-600 text-center">
          {message || "Check your connection and try again."}
        </span>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className={`flex flex-col items-center justify-center gap-2.5 ${padding} ${className}`}>
        <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
          <AlertCircle className="w-5 h-5 text-rose-400" />
        </div>
        <div className="text-center">
          <p className="text-xs font-bold text-white">{title || "Something went wrong"}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {message || "Failed to load data."}
          </p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-300 text-xs font-semibold transition-all cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Retry</span>
          </button>
        )}
      </div>
    );
  }

  // empty
  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${padding} ${className}`}>
      <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
        <Inbox className="w-5 h-5 text-slate-500" />
      </div>
      <div className="text-center">
        <p className="text-xs font-bold text-slate-400">{title || "Nothing here yet"}</p>
        <p className="text-[11px] text-slate-600 mt-0.5">
          {message || "Data will appear here once available."}
        </p>
      </div>
    </div>
  );
}
