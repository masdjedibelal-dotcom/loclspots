import type { SupabaseClient } from "@supabase/supabase-js";

export type UnreadCountRow = { chatroom_id: string; unread_count: number };

export async function getUnreadCounts(
  supabase: SupabaseClient,
  userId: string
): Promise<UnreadCountRow[]> {
  const { data } = await supabase.rpc("get_unread_counts", {
    p_user_id: userId,
  });
  return (data ?? []).map((r: { chatroom_id: string; unread_count: number }) => ({
    chatroom_id: r.chatroom_id,
    unread_count: Number(r.unread_count) || 0,
  }));
}
