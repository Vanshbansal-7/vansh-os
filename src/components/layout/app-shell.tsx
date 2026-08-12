"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { LeftSidebar } from "./left-sidebar";
import { RightSidebar } from "./right-sidebar";
import { TopHeader } from "./top-header";
import { FloatingOmnibar } from "../dashboard/floating-omnibar";
import { UniversalSearchModal } from "../dashboard/universal-search-modal";
import { VanshAIModal } from "../ai/vansh-ai-modal";
import { TerminalOverlay } from "../system/terminal-overlay";
import { useLayoutStore } from "@/store/use-layout-store";
import { PanelLeftOpen, PanelRightOpen } from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isModulePage = pathname.startsWith("/modules") || pathname === "/companies" || pathname === "/documents" || pathname === "/streak";
  
  const { leftSidebarVisible, rightSidebarVisible, toggleLeftSidebar, toggleRightSidebar } = useLayoutStore();
  
  const [isTerminalUnlocked, setIsTerminalUnlocked] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const unlocked = sessionStorage.getItem("terminal_unlocked");
    if (unlocked === "true") {
      setIsTerminalUnlocked(true);
    }
  }, []);

  const handleUnlock = () => {
    sessionStorage.setItem("terminal_unlocked", "true");
    setIsTerminalUnlocked(true);
  };

  if (!isMounted) return null; // Prevent hydration mismatch

  return (
    <>
      {!isTerminalUnlocked && <TerminalOverlay onUnlock={handleUnlock} />}
      
      <div className={`min-h-screen bg-[#090A10] text-[#F8FAFC] flex justify-center w-full relative ${!isTerminalUnlocked ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 transition-opacity duration-1000'}`}>
        {/* Global Universal Search Modal Palette */}
        <UniversalSearchModal />

        {/* Global Vansh AI Operating System Intelligence Overlay */}
        <VanshAIModal />

        <div className="w-full max-w-[1920px] flex min-h-screen relative">
          {/* Fixed Left Sidebar */}
          {leftSidebarVisible && <LeftSidebar />}

          {/* Floating button to restore Left Sidebar */}
          {!leftSidebarVisible && (
            <button
              onClick={toggleLeftSidebar}
              className="fixed left-0 top-1/2 -translate-y-1/2 z-40 p-2 bg-[#10131E] border border-l-0 border-white/10 text-slate-400 hover:text-white rounded-r-xl shadow-xl transition-colors opacity-30 hover:opacity-100"
              title="Show Left Sidebar"
            >
              <PanelLeftOpen className="w-5 h-5" />
            </button>
          )}

          {/* Center Fluid Command Workspace with generous bottom padding */}
          {isModulePage ? (
            <main className="flex-1 flex flex-col min-w-0 px-4 sm:px-6 pt-4 pb-32 overflow-y-auto h-screen no-scrollbar transition-all duration-300">
              {children}
              <FloatingOmnibar />
            </main>
          ) : (
            <>
              <main className="flex-1 flex flex-col min-w-0 px-4 sm:px-6 pt-4 pb-32 overflow-y-auto h-screen no-scrollbar transition-all duration-300">
                <TopHeader />
                <div className="flex flex-col gap-4 mt-2">
                  {children}
                </div>
                <FloatingOmnibar />
              </main>
              {/* Fixed Right Context & Telemetry Sidebar for Dashboard */}
              {rightSidebarVisible && <RightSidebar />}

              {/* Floating button to restore Right Sidebar */}
              {!rightSidebarVisible && !isModulePage && (
                <button
                  onClick={toggleRightSidebar}
                  className="fixed right-0 top-1/2 -translate-y-1/2 z-40 p-2 bg-[#10131E] border border-r-0 border-white/10 text-slate-400 hover:text-white rounded-l-xl shadow-xl transition-colors opacity-30 hover:opacity-100"
                  title="Show Right Sidebar"
                >
                  <PanelRightOpen className="w-5 h-5" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
