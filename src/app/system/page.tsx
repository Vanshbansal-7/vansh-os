import { Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SystemEngine() {
  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto pb-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary" /> System Configuration
        </h1>
        <p className="text-muted-foreground">Manage Vansh OS settings, sync, and integrations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Data Synchronization</CardTitle>
            <CardDescription>Supabase Cloud Sync Status</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium text-muted-foreground">Syncing to cloud is currently disabled in local mode.</p>
          </CardContent>
        </Card>
        
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Integrations</CardTitle>
            <CardDescription>External API Connections</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium text-muted-foreground">GitHub, LinkedIn, and Google Calendar integrations pending V1 Polish.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
