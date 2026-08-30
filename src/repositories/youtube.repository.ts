import { createClient } from "@supabase/supabase-js";
import { logger } from "@/lib/logger";
import {
  YouTubeChannelProfile,
  VaultAsset,
  YouTubeResource,
  YouTubeNote,
} from "@/types/youtube";

export interface YouTubeVideoTask {
  id: string;
  channel_id?: string;
  title: string;
  category: string;
  is_idea: boolean;
  is_script: boolean;
  is_editing: boolean;
  is_published: boolean;
  order_index: number;
}

export class YouTubeRepository {
  private getSupabase() {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "https://otjslotfiiubgehiucmn.supabase.co",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_e9C8vUd9Xnwk6DZIEJOQLw_0x4pwPWk"
    );
  }

  async getProfile(): Promise<YouTubeChannelProfile | null> {
    const supabase = this.getSupabase();
    const { data, error } = await supabase
      .from("youtube_channels")
      .select("*")
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned, perfectly fine for profile
        return null;
      }
      logger.error("Supabase youtube_channels fetch error", { error });
      throw new Error(`Database Fetch Failed: ${error.message}`);
    }

    return data as YouTubeChannelProfile;
  }

  async saveProfile(profile: Partial<YouTubeChannelProfile>): Promise<YouTubeChannelProfile> {
    const supabase = this.getSupabase();
    
    // Check if profile exists
    const existing = await this.getProfile();
    const profileData = {
      ...(existing ? { id: existing.id } : { id: crypto.randomUUID() }),
      ...profile
    };

    const { data, error } = await supabase
      .from("youtube_channels")
      .upsert(profileData)
      .select("*")
      .single();

    if (error) {
      logger.error("Supabase error saving YouTube profile", { error });
      throw new Error(`Database Upsert Failed: ${error.message}`);
    }

    return data as YouTubeChannelProfile;
  }

  async getVideoTasks(): Promise<YouTubeVideoTask[]> {
    const supabase = this.getSupabase();
    const { data, error } = await supabase
      .from("youtube_video_tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      logger.error("Supabase youtube_video_tasks fetch error", { error });
      throw new Error(`Database Fetch Failed: ${error.message}`);
    }

    return (data || []) as YouTubeVideoTask[];
  }

  async createVideoTask(title: string, category: string): Promise<YouTubeVideoTask> {
    const newTask: YouTubeVideoTask = {
      id: crypto.randomUUID(),
      title,
      category: category || "Content",
      is_idea: true,
      is_script: false,
      is_editing: false,
      is_published: false,
      order_index: 1,
    };

    const supabase = this.getSupabase();
    const { data, error } = await supabase
      .from("youtube_video_tasks")
      .insert(newTask)
      .select("*")
      .single();

    if (error) {
      logger.error("Supabase error inserting video task", { error });
      throw new Error(`Database Insert Failed: ${error.message}`);
    }

    return data as YouTubeVideoTask;
  }

  async updateVideoTaskStage(
    id: string,
    updates: Partial<YouTubeVideoTask>
  ): Promise<boolean> {
    const supabase = this.getSupabase();
    const { error } = await supabase
      .from("youtube_video_tasks")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id);
      
    if (error) {
      logger.error("Supabase error updating video task", { error });
      throw new Error(`Database Update Failed: ${error.message}`);
    }

    return true;
  }

  async deleteVideoTask(id: string): Promise<boolean> {
    const supabase = this.getSupabase();
    const { error } = await supabase.from("youtube_video_tasks").delete().eq("id", id);
    if (error) {
      logger.error("Supabase error deleting video task", { error });
      throw new Error(`Database Delete Failed: ${error.message}`);
    }

    return true;
  }

  async getVaultAssets(): Promise<VaultAsset[]> {
    try {
      const supabase = this.getSupabase();
      const { data } = await supabase
        .from("resources")
        .select("*")
        .eq("module", "YOUTUBE")
        .eq("category", "VAULT_ASSET")
        .order("created_at", { ascending: false });

      if (!data) return [];
      
      return data.map((r: any) => {
        let metaObj = { realType: 'image', size: 'Unknown Size', realCategory: r.category || 'Uncategorized' };
        try {
          if (r.metadata) metaObj = JSON.parse(r.metadata);
        } catch(e) {}
        
        return {
          id: r.id,
          name: r.title,
          category: metaObj.realCategory || 'Uncategorized',
          tags: r.tags || [],
          preview_url: r.url,
          type: (metaObj.realType || 'image') as VaultAsset['type'],
          size: metaObj.size || 'Unknown Size',
          date_added: new Date(r.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
          is_favorite: r.priority === 'HIGH',
          description: r.description || '',
        };
      });
    } catch (_) {
      return [];
    }
  }

  async getResources(): Promise<YouTubeResource[]> {
    try {
      const supabase = this.getSupabase();
      const { data } = await supabase
        .from("resources")
        .select("*")
        .eq("module", "YOUTUBE")
        .neq("category", "VAULT_ASSET")
        .order("created_at", { ascending: false });

      return (data || []) as YouTubeResource[];
    } catch (_) {
      return [];
    }
  }

  async getNotes(): Promise<YouTubeNote[]> {
    try {
      const supabase = this.getSupabase();
      const { data } = await supabase
        .from("notes")
        .select("*")
        .eq("module", "YOUTUBE")
        .order("created_at", { ascending: false });

      return (data || []) as YouTubeNote[];
    } catch (_) {
      return [];
    }
  }
}

export const youtubeRepository = new YouTubeRepository();
