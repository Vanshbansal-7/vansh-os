import { Layers, Sparkles } from "lucide-react";

export default function ResourcesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between p-6 rounded-2xl bg-[#10131E] border border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Resources</h1>
            <p className="text-xs text-slate-400 mt-0.5">Curated bookmarks, PDFs, references, and study material.</p>
          </div>
        </div>
      </div>

      <div className="p-8 rounded-2xl bg-[#10131E]/60 border border-dashed border-white/[0.08] flex flex-col items-center justify-center text-center">
        <Sparkles className="w-8 h-8 text-cyan-400 mb-3 opacity-60" />
        <h2 className="text-sm font-semibold text-white">Resources Bank Ready</h2>
        <p className="text-xs text-slate-400 max-w-md mt-1">
          Connected to Left Sidebar navigation.
        </p>
      </div>
    </div>
  );
}
