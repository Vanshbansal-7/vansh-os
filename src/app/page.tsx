import { CheckCircle2, Circle, Clock, Flame, ShieldAlert, Target, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/server";
import { startSessionAction, completeSessionAction } from "@/actions/mission";
import { PageTransition } from "@/components/ui/page-transition";
import { EmptyState } from "@/components/ui/empty-state";

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
    console.error("Supabase not connected yet.");
  }

  // Fallbacks if no data exists yet
  const displayTitle = mission?.title || "No Active Mission";
  const displayDesc = mission?.description || "Connect Supabase to load today's mission data.";
  const displayProgress = mission?.completion_percentage || 0;

  return (
    <PageTransition className="flex flex-col gap-8 max-w-7xl mx-auto pb-8">
      {/* Hero Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Mission Control</h1>
        <p className="text-muted-foreground text-lg font-medium">Good morning. Your focus is required.</p>
      </div>

      {/* Active Mission Banner */}
      <Card className="border-border/60 bg-gradient-to-r from-card to-card/50 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-[0.03] transition-transform duration-700 hover:scale-110">
          <Target className="w-48 h-48" />
        </div>
        <CardHeader className="pb-4 relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">
              {mission?.status?.replace('_', ' ') || "NO DATA"}
            </span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              {mission?.date || new Date().toISOString().split("T")[0]}
            </span>
          </div>
          <CardTitle className="text-3xl tracking-tight">{displayTitle}</CardTitle>
          <CardDescription className="text-base max-w-2xl mt-1">{displayDesc}</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm font-bold">
              <span className="uppercase tracking-wider text-xs text-muted-foreground">Progress</span>
              <span className="text-primary">{displayProgress}%</span>
            </div>
            <Progress value={displayProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Session Timeline */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
          <Clock className="w-5 h-5 text-muted-foreground" /> Today's Timeline
        </h2>
        
        {sessions.length === 0 ? (
          <EmptyState 
            icon={Coffee}
            title="Your timeline is clear"
            description="No sessions planned for today. Take a break or schedule a new deep-work session."
            actionLabel="Schedule Session"
          />
        ) : (
          <div className="flex flex-col gap-3">
            {sessions.map((session) => (
              <Card 
                key={session.id} 
                className={`border-border/60 transition-all duration-300 hover:shadow-md ${
                  session.status === 'current' ? "border-primary shadow-md ring-1 ring-primary/20 scale-[1.01]" : ""
                } ${session.status === 'completed' ? "opacity-60 bg-muted/30" : "hover:border-primary/40"}`}
              >
                <CardContent className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start md:items-center gap-4">
                    <div className="mt-1 md:mt-0 shrink-0">
                      {session.status === 'completed' ? (
                        <CheckCircle2 className="w-6 h-6 text-primary" />
                      ) : session.status === 'current' ? (
                        <Flame className="w-6 h-6 text-orange-500 animate-pulse" />
                      ) : (
                        <Circle className="w-6 h-6 text-muted-foreground/50" />
                      )}
                    </div>
                    
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-lg leading-tight ${session.status === 'completed' ? "line-through text-muted-foreground" : ""}`}>
                          {session.title}
                        </span>
                        {session.priority === 'critical' && (
                          <ShieldAlert className="w-4 h-4 text-destructive shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <span className="uppercase font-bold tracking-wider text-[10px] bg-secondary px-2 py-0.5 rounded-sm">
                          {session.module}
                        </span>
                        <span className="opacity-50">•</span>
                        <span className="font-medium text-xs">{session.time_window || "Anytime"}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 shrink-0">
                    {session.status === 'upcoming' && (
                      <form action={startSessionAction.bind(null, session.id)}>
                        <Button variant="outline" type="submit" size="sm" className="font-semibold shadow-sm">Start Session</Button>
                      </form>
                    )}
                    {session.status === 'current' && (
                      <form action={completeSessionAction.bind(null, session.id)}>
                        <Button type="submit" size="sm" className="font-semibold shadow-sm">Complete</Button>
                      </form>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
