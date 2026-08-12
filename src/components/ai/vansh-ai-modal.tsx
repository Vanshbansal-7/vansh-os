"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { AIResponsePayload } from "@/lib/ai/vansh-ai-engine";

export function VanshAIModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<AIResponsePayload | null>(null);
  const [selectedFile, setSelectedFile] = useState<{ name: string; type: string } | null>(null);
  const router = useRouter();

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
        setQuery(customEvent.detail.query);
        handleExecute(customEvent.detail.query);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-vansh-ai", handleCustomEvent);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-vansh-ai", handleCustomEvent);
    };
  }, []);

  const handleExecute = async (inputQuery?: string) => {
    const q = inputQuery !== undefined ? inputQuery : query;
    if (!q.trim() && !selectedFile) return;

    setIsProcessing(true);
    setResponse(null);

    try {
      const res = await fetch("/api/v1/ai/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, attachment: selectedFile }),
      });
      const json = await res.json();
      if (json.success) {
        setResponse(json.data);
        // Execute navigation tool if present
        const navTool = json.data.executed_tools?.find((t: any) => t.name === "openModule");
        if (navTool?.result?.data?.route) {
          setTimeout(() => {
            router.push(navTool.result.data.route);
          }, 800);
        }
      }
    } catch (_) {
      setResponse({
        message: "Failed to connect to Vansh AI Engine.",
        executed_tools: [],
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl rounded-2xl bg-[#0E101A] border border-purple-500/40 shadow-[0_0_50px_rgba(168,85,247,0.35)] overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#131626] border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white tracking-tight leading-none">
                Vansh AI — Operating System Intelligence Layer
              </h2>
              <span className="text-[10px] text-purple-300 font-semibold mt-1 block">
                Multi-Module Tool Calling • Document OCR • WhatsApp Screenshot Intelligence
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

        {/* Content Body */}
        <div className="p-5 flex-1 overflow-y-auto flex flex-col gap-4 no-scrollbar">
          {/* Quick Preset Prompts */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => {
                setQuery("Open Placement");
                handleExecute("Open Placement");
              }}
              className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-purple-600/20 border border-white/[0.08] hover:border-purple-500/40 text-[11px] font-semibold text-slate-300 hover:text-purple-300 transition-all shrink-0 cursor-pointer"
            >
              Open Placement
            </button>
            <button
              onClick={() => {
                setQuery("Open Companies");
                handleExecute("Open Companies");
              }}
              className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-purple-600/20 border border-white/[0.08] hover:border-purple-500/40 text-[11px] font-semibold text-slate-300 hover:text-purple-300 transition-all shrink-0 cursor-pointer"
            >
              Open Companies
            </button>
            <button
              onClick={() => {
                setSelectedFile({ name: "WhatsApp_Interview_Chat.png", type: "PNG" });
                setQuery("Parse WhatsApp interview screenshot");
                handleExecute("Parse WhatsApp interview screenshot");
              }}
              className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-purple-600/20 border border-white/[0.08] hover:border-purple-500/40 text-[11px] font-semibold text-slate-300 hover:text-purple-300 transition-all shrink-0 cursor-pointer"
            >
              Parse WhatsApp Chat Screenshot
            </button>
            <button
              onClick={() => {
                setSelectedFile({ name: "Aadhaar_Card.pdf", type: "PDF" });
                setQuery("Extract Aadhaar OCR info");
                handleExecute("Extract Aadhaar OCR info");
              }}
              className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-purple-600/20 border border-white/[0.08] hover:border-purple-500/40 text-[11px] font-semibold text-slate-300 hover:text-purple-300 transition-all shrink-0 cursor-pointer"
            >
              Extract Aadhaar OCR
            </button>
          </div>

          {/* Attachment Preview Badge */}
          {selectedFile && (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-xs text-purple-200">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                <span className="font-bold">{selectedFile.name}</span>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center gap-3 text-xs font-semibold text-purple-300 animate-pulse">
              <Cpu className="w-4 h-4 animate-spin" />
              <span>Analyzing OS intent and executing registered tools...</span>
            </div>
          )}

          {/* AI Response Output */}
          {response && (
            <div className="flex flex-col gap-3 p-4 rounded-2xl bg-[#141728] border border-white/[0.08]">
              <p className="text-xs font-semibold text-white leading-relaxed whitespace-pre-line">
                {response.message}
              </p>

              {/* Tool Execution Logs */}
              {response.executed_tools && response.executed_tools.length > 0 && (
                <div className="flex flex-col gap-1.5 pt-2 border-t border-white/[0.06]">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Executed OS Tools
                  </span>
                  {response.executed_tools.map((t, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-[#0E101A] text-[11px] font-mono text-purple-300 border border-white/[0.04]"
                    >
                      <span className="font-bold">{t.name}()</span>
                      <span className="text-[10px] text-emerald-400">SUCCESS ✓</span>
                    </div>
                  ))}
                </div>
              )}

              {/* OCR Structured Entities Grid */}
              {response.ocr_result && (
                <div className="flex flex-col gap-2 p-3 rounded-xl bg-[#0E101A] border border-white/[0.06] mt-1">
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                    Extracted {response.ocr_result.document_type} Structured Data
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(response.ocr_result.entities).map(([key, val]) => (
                      <div key={key} className="flex flex-col">
                        <span className="text-[10px] text-slate-500 font-semibold">{key}</span>
                        <span className="font-bold text-white">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Confirmation Dialog for Destructive or Write Actions */}
              {response.requires_confirmation && response.confirmation_data && (
                <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 flex flex-col gap-2 mt-2">
                  <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>Founder Confirmation Required</span>
                  </div>
                  <p className="text-[11.5px] text-slate-300 font-medium">
                    Would you like Vansh AI to automatically add <strong>{response.confirmation_data.payload.company_name}</strong> to your Companies ATS Module?
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => {
                        router.push("/companies");
                        setIsOpen(false);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all cursor-pointer"
                    >
                      Confirm & Add Company
                    </button>
                    <button
                      onClick={() => setResponse(null)}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 text-xs font-medium cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleExecute();
          }}
          className="flex items-center gap-3 px-4 py-3 bg-[#121524] border-t border-white/[0.08]"
        >
          <label
            htmlFor="file-upload"
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
            title="Attach Document or Screenshot"
          >
            <Upload className="w-4 h-4" />
            <input
              id="file-upload"
              type="file"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setSelectedFile({ name: f.name, type: f.name.split(".").pop()?.toUpperCase() || "FILE" });
              }}
              className="hidden"
            />
          </label>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask Vansh AI (e.g. Open Placement, Search Resume, Extract Aadhaar)..."
            className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none font-medium"
          />

          <button
            type="submit"
            className="w-8 h-8 rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center transition-all shrink-0 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
