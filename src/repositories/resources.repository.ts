import { createClient } from "@supabase/supabase-js";
import { logger } from "@/lib/logger";

export interface ResourceEntity {
  id: string;
  user_id?: string;
  module: string;
  title: string;
  description?: string;
  url: string;
  category: string;
  type: string;
  priority: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export class ResourcesRepository {
  private getSupabase() {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "https://otjslotfiiubgehiucmn.supabase.co",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_e9C8vUd9Xnwk6DZIEJOQLw_0x4pwPWk"
    );
  }

  async findByModule(module: string, examId?: string): Promise<ResourceEntity[]> {
    const targetModule = module.toUpperCase();
    const supabase = this.getSupabase();
    
    let query = supabase
      .from("resources")
      .select("*")
      .eq("module", targetModule);
      
    if (examId) {
      query = query.eq("exam_id", examId);
    }

    // Vault assets are stored under YOUTUBE module with category VAULT_ASSET. Exclude them from generic resource queries.
    if (targetModule === "YOUTUBE") {
      query = query.neq("category", "VAULT_ASSET");
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      logger.error("Supabase resources fetch failed", { error });
      throw new Error(`Database Fetch Failed: ${error.message}`);
    }

    return (data || []) as ResourceEntity[];
  }

  async create(input: Partial<ResourceEntity> & { exam_id?: string }): Promise<ResourceEntity> {
    const newResource = {
      id: crypto.randomUUID(),
      module: (input.module || "PLACEMENT").toUpperCase(),
      exam_id: input.exam_id,
      title: input.title || "Untitled Resource",
      url: input.url || "#",
      category: input.category || "General",
      type: input.type || "website",
      priority: input.priority || "MEDIUM",
      tags: input.tags || [],
      metadata: (input as any).metadata || null,
    };

    const supabase = this.getSupabase();
    const { data, error } = await supabase
      .from("resources")
      .insert(newResource)
      .select("*")
      .single();

    if (error) {
      logger.error("Database error inserting resource", { error, newResource });
      throw new Error(`Database Insert Failed: ${error.message}`);
    }

    return data as ResourceEntity;
  }

  async delete(id: string): Promise<boolean> {
    const supabase = this.getSupabase();
    const { error } = await supabase.from("resources").delete().eq("id", id);
    
    if (error) {
      logger.error("Database error deleting resource", { error, id });
      throw new Error(`Database Delete Failed: ${error.message}`);
    }
    
    return true;
  }
}

export const resourcesRepository = new ResourcesRepository();
