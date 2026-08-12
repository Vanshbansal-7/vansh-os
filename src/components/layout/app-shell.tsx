"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { LeftSidebar } from "./left-sidebar";
import { RightSidebar } from "./right-sidebar";
import { TopHeader } from "./top-header";
import { FloatingOmnibar } from "../dashboard/floating-omnibar";
import { UniversalSearchModal } from "../dashboard/universal-search-modal";
import { VanshAIModal } from "../ai/vansh-ai-modal";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isModulePage = pathname.startsWith("/modules") || pathname === "/companies" || pathname === "/documents" || pathname === "/streak";

  return (
    <div className="min-h-screen bg-[#090A10] text-[#F8FAFC] flex justify-center w-full relative">
      {/* Global Universal Search Modal Palette */}
      <UniversalSearchModal />

      {/* Global Vansh AI Operating System Intelligence Overlay */}
      <VanshAIModal />

      <div className="w-full max-w-[1920px] flex min-h-screen">
        {/* Fixed Left Sidebar */}
        <LeftSidebar />

        {/* Center Fluid Command Workspace with generous bottom padding */}
        {isModulePage ? (
          <main className="flex-1 flex flex-col min-w-0 px-4 sm:px-6 pt-4 pb-32 overflow-y-auto h-screen no-scrollbar">
            {children}
            <FloatingOmnibar />
          </main>
        ) : (
          <>
            <main className="flex-1 flex flex-col min-w-0 px-4 sm:px-6 pt-4 pb-32 overflow-y-auto h-screen no-scrollbar">
              <TopHeader />
              <div className="flex flex-col gap-4 mt-2">
                {children}
              </div>
              <FloatingOmnibar />
            </main>
            {/* Fixed Right Context & Telemetry Sidebar for Dashboard */}
            <RightSidebar />
          </>
        )}
      </div>
    </div>
  );
}
