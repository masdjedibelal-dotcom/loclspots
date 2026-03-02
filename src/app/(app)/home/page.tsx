import { createClient } from "@/lib/supabase/server";
import { HomeClient } from "./HomeClient";
import { HomeCollabPreview } from "./HomeCollabPreview";
import { HomeEventsPreview } from "./HomeEventsPreview";
import { HomeArticlePreview } from "./HomeArticlePreview";
import type { Chatroom } from "@/lib/types";

export const revalidate = 60;

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Guten Morgen";
  if (hour < 18) return "Guten Tag";
  return "Guten Abend";
}

export default async function HomePage() {
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

  const today = new Date().toISOString().split("T")[0];

  const [chatroomsRes, collabsRes, highlightsRes, articlesRes] =
    await Promise.all([
      supabase.rpc("get_most_active_chatrooms", { p_limit: 4 }),
      supabase
        .from("collabs")
        .select("id, title, description, category, cover_emoji")
        .eq("is_public", true)
        .order("created_at", { ascending: false })
        .limit(4),
      supabase
        .from("events")
        .select("id, title, start_date, start_time, venue_name, category, cover_image_url")
        .eq("highlights", true)
        .eq("is_cancelled", false)
        .gte("start_date", today)
        .order("start_date", { ascending: true })
        .limit(5),
      supabase
        .from("articles")
        .select("id, slug, title, excerpt, category, created_at")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(3),
    ]);

  const chatrooms =
    !chatroomsRes.error && (chatroomsRes.data ?? []).length > 0
      ? (chatroomsRes.data as Chatroom[])
      : ((await supabase
          .from("chatroom_with_member_count")
          .select("id, name, description, emoji, member_count")
          .eq("is_category", false)
          .order("member_count", { ascending: false })
          .limit(4)
        ).data ?? []) as Chatroom[];
  const featuredCollabs = collabsRes.data ?? [];
  const events = highlightsRes.data ?? [];
  const articles = articlesRes.data ?? [];

  return (
    <div className="space-y-8 pb-8">
      <HomeClient
        displayName={displayName}
        greeting={greeting}
        chatrooms={chatrooms}
      />
      <HomeCollabPreview collabs={featuredCollabs} />
      <HomeEventsPreview events={events} />
      <HomeArticlePreview articles={articles} />
    </div>
  );
}
