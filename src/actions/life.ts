"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleHabitAction(id: string, currentStatus: boolean, currentStreak: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const newStatus = !currentStatus;
  const newStreak = newStatus ? currentStreak + 1 : Math.max(0, currentStreak - 1);

  const { error } = await supabase
    .from("habits")
    .update({ 
      completed_today: newStatus, 
      streak: newStreak,
      updated_at: new Date().toISOString() 
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to toggle habit:", error);
    throw new Error("Failed to toggle habit");
  }

  revalidatePath("/life");
}

export async function logHealthMetricAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const calories = Number(formData.get("calories"));
  const water_intake = Number(formData.get("water_intake"));
  const sleep_hours = Number(formData.get("sleep_hours"));
  const weight = Number(formData.get("weight"));

  const { error } = await supabase.from("health_metrics").insert({
    user_id: user.id,
    calories,
    water_intake,
    sleep_hours,
    weight,
    date: new Date().toISOString().split("T")[0],
  });

  if (error) {
    console.error("Failed to log health metrics:", error);
    throw new Error("Failed to log health metrics");
  }

  revalidatePath("/life");
}
