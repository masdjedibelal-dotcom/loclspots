"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function deleteCollab(collabId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Nicht eingeloggt" };

  const { data: collab } = await supabase
    .from("collabs")
    .select("creator_id")
    .eq("id", collabId)
    .single();

  if (!collab || collab.creator_id !== user.id) {
    return { error: "Keine Berechtigung" };
  }

  const { error } = await supabase
    .from("collabs")
    .delete()
    .eq("id", collabId);

  if (error) return { error: error.message };

  redirect("/collabs");
}
