import { Calendar as CalendarIcon, Sparkles } from "lucide-react";

export default function CalendarPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between p-6 rounded-2xl bg-[#10131E] border border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-pink-500/20 text-pink-300 border border-pink-400/30">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Calendar & Time Horizons</h1>
            <p className="text-xs text-slate-400 mt-0.5">Schedules, deadlines, daily time-blocks, and exams.</p>
          </div>
        </div>
      </div>

      <div className="p-8 rounded-2xl bg-[#10131E]/60 border border-dashed border-white/[0.08] flex flex-col items-center justify-center text-center">
        <Sparkles className="w-8 h-8 text-pink-400 mb-3 opacity-60" />
        <h2 className="text-sm font-semibold text-white">Calendar Engine Connected</h2>
        <p className="text-xs text-slate-400 max-w-md mt-1">
          Real time blocks synchronized with right sidebar mini-calendar.
        </p>
      </div>
    </div>
  );
}
