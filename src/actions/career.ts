"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addCompanyAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const role = formData.get("role") as string;

  const { error } = await supabase.from("companies").insert({
    user_id: user.id,
    name,
    role,
    status: "wishlist",
  });

  if (error) {
    console.error("Failed to add company:", error);
    throw new Error("Failed to add company");
  }

  revalidatePath("/career");
}

export async function updateCompanyStatusAction(id: string, status: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("companies")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to update status:", error);
    throw new Error("Failed to update status");
  }

  revalidatePath("/career");
}
