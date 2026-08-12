"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Flame, ShieldAlert, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { startSessionAction, completeSessionAction, deleteSessionAction } from "@/actions/mission";

export function SessionItem({ session }: { session: any }) {
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    try {
      await startSessionAction(session.id);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      await completeSessionAction(session.id);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteSessionAction(session.id);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      className={`border-border/60 transition-all duration-300 hover:shadow-md ${
        session.status === "current"
          ? "border-primary shadow-md ring-1 ring-primary/20 scale-[1.01]"
          : ""
      } ${
        session.status === "completed"
          ? "opacity-60 bg-muted/30"
          : "hover:border-primary/40"
      }`}
    >
      <CardContent className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start md:items-center gap-4">
          <div className="mt-1 md:mt-0 shrink-0">
            {session.status === "completed" ? (
              <CheckCircle2 className="w-6 h-6 text-primary" />
            ) : session.status === "current" ? (
              <Flame className="w-6 h-6 text-orange-500 animate-pulse" />
            ) : (
              <Circle className="w-6 h-6 text-muted-foreground/50" />
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span
                className={`font-bold text-lg leading-tight ${
                  session.status === "completed"
                    ? "line-through text-muted-foreground"
                    : ""
                }`}
              >
                {session.title}
              </span>
              {session.priority === "critical" && (
                <ShieldAlert className="w-4 h-4 text-destructive shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <span className="uppercase font-bold tracking-wider text-[10px] bg-secondary px-2 py-0.5 rounded-sm">
                {session.module}
              </span>
              <span className="opacity-50">•</span>
              <span className="font-medium text-xs">
                {session.time_window || "Anytime"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {session.status === "upcoming" && (
            <Button
              variant="outline"
              size="sm"
              className="font-semibold shadow-sm text-xs"
              onClick={handleStart}
              disabled={loading}
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Start Session"}
            </Button>
          )}
          {session.status === "current" && (
            <Button
              type="button"
              size="sm"
              className="font-semibold shadow-sm text-xs"
              onClick={handleComplete}
              disabled={loading}
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Complete"}
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={handleDelete}
            disabled={loading}
            title="Delete Session"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
