"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createMissionAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const today = new Date().toISOString().split("T")[0];

  const { error } = await supabase.from("missions").upsert({
    user_id: user.id,
    title,
    description,
    date: today,
    status: "in_progress",
    completion_percentage: 0,
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id, date" });

  if (error) {
    console.error("Failed to create mission:", error);
    // If upsert with onConflict failed due to constraint, just insert
    await supabase.from("missions").insert({
      user_id: user.id,
      title,
      description,
      date: today,
      status: "in_progress",
      completion_percentage: 0,
    });
  }

  revalidatePath("/");
}

export async function addSessionAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const module = (formData.get("module") as string) || "career";
  const time_window = (formData.get("time_window") as string) || "Anytime";
  const priority = (formData.get("priority") as string) || "medium";

  const { error } = await supabase.from("sessions").insert({
    user_id: user.id,
    title,
    module,
    time_window,
    priority,
    status: "upcoming",
    progress: 0,
  });

  if (error) {
    console.error("Failed to add session:", error);
    throw new Error("Failed to add session");
  }

  revalidatePath("/");
}

export async function startSessionAction(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("sessions")
    .update({ 
      status: "current",
      updated_at: new Date().toISOString() 
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to start session:", error);
    throw new Error("Failed to start session");
  }

  revalidatePath("/");
}

export async function completeSessionAction(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("sessions")
    .update({ 
      status: "completed", 
      progress: 100,
      updated_at: new Date().toISOString() 
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to complete session:", error);
    throw new Error("Failed to complete session");
  }

  revalidatePath("/");
}

export async function deleteSessionAction(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("sessions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to delete session:", error);
    throw new Error("Failed to delete session");
  }

  revalidatePath("/");
}
