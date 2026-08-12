import { createClient as createServerSupabase } from "@/lib/supabase/server";
import {
  ExamMaster,
  ExamApplication,
  ExamOverviewData,
  ExamSubject,
  ExamResource,
  ExamNote,
} from "@/types/exams";
import { logger } from "@/lib/logger";

const EXAMS_POOL: ExamMaster[] = [];

export class SupabaseExamsDatasource {
  async getAllExams(): Promise<ExamMaster[]> {
    try {
      const supabase = await createServerSupabase();
      const { data, error } = await supabase
        .from("exams")
        .select("*")
        .eq("is_active", true);

      if (error) {
        logger.error("Supabase error fetching all exams in datasource", { error });
      }

      if (!error && data && data.length > 0) {
        return data as ExamMaster[];
      }
    } catch (err) {
      logger.error("Failed to execute getAllExams in datasource", { err });
    }

    return EXAMS_POOL;
  }

  async getApplications(): Promise<ExamApplication[]> {
    try {
      const supabase = await createServerSupabase();
      const { data, error } = await supabase.from("exam_applications").select("*");
      if (error) {
        logger.error("Supabase error fetching exam applications", { error });
      }
      if (!error && data) return data as ExamApplication[];
    } catch (err) {
      logger.error("Failed to execute getApplications in datasource", { err });
    }

    return [];
  }

  async getExamBySlug(slug: string): Promise<ExamMaster | null> {
    try {
      const supabase = await createServerSupabase();
      const { data, error } = await supabase.from("exams").select("*").eq("slug", slug).single();
      if (error) {
        logger.error("Supabase error fetching exam by slug", { error, slug });
      }
      if (!error && data) return data as ExamMaster;
    } catch (err) {
      logger.error("Failed to execute getExamBySlug in datasource", { err, slug });
    }

    return null;
  }

  async getOverviewBySlug(slug: string): Promise<ExamOverviewData | null> {
    return null;
  }

  async getSubjectsBySlug(slug: string): Promise<ExamSubject[]> {
    return [];
  }

  async getResourcesBySlug(slug: string): Promise<ExamResource[]> {
    return [];
  }

  async getNotesBySlug(slug: string): Promise<ExamNote[]> {
    return [];
  }
}

export const supabaseExamsDatasource = new SupabaseExamsDatasource();
