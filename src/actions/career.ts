"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addCompanyAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const status = (formData.get("status") as string) || "wishlist";
  const applied_date = (formData.get("applied_date") as string) || null;

  const { error } = await supabase.from("companies").insert({
    user_id: user.id,
    name,
    role,
    status,
    applied_date: applied_date || null,
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

  if (!user) throw new Error("Unauthorized");

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

export async function deleteCompanyAction(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("companies")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to delete company:", error);
    throw new Error("Failed to delete company");
  }

  revalidatePath("/career");
}
