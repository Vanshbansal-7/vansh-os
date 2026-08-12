"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function TerminalEntryPage() {
  const router = useRouter();
  
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<React.ReactNode[]>([
    "NEURAL PROFILE SYS.V.1.0",
    "Initializing secure connection...",
    "> type 'help' for available commands"
  ]);
  const [isAwaitingPassword, setIsAwaitingPassword] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // Keep focus on input
  useEffect(() => {
    const focusInput = () => inputRef.current?.focus();
    document.addEventListener("click", focusInput);
    focusInput();
    return () => document.removeEventListener("click", focusInput);
  }, []);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    if (isAwaitingPassword) {
      setHistory(prev => [...prev, `> ${'*'.repeat(cmd.length)}`]);
      if (cmd === "2005") {
        setHistory(prev => [
          ...prev, 
          <span key={Date.now()} className="text-[#00ff41] font-bold">ACCESS GRANTED. INITIALIZING SYSTEM...</span>
        ]);
        
        // Set cookies and redirect
        document.cookie = "vos_founder_code=2005; path=/; max-age=31536000; SameSite=Lax";
        document.cookie = "vansh_founder_auth=2005; path=/; max-age=31536000; SameSite=Lax";
        
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1500);
      } else {
        setHistory(prev => [
          ...prev, 
          <span key={Date.now()} className="text-red-500 font-bold">ACCESS DENIED. INCORRECT CODE.</span>
        ]);
        setIsAwaitingPassword(false);
      }
      return;
    }

    setHistory(prev => [...prev, `> ${cmd}`]);

    switch (trimmedCmd) {
      case "help":
        setHistory(prev => [...prev, 
          "AVAILABLE COMMANDS:",
          "  identity  → who is operating this system",
          "  systems   → how the system is built",
          "  chaos     → unstable / experimental modules",
          "  contact   → direct access channels",
          "  clear     → reset active interface",
          "  exit      → terminate session",
          "  enter     → ENTER THE OS"
        ]);
        break;
      case "identity":
        setHistory(prev => [...prev, 
          <div key={Date.now()} className="border border-[#00ff41] p-4 max-w-lg my-4 bg-black/50 backdrop-blur-sm shadow-[0_0_15px_rgba(0,255,65,0.2)]">
            <h3 className="font-bold border-b border-[#00ff41]/40 pb-2 mb-2">NEURAL PROFILE <span className="float-right text-xs">SYS.V.1.0</span></h3>
            <p><strong>ID:</strong> VANSH</p>
            <p><strong>CLASS:</strong> ARCHITECT / DEV</p>
            <p><strong>STATUS:</strong> ONLINE</p>
            <p className="mt-4 italic opacity-80">"I don't just write code. I build systems that live."</p>
            <p className="mt-4 text-xs opacity-70">Specializing in Agentic AI, High-Performance WebGL, and Experimental UI/UX.</p>
          </div>
        ]);
        break;
      case "systems":
        setHistory(prev => [...prev, "System built with Next.js, Supabase, and Agentic Intelligence."]);
        break;
      case "chaos":
        setHistory(prev => [...prev, <span key={Date.now()} className="text-amber-500">WARNING: UNSTABLE MODULES DETECTED... Some systems are not accessible.</span>]);
        break;
      case "contact":
        setHistory(prev => [...prev, "Direct Channels:", "→ GitHub: Vanshbansal-7", "→ Transmission protocol ready."]);
        break;
      case "clear":
        setHistory([]);
        break;
      case "exit":
        setHistory(prev => [...prev, "Terminating session...", "Goodbye."]);
        setTimeout(() => window.close(), 1000);
        break;
      case "enter":
        setHistory(prev => [...prev, "AUTHENTICATION REQUIRED.", "Enter Founder Code:"]);
        setIsAwaitingPassword(true);
        break;
      case "":
        break;
      default:
        setHistory(prev => [...prev, `UNKNOWN COMMAND: '${cmd}'. Type 'help' for available commands.`]);
        break;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(input);
      setInput("");
    }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-mono text-[#00ff41]">
      
      {/* Animated Wireframe Sphere Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-60">
        <div className="relative w-64 h-64 sm:w-96 sm:h-96">
          {/* Inner solid glowing sphere */}
          <div className="absolute inset-0 rounded-full bg-[#52b144] shadow-[0_0_80px_#52b144] animate-pulse opacity-90" style={{ transform: "scale(0.85)" }}></div>
          
          {/* Outer wireframe lines (simulated via rotated borders) */}
          <div className="absolute inset-0 border border-[#00ff41]/40 rounded-full animate-[spin_10s_linear_infinite]" style={{ transform: "rotateX(75deg)" }}></div>
          <div className="absolute inset-0 border border-[#00ff41]/40 rounded-full animate-[spin_15s_linear_infinite_reverse]" style={{ transform: "rotateY(75deg)" }}></div>
          <div className="absolute inset-0 border border-[#00ff41]/40 rounded-full animate-[spin_20s_linear_infinite]" style={{ transform: "rotateZ(45deg) rotateX(45deg)" }}></div>
          <div className="absolute inset-0 border border-[#00ff41]/40 rounded-full animate-[spin_12s_linear_infinite_reverse]" style={{ transform: "rotateZ(-45deg) rotateY(45deg)" }}></div>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="relative z-10 w-full h-full p-4 sm:p-8 flex flex-col overflow-y-auto custom-scrollbar">
        
        {/* Status bar */}
        <div className="absolute top-4 right-8 text-xs opacity-70 tracking-widest hidden sm:block">
          SYS.STATUS: OPTIMAL
        </div>

        <div className="flex-1 mt-12 sm:mt-24 max-w-4xl">
          {history.map((line, i) => (
            <div key={i} className="mb-1 leading-relaxed">
              {line}
            </div>
          ))}
          
          <div className="flex items-center mt-2">
            <span className="mr-2 text-[#00ff41]">{isAwaitingPassword ? 'CODE:' : '>'}</span>
            <input
              ref={inputRef}
              type={isAwaitingPassword ? "password" : "text"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-[#00ff41] font-mono shadow-none"
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
          </div>
          <div ref={bottomRef} />
        </div>
      </div>
      
      {/* Scanline overlay effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-50 opacity-20"></div>
    </div>
  );
}
