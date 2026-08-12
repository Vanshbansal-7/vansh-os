import { Target, Sparkles } from "lucide-react";

export default function MissionPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between p-6 rounded-2xl bg-[#10131E] border border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/30">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Mission Center</h1>
            <p className="text-xs text-slate-400 mt-0.5">Define, track, and execute core founder milestones.</p>
          </div>
        </div>
        <span className="text-[11px] font-bold text-purple-300 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-400/30">
          Active Sprint
        </span>
      </div>

      <div className="p-8 rounded-2xl bg-[#10131E]/60 border border-dashed border-white/[0.08] flex flex-col items-center justify-center text-center">
        <Sparkles className="w-8 h-8 text-purple-400 mb-3 opacity-60" />
        <h2 className="text-sm font-semibold text-white">Mission Engine Ready</h2>
        <p className="text-xs text-slate-400 max-w-md mt-1">
          Module 1 Left Sidebar is active.
        </p>
      </div>
    </div>
  );
}
