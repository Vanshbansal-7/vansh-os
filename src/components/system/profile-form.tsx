"use client";

import { useState } from "react";
import { User, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfileAction } from "@/actions/system";

export function ProfileForm({ user, profile }: { user: any; profile: any }) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    const formData = new FormData(e.currentTarget);
    try {
      await updateProfileAction(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-primary" /> Founder Profile
        </CardTitle>
        <CardDescription>
          Your identity and timezone across all engines.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="p-email">Authenticated Email</Label>
            <Input
              id="p-email"
              value={user?.email || "founder@vos.internal"}
              disabled
              className="bg-muted text-muted-foreground font-mono text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="p-name">Full Name / Display Handle</Label>
            <Input
              id="p-name"
              name="name"
              defaultValue={profile?.name || user?.user_metadata?.full_name || ""}
              placeholder="e.g. Vansh Bansal"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="p-tz">Timezone</Label>
            <Input
              id="p-tz"
              name="timezone"
              defaultValue={profile?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone}
              placeholder="e.g. Asia/Kolkata or UTC"
              required
            />
          </div>

          <Button type="submit" size="sm" className="font-semibold gap-1.5" disabled={loading}>
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : saved ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Saved Successfully
              </>
            ) : (
              "Update Profile"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
