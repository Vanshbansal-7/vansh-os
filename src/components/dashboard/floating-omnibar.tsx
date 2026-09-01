"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";

interface FloatingOmnibarProps {
  onOpenAI?: (initialQuery?: string) => void;
}

export function FloatingOmnibar({ onOpenAI }: FloatingOmnibarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = query.trim();
    // Dispatch ⌘ J event to open Vansh AI Modal
    window.dispatchEvent(
      new CustomEvent("open-vansh-ai", { detail: { query: q } })
    );
    onOpenAI?.(q);
    setQuery("");
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-xl px-4 pointer-events-none">
      <form
        onSubmit={handleSubmit}
        className="pointer-events-auto flex items-center justify-between w-full h-12 px-3.5 rounded-full bg-[#131726]/95 border border-purple-500/40 shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(139,92,246,0.3)] backdrop-blur-xl transition-all focus-within:border-purple-400 focus-within:shadow-[0_10px_40px_rgba(0,0,0,0.9),0_0_25px_rgba(139,92,246,0.5)]"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300 shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={query}
            onFocus={() => {
              window.dispatchEvent(
                new CustomEvent("open-vansh-ai", { detail: { query } })
              );
              onOpenAI?.(query);
            }}
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent("open-vansh-ai", { detail: { query } })
              );
              onOpenAI?.(query);
            }}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask Raj anything... (e.g. Open Placement, Raj what's my schedule)"
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-white/[0.06] border border-white/[0.08] text-[10px] font-mono font-bold text-slate-400">
            <span>Ctrl</span>
            <span>+</span>
            <span>J</span>
          </div>

          <button
            type="submit"
            aria-label="Ask Vansh AI"
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
