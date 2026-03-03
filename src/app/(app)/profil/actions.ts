"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateProfile(data: {
  display_name: string;
  bio: string | null;
  interests: string[];
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Nicht eingeloggt" };

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: data.display_name.trim(),
      bio: data.bio?.trim() || null,
      interests: data.interests,
    })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/profil");
  return { success: true };
}
