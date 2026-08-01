"use client";

import { useState } from "react";
import { Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { logHealthMetricAction } from "@/actions/life";

export function LogHealthDialog({ current }: { current?: { calories?: number; water_intake?: number; sleep_hours?: number; weight?: number | null } }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await logHealthMetricAction(formData);
      setOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button variant="outline" className="gap-2 shadow-sm shrink-0">
          <Activity className="w-4 h-4" /> Log Health Metrics
        </Button>
      } />
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Log Daily Health Metrics</DialogTitle>
            <DialogDescription>
              Record your nutrition, hydration, sleep, and physical stats for today.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="h-calories">Calories (kcal)</Label>
              <Input
                id="h-calories"
                name="calories"
                type="number"
                defaultValue={current?.calories || 0}
                placeholder="2200"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="h-water">Water Intake (ml)</Label>
              <Input
                id="h-water"
                name="water_intake"
                type="number"
                defaultValue={current?.water_intake || 0}
                placeholder="3000"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="h-sleep">Sleep Duration (hours)</Label>
              <Input
                id="h-sleep"
                name="sleep_hours"
                type="number"
                step="0.5"
                defaultValue={current?.sleep_hours || 0}
                placeholder="7.5"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="h-weight">Body Weight (kg)</Label>
              <Input
                id="h-weight"
                name="weight"
                type="number"
                step="0.1"
                defaultValue={current?.weight || ""}
                placeholder="72.5"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Metrics"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
