import { createClient } from "@supabase/supabase-js";
import { logger } from "@/lib/logger";

export interface SubjectEntity {
  id: string;
  module: string;
  name: string;
  description?: string;
  order_index: number;
  topics?: TopicEntity[];
  created_at: string;
}

export interface TopicEntity {
  id: string;
  subject_id: string;
  name: string;
  description?: string;
  difficulty: "Easy" | "Medium" | "Hard";
  estimated_hours: number;
  target_date?: string;
  notes?: string;
  is_learned: boolean;
  is_practiced: boolean;
  is_revised: boolean;
  is_mastered: boolean;
  order_index: number;
  created_at: string;
}

export class TrackerRepository {
  private getSupabase() {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "https://otjslotfiiubgehiucmn.supabase.co",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_e9C8vUd9Xnwk6DZIEJOQLw_0x4pwPWk"
    );
  }

  async findSubjectsByModule(module: string, examId?: string): Promise<SubjectEntity[]> {
    const targetModule = module.toUpperCase();
    const supabase = this.getSupabase();

    let query = supabase
      .from("subjects")
      .select("*, topics(*)")
      .eq("module", targetModule);

    if (examId) {
      query = query.eq("exam_id", examId);
    }

    const { data, error } = await query.order("order_index", { ascending: true });

    if (error) {
      logger.error("Database error fetching subjects", { error, targetModule });
      throw new Error(`Database Error: ${error.message} (${error.code})`);
    }

    return (data || []) as SubjectEntity[];
  }

  async createSubject(input: Partial<SubjectEntity> & { exam_id?: string }): Promise<SubjectEntity> {
    const supabase = this.getSupabase();
    const newSubjectPayload = {
      id: crypto.randomUUID(),
      module: (input.module || "PLACEMENT").toUpperCase(),
      exam_id: input.exam_id,
      name: input.name!,
      description: input.description || "",
      order_index: input.order_index || 1,
    };

    const { data, error } = await supabase
      .from("subjects")
      .insert(newSubjectPayload)
      .select("*, topics(*)")
      .single();

    if (error) {
      logger.error("Database error inserting subject", { error, newSubjectPayload });
      throw new Error(`Database Insert Failed: ${error.message} (${error.code})`);
    }

    return (data || { ...newSubjectPayload, topics: [] }) as SubjectEntity;
  }

  async renameSubject(id: string, name: string): Promise<boolean> {
    const supabase = this.getSupabase();
    const { error } = await supabase
      .from("subjects")
      .update({ name, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      logger.error("Database error renaming subject", { error, id, name });
      throw new Error(`Database Update Failed: ${error.message}`);
    }

    return true;
  }

  async createTopic(input: Partial<TopicEntity>): Promise<TopicEntity> {
    const supabase = this.getSupabase();
    const newTopicPayload = {
      id: crypto.randomUUID(),
      subject_id: input.subject_id!,
      name: input.name!,
      description: input.description || "",
      difficulty: input.difficulty || "Medium",
      estimated_hours: input.estimated_hours || 2.0,
      target_date: input.target_date || new Date().toISOString().split("T")[0],
      notes: input.notes || "",
      is_learned: input.is_learned || false,
      is_practiced: input.is_practiced || false,
      is_revised: input.is_revised || false,
      is_mastered: input.is_mastered || false,
      order_index: input.order_index || 1,
    };

    const { data, error } = await supabase
      .from("topics")
      .insert(newTopicPayload)
      .select("*")
      .single();

    if (error) {
      logger.error("Database error inserting topic", { error, newTopicPayload });
      throw new Error(`Database Insert Failed: ${error.message} (${error.code})`);
    }

    return (data || newTopicPayload) as TopicEntity;
  }

  async renameTopic(topicId: string, name: string): Promise<boolean> {
    const supabase = this.getSupabase();
    const { error } = await supabase
      .from("topics")
      .update({ name, updated_at: new Date().toISOString() })
      .eq("id", topicId);

    if (error) {
      logger.error("Database error renaming topic", { error, topicId, name });
      throw new Error(`Database Update Failed: ${error.message}`);
    }

    return true;
  }

  async updateTopicMilestone(
    topicId: string,
    milestone: "is_learned" | "is_practiced" | "is_revised" | "is_mastered",
    value: boolean
  ): Promise<boolean> {
    const supabase = this.getSupabase();
    const { error } = await supabase
      .from("topics")
      .update({ [milestone]: value, updated_at: new Date().toISOString() })
      .eq("id", topicId);

    if (error) {
      logger.error("Database error updating milestone", { error, topicId, milestone, value });
      throw new Error(`Database Milestone Update Failed: ${error.message}`);
    }

    return true;
  }

  async deleteTopic(topicId: string): Promise<boolean> {
    const supabase = this.getSupabase();
    const { error } = await supabase.from("topics").delete().eq("id", topicId);

    if (error) {
      logger.error("Database error deleting topic", { error, topicId });
      throw new Error(`Database Delete Failed: ${error.message}`);
    }

    return true;
  }

  async deleteSubject(id: string): Promise<boolean> {
    const supabase = this.getSupabase();
    const { error } = await supabase.from("subjects").delete().eq("id", id);

    if (error) {
      logger.error("Database error deleting subject", { error, id });
      throw new Error(`Database Delete Failed: ${error.message}`);
    }

    return true;
  }
}

export const trackerRepository = new TrackerRepository();
