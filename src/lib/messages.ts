import type { SupabaseClient } from "@supabase/supabase-js";
import type { Message, Profile } from "@/lib/types";

export async function getMessages(
  supabase: SupabaseClient,
  chatroomId: string,
  limit = 100
): Promise<Message[]> {
  const { data: rawMessages } = await supabase
    .from("messages")
    .select("id, chatroom_id, user_id, content, created_at, reactions, is_deleted, reply_to_id")
    .eq("chatroom_id", chatroomId)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (!rawMessages?.length) return [];

  const userIds = Array.from(new Set(rawMessages.map((m) => m.user_id)));
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url")
    .in("id", userIds);

  const profileMap = new Map(
    (profiles ?? []).map((p) => [p.id, p as Profile])
  );

  const replyToIds = Array.from(
    new Set(
      rawMessages
        .map((m) => (m as { reply_to_id?: string | null }).reply_to_id)
        .filter(Boolean) as string[]
    )
  );

  let replyMap = new Map<
    string,
    { id: string; content: string; is_deleted?: boolean; profiles?: { username?: string } }
  >();

  if (replyToIds.length > 0) {
    const { data: replyMessages } = await supabase
      .from("messages")
      .select("id, content, is_deleted, user_id")
      .in("id", replyToIds);

    const replyUserIds = Array.from(
      new Set((replyMessages ?? []).map((r) => r.user_id))
    );
    const { data: replyProfiles } = await supabase
      .from("profiles")
      .select("id, username")
      .in("id", replyUserIds);

    const replyProfileMap = new Map(
      (replyProfiles ?? []).map((p) => [p.id, p])
    );

    replyMap = new Map(
      (replyMessages ?? []).map((r) => [
        r.id,
        {
          id: r.id,
          content: r.content,
          is_deleted: (r as { is_deleted?: boolean }).is_deleted,
          profiles: replyProfileMap.get(r.user_id)
            ? { username: replyProfileMap.get(r.user_id)!.username }
            : undefined,
        },
      ])
    );
  }

  return rawMessages.map((m) => {
    const row = m as {
      reactions?: Record<string, string[]>;
      is_deleted?: boolean;
      reply_to_id?: string | null;
    };
    const replyToId = row.reply_to_id;
    return {
      ...m,
      profile: profileMap.get(m.user_id) ?? undefined,
      reactions: row.reactions ?? undefined,
      is_deleted: row.is_deleted ?? false,
      reply_to_id: replyToId ?? undefined,
      reply_to: replyToId ? replyMap.get(replyToId) ?? null : undefined,
    };
  });
}
