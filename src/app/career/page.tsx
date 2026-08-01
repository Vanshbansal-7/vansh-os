import { Briefcase, Rocket } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { PageTransition } from "@/components/ui/page-transition";
import { EmptyState } from "@/components/ui/empty-state";
import { AddCompanyDialog } from "@/components/career/add-company-dialog";
import { CompanyCard } from "@/components/career/company-card";

export default async function CareerEngine() {
  const supabase = await createClient();
  let companies: any[] = [];
  
  try {
    const { data } = await supabase.from("companies").select("*").order("created_at", { ascending: false });
    if (data) companies = data;
  } catch (error) {
    console.error("Supabase query error:", error);
  }

  const activeApplications = companies.filter(c => c.status !== 'rejected' && c.status !== 'wishlist').length;
  const interviewingCount = companies.filter(c => c.status === 'interviewing').length;

  return (
    <PageTransition className="flex flex-col gap-8 max-w-7xl mx-auto pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-primary" /> Career Engine
          </h1>
          <p className="text-muted-foreground">Manage job applications, interview pipelines, and target companies.</p>
        </div>
        <AddCompanyDialog />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
