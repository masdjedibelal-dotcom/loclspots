"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function likeCollab(collabId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Nicht eingeloggt" };

  const { error } = await supabase.from("collab_likes").insert({
    collab_id: collabId,
    user_id: user.id,
  });

  if (error) {
    if (error.code === "23505") return { success: true };
    if (error.code === "42P01") {
      const { data } = await supabase
        .from("collabs")
        .select("likes_count")
        .eq("id", collabId)
        .single();
      await supabase
        .from("collabs")
        .update({
          likes_count: ((data?.likes_count ?? 0) + 1),
        })
        .eq("id", collabId);
      revalidatePath(`/collabs/${collabId}`);
      revalidatePath("/collabs");
      return { success: true };
    }
    return { error: error.message };
  }

  revalidatePath(`/collabs/${collabId}`);
  revalidatePath("/collabs");
  return { success: true };
}

export async function unlikeCollab(collabId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Nicht eingeloggt" };

  const { error } = await supabase
    .from("collab_likes")
    .delete()
    .eq("collab_id", collabId)
    .eq("user_id", user.id);

  if (error) {
    if (error.code === "42P01") return { error: "collab_likes Tabelle fehlt" };
    return { error: error.message };
  }

  revalidatePath(`/collabs/${collabId}`);
  revalidatePath("/collabs");
  return { success: true };
}
