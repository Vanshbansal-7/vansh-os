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
    if (!query || query.trim().length < 2) return [];

    const supabase = this.getSupabase();
    const cleanQuery = query.trim();
    const searchPattern = `%${cleanQuery}%`;
    const results: SearchResultItem[] = [];

    const promises = [
      // 1. Search Topics (Videos & Lectures) - Match name or description (module name)
      supabase
        .from("topics")
        .select("id, name, description, notes, subject_id, subjects(id, name, module)")
        .or(`name.ilike.${searchPattern},description.ilike.${searchPattern}`)
        .limit(15),

      // 2. Search Subjects & Modules
      supabase
        .from("subjects")
        .select("id, name, module, description")
        .ilike("name", searchPattern)
        .limit(8),

      // 3. Search Companies ATS
      supabase
        .from("companies")
        .select("id, company_name, role, status, salary_range")
        .or(`company_name.ilike.${searchPattern},role.ilike.${searchPattern}`)
        .limit(8),

      // 4. Search Documents & Vault Files
      supabase
        .from("documents")
        .select("id, file_name, folder, tags")
        .or(`file_name.ilike.${searchPattern},folder.ilike.${searchPattern}`)
        .limit(8),

      // 5. Search YouTube Video Tasks
      supabase
        .from("youtube_video_tasks")
        .select("id, title, category, status")
        .ilike("title", searchPattern)
        .limit(8),

      // 6. Search Resources & Vault Assets
      supabase
        .from("resources")
        .select("id, title, module, category, url, display_url")
        .or(`title.ilike.${searchPattern},description.ilike.${searchPattern}`)
        .limit(8),

      // 7. Search Notes & Documentation
      supabase
        .from("notes")
        .select("id, title, module, content")
        .or(`title.ilike.${searchPattern},content.ilike.${searchPattern}`)
        .limit(8),

      // 8. Search Tasks & Today's Priorities
      supabase
        .from("tasks")
        .select("id, title, priority, status")
        .ilike("title", searchPattern)
        .limit(6),

      // 9. Search Timetable Blocks
      supabase
        .from("timetable_blocks")
        .select("id, title, category, start_time, end_time")
        .ilike("title", searchPattern)
        .limit(6),
    ];

    const responses = await Promise.allSettled(promises);

    // Process 1: Topics (Video Lectures)
    if (responses[0].status === "fulfilled" && responses[0].value.data) {
      responses[0].value.data.forEach((topic: any) => {
        const subj = Array.isArray(topic.subjects) ? topic.subjects[0] : topic.subjects;
        const subjName = subj?.name || "DSA";
        const subjModule = subj?.module || "PLACEMENT";
        const moduleName = topic.description || "General";
        const durationStr = topic.notes ? ` • ${topic.notes}` : "";

        let navUrl = "/modules/placement";
        let cat: SearchResultItem["category"] = "Topic";

        if (subjModule === "CGL") {
          navUrl = `/modules/cgl?subjectId=${topic.subject_id}&module=${encodeURIComponent(moduleName)}&topicId=${topic.id}`;
          cat = "Exam";
        } else if (subjModule === "EXAMS") {
          navUrl = `/modules/exams?subjectId=${topic.subject_id}&module=${encodeURIComponent(moduleName)}&topicId=${topic.id}`;
          cat = "Exam";
        } else {
          navUrl = `/modules/placement?subjectId=${topic.subject_id}&module=${encodeURIComponent(moduleName)}&topicId=${topic.id}`;
          cat = "Placement";
        }

        results.push({
          id: `topic-${topic.id}`,
          title: topic.name,
          subtitle: `${subjName} • ${moduleName}${durationStr}`,
          category: cat,
          url: navUrl,
        });
      });
    }

    // Process 2: Subjects
    if (responses[1].status === "fulfilled" && responses[1].value.data) {
      responses[1].value.data.forEach((sub: any) => {
        let navUrl = "/modules/placement";
        let cat: SearchResultItem["category"] = "Placement";

        if (sub.module === "CGL") {
          navUrl = `/modules/cgl?subjectId=${sub.id}`;
          cat = "Exam";
        } else if (sub.module === "EXAMS") {
          navUrl = `/modules/exams?subjectId=${sub.id}`;
          cat = "Exam";
        } else {
          navUrl = `/modules/placement?subjectId=${sub.id}`;
          cat = "Placement";
        }

        results.push({
          id: `sub-${sub.id}`,
          title: sub.name,
          subtitle: `Subject • ${sub.module || "Tracker"}`,
          category: cat,
          url: navUrl,
        });
      });
    }

    // Process 3: Companies ATS
    if (responses[2].status === "fulfilled" && responses[2].value.data) {
      responses[2].value.data.forEach((comp: any) => {
        results.push({
          id: `comp-${comp.id}`,
          title: comp.company_name,
          subtitle: `ATS Application • ${comp.role || "Software Engineer"}${comp.status ? ` (${comp.status})` : ""}`,
          category: "Company",
          url: "/companies",
        });
      });
    }

    // Process 4: Documents Vault
    if (responses[3].status === "fulfilled" && responses[3].value.data) {
      responses[3].value.data.forEach((doc: any) => {
        results.push({
          id: `doc-${doc.id}`,
          title: doc.file_name,
          subtitle: `Document • ${doc.folder || "Vault"}`,
          category: "Document",
          url: "/documents",
        });
      });
    }

    // Process 5: YouTube Tasks
    if (responses[4].status === "fulfilled" && responses[4].value.data) {
      responses[4].value.data.forEach((task: any) => {
        results.push({
          id: `yt-${task.id}`,
          title: task.title,
          subtitle: `YouTube Task • ${task.category || "Production"}`,
          category: "YouTube",
          url: "/modules/youtube",
        });
      });
    }

    // Process 6: Resources
    if (responses[5].status === "fulfilled" && responses[5].value.data) {
      responses[5].value.data.forEach((res: any) => {
        let navUrl = "/modules/placement";
        if (res.module === "YOUTUBE") navUrl = "/modules/youtube";
        else if (res.module === "CGL") navUrl = "/modules/cgl";
        else if (res.module === "EXAMS") navUrl = "/modules/exams";

        results.push({
          id: `res-${res.id}`,
          title: res.title || "Untitled Resource",
          subtitle: `Resource • ${res.module || "Study Material"}`,
          category: res.module === "YOUTUBE" ? "YouTube" : "Placement",
          url: navUrl,
        });
      });
    }

    // Process 7: Notes
    if (responses[6].status === "fulfilled" && responses[6].value.data) {
      responses[6].value.data.forEach((note: any) => {
        let navUrl = "/modules/placement";
        if (note.module === "YOUTUBE") navUrl = "/modules/youtube";
        else if (note.module === "CGL") navUrl = "/modules/cgl";
        else if (note.module === "EXAMS") navUrl = "/modules/exams";

        results.push({
          id: `note-${note.id}`,
          title: note.title || "Untitled Note",
          subtitle: `Note • ${note.module || "General"}`,
          category: "Module",
          url: navUrl,
        });
      });
    }

    // Process 8: Tasks & Priorities
    if (responses[7].status === "fulfilled" && responses[7].value.data) {
      responses[7].value.data.forEach((task: any) => {
        results.push({
          id: `task-${task.id}`,
          title: task.title,
          subtitle: `Priority Item • ${task.priority || "HIGH"}`,
          category: "Priority",
          url: "/",
        });
      });
    }

    // Process 9: Timetable Blocks
    if (responses[8].status === "fulfilled" && responses[8].value.data) {
      responses[8].value.data.forEach((block: any) => {
        results.push({
          id: `time-${block.id}`,
          title: block.title,
          subtitle: `Timetable • ${block.start_time || ""} - ${block.end_time || ""}`,
          category: "Module",
          url: "/calendar",
        });
      });
    }

    return results;
  }
}

export const searchRepository = new SearchRepository();

