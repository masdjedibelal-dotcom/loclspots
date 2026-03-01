import { createClient } from "@/lib/supabase/server";
import { DashboardClient } from "./DashboardClient";
import { getLatestArticles } from "@/lib/supabase";
import type { Chatroom } from "@/lib/types";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Guten Morgen";
  if (hour < 18) return "Guten Tag";
  return "Guten Abend";
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  const displayName = profile?.display_name ?? "Nutzer";
  const greeting = getGreeting();

  // Deine Chatrooms (für Stories-Pills oben)
  const { data: memberRooms } = await supabase
    .from("chatroom_members")
    .select("chatroom_id")
    .eq("user_id", user.id);

  const memberRoomIds = memberRooms?.map((r) => r.chatroom_id) ?? [];
  let myChatrooms: Chatroom[] = [];
  let exampleChatrooms: Array<Chatroom & { lastMessage?: string; lastMessageAt?: string; isActive?: boolean }> = [];

  if (memberRoomIds.length > 0) {
    const { data } = await supabase
      .from("chatroom_with_member_count")
      .select("*")
      .in("id", memberRoomIds);
    myChatrooms = (data ?? []) as Chatroom[];
  } else {
    // Beispiel-Chatrooms mit letzter Nachricht und Online-Status
    const { data: exampleRooms } = await supabase
      .from("chatroom_with_member_count")
      .select("*")
      .order("member_count", { ascending: false })
      .limit(6);

    if (exampleRooms && exampleRooms.length > 0) {
      const roomIds = exampleRooms.map((r) => r.id);
      const { data: recentMessages } = await supabase
        .from("messages")
        .select("chatroom_id, content, created_at")
        .in("chatroom_id", roomIds)
        .order("created_at", { ascending: false });

      const lastByRoom = new Map<string, { content: string; created_at: string }>();
      for (const m of recentMessages ?? []) {
        if (!lastByRoom.has(m.chatroom_id)) {
          lastByRoom.set(m.chatroom_id, {
            content: m.content,
            created_at: m.created_at,
          });
        }
      }

      const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
      exampleChatrooms = exampleRooms.map((room) => {
        const last = lastByRoom.get(room.id);
        const lastAt = last ? new Date(last.created_at).getTime() : 0;
        const isActive = lastAt >= twoHoursAgo;
        return {
          ...(room as Chatroom),
          lastMessage: last?.content,
          lastMessageAt: last?.created_at,
          isActive,
        };
      });
    }
  }

  // Feed-Content parallel laden – mehr für gemischten Stream
  const now = new Date().toISOString();

  const [
    collabsResult,
    eventsResult,
    articlesResult,
  ] = await Promise.all([
    supabase
      .from("collabs")
      .select("id, title, description, category, cover_emoji, likes_count, created_at")
      .order("created_at", { ascending: false })
      .limit(12),
    supabase
      .from("events")
      .select("id, title, date, start_datetime, start_date, category, created_at")
      .eq("is_cancelled", false)
      .gte("date", now)
      .order("date", { ascending: true })
      .limit(12),
    (async () => {
      try {
        return await getLatestArticles(8);
      } catch {
        return [];
      }
    })(),
  ]);

  const collabs = collabsResult.data ?? [];
  const upcomingEvents = eventsResult.data ?? [];
  const articles = articlesResult ?? [];

  return (
    <DashboardClient
      displayName={displayName}
      greeting={greeting}
      myChatrooms={myChatrooms}
      exampleChatrooms={exampleChatrooms}
      collabs={collabs}
      upcomingEvents={upcomingEvents}
      articles={articles}
    />
  );
}
