import { Clock, Target, Coffee } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/server";
import { PageTransition } from "@/components/ui/page-transition";
import { EmptyState } from "@/components/ui/empty-state";
import { AddSessionDialog } from "@/components/mission/add-session-dialog";
import { EditMissionDialog } from "@/components/mission/edit-mission-dialog";
import { SessionItem } from "@/components/mission/session-item";

export default async function MissionEngine() {
  const supabase = await createClient();
  let mission: any = null;
  let sessions: any[] = [];
  
  try {
    const today = new Date().toISOString().split("T")[0];
    const [{ data: mData }, { data: sData }] = await Promise.all([
      supabase.from("missions").select("*").eq("date", today).limit(1),
      supabase.from("sessions").select("*").order("created_at", { ascending: true })
    ]);
    if (mData && mData.length > 0) mission = mData[0];
    if (sData) sessions = sData;
  } catch (error) {
    console.error("Supabase query error:", error);
  }

  const completedCount = sessions.filter(s => s.status === "completed").length;
  const calculatedProgress = sessions.length > 0 ? Math.round((completedCount / sessions.length) * 100) : (mission?.completion_percentage || 0);

  const displayTitle = mission?.title || "Daily Mission Objective";
  const displayDesc = mission?.description || "Set today's primary focus outcome and start your scheduled sessions.";

  return (
    <PageTransition className="flex flex-col gap-8 max-w-7xl mx-auto pb-8">
      {/* Hero Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-extrabold tracking-tight">Mission Control</h1>
          <p className="text-muted-foreground text-lg font-medium">Your central execution dashboard.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <EditMissionDialog currentTitle={mission?.title} currentDesc={mission?.description} />
          <AddSessionDialog />
        </div>
      </div>

      {/* Active Mission Banner */}
      <Card className="border-border/60 bg-gradient-to-r from-card via-card/90 to-secondary/30 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-[0.03] transition-transform duration-700 hover:scale-110 pointer-events-none">
          <Target className="w-48 h-48" />
        </div>
        <CardHeader className="pb-4 relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">
              {mission?.status?.replace('_', ' ') || "READY"}
            </span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              {mission?.date || new Date().toISOString().split("T")[0]}
            </span>
          </div>
          <CardTitle className="text-2xl sm:text-3xl tracking-tight">{displayTitle}</CardTitle>
          <CardDescription className="text-sm sm:text-base max-w-2xl mt-1">{displayDesc}</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm font-bold">
              <span className="uppercase tracking-wider text-xs text-muted-foreground">Session Completion</span>
              <span className="text-primary">{calculatedProgress}%</span>
            </div>
            <Progress value={calculatedProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Session Timeline */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
            <Clock className="w-5 h-5 text-muted-foreground" /> Today's Timeline
          </h2>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {completedCount} of {sessions.length} Completed
          </span>
        </div>
        
        {sessions.length === 0 ? (
          <EmptyState 
            icon={Coffee}
            title="Your timeline is clear"
            description="No sessions planned for today. Schedule a new deep-work session to start tracking."
            actionLabel="Schedule First Session"
          />
        ) : (
          <div className="flex flex-col gap-3">
            {sessions.map((session) => (
              <SessionItem key={session.id} session={session} />
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
