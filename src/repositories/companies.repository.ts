import { createClient } from "@supabase/supabase-js";
import { CompanyApplication } from "@/types/company";
import { logger } from "@/lib/logger";

export class CompaniesRepository {
  private getSupabase() {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "https://otjslotfiiubgehiucmn.supabase.co",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_e9C8vUd9Xnwk6DZIEJOQLw_0x4pwPWk"
    );
  }

  async getCompanies(): Promise<CompanyApplication[]> {
    const supabase = this.getSupabase();
    const { data, error } = await supabase
      .from("company_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      logger.error("Supabase company_applications fetch error", { error });
      throw new Error(`Database Fetch Failed: ${error.message}`);
    }

    return (data || []) as CompanyApplication[];
  }

  async createCompany(input: Omit<CompanyApplication, "id" | "documents">): Promise<CompanyApplication> {
    const newCompany: CompanyApplication = {
      id: crypto.randomUUID(),
      documents: [],
      ...input,
    };

    const supabase = this.getSupabase();
    const { data, error } = await supabase.from("company_applications").insert({
      id: newCompany.id,
      company_name: newCompany.company_name,
      logo_url: newCompany.logo_url || "",
      role: newCompany.role || "Software Engineer",
      applied_date: newCompany.applied_date,
      application_mode: newCompany.application_mode,
      job_link: newCompany.job_link || "",
      status: newCompany.status,
      location: newCompany.location || "",
      notes: newCompany.notes || "",
      documents: [],
    }).select("*").single();

    if (error) {
      logger.error("Supabase error inserting company", { error });
      throw new Error(`Database Insert Failed: ${error.message}`);
    }

    return data as CompanyApplication;
  }

  async updateCompanyStatus(id: string, status: CompanyApplication["status"]): Promise<boolean> {
    const supabase = this.getSupabase();
    const { error } = await supabase
      .from("company_applications")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);
      
    if (error) {
      logger.error("Supabase error updating company status", { error });
      throw new Error(`Database Update Failed: ${error.message}`);
    }

    return true;
  }

  async updateCompanyDetails(id: string, updates: Partial<CompanyApplication>): Promise<boolean> {
    const supabase = this.getSupabase();
    const { error } = await supabase
      .from("company_applications")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id);
      
    if (error) {
      logger.error("Supabase error updating company details", { error });
      throw new Error(`Database Update Failed: ${error.message}`);
    }

    return true;
  }

  async deleteCompany(id: string): Promise<boolean> {
    const supabase = this.getSupabase();
    const { error } = await supabase.from("company_applications").delete().eq("id", id);
    if (error) {
      logger.error("Supabase error deleting company", { error });
      throw new Error(`Database Delete Failed: ${error.message}`);
    }

    return true;
  }
}

export const companiesRepository = new CompaniesRepository();
