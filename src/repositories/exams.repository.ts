import { createClient } from "@supabase/supabase-js";
import { supabaseExamsDatasource } from "@/datasources/supabase-exams.datasource";
import { logger } from "@/lib/logger";
import {
  ExamMaster,
  ExamApplication,
  ExamOverviewData,
  ExamSubject,
  ExamResource,
  ExamNote,
} from "@/types/exams";

export class ExamsRepository {
  private getSupabase() {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "https://otjslotfiiubgehiucmn.supabase.co",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_e9C8vUd9Xnwk6DZIEJOQLw_0x4pwPWk"
    );
  }

  async getExams(): Promise<ExamMaster[]> {
    const supabase = this.getSupabase();
    const { data, error } = await supabase
      .from("exams")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      logger.error("Supabase exams fetch error", { error });
      throw new Error(`Database Fetch Failed: ${error.message}`);
    }

    return (data || []) as ExamMaster[];
  }

  async createExam(input: Omit<ExamMaster, "id">): Promise<ExamMaster> {
    const newExam: ExamMaster = {
      id: crypto.randomUUID(),
      ...input,
    };

    const supabase = this.getSupabase();
    const { data, error } = await supabase
      .from("exams")
      .insert(newExam)
      .select("*")
      .single();

    if (error) {
      logger.error("Supabase error inserting exam", { error, newExam });
      throw new Error(`Database Insert Failed: ${error.message}`);
    }

    return data as ExamMaster;
  }

  async deleteExam(id: string): Promise<boolean> {
    const supabase = this.getSupabase();
    const { error } = await supabase.from("exams").delete().eq("id", id);
    if (error) {
      logger.error("Supabase error deleting exam", { error, id });
      throw new Error(`Database Delete Failed: ${error.message}`);
    }

    return true;
  }

  async getApplications(): Promise<ExamApplication[]> {
    return supabaseExamsDatasource.getApplications();
  }

  async getExamBySlug(slug: string): Promise<ExamMaster> {
    const all = await this.getExams();
    const existing = all.find((e) => e.slug === slug);
    if (existing) return existing;

    const titleMap: Record<string, { name: string; short: string; category: any }> = {
      cgl: { name: "SSC Combined Graduate Level (CGL)", short: "SSC CGL", category: "SSC" },
      afcat: { name: "Air Force Common Admission Test", short: "AFCAT", category: "Defense" },
      cds: { name: "Combined Defence Services Examination", short: "CDS", category: "Defense" },
      capf: { name: "Central Armed Police Forces", short: "CAPF AC", category: "Defense" },
    };

    const info = titleMap[slug.toLowerCase()] || {
      name: `${slug.toUpperCase()} Exam`,
      short: slug.toUpperCase(),
      category: "Defense",
    };

    const newExam: ExamMaster = {
      id: crypto.randomUUID(),
      slug,
      name: info.name,
      short_name: info.short,
      category: info.category,
      conducting_body: "Official Conducting Body",
      official_website: "https://example.gov.in",
      description: `Official preparation tracking workspace for ${info.name}.`,
      logo_icon: "Award",
      prep_progress: 0,
      is_active: true,
    };

    const supabase = this.getSupabase();
    const { data, error } = await supabase.from("exams").insert(newExam).select("*").single();
    
    if (error) {
      logger.error("Supabase error inserting exam by slug", { error, newExam });
      throw new Error(`Database Insert Failed: ${error.message}`);
    }

    return data as ExamMaster;
  }

  async getOverview(slug: string): Promise<ExamOverviewData | null> {
    return supabaseExamsDatasource.getOverviewBySlug(slug);
  }

  async getSubjects(slug: string): Promise<ExamSubject[]> {
    return supabaseExamsDatasource.getSubjectsBySlug(slug);
  }

  async getResources(slug: string): Promise<ExamResource[]> {
    return supabaseExamsDatasource.getResourcesBySlug(slug);
  }

  async getNotes(slug: string): Promise<ExamNote[]> {
    return supabaseExamsDatasource.getNotesBySlug(slug);
  }
}

export const examsRepository = new ExamsRepository();
