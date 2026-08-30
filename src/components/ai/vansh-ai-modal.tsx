"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  X,
  Upload,
  Send,
  CheckCircle2,
  FileText,
  Building2,
  Cpu,
  ShieldAlert,
  ArrowRight,
  Bot,
  User,
} from "lucide-react";

interface ExecutedTool {
  name: string;
  args: any;
  result: any;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolsExecuted?: ExecutedTool[];
}

export function VanshAIModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const router = useRouter();
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isProcessing]);

  // Listen to ⌘ J or custom event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "j") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsOpen(true);
      if (customEvent.detail?.query) {
        handleSendMessage(customEvent.detail.query);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-vansh-ai", handleCustomEvent);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-vansh-ai", handleCustomEvent);
    };
  }, [messages]);

  const handleSendMessage = async (text?: string) => {
    const query = text !== undefined ? text : input;
    if (!query.trim()) return;

    setInput("");

    const newUserMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: query.trim(),
    };

    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setIsProcessing(true);

    try {
      // Send the entire conversation history (excluding tool results to keep it simple for now)
      const apiMessages = updatedMessages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch("/api/v1/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });
      
      const json = await res.json();
      
      if (json.success) {
        const newAiMsg: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: json.message,
          toolsExecuted: json.executedTools || [],
        };
        setMessages((prev) => [...prev, newAiMsg]);

        // Process any Navigation tools returned by the API
        if (json.executedTools) {
          const navTool = json.executedTools.find((t: any) => t.name === "navigateToRoute");
          if (navTool && navTool.result?.navigatedTo) {
            setTimeout(() => {
              router.push(navTool.result.navigatedTo);
            }, 500);
          }
        }
      } else {
        // Fallback for API Key missing or error
        setMessages((prev) => [
          ...prev, 
          { id: crypto.randomUUID(), role: "assistant", content: json.message || "An error occurred." }
        ]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev, 
        { id: crypto.randomUUID(), role: "assistant", content: "Failed to connect to the Gemini AI Engine." }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl rounded-2xl bg-[#0E101A] border border-purple-500/40 shadow-[0_0_50px_rgba(168,85,247,0.35)] overflow-hidden flex flex-col h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#131626] border-b border-white/[0.08] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white tracking-tight leading-none">
                Gemini Agent — Vansh OS Intelligence
              </h2>
              <span className="text-[10px] text-purple-300 font-semibold mt-1 block">
                Powered by Gemini 2.5 Flash • True CRUD Execution
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat History Body */}
        <div 
          ref={chatScrollRef}
          className="p-5 flex-1 overflow-y-auto flex flex-col gap-6 no-scrollbar bg-[#090A10]"
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center max-w-sm mx-auto opacity-70">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                <Bot className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">How can I help you?</h3>
              <p className="text-xs font-medium text-slate-400">
                I am now powered by Gemini. Ask me to navigate, create notes, add companies, or set up tasks directly in your OS.
              </p>
              
              <div className="flex flex-wrap gap-2 justify-center mt-6">
                <button
                  onClick={() => handleSendMessage("Navigate to my companies ATS page.")}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] font-semibold text-slate-300 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
                >
                  "Open Companies ATS"
                </button>
                <button
                  onClick={() => handleSendMessage("Create a new note in the Placement module called 'Interview Tips'")}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] font-semibold text-slate-300 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
                >
                  "Create Placement Note"
                </button>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                
                {/* Bubble */}
                <div className="flex items-start gap-3 max-w-[85%]">
                  {msg.role === "assistant" && (
                    <div className="w-6 h-6 shrink-0 rounded-lg bg-purple-600/20 flex items-center justify-center border border-purple-500/30 mt-1">
                      <Bot className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                  )}
                  
                  <div className={`flex flex-col gap-2 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                    <div 
                      className={`px-4 py-2.5 rounded-2xl text-[13px] font-medium leading-relaxed whitespace-pre-wrap ${
                        msg.role === "user" 
                          ? "bg-purple-600 text-white rounded-tr-sm shadow-sm"
                          : "bg-[#141728] border border-white/[0.08] text-slate-200 rounded-tl-sm shadow-sm"
                      }`}
                    >
                      {msg.content}
                    </div>

                    {/* Tool Execution Logs */}
                    {msg.toolsExecuted && msg.toolsExecuted.length > 0 && (
                      <div className="flex flex-col gap-1.5 w-full mt-1">
                        {msg.toolsExecuted.map((t, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 rounded-xl bg-[#10131E] text-[11px] font-mono border border-purple-500/20 w-full shadow-sm"
                          >
                            <div className="flex flex-col min-w-0">
                              <span className="font-bold text-purple-300 truncate">⚡ {t.name}()</span>
                              <span className="text-[9px] text-slate-500 truncate">
                                {JSON.stringify(t.args)}
                              </span>
                            </div>
                            <span className="text-[10px] text-emerald-400 font-bold shrink-0 ml-3">
                              {t.result?.success ? "SUCCESS ✓" : "FAILED ✗"}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 shrink-0 rounded-lg bg-purple-600/20 flex items-center justify-center border border-purple-500/30 mt-1">
                <Bot className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <div className="px-4 py-2.5 rounded-2xl bg-[#141728] border border-white/[0.08] rounded-tl-sm text-xs font-semibold text-purple-300 animate-pulse flex items-center gap-2">
                <Cpu className="w-4 h-4 animate-spin" />
                <span>Thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-3 px-4 py-3 bg-[#121524] border-t border-white/[0.08] shrink-0"
        >
          <input
            type="text"
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Gemini to navigate, create notes, or add companies..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-medium"
            disabled={isProcessing}
          />

          <button
            type="submit"
            disabled={isProcessing || !input.trim()}
            className="w-8 h-8 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white flex items-center justify-center transition-all shrink-0 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
