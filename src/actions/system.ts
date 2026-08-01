"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const timezone = (formData.get("timezone") as string) || "UTC";

  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      name,
      timezone,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    console.error("Failed to update profile:", error);
    throw new Error("Failed to update profile");
  }

  revalidatePath("/system");
}
