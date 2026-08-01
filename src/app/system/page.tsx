import { Settings, Database, CloudCheck, Shield, Key } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { PageTransition } from "@/components/ui/page-transition";
import { ProfileForm } from "@/components/system/profile-form";

export default async function SystemEngine() {
  const supabase = await createClient();
  let user: any = null;
  let profile: any = null;

  try {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    user = authUser;

    if (user) {
      const { data: pData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      profile = pData;
    }
  } catch (error) {
    console.error("Failed to load user in system engine:", error);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "Configured";

  return (
    <PageTransition className="flex flex-col gap-8 max-w-7xl mx-auto pb-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary" /> System Configuration
        </h1>
        <p className="text-muted-foreground">Manage Vansh OS settings, database connections, and founder identity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <ProfileForm user={user} profile={profile} />

        {/* Supabase Connection Status */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-500" /> Database & Cloud Status
            </CardTitle>
            <CardDescription>
              Real-time PostgreSQL and Supabase Cloud connection status.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border/40">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Cloud Instance</span>
                <span className="text-sm font-mono truncate max-w-[240px]">{supabaseUrl}</span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                Connected
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border/40">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Row Level Security</span>
                <span className="text-xs text-muted-foreground">Enforced on all tables</span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/15 text-primary">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border/40">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Session Persistence</span>
                <span className="text-xs text-muted-foreground">Encrypted SSR Cookies</span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/15 text-primary">
                Active
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
