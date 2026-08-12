import { createClient } from "@supabase/supabase-js";
import { DocumentFolder, UserDocument } from "@/types/document";
import { logger } from "@/lib/logger";

export class DocumentsRepository {
  private getSupabase() {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "https://otjslotfiiubgehiucmn.supabase.co",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_e9C8vUd9Xnwk6DZIEJOQLw_0x4pwPWk"
    );
  }

  async getFolders(): Promise<DocumentFolder[]> {
    const supabase = this.getSupabase();
    const { data, error } = await supabase
      .from("document_folders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      logger.error("Supabase document_folders fetch error", { error });
      throw new Error(`Database Fetch Failed: ${error.message}`);
    }

    return (data || []) as DocumentFolder[];
  }

  async getDocuments(): Promise<UserDocument[]> {
    const supabase = this.getSupabase();
    const { data, error } = await supabase
      .from("user_documents")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      logger.error("Supabase user_documents fetch error", { error });
      throw new Error(`Database Fetch Failed: ${error.message}`);
    }

    return (data || []) as UserDocument[];
  }

  async createFolder(name: string, parentId?: string): Promise<DocumentFolder> {
    const newFolder: DocumentFolder = {
      id: crypto.randomUUID(),
      name,
      item_count: 0,
      parent_id: parentId,
    };

    const supabase = this.getSupabase();
    const { data, error } = await supabase.from("document_folders").insert({
      id: newFolder.id,
      name: newFolder.name,
      parent_id: parentId || null,
      item_count: 0,
    }).select("*").single();

    if (error) {
      logger.error("Supabase error inserting folder", { error });
      throw new Error(`Database Insert Failed: ${error.message}`);
    }

    return data as DocumentFolder;
  }

  async renameFolder(id: string, name: string): Promise<boolean> {
    const supabase = this.getSupabase();
    const { error } = await supabase
      .from("document_folders")
      .update({ name, updated_at: new Date().toISOString() })
      .eq("id", id);
      
    if (error) {
      logger.error("Supabase error renaming folder", { error });
      throw new Error(`Database Update Failed: ${error.message}`);
    }

    return true;
  }

  async deleteFolder(id: string): Promise<boolean> {
    const supabase = this.getSupabase();
    const { error } = await supabase.from("document_folders").delete().eq("id", id);
    if (error) {
      logger.error("Supabase error deleting folder", { error });
      throw new Error(`Database Delete Failed: ${error.message}`);
    }
    return true;
  }

  async createDocument(doc: Omit<UserDocument, "id">): Promise<UserDocument> {
    const newDoc: UserDocument = {
      id: crypto.randomUUID(),
      ...doc,
    };

    const supabase = this.getSupabase();
    const { data, error } = await supabase.from("user_documents").insert({
      id: newDoc.id,
      folder_id: newDoc.folder_id || null,
      name: newDoc.name,
      path: newDoc.path,
      type: newDoc.type,
      category: newDoc.category,
      size: newDoc.size || "0 KB",
      download_url: newDoc.download_url || "",
      tags: newDoc.tags || [],
      is_favorite: newDoc.is_favorite || false,
      is_pinned: newDoc.is_pinned || false,
    }).select("*").single();

    if (error) {
      logger.error("Supabase error inserting document", { error });
      throw new Error(`Database Insert Failed: ${error.message}`);
    }

    return data as UserDocument;
  }

  async renameDocument(id: string, name: string): Promise<boolean> {
    const supabase = this.getSupabase();
    const { error } = await supabase
      .from("user_documents")
      .update({ name, updated_at: new Date().toISOString() })
      .eq("id", id);
      
    if (error) {
      logger.error("Supabase error renaming document", { error });
      throw new Error(`Database Update Failed: ${error.message}`);
    }

    return true;
  }

  async moveDocument(id: string, folderId: string | null): Promise<boolean> {
    const supabase = this.getSupabase();
    const { error } = await supabase
      .from("user_documents")
      .update({ folder_id: folderId, updated_at: new Date().toISOString() })
      .eq("id", id);
      
    if (error) {
      logger.error("Supabase error moving document", { error });
      throw new Error(`Database Update Failed: ${error.message}`);
    }

    return true;
  }

  async toggleFavorite(id: string, isFavorite: boolean): Promise<boolean> {
    const supabase = this.getSupabase();
    const { error } = await supabase
      .from("user_documents")
      .update({ is_favorite: isFavorite, updated_at: new Date().toISOString() })
      .eq("id", id);
      
    if (error) {
      logger.error("Supabase error toggling favorite", { error });
      throw new Error(`Database Update Failed: ${error.message}`);
    }

    return true;
  }

  async togglePin(id: string, isPinned: boolean): Promise<boolean> {
    const supabase = this.getSupabase();
    const { error } = await supabase
      .from("user_documents")
      .update({ is_pinned: isPinned, updated_at: new Date().toISOString() })
      .eq("id", id);
      
    if (error) {
      logger.error("Supabase error toggling pin", { error });
      throw new Error(`Database Update Failed: ${error.message}`);
    }

    return true;
  }

  async deleteDocument(id: string): Promise<boolean> {
    const supabase = this.getSupabase();
    const { error } = await supabase.from("user_documents").delete().eq("id", id);
    if (error) {
      logger.error("Supabase error deleting document", { error });
      throw new Error(`Database Delete Failed: ${error.message}`);
    }
    return true;
  }
}

export const documentsRepository = new DocumentsRepository();
