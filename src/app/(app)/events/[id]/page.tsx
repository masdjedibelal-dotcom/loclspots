import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EventDetailView } from "./EventDetailView";
import type { Event } from "@/lib/types";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: event } = await supabase
    .from("events")
    .select(
      "id, title, description, start_date, start_time, start_datetime, end_date, end_time, end_datetime, venue_name, venue_id, category, tags, source, source_url, is_public, is_cancelled, cover_image_url, lat, lng, created_at, updated_at, highlights"
    )
    .eq("id", id)
    .single();

  if (!event) notFound();

  const { data: participants } = await supabase
    .from("event_participants")
    .select("user_id")
    .eq("event_id", id);

  const participantCount = participants?.length ?? 0;
  const isParticipating =
    participants?.some((p) => p.user_id === user.id) ?? false;

  const userIds = participants?.map((p) => p.user_id) ?? [];
  let profiles: { id: string; username: string; display_name: string; avatar_url: string | null }[] = [];
  if (userIds.length > 0) {
    const { data } = await supabase
      .from("profiles")
      .select("id, username, display_name, avatar_url")
      .in("id", userIds);
    profiles = data ?? [];
  }

  let mapUrl: string | null = null;
  if (event.lat && event.lng) {
    mapUrl = "https://www.google.com/maps?q=" + event.lat + "," + event.lng;
  }

  const eventData = event as Event;

  return (
    <EventDetailView
      event={eventData}
      mapUrl={mapUrl}
      profiles={profiles}
      participantCount={participantCount}
      isParticipating={isParticipating}
      currentUserId={user.id}
    />
  );
}
