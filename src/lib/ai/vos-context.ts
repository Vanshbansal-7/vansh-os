import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://otjslotfiiubgehiucmn.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_e9C8vUd9Xnwk6DZIEJOQLw_0x4pwPWk"
  );
}

const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;

// Cache telemetry in memory for 2 minutes to prevent repeated DB latency on every message
let cachedTelemetry: {
  timestamp: number;
  streakInfo: string;
  activeTasks: string;
} | null = null;

async function getCachedTelemetry() {
  const now = Date.now();
  if (cachedTelemetry && (now - cachedTelemetry.timestamp < 120000)) {
    return cachedTelemetry;
  }

  let streakInfo = "5 Days";
  let activeTasks = "Daily Priorities";

  try {
    const supabase = getSupabase();
    const [streakRes, tasksRes] = await Promise.allSettled([
      supabase.from("streaks").select("current_streak").limit(1).maybeSingle(),
      supabase.from("daily_tasks").select("title").eq("completed", false).limit(3),
    ]);

    if (streakRes.status === "fulfilled" && streakRes.value.data) {
      streakInfo = `${streakRes.value.data.current_streak || 0} Days`;
    }
    if (tasksRes.status === "fulfilled" && tasksRes.value.data) {
      activeTasks = tasksRes.value.data.map((t: any) => t.title).join(", ") || "None";
    }

    cachedTelemetry = {
      timestamp: now,
      streakInfo,
      activeTasks,
    };
  } catch (e) {}

  return cachedTelemetry || {
    timestamp: now,
    streakInfo,
    activeTasks,
  };
}

export async function buildVOSSystemContext(currentRoute?: string): Promise<string> {
  const nowIST = new Date(Date.now() + IST_OFFSET_MS);
  const todayStr = nowIST.toISOString().split("T")[0];
  const dayOfWeek = nowIST.getUTCDay();
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDayName = dayNames[dayOfWeek];
  const timeStr = nowIST.toISOString().split("T")[1].slice(0, 5) + " IST";

  let dayRule = "Learning & Practice Day";
  if (dayOfWeek === 1 || dayOfWeek === 2) {
    dayRule = "College Day (Study Timetable Off)";
  } else if (dayOfWeek === 0) {
    dayRule = "Sunday Revision & Weekly Review";
  }

  const telemetry = await getCachedTelemetry();

  return `You are Vansh AI, the autonomous intelligence agent of Vansh OS (VOS).

CRITICAL DIRECTIVES:
1. When the user gives an actionable command (e.g. "open placement", "add DBMS", "show timetable", "create task", "search web"), IMMEDIATELY call the appropriate tool.
2. DO NOT merely describe how to do it. Execute the tool directly.
3. For navigation, always return exact routes (e.g. /modules/placement, /companies, /documents, /calendar, /streak).
4. For general chat ("hi", "who are you", questions), answer directly, concisely, and naturally within 1-2 sentences.

LIVE CONTEXT:
- Time: ${currentDayName}, ${todayStr} ${timeStr} (${dayRule})
- Active Screen: ${currentRoute || "/"}
- Streak: ${telemetry.streakInfo} | Pending Tasks: ${telemetry.activeTasks}`;
}
