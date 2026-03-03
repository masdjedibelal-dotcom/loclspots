import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EventsClient } from "./EventsClient";
import type { Event } from "@/lib/types";

import { PAGINATION } from "@/lib/constants";

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const category = params.category ?? "";
  const isHighlights = category === "⭐ Highlights";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const offset = (page - 1) * PAGINATION.EVENTS;
  const today = new Date().toISOString().split("T")[0];

  // Count für Paginierung
  let countQuery = supabase
    .from("events")
    .select("*", { count: "exact", head: true })
    .eq("is_cancelled", false)
    .eq("is_public", true)
    .gte("start_date", today);

  if (isHighlights) {
    countQuery = countQuery.eq("highlights", true);
  } else if (category && category !== "Alle") {
    countQuery = countQuery.eq("category", category);
  }
  const { count } = await countQuery;

  // Daten laden (gleiche Filter-Logik)
  let dataQuery = supabase
    .from("events")
    .select(
      "id, title, description, start_date, start_time, start_datetime, venue_name, category, cover_image_url, source_url, is_cancelled"
    )
    .eq("is_cancelled", false)
    .eq("is_public", true)
    .gte("start_date", today)
    .order("start_date", { ascending: true, nullsFirst: false })
    .range(offset, offset + PAGINATION.EVENTS - 1);

  if (isHighlights) {
    dataQuery = dataQuery.eq("highlights", true);
  } else if (category && category !== "Alle") {
    dataQuery = dataQuery.eq("category", category);
  }
  const { data: eventsData } = await dataQuery;

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

  const events = (eventsData ?? []).map((e) => ({
    ...e,
    participant_count: participantCountMap.get(e.id) ?? 0,
    is_participating: myParticipantIds.has(e.id),
  })) as Event[];

  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGINATION.EVENTS));

  return (
    <EventsClient
      events={events}
      totalPages={totalPages}
      currentPage={page}
      categoryFilter={category || "all"}
      participantIds={Array.from(myParticipantIds)}
      currentUserId={user.id}
    />
  );
}
