"use client";

import { useState, useEffect } from "react";

export interface TimeLog {
  id: string;
  taskId: string;
  taskTitle: string;
  date: string; // YYYY-MM-DD
  durationSeconds: number;
}

export interface ActiveSession {
  taskId: string;
  taskTitle: string;
  startTime: number; // timestamp
  accumulatedSeconds: number; // time from previous pauses
  isPaused: boolean;
}

export function useTimeTracker() {
  const [logs, setLogs] = useState<TimeLog[]>([]);
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [currentElapsed, setCurrentElapsed] = useState(0);

  // Load from localStorage on mount
  useEffect(() => {
    const storedLogs = localStorage.getItem("vos_time_logs");
    if (storedLogs) setLogs(JSON.parse(storedLogs));

    const storedSession = localStorage.getItem("vos_active_session");
    if (storedSession) {
      setActiveSession(JSON.parse(storedSession));
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem("vos_time_logs", JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    if (activeSession) {
      localStorage.setItem("vos_active_session", JSON.stringify(activeSession));
    } else {
      localStorage.removeItem("vos_active_session");
    }
  }, [activeSession]);

  // Tick the timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeSession && !activeSession.isPaused) {
      interval = setInterval(() => {
        const now = Date.now();
        const diff = Math.floor((now - activeSession.startTime) / 1000);
        setCurrentElapsed(activeSession.accumulatedSeconds + diff);
      }, 1000);
    } else if (activeSession && activeSession.isPaused) {
      setCurrentElapsed(activeSession.accumulatedSeconds);
    } else {
      setCurrentElapsed(0);
    }

    return () => clearInterval(interval);
  }, [activeSession]);

  const startSession = (taskId: string, taskTitle: string) => {
    // If starting a different task while one is active, end the current one first
    if (activeSession && activeSession.taskId !== taskId) {
      endSession();
    }

    setActiveSession({
      taskId,
      taskTitle,
      startTime: Date.now(),
      accumulatedSeconds: 0,
      isPaused: false,
    });
  };

  const pauseSession = () => {
    if (!activeSession || activeSession.isPaused) return;
    
    const now = Date.now();
    const diff = Math.floor((now - activeSession.startTime) / 1000);
    
    setActiveSession(prev => prev ? {
      ...prev,
      accumulatedSeconds: prev.accumulatedSeconds + diff,
      isPaused: true,
    } : null);
  };

  const resumeSession = () => {
    if (!activeSession || !activeSession.isPaused) return;
    setActiveSession(prev => prev ? {
      ...prev,
      startTime: Date.now(),
      isPaused: false,
    } : null);
  };

  const endSession = () => {
    if (!activeSession) return;
    
    let totalSeconds = activeSession.accumulatedSeconds;
    if (!activeSession.isPaused) {
      const diff = Math.floor((Date.now() - activeSession.startTime) / 1000);
      totalSeconds += diff;
    }

    if (totalSeconds > 0) {
      const today = new Date().toISOString().split("T")[0];
      const newLog: TimeLog = {
        id: crypto.randomUUID(),
        taskId: activeSession.taskId,
        taskTitle: activeSession.taskTitle,
        date: today,
        durationSeconds: totalSeconds,
      };
      setLogs(prev => [newLog, ...prev]);
    }

    setActiveSession(null);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return {
    logs,
    activeSession,
    currentElapsed,
    startSession,
    pauseSession,
    resumeSession,
    endSession,
    clearLogs,
  };
}
