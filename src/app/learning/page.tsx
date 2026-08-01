import { GraduationCap, Search, Play, BookOpen, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { STATUS_COLORS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { PageTransition } from "@/components/ui/page-transition";
import { EmptyState } from "@/components/ui/empty-state";

export default async function LearningEngine() {
  const supabase = await createClient();
  let topics: any[] = [];
  
  try {
    const { data } = await supabase.from("learning_topics").select("*").order("created_at", { ascending: false });
    if (data) topics = data;
  } catch (error) {
    console.error("Supabase not connected yet.");
  }

  const dsaCount = topics.filter(t => t.category === "dsa" && t.status === "completed").length;
  const revisionQueue = topics.filter(t => t.next_revision && new Date(t.next_revision) <= new Date());

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty === "easy") return "text-emerald-500 bg-emerald-500/10";
    if (difficulty === "medium") return "text-yellow-600 dark:text-yellow-500 bg-yellow-500/10";
    if (difficulty === "hard") return "text-destructive bg-destructive/10";
    return "text-muted-foreground bg-muted";
  };

  return (
    <PageTransition className="flex flex-col gap-8 max-w-7xl mx-auto pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-primary" /> Learning Engine
          </h1>
          <p className="text-muted-foreground">Master Data Structures, Core Subjects, and New Frameworks.</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" className="gap-2 shadow-sm">
            <Search className="w-4 h-4" /> Search
          </Button>
          <Button className="gap-2 shadow-sm">
            <Play className="w-4 h-4" /> Start Session
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/60 hover:border-primary/20 transition-all duration-300 shadow-sm hover:shadow-md">
          <CardHeader className="pb-2">
            <CardDescription className="font-medium">DSA Solved</CardDescription>
            <CardTitle className="text-4xl font-bold tracking-tight">{dsaCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-border/60 hover:border-yellow-500/20 transition-all duration-300 shadow-sm hover:shadow-md">
          <CardHeader className="pb-2">
            <CardDescription className="font-medium">Revision Queue</CardDescription>
            <CardTitle className="text-4xl font-bold tracking-tight text-yellow-600 dark:text-yellow-500">
              {revisionQueue.length} <span className="text-lg font-normal text-muted-foreground">Due</span>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-border/60 hover:border-primary/20 transition-all duration-300 shadow-sm hover:shadow-md">
          <CardHeader className="pb-2">
            <CardDescription className="font-medium">Total Topics</CardDescription>
            <CardTitle className="text-4xl font-bold tracking-tight">{topics.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Topic Repository */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight">Knowledge Base</h2>
        {topics.length === 0 ? (
          <EmptyState 
            icon={BrainCircuit}
            title="Expand your knowledge"
            description="Start building your learning repository by adding your first topic or DSA question."
            actionLabel="Add Topic"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {topics.map((topic) => (
              <Card key={topic.id} className="border-border/60 hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-md group flex flex-col justify-between">
                <CardContent className="p-5 flex flex-col gap-4 h-full">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-bold leading-tight group-hover:text-primary transition-colors">{topic.title}</h3>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shrink-0 ${(STATUS_COLORS as any)[topic.status] || "bg-muted"}`}>
                      {topic.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="mt-auto pt-2 flex justify-between items-center text-xs font-medium border-t border-border/40">
                    <span className="uppercase tracking-wider text-muted-foreground font-semibold">{topic.category}</span>
                    <span className={`px-2 py-0.5 rounded-md capitalize font-bold ${getDifficultyColor(topic.difficulty)}`}>{topic.difficulty}</span>
                  </div>
                  
                  <Button variant="secondary" size="sm" className="w-full text-xs font-semibold gap-2 mt-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <BookOpen className="w-3.5 h-3.5" /> Review Notes
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
