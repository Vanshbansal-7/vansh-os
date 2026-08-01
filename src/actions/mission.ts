"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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

  // A trigger or additional logic would usually update the mission's overall completion percentage
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
