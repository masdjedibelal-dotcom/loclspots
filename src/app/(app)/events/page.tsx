import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EventsClient } from "./EventsClient";
import type { Event } from "@/lib/types";

const CATEGORIES = [
  "Konzerte",
  "Klassik",
  "Theater",
  "Shows",
  "Kabarett",
  "Sonstiges",
] as const;

export default async function EventsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const now = new Date().toISOString().slice(0, 19);

  const { data: allEvents } = await supabase
    .from("events")
    .select(
      "id, title, description, date, start_date, start_time, start_datetime, end_date, end_time, end_datetime, venue_name, venue_id, category, tags, source, source_url, is_public, is_cancelled, cover_image_url, lat, lng, created_at, updated_at, highlights"
    )
    .eq("is_cancelled", false)
    .order("date", { ascending: true, nullsFirst: false });

  const { data: participantRows } = await supabase
    .from("event_participants")
    .select("event_id, user_id");

  const participantCountMap = new Map<string, number>();
  const myParticipantIds = new Set<string>();
  for (const p of participantRows ?? []) {
    participantCountMap.set(
      p.event_id,
      (participantCountMap.get(p.event_id) ?? 0) + 1
    );
    if (p.user_id === user.id) myParticipantIds.add(p.event_id);
  }

  const eventsWithExtras: Event[] = (allEvents ?? []).map((e) => ({
    ...e,
    participant_count: participantCountMap.get(e.id) ?? 0,
    is_participating: myParticipantIds.has(e.id),
  }));

  const upcomingEvents = eventsWithExtras.filter((e) => {
    const dt = e.start_datetime ?? e.start_date ?? e.date ?? e.created_at;
    return dt && dt >= now;
  });

  const pastEvents = eventsWithExtras.filter((e) => {
    const dt = e.start_datetime ?? e.start_date ?? e.date ?? e.created_at;
    return !dt || dt < now;
  });

  const categoriesInData = Array.from(
    new Set(
      (allEvents ?? [])
        .map((e) => e.category)
        .filter((c): c is string => !!c)
    )
  ).sort();
  const filterCategories =
    categoriesInData.length > 0 ? categoriesInData : [...CATEGORIES];

  return (
    <EventsClient
      upcomingEvents={upcomingEvents}
      pastEvents={pastEvents}
      categories={filterCategories}
      participantIds={Array.from(myParticipantIds)}
      currentUserId={user.id}
    />
  );
}
