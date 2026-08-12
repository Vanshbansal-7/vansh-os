"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toggleHabitAction, deleteHabitAction } from "@/actions/life";

export function HabitCard({ habit }: { habit: any }) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      await toggleHabitAction(habit.id, habit.completed_today, habit.streak || 0);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    try {
      await deleteHabitAction(habit.id);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      onClick={handleToggle}
      className={`border-border/60 cursor-pointer transition-all duration-300 hover:shadow-md group ${
        habit.completed_today
          ? "bg-primary/5 border-primary/30 hover:bg-primary/10"
          : "hover:border-primary/40"
      }`}
    >
      <CardContent className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="transition-transform group-hover:scale-110">
            {loading ? (
              <Loader2 className="w-7 h-7 text-primary animate-spin" />
            ) : habit.completed_today ? (
              <CheckCircle2 className="w-7 h-7 text-primary" />
            ) : (
              <Circle className="w-7 h-7 text-muted-foreground/50 group-hover:text-primary/50" />
            )}
          </div>
          <div className="flex flex-col">
            <h3
              className={`font-bold transition-colors ${
                habit.completed_today ? "text-muted-foreground line-through" : ""
              }`}
            >
              {habit.title}
            </h3>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
              {habit.frequency}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span
              className={`text-2xl font-bold tracking-tight ${
                habit.streak > 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-muted-foreground"
              }`}
            >
              {habit.streak}
            </span>
            <span className="text-[10px] text-muted-foreground font-bold uppercase">
              STREAK
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-60 group-hover:opacity-100 transition-opacity"
            onClick={handleDelete}
            title="Delete Habit"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
