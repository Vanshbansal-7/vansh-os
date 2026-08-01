"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addLearningTopicAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const category = (formData.get("category") as string) || "dsa";
  const difficulty = (formData.get("difficulty") as string) || "medium";
  const status = (formData.get("status") as string) || "not_started";

  const { error } = await supabase.from("learning_topics").insert({
    user_id: user.id,
    title,
    category,
    difficulty,
    status,
    last_revised: new Date().toISOString().split("T")[0],
  });

  if (error) {
    console.error("Failed to add learning topic:", error);
    throw new Error("Failed to add learning topic");
  }

  revalidatePath("/learning");
}

export async function updateTopicStatusAction(id: string, status: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("learning_topics")
    .update({ 
      status, 
      last_revised: new Date().toISOString().split("T")[0],
      updated_at: new Date().toISOString() 
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to update learning topic status:", error);
    throw new Error("Failed to update status");
  }

  revalidatePath("/learning");
}

export async function deleteLearningTopicAction(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("learning_topics")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to delete learning topic:", error);
    throw new Error("Failed to delete learning topic");
  }

  revalidatePath("/learning");
}
