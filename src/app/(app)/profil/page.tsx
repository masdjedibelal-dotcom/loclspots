import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfilClient } from "./ProfilClient";
import type { Profile, Chatroom, Event } from "@/lib/types";

export const metadata: Metadata = {
  title: "Mein Profil",
  description: "Dein LoclSpots-Profil, Collabs, Chatrooms und Events.",
};

export default async function ProfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    // Profil fehlt (z.B. Trigger nicht ausgeführt) – anlegen
    const username =
      user.user_metadata?.username ||
      `user_${user.id.replace(/-/g, "").slice(0, 12)}`;
    const displayName =
      user.user_metadata?.display_name ||
      user.user_metadata?.full_name ||
      user.email?.split("@")[0] ||
      "Nutzer";

    const { error: insertError } = await supabase.from("profiles").insert({
      id: user.id,
      username,
      display_name: displayName,
      bio: null,
      interests: [],
    });

    if (!insertError || insertError.code === "23505") {
      const { data: fetched } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      profile = fetched;
    }
  }

  if (!profile) redirect("/login");

  const { count: collabsCount } = await supabase
    .from("collabs")
    .select("id", { count: "exact", head: true })
    .eq("creator_id", user.id);

  const { count: chatroomsCount } = await supabase
    .from("chatroom_members")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { count: eventsCount } = await supabase
    .from("event_participants")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  const stats = {
    collabs: collabsCount ?? 0,
    chatrooms: chatroomsCount ?? 0,
    events: eventsCount ?? 0,
  };

  const { data: memberRooms } = await supabase
    .from("chatroom_members")
    .select("chatroom_id")
    .eq("user_id", user.id);

  const roomIds = memberRooms?.map((r) => r.chatroom_id) ?? [];
  const { data: myChatroomsRaw } =
    roomIds.length > 0
      ? await supabase
          .from("chatroom_with_member_count")
          .select("*")
          .in("id", roomIds)
      : { data: [] };

  const { data: eventParticipations } = await supabase
    .from("event_participants")
    .select("event_id")
    .eq("user_id", user.id);

  const eventIds = eventParticipations?.map((e) => e.event_id) ?? [];
  const { data: myEventsRaw } =
    eventIds.length > 0
      ? await supabase
          .from("events")
          .select("*")
          .in("id", eventIds)
          .gte("date", new Date().toISOString())
          .order("date", { ascending: true })
      : { data: [] };

  return (
    <ProfilClient
      profile={profile as Profile}
      stats={stats}
      myChatrooms={(myChatroomsRaw ?? []) as Chatroom[]}
      myEvents={(myEventsRaw ?? []) as Event[]}
      currentUserId={user.id}
    />
  );
}
