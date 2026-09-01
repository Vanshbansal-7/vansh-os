"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, ChevronDown, Check } from "lucide-react";

type ModeType = "TIMER" | "STOPWATCH";

const PRESET_MINUTES = [15, 25, 30, 45, 60, 90];

export function StudyTimerWidget() {
  const [mode, setMode] = useState<ModeType>("TIMER");
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [stopwatchSeconds, setStopwatchSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [customMinsInput, setCustomMinsInput] = useState<string>("");

  const startTimeRef = useRef<number | null>(null);
  const baseSecondsRef = useRef<number>(25 * 60);
  const baseStopwatchRef = useRef<number>(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Synthesize soft chime using Web Audio API
  const playChime = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {}
  }, []);

  // Format time display
  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Switch mode to Timer with specified minutes
  const setTimerMinutes = (mins: number) => {
    setIsRunning(false);
    setMode("TIMER");
    const dur = Math.max(1, mins) * 60;
    setSecondsLeft(dur);
    baseSecondsRef.current = dur;
    startTimeRef.current = null;
    setShowDropdown(false);
  };

  // Switch to Stopwatch
  const switchToStopwatch = () => {
    setIsRunning(false);
    setMode("STOPWATCH");
    setStopwatchSeconds(0);
    baseStopwatchRef.current = 0;
    startTimeRef.current = null;
    setShowDropdown(false);
  };

  // Set Custom Timer from input
  const handleSetCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customMinsInput, 10);
    if (!isNaN(val) && val > 0 && val <= 720) {
      setTimerMinutes(val);
      setCustomMinsInput("");
    }
  };

  // Toggle Start / Pause
  const togglePlay = () => {
    if (!isRunning) {
      startTimeRef.current = Date.now();
      setIsRunning(true);
    } else {
      setIsRunning(false);
      startTimeRef.current = null;
    }
  };

  // Reset
  const handleReset = () => {
    setIsRunning(false);
    startTimeRef.current = null;
    if (mode === "STOPWATCH") {
      setStopwatchSeconds(0);
      baseStopwatchRef.current = 0;
    } else {
      setSecondsLeft(baseSecondsRef.current);
    }
  };

  // Precision Timer loop using Date.now() timestamp math (never drifts in minimized tab)
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      if (!startTimeRef.current) return;
      const elapsedSecs = Math.floor((Date.now() - startTimeRef.current) / 1000);

      if (mode === "STOPWATCH") {
        setStopwatchSeconds(baseStopwatchRef.current + elapsedSecs);
      } else {
        const remaining = Math.max(0, baseSecondsRef.current - elapsedSecs);
        setSecondsLeft(remaining);

        if (remaining === 0) {
          setIsRunning(false);
          startTimeRef.current = null;
          playChime();
        }
      }
    }, 200);

    return () => clearInterval(interval);
  }, [isRunning, mode, playChime]);

  // Update base seconds on pause
  useEffect(() => {
    if (!isRunning) {
      if (mode === "STOPWATCH") {
        baseStopwatchRef.current = stopwatchSeconds;
      } else {
        baseSecondsRef.current = secondsLeft;
      }
    }
  }, [isRunning, mode, secondsLeft, stopwatchSeconds]);

  // Browser Tab Title Sync: Works in minimized & background tabs
  useEffect(() => {
    if (isRunning) {
      const display = mode === "STOPWATCH" ? formatTime(stopwatchSeconds) : formatTime(secondsLeft);
      const icon = mode === "STOPWATCH" ? "⏱️" : "🔴";
      document.title = `(${display}) ${icon} Study — Vansh OS`;
    } else {
      document.title = "Vansh OS — The Personal Intelligence Operating System";
    }

    return () => {
      document.title = "Vansh OS — The Personal Intelligence Operating System";
    };
  }, [isRunning, secondsLeft, stopwatchSeconds, mode]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentDisplay = mode === "STOPWATCH" ? formatTime(stopwatchSeconds) : formatTime(secondsLeft);

  return (
    <div className="relative flex items-center" ref={dropdownRef}>
      <div
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-300 shadow-sm select-none ${
          isRunning
            ? "bg-[#161019] border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.25)] ring-1 ring-red-500/30"
            : "bg-[#101320] hover:bg-[#131728] border-white/[0.08] hover:border-red-500/30"
        }`}
      >
        {/* Red Beacon & Mode Selector */}
        <div
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-1.5 cursor-pointer group"
          title="Click to switch between Timer, Stopwatch & Custom minutes"
        >
          <div className="relative flex items-center justify-center">
            <span
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                isRunning
                  ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.9)] animate-pulse"
                  : "bg-red-500/60 group-hover:bg-red-400"
              }`}
            />
            {isRunning && (
              <span className="absolute w-4 h-4 rounded-full bg-red-500/30 animate-ping pointer-events-none" />
            )}
          </div>

          <span className="text-[10px] font-bold tracking-wider text-red-400 uppercase hidden md:inline-block">
            {mode}
          </span>
          <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-red-400 transition-colors" />
        </div>

        {/* Digital Time Counter */}
        <div
          onClick={togglePlay}
          className="cursor-pointer font-mono font-extrabold text-sm sm:text-base tracking-wider px-1 text-white hover:text-red-300 transition-colors"
          title={isRunning ? "Click to Pause" : "Click to Start"}
        >
          <span className={isRunning ? "text-red-400 drop-shadow-[0_0_6px_rgba(239,68,68,0.6)]" : "text-slate-100"}>
            {currentDisplay}
          </span>
        </div>

        {/* Play / Reset Action Buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isRunning ? "Pause timer" : "Start timer"}
            className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              isRunning
                ? "bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30"
                : "bg-red-600 hover:bg-red-500 text-white shadow-sm hover:scale-105"
            }`}
          >
            {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 translate-x-0.2" />}
          </button>

          <button
            type="button"
            onClick={handleReset}
            aria-label="Reset timer"
            className="w-6 h-6 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            title="Reset"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Mode & Custom Timer Menu */}
      {showDropdown && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 w-56 p-2.5 rounded-2xl bg-[#111322] border border-red-500/30 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400">
            Study Modes
          </div>

          <div className="flex flex-col gap-1 mt-1">
            <button
              type="button"
              onClick={() => setTimerMinutes(25)}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                mode === "TIMER" ? "bg-red-500/20 text-red-400 border border-red-500/30" : "hover:bg-white/[0.06] text-slate-300"
              }`}
            >
              <span>⏳ Countdown Timer</span>
              {mode === "TIMER" && <Check className="w-3.5 h-3.5 text-red-400" />}
            </button>

            <button
              type="button"
              onClick={switchToStopwatch}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                mode === "STOPWATCH" ? "bg-red-500/20 text-red-400 border border-red-500/30" : "hover:bg-white/[0.06] text-slate-300"
              }`}
            >
              <span>⏱️ Stopwatch (Count Up)</span>
              {mode === "STOPWATCH" && <Check className="w-3.5 h-3.5 text-red-400" />}
            </button>
          </div>

          <div className="h-[1px] bg-white/[0.08] my-2" />

          {/* Quick Preset Buttons */}
          <div className="px-2 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400">
            Quick Timer Presets
          </div>
          <div className="grid grid-cols-3 gap-1.5 mt-1">
            {PRESET_MINUTES.map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setTimerMinutes(mins)}
                className="px-2 py-1 rounded-lg bg-white/[0.04] hover:bg-red-500/20 hover:text-red-400 text-[11px] font-mono font-bold text-slate-300 transition-colors border border-white/[0.04]"
              >
                {mins}m
              </button>
            ))}
          </div>

          <div className="h-[1px] bg-white/[0.08] my-2" />

          {/* Custom Minute Input */}
          <form onSubmit={handleSetCustom} className="flex flex-col gap-1 px-1">
            <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400">
              Custom Timer (Minutes)
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <input
                type="number"
                min="1"
                max="720"
                value={customMinsInput}
                onChange={(e) => setCustomMinsInput(e.target.value)}
                placeholder="e.g. 35"
                className="flex-1 h-7 px-2 rounded-lg bg-white/[0.05] border border-white/[0.1] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500/50"
              />
              <button
                type="submit"
                className="h-7 px-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold transition-all shadow-sm cursor-pointer"
              >
                Set
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
