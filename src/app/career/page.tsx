import { Briefcase, Plus, ExternalLink, CalendarDays, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { PageTransition } from "@/components/ui/page-transition";
import { EmptyState } from "@/components/ui/empty-state";

export default async function CareerEngine() {
  const supabase = await createClient();
  let companies: any[] = [];
  
  try {
    const { data } = await supabase.from("companies").select("*").order("created_at", { ascending: false });
    if (data) companies = data;
  } catch (error) {
    console.error("Supabase not connected yet.");
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "wishlist": return "bg-muted text-muted-foreground";
      case "applied": return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
      case "interviewing": return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
      case "offer": return "bg-primary text-primary-foreground";
      case "rejected": return "bg-destructive/10 text-destructive";
      default: return "bg-muted text-foreground";
    }
  };

  const activeApplications = companies.filter(c => c.status !== 'rejected' && c.status !== 'wishlist').length;
  const interviewingCount = companies.filter(c => c.status === 'interviewing').length;

  return (
    <PageTransition className="flex flex-col gap-8 max-w-7xl mx-auto pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-primary" /> Career Engine
          </h1>
          <p className="text-muted-foreground">Manage job applications, resumes, and networking.</p>
        </div>
        <Button className="gap-2 shadow-sm shrink-0">
          <Plus className="w-4 h-4" /> Add Company
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/60 hover:border-primary/20 transition-all duration-300 shadow-sm hover:shadow-md">
          <CardHeader className="pb-2">
            <CardDescription className="font-medium">Active Applications</CardDescription>
            <CardTitle className="text-4xl font-bold tracking-tight">{activeApplications}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-border/60 hover:border-emerald-500/20 transition-all duration-300 shadow-sm hover:shadow-md">
          <CardHeader className="pb-2">
            <CardDescription className="font-medium">Interviewing</CardDescription>
            <CardTitle className="text-4xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">{interviewingCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-border/60 hover:border-primary/20 transition-all duration-300 shadow-sm hover:shadow-md">
          <CardHeader className="pb-2">
            <CardDescription className="font-medium">Total Tracked</CardDescription>
            <CardTitle className="text-4xl font-bold tracking-tight">{companies.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Application Pipeline */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight">Application Pipeline</h2>
        {companies.length === 0 ? (
          <EmptyState 
            icon={Rocket}
            title="Your pipeline is empty"
            description="Start tracking your career journey by adding companies you want to apply to."
            actionLabel="Add Target Company"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {companies.map((company) => (
              <Card key={company.id} className="border-border/60 hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-md group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{company.name}</h3>
                      <p className="text-sm font-medium text-muted-foreground">{company.role}</p>
                      {company.applied_date && (
                        <span className="text-xs text-muted-foreground/80 flex items-center gap-1.5 mt-3 font-medium">
                          <CalendarDays className="w-3.5 h-3.5" /> Applied: {company.applied_date}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${getStatusColor(company.status)}`}>
                        {company.status}
                      </span>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
