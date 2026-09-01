import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://otjslotfiiubgehiucmn.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_e9C8vUd9Xnwk6DZIEJOQLw_0x4pwPWk"
  );
}

const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;

export async function buildVOSSystemContext(currentRoute?: string): Promise<string> {
  const supabase = getSupabase();
  const nowIST = new Date(Date.now() + IST_OFFSET_MS);
  const todayStr = nowIST.toISOString().split("T")[0];
  const dayOfWeek = nowIST.getUTCDay(); // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDayName = dayNames[dayOfWeek];
  const timeStr = nowIST.toISOString().split("T")[1].slice(0, 8) + " IST";

  let dayRule = "New Learning + Practice";
  if (dayOfWeek === 1 || dayOfWeek === 2) {
    dayRule = "College Day (Study Timetable Off • Morning Routine + College Lectures/Labs + Evening Review/VOS)";
  } else if (dayOfWeek === 0) {
    dayRule = "Sunday Revision Day (Weekly DSA Test & Mistake Analysis + CS Revision + Next Week Plan)";
  }

  let streakInfo = "0 Days";
  let activeTasksSummary = "No active tasks";
  let timetableSummary = "No active blocks";
  let curriculumSummary = "518 videos";

  try {
    const [streakRes, tasksRes, timetableRes, topicsRes] = await Promise.allSettled([
      supabase.from("streaks").select("*").limit(1).maybeSingle(),
      supabase.from("daily_tasks").select("title, priority_level").eq("is_active", true).eq("completed", false).limit(5),
      supabase.from("daily_timetable").select("title, start_time, end_time, category").eq("is_active", true).contains("day_of_week", [dayOfWeek]).order("start_time", { ascending: true }),
      supabase.from("topics").select("id, is_mastered, is_learned").limit(600),
    ]);

    if (streakRes.status === "fulfilled" && streakRes.value.data) {
      streakInfo = `${streakRes.value.data.current_streak || 0} Days (Longest: ${streakRes.value.data.longest_streak || 0} Days)`;
    }

    if (tasksRes.status === "fulfilled" && tasksRes.value.data) {
      const list = tasksRes.value.data;
      activeTasksSummary = list.length > 0 ? list.map(t => `"${t.title}" [${t.priority_level}]`).join(", ") : "All tasks completed";
    }

    if (timetableRes.status === "fulfilled" && timetableRes.value.data) {
      const blocks = timetableRes.value.data;
      timetableSummary = blocks.length > 0 ? blocks.map(b => `${b.start_time.slice(0,5)}-${b.end_time.slice(0,5)} ${b.title} (${b.category})`).join(" | ") : "Free schedule";
    }

    if (topicsRes.status === "fulfilled" && topicsRes.value.data) {
      const all = topicsRes.value.data;
      const learned = all.filter(t => t.is_learned).length;
      const mastered = all.filter(t => t.is_mastered).length;
      curriculumSummary = `${all.length} Total Topics (${learned} Learned, ${mastered} Mastered)`;
    }
  } catch (err) {}

  return `You are Vansh AI, the autonomous operating system intelligence agent of Vansh OS (VOS).

CORE OPERATING DIRECTIVE:
1. When the user gives an actionable command (e.g. "Add DBMS", "Delete this topic", "Import this timetable", "Create a note", "Search for X", "Open Placement"), you MUST IMMEDIATELY call the appropriate tool.
2. DO NOT respond with "I can help you add this" or merely explain how to do it. DO THE WORK by calling the tool and report the real result.
3. You can execute multiple tools in sequence (multi-step workflow) to inspect state, perform actions, and verify results.
4. For translation or conceptual questions, provide direct, high-clarity answers.
5. If the user attaches or uploads a document/PDF/image, analyze the contents, extract structured information, and perform the requested actions.

LIVE VOS TELEMETRY CONTEXT:
- Real-Time: ${currentDayName}, ${todayStr} at ${timeStr}
- Day Rule: ${dayRule}
- Current Screen/Route: ${currentRoute || "/"}
- Streak Status: ${streakInfo}
- Incomplete Priorities: ${activeTasksSummary}
- Today's Scheduled Blocks: ${timetableSummary}
- Placement Curriculum Stats: ${curriculumSummary}

Always be concise, confident, and accurate. When an action completes, summarize what was executed cleanly.`;
}
