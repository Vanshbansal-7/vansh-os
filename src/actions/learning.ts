"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addLearningTopicAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const difficulty = formData.get("difficulty") as string;

  const { error } = await supabase.from("learning_topics").insert({
    user_id: user.id,
    title,
    category,
    difficulty,
    status: "not_started",
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
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to update learning topic status:", error);
    throw new Error("Failed to update status");
  }

  revalidatePath("/learning");
}
