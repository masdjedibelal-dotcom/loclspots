"use server";

import { createClient } from "@/lib/supabase/server";

export async function joinChatroom(chatroomId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Nicht eingeloggt" };
  }

  const { error } = await supabase.from("chatroom_members").insert({
    chatroom_id: chatroomId,
    user_id: user.id,
  });

  if (error) {
    if (error.code === "23505") {
      // Already a member
      return { success: true };
    }
    return { error: error.message };
  }

  return { success: true };
}
