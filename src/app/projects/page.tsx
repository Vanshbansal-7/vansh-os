import { FolderGit2, Sparkles } from "lucide-react";

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between p-6 rounded-2xl bg-[#10131E] border border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/30">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Projects Hub</h1>
            <p className="text-xs text-slate-400 mt-0.5">Repositories, architectures, deployments, and ship logs.</p>
          </div>
        </div>
        <span className="text-[11px] font-bold text-blue-300 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30">
          System V1.0
        </span>
      </div>

      <div className="p-8 rounded-2xl bg-[#10131E]/60 border border-dashed border-white/[0.08] flex flex-col items-center justify-center text-center">
        <Sparkles className="w-8 h-8 text-blue-400 mb-3 opacity-60" />
        <h2 className="text-sm font-semibold text-white">Projects Workspace Ready</h2>
        <p className="text-xs text-slate-400 max-w-md mt-1">
          Production routing active for Projects Hub.
        </p>
      </div>
    </div>
  );
}
