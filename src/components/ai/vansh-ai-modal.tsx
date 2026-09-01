"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Paperclip,
  FileText,
  Image as ImageIcon,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Cpu,
  ArrowRight,
} from "lucide-react";

interface ExecutedTool {
  name: string;
  args: any;
  result: any;
}

interface Citation {
  title: string;
  url: string;
  snippet?: string;
}

interface Attachment {
  name: string;
  type: string;
  data: string; // Base64 data URL
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolsExecuted?: ExecutedTool[];
  citations?: Citation[];
  attachments?: Array<{ name: string; type: string }>;
}

export function VanshAIModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [expandedToolIdx, setExpandedToolIdx] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setAttachments((prev) => [
          ...prev,
          {
            name: file.name,
            type: file.type || "application/octet-stream",
            data: base64,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAttachment = (idx: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSendMessage = async (text?: string) => {
    const query = text !== undefined ? text : input;
    if (!query.trim() && attachments.length === 0) return;

    setInput("");
    const currentAttachments = [...attachments];
    setAttachments([]);

    const newUserMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: query.trim() || "Uploaded document for analysis.",
      attachments: currentAttachments.map((a) => ({ name: a.name, type: a.type })),
    };

    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setIsProcessing(true);

    try {
      const apiMessages = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/v1/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          attachments: currentAttachments,
          currentRoute: pathname,
        }),
      });

      const json = await res.json();

      if (json.success) {
        const newAiMsg: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: json.message,
          toolsExecuted: json.executedTools || [],
          citations: json.citations || [],
        };
        setMessages((prev) => [...prev, newAiMsg]);

        // Process any Navigation tools returned by the API
        let targetRoute = json.navigatedTo;
        if (!targetRoute && json.executedTools) {
          const navTool = json.executedTools.find(
            (t: any) => (t.name === "vos_navigate" || t.name === "vos_open_entity") && t.result?.navigatedTo
          );
          if (navTool && navTool.result?.navigatedTo) {
            targetRoute = navTool.result.navigatedTo;
          }
        }

        if (targetRoute) {
          setIsOpen(false);
          router.push(targetRoute);
          return;
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: json.message || "An error occurred during execution.",
          },
        ]);
      }
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Failed to connect to the VOS Gemini AI Engine: " + e.message,
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl rounded-2xl bg-[#0E101A] border border-purple-500/40 shadow-[0_0_50px_rgba(168,85,247,0.35)] overflow-hidden flex flex-col h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#131626] border-b border-white/[0.08] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white tracking-tight leading-none">
                Vansh AI — Autonomous OS Agent
              </h2>
              <span className="text-[10px] text-purple-300 font-semibold mt-1 block">
                Powered by Gemini 2.5 Flash • Live Supabase CRUD & Web Search
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
            <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto opacity-80">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 shadow-lg">
                <Bot className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">VOS Operating System Intelligence</h3>
              <p className="text-xs font-medium text-slate-400 leading-relaxed">
                Give natural-language commands to manage subjects, video topics, weekly timetables, priorities, ATS applications, notes, or search the web.
              </p>

              <div className="flex flex-wrap gap-2 justify-center mt-6">
                <button
                  onClick={() => handleSendMessage("Show my today's timetable schedule")}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[11px] font-semibold text-slate-300 hover:text-white hover:bg-purple-600/20 hover:border-purple-500/30 transition-all cursor-pointer"
                >
                  📅 "Show today's timetable"
                </button>
                <button
                  onClick={() => handleSendMessage("Add DBMS as a subject in Placement")}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[11px] font-semibold text-slate-300 hover:text-white hover:bg-purple-600/20 hover:border-purple-500/30 transition-all cursor-pointer"
                >
                  📚 "Add DBMS to Placement"
                </button>
                <button
                  onClick={() => handleSendMessage("Search the web for latest SSC CGL 2026 notification updates")}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[11px] font-semibold text-slate-300 hover:text-white hover:bg-purple-600/20 hover:border-purple-500/30 transition-all cursor-pointer"
                >
                  🌐 "Search SSC CGL Updates"
                </button>
                <button
                  onClick={() => handleSendMessage("Find my notes about SQL")}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[11px] font-semibold text-slate-300 hover:text-white hover:bg-purple-600/20 hover:border-purple-500/30 transition-all cursor-pointer"
                >
                  🔍 "Find my SQL notes"
                </button>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
              >
                {/* Bubble */}
                <div className="flex items-start gap-3 max-w-[90%]">
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 shrink-0 rounded-xl bg-purple-600/20 flex items-center justify-center border border-purple-500/30 mt-1 shadow-sm">
                      <Bot className="w-4 h-4 text-purple-400" />
                    </div>
                  )}

                  <div className={`flex flex-col gap-2 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                    {/* User Attachment Pills */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-1">
                        {msg.attachments.map((att, i) => (
                          <span
                            key={i}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-900/40 border border-purple-500/30 text-[10px] text-purple-200 font-mono"
                          >
                            <FileText className="w-3 h-3 text-purple-300" />
                            {att.name}
                          </span>
                        ))}
                      </div>
                    )}

                    <div
                      className={`px-4 py-3 rounded-2xl text-[13px] font-medium leading-relaxed whitespace-pre-wrap ${
                        msg.role === "user"
                          ? "bg-purple-600 text-white rounded-tr-sm shadow-md"
                          : "bg-[#141728] border border-white/[0.08] text-slate-200 rounded-tl-sm shadow-md"
                      }`}
                    >
                      {msg.content}
                    </div>

                    {/* Tool Execution Logs */}
                    {msg.toolsExecuted && msg.toolsExecuted.length > 0 && (
                      <div className="flex flex-col gap-1.5 w-full mt-1">
                        {msg.toolsExecuted.map((t, idx) => {
                          const toolKey = `${msg.id}-tool-${idx}`;
                          const isExpanded = expandedToolIdx === toolKey;
                          const isSuccess = t.result?.success !== false;

                          return (
                            <div
                              key={idx}
                              className="flex flex-col p-2.5 rounded-xl bg-[#10131E] text-[11px] font-mono border border-purple-500/20 w-full shadow-sm"
                            >
                              <div
                                onClick={() =>
                                  setExpandedToolIdx(isExpanded ? null : toolKey)
                                }
                                className="flex items-center justify-between cursor-pointer"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="font-bold text-purple-300 truncate">
                                    ⚡ {t.name}()
                                  </span>
                                  <span className="text-[9.5px] text-slate-400 truncate max-w-[200px]">
                                    {t.result?.message || JSON.stringify(t.args)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span
                                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                      isSuccess
                                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                        : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                                    }`}
                                  >
                                    {isSuccess ? "SUCCESS ✓" : "FAILED ✗"}
                                  </span>
                                  {isExpanded ? (
                                    <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                                  ) : (
                                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                                  )}
                                </div>
                              </div>

                              {isExpanded && (
                                <div className="mt-2 pt-2 border-t border-white/[0.06] flex flex-col gap-1 text-[10px] text-slate-400">
                                  <div>
                                    <span className="text-purple-400 font-bold">Args: </span>
                                    <span className="text-slate-300">{JSON.stringify(t.args, null, 2)}</span>
                                  </div>
                                  {t.result?.data && (
                                    <div>
                                      <span className="text-emerald-400 font-bold">Output: </span>
                                      <span className="text-slate-300">{JSON.stringify(t.result.data, null, 2)}</span>
                                    </div>
                                  )}
                                  {t.result?.navigatedTo && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setIsOpen(false);
                                        router.push(t.result.navigatedTo);
                                      }}
                                      className="mt-1 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-[10px] font-bold text-white shadow transition-all cursor-pointer w-fit"
                                    >
                                      <span>🚀 Open: {t.result.navigatedTo}</span>
                                      <ArrowRight className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Direct Screen Navigation Action Button */}
                    {msg.toolsExecuted?.some((t) => t.result?.navigatedTo) && (
                      <button
                        type="button"
                        onClick={() => {
                          const target = msg.toolsExecuted?.find((t) => t.result?.navigatedTo)?.result?.navigatedTo;
                          if (target) {
                            setIsOpen(false);
                            router.push(target);
                          }
                        }}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-900/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer mt-1 w-fit"
                      >
                        <span>🚀 Open Destination Screen</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Web Citation Source Links */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {msg.citations.map((c, i) => (
                          <a
                            key={i}
                            href={c.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-sky-950/40 hover:bg-sky-900/60 border border-sky-500/30 text-[10px] text-sky-300 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span className="truncate max-w-[180px]">{c.title}</span>
                          </a>
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
              <div className="w-7 h-7 shrink-0 rounded-xl bg-purple-600/20 flex items-center justify-center border border-purple-500/30 mt-1">
                <Bot className="w-4 h-4 text-purple-400" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-[#141728] border border-white/[0.08] rounded-tl-sm text-xs font-semibold text-purple-300 animate-pulse flex items-center gap-2 shadow-md">
                <Cpu className="w-4 h-4 animate-spin" />
                <span>Executing VOS Agent Operations...</span>
              </div>
            </div>
          )}
        </div>

        {/* Attachment Preview Strip */}
        {attachments.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-[#121524] border-t border-white/[0.06] overflow-x-auto">
            {attachments.map((att, i) => (
              <span
                key={i}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-600/20 border border-purple-500/30 text-xs text-purple-200 font-medium shrink-0"
              >
                {att.type.includes("image") ? (
                  <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-purple-400" />
                )}
                <span className="truncate max-w-[160px]">{att.name}</span>
                <button
                  type="button"
                  onClick={() => removeAttachment(i)}
                  className="hover:text-white text-slate-400 p-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-3 px-4 py-3 bg-[#121524] border-t border-white/[0.08] shrink-0"
        >
          {/* File Upload Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            multiple
            accept=".pdf,.png,.jpg,.jpeg,.webp,.txt"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Attach PDF or Screenshot"
            className="p-2 rounded-xl text-slate-400 hover:text-purple-300 hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <input
            type="text"
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Command Vansh AI (e.g. Add DBMS, Import timetable, Search web...)"
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-medium"
            disabled={isProcessing}
          />

          <button
            type="submit"
            disabled={isProcessing || (!input.trim() && attachments.length === 0)}
            className="w-8 h-8 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
