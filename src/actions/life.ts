"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createHabitAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const frequency = (formData.get("frequency") as string) || "daily";

  const { error } = await supabase.from("habits").insert({
    user_id: user.id,
    title,
    frequency,
    streak: 0,
    completed_today: false,
  });

  if (error) {
    console.error("Failed to create habit:", error);
    throw new Error("Failed to create habit");
  }

  revalidatePath("/life");
}

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

export async function deleteHabitAction(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("habits")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to delete habit:", error);
    throw new Error("Failed to delete habit");
  }

  revalidatePath("/life");
}

export async function logHealthMetricAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const calories = Number(formData.get("calories")) || 0;
  const water_intake = Number(formData.get("water_intake")) || 0;
  const sleep_hours = Number(formData.get("sleep_hours")) || 0;
  const weight = formData.get("weight") ? Number(formData.get("weight")) : null;
  const today = new Date().toISOString().split("T")[0];

  // Check if metric already exists for today
  const { data: existing } = await supabase
    .from("health_metrics")
    .select("id")
    .eq("user_id", user.id)
    .eq("date", today)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("health_metrics")
      .update({
        calories,
        water_intake,
        sleep_hours,
        weight,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
  } else {
    await supabase.from("health_metrics").insert({
      user_id: user.id,
      calories,
      water_intake,
      sleep_hours,
      weight,
      date: today,
    });
  }

  revalidatePath("/life");
}
