"use client";

import React from "react";
import { useDailyGitaVerse } from "@/hooks/use-daily-gita-verse";
import { Sparkles } from "lucide-react";

export function MissionHeroCard() {
  const { verse, isLoading } = useDailyGitaVerse();

  const chapterNum = verse?.chapter ?? 2;
  const verseNum = verse?.verse ?? 47;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-purple-500/35 bg-[#100D22] p-6 sm:p-7 shadow-[0_8px_32px_rgba(0,0,0,0.5)] group min-h-[175px] flex flex-col justify-center">
      {/* Official Bhagavad Gita Sacred Artwork Background */}
      <div
        className="absolute inset-0 bg-cover opacity-75 pointer-events-none rounded-2xl transition-transform duration-1000 group-hover:scale-[1.02]"
        style={{
          backgroundImage: "url('/assets/gita_card_bg.png')",
          backgroundPosition: "center 30%",
        }}
      />

      {/* Layered Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B0916]/95 via-[#120E28]/85 to-[#0B0916]/65 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0916]/90 via-transparent to-[#0B0916]/40 pointer-events-none" />

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col items-center text-center justify-center py-1 gap-2.5">
        {isLoading && !verse ? (
          <div className="flex flex-col items-center gap-3 w-full max-w-2xl animate-pulse py-2">
            <div className="h-5 bg-amber-200/20 rounded-full w-32 mb-1" />
            <div className="h-6 bg-amber-200/20 rounded-md w-3/4" />
            <div className="w-24 h-[1px] bg-amber-400/30 my-1" />
            <div className="h-4 bg-purple-300/20 rounded w-1/3" />
            <div className="h-4 bg-slate-300/20 rounded w-4/5 mt-1" />
          </div>
        ) : (
          <>
            {/* Today's Wisdom Premium Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[10.5px] font-bold tracking-wider backdrop-blur-sm shadow-sm">
              <Sparkles className="w-3 h-3" />
              <span>Today&apos;s Wisdom</span>
            </div>

            {/* Chapter & Verse — English numerals */}
            <p className="text-[11px] font-semibold text-purple-300/90 tracking-widest uppercase">
              Chapter {chapterNum} &bull; Verse {verseNum}
            </p>

            {/* Sanskrit Verse — Devanagari */}
            <p className="text-lg sm:text-xl lg:text-[22px] font-bold text-amber-100/95 tracking-wide leading-relaxed font-serif drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] max-w-3xl whitespace-pre-line">
              {verse?.sanskrit ||
                "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥"}
            </p>

            {/* Thin Elegant Separator */}
            <div className="w-28 sm:w-36 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent shadow-sm" />

            {/* Hindi Meaning */}
            <p className="text-xs sm:text-sm text-slate-200/90 font-medium leading-relaxed max-w-3xl drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] px-2">
              {verse?.hindi_meaning ||
                "तेरा अधिकार केवल कर्म करने में है, उसके फलों में कभी नहीं। इसलिए तू कर्मफल का हेतु मत बन और न ही तेरी अकर्मण्यता में आसक्ति हो।"}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
