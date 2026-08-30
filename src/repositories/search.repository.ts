import { createClient } from "@supabase/supabase-js";
import { logger } from "@/lib/logger";
import { SearchResultItem } from "@/components/dashboard/universal-search-modal";

export class SearchRepository {
  private getSupabase() {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "https://otjslotfiiubgehiucmn.supabase.co",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_e9C8vUd9Xnwk6DZIEJOQLw_0x4pwPWk"
    );
  }

  async globalSearch(query: string): Promise<SearchResultItem[]> {
    if (!query || query.length < 2) return [];
    
    const supabase = this.getSupabase();
    const searchPattern = `%${query}%`;
    const results: SearchResultItem[] = [];

    const promises = [
      // 1. Search Notes
      supabase.from("notes").select("id, title, module, content").or(`title.ilike.${searchPattern},content.ilike.${searchPattern}`).limit(5),
      
      // 2. Search Resources & Vault Assets
      supabase.from("resources").select("id, title, module, category, metadata").or(`title.ilike.${searchPattern},metadata.ilike.${searchPattern},description.ilike.${searchPattern}`).limit(5),
      
      // 3. Search Documents
      supabase.from("documents").select("id, file_name, folder").ilike("file_name", searchPattern).limit(5),
      
      // 4. Search Subjects
      supabase.from("subjects").select("id, name, module").ilike("name", searchPattern).limit(5),

      // 4b. Search Topics
      supabase.from("topics").select("id, name, subject_id").ilike("name", searchPattern).limit(5),
      
      // 5. Search YouTube Video Tasks
      supabase.from("youtube_video_tasks").select("id, title, category").ilike("title", searchPattern).limit(5),
      
      // 6. Search Companies ATS
      supabase.from("companies").select("id, company_name, role").ilike("company_name", searchPattern).limit(5)
    ];

    const responses = await Promise.allSettled(promises);

    // Process Notes
    if (responses[0].status === "fulfilled" && responses[0].value.data) {
      responses[0].value.data.forEach((note: any) => {
        let url = "/";
        if (note.module === "YOUTUBE") url = "/modules/youtube";
        else if (note.module === "CGL") url = "/modules/cgl";
        else if (note.module === "PLACEMENT") url = "/modules/placement";
        else if (note.module === "EXAMS") url = "/modules/exams";

        results.push({
          id: `note-${note.id}`,
          title: note.title || "Untitled Note",
          subtitle: `Note • ${note.module}`,
          category: "Module",
          url: url
        });
      });
    }

    // Process Resources
    if (responses[1].status === "fulfilled" && responses[1].value.data) {
      responses[1].value.data.forEach((res: any) => {
        let url = "/";
        let cat: any = "Module";
        
        if (res.module === "YOUTUBE") { url = "/modules/youtube"; cat = "YouTube"; }
        else if (res.module === "CGL") { url = "/modules/cgl"; cat = "Exam"; }
        else if (res.module === "PLACEMENT") { url = "/modules/placement"; cat = "Placement"; }
        else if (res.module === "EXAMS") { url = "/modules/exams"; cat = "Exam"; }

        results.push({
          id: `res-${res.id}`,
          title: res.title || "Untitled Resource",
          subtitle: `${res.category === "VAULT_ASSET" ? "Vault Asset" : "Resource"} • ${res.module}`,
          category: cat,
          url: url
        });
      });
    }

    // Process Documents
    if (responses[2].status === "fulfilled" && responses[2].value.data) {
      responses[2].value.data.forEach((doc: any) => {
        results.push({
          id: `doc-${doc.id}`,
          title: doc.file_name,
          subtitle: `Document • ${doc.folder || "Uncategorized"}`,
          category: "Document",
          url: "/documents"
        });
      });
    }

    // Process Subjects
    if (responses[3].status === "fulfilled" && responses[3].value.data) {
      responses[3].value.data.forEach((sub: any) => {
        let url = "/";
        if (sub.module === "PLACEMENT") url = "/modules/placement";
        else url = "/modules/exams";
        results.push({
          id: `sub-${sub.id}`,
          title: sub.name,
          subtitle: `Subject Tracker • ${sub.module}`,
          category: "Module",
          url: url
        });
      });
    }

    // Process Topics
    if (responses[4].status === "fulfilled" && responses[4].value.data) {
      responses[4].value.data.forEach((topic: any) => {
        results.push({
          id: `topic-${topic.id}`,
          title: topic.name,
          subtitle: `Topic Tracker`,
          category: "Topic",
          url: "/"
        });
      });
    }

    // Process YouTube Tasks
    if (responses[5].status === "fulfilled" && responses[5].value.data) {
      responses[5].value.data.forEach((task: any) => {
        results.push({
          id: `yt-${task.id}`,
          title: task.title,
          subtitle: `Video Task • ${task.category}`,
          category: "YouTube",
          url: "/modules/youtube"
        });
      });
    }

    // Process Companies
    if (responses[6].status === "fulfilled" && responses[6].value.data) {
      responses[6].value.data.forEach((comp: any) => {
        results.push({
          id: `comp-${comp.id}`,
          title: comp.company_name,
          subtitle: `ATS • ${comp.role}`,
          category: "Company",
          url: "/companies"
        });
      });
    }

    return results;
  }
}

export const searchRepository = new SearchRepository();
