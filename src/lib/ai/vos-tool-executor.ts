import { createClient } from "@supabase/supabase-js";
import { trackerRepository } from "@/repositories/tracker.repository";
import { companiesRepository } from "@/repositories/companies.repository";
import { NotesRepository } from "@/repositories/notes.repository";
import { documentsRepository } from "@/repositories/documents.repository";
import { tasksRepository } from "@/repositories/tasks.repository";
import { searchRepository } from "@/repositories/search.repository";
import { executeWebSearch, fetchWebpageContent } from "./web-search";
import { logger } from "@/lib/logger";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://otjslotfiiubgehiucmn.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_e9C8vUd9Xnwk6DZIEJOQLw_0x4pwPWk"
  );
}

export interface ToolExecutionResult {
  success: boolean;
  data?: any;
  message: string;
  navigatedTo?: string;
  citations?: Array<{ title: string; url: string; snippet?: string }>;
  error?: string;
}

export async function executeVOSTool(name: string, args: Record<string, any>): Promise<ToolExecutionResult> {
  const supabase = getSupabase();
  logger.info("[VOSToolExecutor] Executing tool: " + name, { args });

  try {
    switch (name) {
      case "vos_navigate": {
        const route = args.route || "/";
        return {
          success: true,
          navigatedTo: route,
          message: "Navigated to " + route,
        };
      }

      case "vos_open_entity": {
        const { entity_type, subject_id, module_name, topic_id, company_id, document_id } = args;
        let targetRoute = "/";

        if (entity_type === "subject" || entity_type === "module" || entity_type === "topic") {
          targetRoute = "/modules/placement";
          const params = new URLSearchParams();
          if (subject_id) params.set("subjectId", subject_id);
          if (module_name) params.set("module", module_name);
          if (topic_id) params.set("topicId", topic_id);
          if (params.toString()) targetRoute += "?" + params.toString();
        } else if (entity_type === "company") {
          targetRoute = company_id ? "/companies?id=" + company_id : "/companies";
        } else if (entity_type === "document") {
          targetRoute = document_id ? "/documents?id=" + document_id : "/documents";
        }

        return {
          success: true,
          navigatedTo: targetRoute,
          message: "Opening " + entity_type + ": " + targetRoute,
        };
      }

      case "vos_get_timetable": {
        let query = supabase.from("daily_timetable").select("*").eq("is_active", true);
        if (args.day_of_week !== undefined) {
          query = query.contains("day_of_week", [Number(args.day_of_week)]);
        }
        const { data, error } = await query.order("start_time", { ascending: true });
        if (error) throw error;
        return {
          success: true,
          data: data || [],
          message: "Found " + (data ? data.length : 0) + " timetable entries.",
        };
      }

      case "vos_create_timetable_block": {
        const startTime = args.start_time && args.start_time.includes(":") && args.start_time.split(":").length === 2 ? args.start_time + ":00" : args.start_time;
        const endTime = args.end_time && args.end_time.includes(":") && args.end_time.split(":").length === 2 ? args.end_time + ":00" : args.end_time;
        const newEntry = {
          id: crypto.randomUUID(),
          title: args.title,
          start_time: startTime,
          end_time: endTime,
          day_of_week: Array.isArray(args.day_of_week) ? args.day_of_week : [args.day_of_week],
          category: args.category || "General",
          priority: args.priority || "MEDIUM",
          status: "upcoming",
          recurring: true,
          is_active: true,
          color_tag: args.category || "General",
        };
        const { data, error } = await supabase.from("daily_timetable").insert([newEntry]).select().single();
        if (error) throw error;
        return {
          success: true,
          data,
          message: "Created timetable block " + data.title + " (" + data.start_time.slice(0,5) + " - " + data.end_time.slice(0,5) + ").",
        };
      }

      case "vos_update_timetable_block": {
        let targetId = args.id;
        if (!targetId && args.title) {
          const { data: matched } = await supabase.from("daily_timetable").select("id").ilike("title", "%" + args.title + "%").limit(1).maybeSingle();
          if (matched) targetId = matched.id;
        }
        if (!targetId) throw new Error("Timetable block ID or title match not found");
        const updates: any = { updated_at: new Date().toISOString() };
        if (args.title) updates["title"] = args.title;
        if (args.start_time) updates["start_time"] = args.start_time.length === 5 ? args.start_time + ":00" : args.start_time;
        if (args.end_time) updates["end_time"] = args.end_time.length === 5 ? args.end_time + ":00" : args.end_time;
        if (args.day_of_week) updates["day_of_week"] = Array.isArray(args.day_of_week) ? args.day_of_week : [args.day_of_week];
        if (args.category) { updates["category"] = args.category; updates["color_tag"] = args.category; }
        if (args.priority) updates["priority"] = args.priority;
        const { data, error } = await supabase.from("daily_timetable").update(updates).eq("id", targetId).select().single();
        if (error) throw error;
        return {
          success: true,
          data,
          message: "Updated timetable block " + data.title + ".",
        };
      }

      case "vos_delete_timetable_block": {
        let targetId = args.id;
        if (!targetId && args.title) {
          const { data: matched } = await supabase.from("daily_timetable").select("id, title").ilike("title", "%" + args.title + "%").limit(1).maybeSingle();
          if (matched) targetId = matched.id;
        }
        if (!targetId) throw new Error("Timetable block ID or matching title not found");
        const { error } = await supabase.from("daily_timetable").delete().eq("id", targetId);
        if (error) throw error;
        return {
          success: true,
          message: "Deleted timetable block (ID: " + targetId + ").",
        };
      }

      case "vos_bulk_import_timetable": {
        const blocks = args.blocks || [];
        if (blocks.length === 0) throw new Error("No blocks provided for import");
        if (args.mode === "replace") {
          const daysToReplace = Array.from(new Set(blocks.flatMap((b: any) => b.day_of_week || [])));
          for (const d of daysToReplace) {
            await supabase.from("daily_timetable").delete().contains("day_of_week", [d]);
          }
        }
        const rows = blocks.map((b: any) => ({
          id: crypto.randomUUID(),
          title: b.title,
          start_time: b.start_time.length === 5 ? b.start_time + ":00" : b.start_time,
          end_time: b.end_time.length === 5 ? b.end_time + ":00" : b.end_time,
          day_of_week: Array.isArray(b.day_of_week) ? b.day_of_week : [b.day_of_week],
          category: b.category || "Learning",
          priority: b.priority || "MEDIUM",
          status: "upcoming",
          recurring: true,
          is_active: true,
          color_tag: b.category || "Learning",
        }));
        const { data, error } = await supabase.from("daily_timetable").insert(rows).select();
        if (error) throw error;
        return {
          success: true,
          data: { imported_count: data ? data.length : 0 },
          message: "Successfully imported " + (data ? data.length : 0) + " timetable blocks into Supabase.",
        };
      }

      case "vos_create_subject": {
        const subject = await trackerRepository.createSubject({
          name: args.name,
          module: (args.module || "PLACEMENT").toUpperCase(),
          description: args.description || "",
        });
        return {
          success: true,
          data: subject,
          message: "Created Subject " + subject.name + " in " + subject.module + " (ID: " + subject.id + ").",
        };
      }

      case "vos_rename_subject": {
        let targetId = args.id;
        if (!targetId && args.name) {
          const { data: matched } = await supabase.from("subjects").select("id").ilike("name", "%" + args.name + "%").limit(1).maybeSingle();
          if (matched) targetId = matched.id;
        }
        if (!targetId) throw new Error("Subject ID or name not found");
        await trackerRepository.renameSubject(targetId, args.new_name);
        return {
          success: true,
          message: "Renamed subject to " + args.new_name + ".",
        };
      }

      case "vos_delete_subject": {
        let targetId = args.id;
        if (!targetId && args.name) {
          const { data: matched } = await supabase.from("subjects").select("id").ilike("name", "%" + args.name + "%").limit(1).maybeSingle();
          if (matched) targetId = matched.id;
        }
        if (!targetId) throw new Error("Subject not found");
        await supabase.from("topics").delete().eq("subject_id", targetId);
        await trackerRepository.deleteSubject(targetId);
        return {
          success: true,
          message: "Deleted subject (ID: " + targetId + ") and all associated topics.",
        };
      }

      case "vos_create_topic": {
        let targetSubjectId = args.subject_id;
        if (!targetSubjectId && args.subject_name) {
          const { data: matched } = await supabase.from("subjects").select("id").ilike("name", "%" + args.subject_name + "%").limit(1).maybeSingle();
          if (matched) targetSubjectId = matched.id;
        }
        if (!targetSubjectId) {
          const { data: dsa } = await supabase.from("subjects").select("id").limit(1).maybeSingle();
          targetSubjectId = dsa?.id || "796ccd5f-b9ec-4b0f-810f-c9fafa72b8bf";
        }
        const topic = await trackerRepository.createTopic({
          subject_id: targetSubjectId,
          name: args.name,
          description: args.description || "Module 01: General",
          difficulty: args.difficulty || "Medium",
          notes: args.duration ? "Duration: " + args.duration : "",
        });
        return {
          success: true,
          data: topic,
          message: "Created topic " + topic.name + " under " + topic.description + " (ID: " + topic.id + ").",
        };
      }

      case "vos_update_topic": {
        let targetTopicId = args.id;
        if (!targetTopicId && args.name) {
          const { data: matched } = await supabase.from("topics").select("id").ilike("name", "%" + args.name + "%").limit(1).maybeSingle();
          if (matched) targetTopicId = matched.id;
        }
        if (!targetTopicId) throw new Error("Topic not found");
        const updates: any = { updated_at: new Date().toISOString() };
        if (args.new_name) updates["name"] = args.new_name;
        if (args.description) updates["description"] = args.description;
        if (args.duration) updates["notes"] = "Duration: " + args.duration;
        if (args.difficulty) updates["difficulty"] = args.difficulty;
        const { data, error } = await supabase.from("topics").update(updates).eq("id", targetTopicId).select().single();
        if (error) throw error;
        return {
          success: true,
          data,
          message: "Updated topic " + data.name + ".",
        };
      }

      case "vos_update_topic_milestone": {
        let targetTopicId = args.id;
        if (!targetTopicId && args.topic_name) {
          const { data: matched } = await supabase.from("topics").select("id").ilike("name", "%" + args.topic_name + "%").limit(1).maybeSingle();
          if (matched) targetTopicId = matched.id;
        }
        if (!targetTopicId) throw new Error("Topic not found");
        await trackerRepository.updateTopicMilestone(targetTopicId, args.milestone, Boolean(args.value));
        return {
          success: true,
          message: "Set milestone " + args.milestone + " to " + args.value + " for topic " + targetTopicId + ".",
        };
      }

      case "vos_delete_topic": {
        let targetTopicId = args.id;
        if (!targetTopicId && args.name) {
          const { data: matched } = await supabase.from("topics").select("id").ilike("name", "%" + args.name + "%").limit(1).maybeSingle();
          if (matched) targetTopicId = matched.id;
        }
        if (!targetTopicId) throw new Error("Topic not found");
        await trackerRepository.deleteTopic(targetTopicId);
        return {
          success: true,
          message: "Deleted topic (ID: " + targetTopicId + ").",
        };
      }

      case "vos_bulk_import_syllabus": {
        let targetSubjectId = args.subject_id;
        if (!targetSubjectId && args.subject_name) {
          const { data: matched } = await supabase.from("subjects").select("id").ilike("name", "%" + args.subject_name + "%").limit(1).maybeSingle();
          if (matched) targetSubjectId = matched.id;
        }
        if (!targetSubjectId) {
          const createdSubject = await trackerRepository.createSubject({
            name: args.subject_name || "New Syllabus",
            module: "PLACEMENT",
          });
          targetSubjectId = createdSubject.id;
        }
        const topics = args.topics || [];
        const defaultModule = args.module_name || "Module 01: General";
        let insertedCount = 0;
        for (let i = 0; i < topics.length; i++) {
          const t = topics[i];
          await trackerRepository.createTopic({
            subject_id: targetSubjectId,
            name: t.name,
            description: t.description || defaultModule,
            difficulty: t.difficulty || "Medium",
            notes: t.duration ? "Duration: " + t.duration : "",
            order_index: i + 1,
          });
          insertedCount++;
        }
        return {
          success: true,
          data: { total: topics.length, inserted: insertedCount, subject_id: targetSubjectId },
          message: "Successfully imported " + insertedCount + " topics under Subject (ID: " + targetSubjectId + ").",
        };
      }

      case "vos_get_companies": {
        const comps = await companiesRepository.getCompanies();
        const filtered = args.status ? comps.filter(c => c.status.toLowerCase() === args.status.toLowerCase()) : comps;
        return {
          success: true,
          data: filtered,
          message: "Found " + filtered.length + " company applications.",
        };
      }

      case "vos_create_company": {
        const company = await companiesRepository.createCompany({
          company_name: args.company_name,
          role: args.role || "Software Engineer",
          status: (args.status || "Applied") as any,
          applied_date: args.applied_date || new Date().toISOString().split("T")[0],
          job_link: args.job_link || "",
          location: args.location || "Remote",
          notes: args.notes || "",
          logo_url: "default",
          application_mode: (args.application_mode || "Careers Page") as any,
        });
        return {
          success: true,
          data: company,
          message: "Added company application for " + company.company_name + " (" + company.role + ") with status " + company.status + ".",
        };
      }

      case "vos_update_company": {
        let targetId = args.id;
        if (!targetId && args.company_name) {
          const { data: matched } = await supabase.from("company_applications").select("id").ilike("company_name", "%" + args.company_name + "%").limit(1).maybeSingle();
          if (matched) targetId = matched.id;
        }
        if (!targetId) throw new Error("Company record not found");
        const updates: any = {};
        if (args.status) updates["status"] = args.status;
        if (args.role) updates["role"] = args.role;
        if (args.notes) updates["notes"] = args.notes;
        if (args.location) updates["location"] = args.location;
        await companiesRepository.updateCompanyDetails(targetId, updates);
        return {
          success: true,
          message: "Updated company application (ID: " + targetId + ").",
        };
      }

      case "vos_delete_company": {
        let targetId = args.id;
        if (!targetId && args.company_name) {
          const { data: matched } = await supabase.from("company_applications").select("id").ilike("company_name", "%" + args.company_name + "%").limit(1).maybeSingle();
          if (matched) targetId = matched.id;
        }
        if (!targetId) throw new Error("Company record not found");
        await companiesRepository.deleteCompany(targetId);
        return {
          success: true,
          message: "Deleted company application (ID: " + targetId + ").",
        };
      }

      case "vos_get_tasks": {
        let tasks = await tasksRepository.getTodaysTasks();
        if (args.completed !== undefined) {
          tasks = tasks.filter(t => t.completed === args.completed);
        }
        return {
          success: true,
          data: tasks,
          message: "Found " + tasks.length + " priority tasks.",
        };
      }

      case "vos_create_task": {
        const task = await tasksRepository.createTask({
          title: args.title,
          category: args.category || "General",
          priority_level: args.priority_level || "MEDIUM",
          due_date: args.due_date || new Date().toISOString().split("T")[0],
          subtitle: args.subtitle || "",
          completed: false,
        });
        return {
          success: true,
          data: task,
          message: "Created priority task " + task?.title + " (" + task?.priority_level + " Priority).",
        };
      }

      case "vos_update_task": {
        let targetId = args.id;
        if (!targetId && args.title) {
          const { data: matched } = await supabase.from("daily_tasks").select("id").ilike("title", "%" + args.title + "%").limit(1).maybeSingle();
          if (matched) targetId = matched.id;
        }
        if (!targetId) throw new Error("Task not found");
        const updates: any = {};
        if (args.new_title) updates["title"] = args.new_title;
        if (args.priority_level) updates["priority_level"] = args.priority_level;
        if (args.due_date) updates["due_date"] = args.due_date;
        if (args.category) updates["category"] = args.category;
        await tasksRepository.editTask(targetId, undefined, updates);
        return {
          success: true,
          message: "Updated task (ID: " + targetId + ").",
        };
      }

      case "vos_toggle_task": {
        let targetId = args.id;
        if (!targetId && args.title) {
          const { data: matched } = await supabase.from("daily_tasks").select("id, title").ilike("title", "%" + args.title + "%").limit(1).maybeSingle();
          if (matched) targetId = matched.id;
        }
        if (!targetId) throw new Error("Task not found");
        await tasksRepository.toggleComplete(targetId, undefined, Boolean(args.completed));
        return {
          success: true,
          message: "Marked task " + targetId + " as " + (args.completed ? "completed" : "pending") + ".",
        };
      }

      case "vos_delete_task": {
        let targetId = args.id;
        if (!targetId && args.title) {
          const { data: matched } = await supabase.from("daily_tasks").select("id").ilike("title", "%" + args.title + "%").limit(1).maybeSingle();
          if (matched) targetId = matched.id;
        }
        if (!targetId) throw new Error("Task not found");
        await tasksRepository.deleteTask(targetId);
        return {
          success: true,
          message: "Deleted priority task (ID: " + targetId + ").",
        };
      }

      case "vos_create_note": {
        const note = await NotesRepository.create({
          title: args.title,
          content: args.content,
          module: (args.module || "GENERAL").toUpperCase() as any,
          category: args.category || "General",
          tags: args.tags || [],
        });
        return {
          success: true,
          data: note,
          message: "Created note " + note.title + " in " + note.module + " module.",
        };
      }

      case "vos_update_note": {
        let targetId = args.id;
        if (!targetId && args.title) {
          const { data: matched } = await supabase.from("notes").select("id").ilike("title", "%" + args.title + "%").limit(1).maybeSingle();
          if (matched) targetId = matched.id;
        }
        if (!targetId) throw new Error("Note not found");
        const updates: any = {};
        if (args.new_title) updates["title"] = args.new_title;
        if (args.content) updates["content"] = args.content;
        if (args.category) updates["category"] = args.category;
        if (args.tags) updates["tags"] = args.tags;
        const updated = await NotesRepository.update(targetId, updates);
        return {
          success: true,
          data: updated,
          message: "Updated note " + updated.title + ".",
        };
      }

      case "vos_delete_note": {
        let targetId = args.id;
        if (!targetId && args.title) {
          const { data: matched } = await supabase.from("notes").select("id").ilike("title", "%" + args.title + "%").limit(1).maybeSingle();
          if (matched) targetId = matched.id;
        }
        if (!targetId) throw new Error("Note not found");
        await NotesRepository.delete(targetId);
        return {
          success: true,
          message: "Deleted note (ID: " + targetId + ").",
        };
      }

      case "vos_create_document": {
        const doc = await documentsRepository.createDocument({
          name: args.name,
          type: (args.type || "PDF") as any,
          category: (args.category || "Placement") as any,
          download_url: args.download_url || "",
          path: "documents/" + args.name,
          folder_id: args.folder_id || null,
          size: args.size || "1.2 MB",
          modified_date: new Date().toISOString().split("T")[0],
          tags: args.tags || [],
        });
        return {
          success: true,
          data: doc,
          message: "Registered document " + doc.name + " in vault.",
        };
      }

      case "vos_search_documents": {
        const docs = await documentsRepository.getDocuments();
        const q = (args.query || "").toLowerCase();
        const matches = docs.filter(d => d.name.toLowerCase().includes(q) || (d.category && d.category.toLowerCase().includes(q)));
        return {
          success: true,
          data: matches,
          message: "Found " + matches.length + " matching documents.",
        };
      }

      case "vos_global_search": {
        const results = await searchRepository.globalSearch(args.query);
        return {
          success: true,
          data: results,
          message: "Found " + results.length + " search results in VOS.",
        };
      }

      case "vos_web_search": {
        const query = args.query;
        const maxResults = args.max_results || 5;
        const searchResults = await executeWebSearch(query, maxResults);
        return {
          success: true,
          data: searchResults,
          citations: searchResults,
          message: "Retrieved " + searchResults.length + " live web search results for " + query + ".",
        };
      }

      case "vos_fetch_webpage": {
        const content = await fetchWebpageContent(args.url);
        return {
          success: true,
          data: { content },
          message: "Fetched webpage content from " + args.url + ".",
        };
      }

      case "vos_translate_explain": {
        return {
          success: true,
          data: { text: args.text, action: args.action },
          message: "Cognitive request processed.",
        };
      }

      default: {
        return {
          success: false,
          error: "Tool " + name + " is not implemented on server.",
          message: "Tool " + name + " not found.",
        };
      }
    }
  } catch (err: any) {
    logger.error("[VOSToolExecutor] Tool error for " + name, { err, args });
    return {
      success: false,
      error: err?.message || "Execution error",
      message: "Failed to execute " + name + ": " + (err?.message || "Internal error"),
    };
  }
}
