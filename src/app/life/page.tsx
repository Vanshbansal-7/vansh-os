import { Heart, Activity, Droplet, Moon, Dumbbell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/server";
import { PageTransition } from "@/components/ui/page-transition";
import { EmptyState } from "@/components/ui/empty-state";
import { LogHealthDialog } from "@/components/life/log-health-dialog";
import { AddHabitDialog } from "@/components/life/add-habit-dialog";
import { HabitCard } from "@/components/life/habit-card";

export default async function LifeEngine() {
  const supabase = await createClient();
  let metrics: any[] = [];
  let habits: any[] = [];
  
  try {
    const today = new Date().toISOString().split("T")[0];
    const [{ data: mData }, { data: hData }] = await Promise.all([
      supabase.from("health_metrics").select("*").eq("date", today).limit(1),
      supabase.from("habits").select("*").order("created_at", { ascending: true })
    ]);
    if (mData) metrics = mData;
    if (hData) habits = hData;
  } catch (error) {
    console.error("Supabase query error:", error);
  }

  const todayMetric = metrics[0] || { calories: 0, water_intake: 0, sleep_hours: 0, weight: null };

  return (
    <PageTransition className="flex flex-col gap-8 max-w-7xl mx-auto pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Heart className="w-8 h-8 text-primary" /> Life Engine
          </h1>
          <p className="text-muted-foreground">Monitor health, habits, and physical longevity.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <LogHealthDialog current={todayMetric} />
          <AddHabitDialog />
        </div>
      </div>

      {/* Health Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border/60 hover:border-primary/20 transition-all duration-300 shadow-sm hover:shadow-md">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Calories</CardTitle>
            <Activity className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{todayMetric.calories} <span className="text-sm font-medium text-muted-foreground">/ 2400</span></div>
            <Progress value={Math.min((todayMetric.calories / 2400) * 100, 100)} className="h-2 mt-4" />
          </CardContent>
        </Card>
        
        <Card className="border-border/60 hover:border-blue-500/20 transition-all duration-300 shadow-sm hover:shadow-md">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Hydration</CardTitle>
            <Droplet className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{todayMetric.water_intake} <span className="text-sm font-medium text-muted-foreground">/ 3000ml</span></div>
            <Progress value={Math.min((todayMetric.water_intake / 3000) * 100, 100)} className="h-2 mt-4" />
          </CardContent>
        </Card>

        <Card className="border-border/60 hover:border-indigo-400/20 transition-all duration-300 shadow-sm hover:shadow-md">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Sleep</CardTitle>
            <Moon className="w-4 h-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{todayMetric.sleep_hours} <span className="text-sm font-medium text-muted-foreground">hrs</span></div>
            <Progress value={Math.min((todayMetric.sleep_hours / 8) * 100, 100)} className="h-2 mt-4" />
          </CardContent>
        </Card>

        <Card className="border-border/60 hover:border-rose-500/20 transition-all duration-300 shadow-sm hover:shadow-md">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Weight</CardTitle>
            <Heart className="w-4 h-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{todayMetric.weight || "--"} <span className="text-sm font-medium text-muted-foreground">kg</span></div>
            <p className="text-xs font-medium text-muted-foreground mt-3 flex items-center gap-1 opacity-70">
              Track to observe longevity trends
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Habit Tracker */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight">Daily Habits</h2>
        {habits.length === 0 ? (
          <EmptyState 
            icon={Dumbbell}
            title="No habits tracked"
            description="Build consistency by adding daily or weekly habits to your Life Engine."
            actionLabel="Create First Habit"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {habits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} />
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
