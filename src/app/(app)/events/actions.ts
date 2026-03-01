"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createEvent(data: {
  title: string;
  description: string | null;
  date: string;
  maps_url: string | null;
  chatroom_id: string | null;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Nicht eingeloggt" };

  const { error } = await supabase.from("events").insert({
    title: data.title.trim(),
    description: data.description?.trim() || null,
    date: data.date,
    maps_url: data.maps_url?.trim() || null,
    chatroom_id: data.chatroom_id || null,
    creator_id: user.id,
  });

  if (error) return { error: error.message };

  revalidatePath("/events");
  return { success: true };
}

export async function joinEvent(eventId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Nicht eingeloggt" };

  const { error } = await supabase.from("event_participants").insert({
    event_id: eventId,
    user_id: user.id,
  });

  if (error) {
    if (error.code === "23505") return { success: true };
    return { error: error.message };
  }

  revalidatePath("/events");
  revalidatePath(`/events/${eventId}`);
  return { success: true };
}

export async function leaveEvent(eventId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Nicht eingeloggt" };

  const { error } = await supabase
    .from("event_participants")
    .delete()
    .eq("event_id", eventId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/events");
  revalidatePath(`/events/${eventId}`);
  return { success: true };
}
