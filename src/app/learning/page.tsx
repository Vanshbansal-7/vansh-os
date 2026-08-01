import { GraduationCap, BrainCircuit } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { PageTransition } from "@/components/ui/page-transition";
import { EmptyState } from "@/components/ui/empty-state";
import { AddTopicDialog } from "@/components/learning/add-topic-dialog";
import { TopicCard } from "@/components/learning/topic-card";

export default async function LearningEngine() {
  const supabase = await createClient();
  let topics: any[] = [];
  
  try {
    const { data } = await supabase.from("learning_topics").select("*").order("created_at", { ascending: false });
    if (data) topics = data;
  } catch (error) {
    console.error("Supabase query error:", error);
  }

  const dsaCount = topics.filter(t => t.category === "dsa" && t.status === "completed").length;
  const completedCount = topics.filter(t => t.status === "completed").length;

  return (
    <PageTransition className="flex flex-col gap-8 max-w-7xl mx-auto pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-primary" /> Learning Engine
          </h1>
          <p className="text-muted-foreground">Master Data Structures, Core Subjects, and Architecture.</p>
        </div>
        <AddTopicDialog />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="border-border/60 hover:border-primary/20 transition-all duration-300 shadow-sm hover:shadow-md">
          <CardHeader className="pb-2">
            <CardDescription className="font-medium">DSA Solved</CardDescription>
            <CardTitle className="text-4xl font-bold tracking-tight">{dsaCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-border/60 hover:border-emerald-500/20 transition-all duration-300 shadow-sm hover:shadow-md">
          <CardHeader className="pb-2">
            <CardDescription className="font-medium">Mastered Topics</CardDescription>
            <CardTitle className="text-4xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
              {completedCount} <span className="text-lg font-normal text-muted-foreground">/ {topics.length}</span>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-border/60 hover:border-primary/20 transition-all duration-300 shadow-sm hover:shadow-md">
          <CardHeader className="pb-2">
            <CardDescription className="font-medium">Total Repository</CardDescription>
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
            description="Start building your learning repository by adding your first topic or DSA problem."
            actionLabel="Add First Topic"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {topics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
