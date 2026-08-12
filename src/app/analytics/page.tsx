import { BarChart3, Sparkles } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between p-6 rounded-2xl bg-[#10131E] border border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Analytics</h1>
            <p className="text-xs text-slate-400 mt-0.5">Execution scores, focus tracking, and discipline velocity.</p>
          </div>
        </div>
      </div>

      <div className="p-8 rounded-2xl bg-[#10131E]/60 border border-dashed border-white/[0.08] flex flex-col items-center justify-center text-center">
        <Sparkles className="w-8 h-8 text-emerald-400 mb-3 opacity-60" />
        <h2 className="text-sm font-semibold text-white">Analytics Telemetry Active</h2>
        <p className="text-xs text-slate-400 max-w-md mt-1">
          Real telemetry endpoints connected to Left Sidebar.
        </p>
      </div>
    </div>
  );
}
