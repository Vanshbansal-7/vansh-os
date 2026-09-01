"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, Timer, Flame, ChevronDown, Bell, Check } from "lucide-react";

type TimerMode = "POMODORO" | "DEEP_WORK" | "STOPWATCH" | "CUSTOM";

const MODE_DEFAULTS: Record<TimerMode, number> = {
  POMODORO: 25 * 60,
  DEEP_WORK: 50 * 60,
  STOPWATCH: 0,
  CUSTOM: 30 * 60,
};

export function StudyTimerWidget() {
  const [mode, setMode] = useState<TimerMode>("POMODORO");
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [stopwatchSeconds, setStopwatchSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [showPresets, setShowPresets] = useState<boolean>(false);

  const startTimeRef = useRef<number | null>(null);
  const baseSecondsRef = useRef<number>(25 * 60);
  const baseStopwatchRef = useRef<number>(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Synthesize soft pleasant chime using Web Audio API
  const playChime = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {}
  }, []);

  // Format MM:SS or HH:MM:SS
  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Switch modes
  const handleSelectMode = (newMode: TimerMode, customDurationSecs?: number) => {
    setIsRunning(false);
    setMode(newMode);
    setShowPresets(false);

    if (newMode === "STOPWATCH") {
      setStopwatchSeconds(0);
      baseStopwatchRef.current = 0;
    } else {
      const dur = customDurationSecs || MODE_DEFAULTS[newMode];
      setSecondsLeft(dur);
      baseSecondsRef.current = dur;
    }
    startTimeRef.current = null;
  };

  // Toggle start / pause
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
      const def = MODE_DEFAULTS[mode];
      setSecondsLeft(def);
      baseSecondsRef.current = def;
    }
  };

  // Timer Tick Engine using Date.now() timestamp math (immune to tab throttling/minimized browser)
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
          baseSecondsRef.current = MODE_DEFAULTS[mode];
          playChime();
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("⏰ Study Focus Complete!", {
              body: `Great session! Take a short break.`,
              icon: "/assets/founder_avatar.png",
            });
          }
        }
      }
    }, 200);

    return () => clearInterval(interval);
  }, [isRunning, mode, playChime]);

  // Update base reference on pause
  useEffect(() => {
    if (!isRunning) {
      if (mode === "STOPWATCH") {
        baseStopwatchRef.current = stopwatchSeconds;
      } else {
        baseSecondsRef.current = secondsLeft;
      }
    }
  }, [isRunning, mode, secondsLeft, stopwatchSeconds]);

  // Browser Tab Title Sync: Works in background & minimized browser window!
  useEffect(() => {
    if (isRunning) {
      const display = mode === "STOPWATCH" ? formatTime(stopwatchSeconds) : formatTime(secondsLeft);
      const icon = mode === "STOPWATCH" ? "⏱️" : "🔴";
      document.title = `(${display}) ${icon} Focus — Vansh OS`;
    } else {
      document.title = "Vansh OS — The Personal Intelligence Operating System";
    }

    return () => {
      document.title = "Vansh OS — The Personal Intelligence Operating System";
    };
  }, [isRunning, secondsLeft, stopwatchSeconds, mode]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowPresets(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentDisplay = mode === "STOPWATCH" ? formatTime(stopwatchSeconds) : formatTime(secondsLeft);

  return (
    <div className="relative flex items-center" ref={dropdownRef}>
      <div
        className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all duration-300 shadow-sm select-none ${
          isRunning
            ? "bg-[#161019] border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.25)] ring-1 ring-red-500/30"
            : "bg-[#101320] hover:bg-[#131728] border-white/[0.08] hover:border-red-500/30"
        }`}
      >
        {/* Red Live Pulse Beacon / Mode Indicator */}
        <div
          onClick={() => setShowPresets(!showPresets)}
          className="flex items-center gap-1.5 cursor-pointer group"
          title="Click to switch modes or presets"
        >
          <div className="relative flex items-center justify-center">
            <span
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                isRunning
                  ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.9)] animate-pulse"
                  : "bg-red-500/50 group-hover:bg-red-400"
              }`}
            />
            {isRunning && (
              <span className="absolute w-4 h-4 rounded-full bg-red-500/30 animate-ping pointer-events-none" />
            )}
          </div>

          <span className="text-[10px] font-bold tracking-wider text-red-400 uppercase hidden md:inline-block">
            {mode === "STOPWATCH" ? "STOPWATCH" : mode === "DEEP_WORK" ? "DEEP WORK" : mode === "POMODORO" ? "POMODORO" : "CUSTOM"}
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

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          {/* Start / Pause Button */}
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

          {/* Reset Button */}
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

      {/* Mode & Duration Preset Dropdown Menu */}
      {showPresets && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 w-56 p-2 rounded-2xl bg-[#111322] border border-red-500/30 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1 text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400">
            Select Focus Mode
          </div>

          <div className="flex flex-col gap-1 mt-1">
            <button
              type="button"
              onClick={() => handleSelectMode("POMODORO", 25 * 60)}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                mode === "POMODORO" ? "bg-red-500/20 text-red-400 border border-red-500/30" : "hover:bg-white/[0.06] text-slate-300"
              }`}
            >
              <span className="flex items-center gap-2">
                <span>🍅 Pomodoro</span>
              </span>
              <span className="font-mono text-[11px] text-slate-400">25m</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectMode("DEEP_WORK", 50 * 60)}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                mode === "DEEP_WORK" ? "bg-red-500/20 text-red-400 border border-red-500/30" : "hover:bg-white/[0.06] text-slate-300"
              }`}
            >
              <span className="flex items-center gap-2">
                <span>🎯 Deep Work</span>
              </span>
              <span className="font-mono text-[11px] text-slate-400">50m</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectMode("STOPWATCH")}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                mode === "STOPWATCH" ? "bg-red-500/20 text-red-400 border border-red-500/30" : "hover:bg-white/[0.06] text-slate-300"
              }`}
            >
              <span className="flex items-center gap-2">
                <span>⏱️ Stopwatch</span>
              </span>
              <span className="font-mono text-[11px] text-slate-400">Count Up</span>
            </button>

            <div className="h-[1px] bg-white/[0.08] my-1" />

            <div className="px-2.5 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400">
              Quick Timers
            </div>

            <div className="grid grid-cols-3 gap-1 mt-1">
              {[15, 30, 45, 60, 90, 120].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => handleSelectMode("CUSTOM", mins * 60)}
                  className="px-2 py-1 rounded-lg bg-white/[0.04] hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 text-[11px] font-mono font-bold text-slate-300 transition-colors border border-white/[0.04]"
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
