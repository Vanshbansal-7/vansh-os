"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Clock, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { updateTopicStatusAction, deleteLearningTopicAction } from "@/actions/learning";

export function TopicCard({ topic }: { topic: any }) {
  const [loading, setLoading] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty === "easy") return "text-emerald-500 bg-emerald-500/10";
    if (difficulty === "medium") return "text-yellow-600 dark:text-yellow-500 bg-yellow-500/10";
    if (difficulty === "hard") return "text-destructive bg-destructive/10";
    return "text-muted-foreground bg-muted";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400";
      case "in_progress":
        return "bg-primary/15 text-primary";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const cycleStatus = async () => {
    setLoading(true);
    const nextStatus = topic.status === "not_started" 
      ? "in_progress" 
      : topic.status === "in_progress" 
        ? "completed" 
        : "not_started";
    try {
      await updateTopicStatusAction(topic.id, nextStatus);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${topic.title}"?`)) return;
    setLoading(true);
    try {
      await deleteLearningTopicAction(topic.id);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-border/60 hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-md group flex flex-col justify-between">
      <CardContent className="p-5 flex flex-col gap-4 h-full">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-bold leading-tight group-hover:text-primary transition-colors">
            {topic.title}
          </h3>
          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shrink-0 ${getStatusBadge(
              topic.status
            )}`}
          >
            {topic.status?.replace("_", " ")}
          </span>
        </div>

        <div className="mt-auto pt-3 flex justify-between items-center text-xs font-medium border-t border-border/40">
          <span className="uppercase tracking-wider text-muted-foreground font-semibold">
            {topic.category}
          </span>
          <span
            className={`px-2 py-0.5 rounded-md capitalize font-bold ${getDifficultyColor(
              topic.difficulty
            )}`}
          >
            {topic.difficulty}
          </span>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <Button
            variant={topic.status === "completed" ? "secondary" : "default"}
            size="sm"
            className="w-full text-xs font-semibold gap-1.5 shadow-sm"
            onClick={cycleStatus}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : topic.status === "completed" ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Completed
              </>
            ) : topic.status === "in_progress" ? (
              <>
                <Clock className="w-3.5 h-3.5 text-primary" /> Mark Complete
              </>
            ) : (
              <>
                <Circle className="w-3.5 h-3.5" /> Start Learning
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
            onClick={handleDelete}
            disabled={loading}
            title="Delete Topic"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
