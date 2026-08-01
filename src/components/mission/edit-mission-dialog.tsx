"use client";

import { useState } from "react";
import { Edit3 } from "lucide-react";
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
import { createMissionAction } from "@/actions/mission";

export function EditMissionDialog({ currentTitle, currentDesc }: { currentTitle?: string; currentDesc?: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createMissionAction(formData);
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
        <Button variant="outline" size="sm" className="gap-1.5 shadow-sm text-xs font-semibold">
          <Edit3 className="w-3.5 h-3.5" /> Set Daily Objective
        </Button>
      } />
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Set Today's Mission</DialogTitle>
            <DialogDescription>
              Define your high-level objective and focus goal for today.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="m-title">Objective Title</Label>
              <Input
                id="m-title"
                name="title"
                defaultValue={currentTitle || ""}
                placeholder="e.g. Ship Version 1.0 of Founder OS"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="m-desc">Description / Target Outcome</Label>
              <Input
                id="m-desc"
                name="description"
                defaultValue={currentDesc || ""}
                placeholder="e.g. Complete Supabase integration, test all CRUD features."
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Objective"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
