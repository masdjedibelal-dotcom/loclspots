import { createClient } from "@/lib/supabase/server";
import { HomeClient } from "./HomeClient";
import { HomeCollabPreview } from "./HomeCollabPreview";
import { HomeEventsPreview } from "./HomeEventsPreview";
import { HomeArticlePreview } from "./HomeArticlePreview";
import type { Article, Chatroom } from "@/lib/types";

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

  const [chatroomsRes, collabsRes, eventsRes, articlesRes] = await Promise.all([
    // Chatrooms: 4 aktivste (View hat kein is_category — Kategorien per Name ausschließen)
    supabase
      .from("chatroom_with_member_count")
      .select("id, name, description, emoji, category, member_count")
      .not("name", "in", "('Sport & Fitness','Kultur & Kreativ','Essen & Trinken','Stadtleben','Soziales')")
      .order("member_count", { ascending: false })
      .limit(4),

    // Collabs: 4 neueste
    supabase
      .from("collabs")
      .select("id, title, category, cover_emoji")
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(4),

    // Events: nächste 5
    supabase
      .from("events")
      .select("id, title, start_date, start_time, venue_name, category")
      .eq("is_cancelled", false)
      .eq("is_public", true)
      .gte("start_date", today)
      .order("start_date", { ascending: true })
      .limit(5),

    // Artikel: 3 neueste
    supabase
      .from("articles")
      .select("id, slug, title, excerpt, category, created_at")
      .eq("is_published", true)
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  const chatrooms = (chatroomsRes.data ?? []) as Chatroom[];
  const collabs = collabsRes.data ?? [];
  const events = eventsRes.data ?? [];
  const articles = (articlesRes.data ?? []) as Article[];

  return (
    <div className="space-y-8 pb-8">
      <HomeClient
        displayName={displayName}
        greeting={greeting}
        chatrooms={chatrooms}
      />
      <HomeCollabPreview collabs={collabs} />
      <HomeEventsPreview events={events} />
      <HomeArticlePreview articles={articles} />
    </div>
  );
}
