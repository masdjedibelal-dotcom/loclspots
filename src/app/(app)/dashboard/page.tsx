import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Calendar } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Chatroom } from "@/lib/types";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Guten Morgen";
  if (hour < 18) return "Guten Tag";
  return "Guten Abend";
}

function formatEventDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("de-DE", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
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

  // Meine Chatrooms: user's joined rooms
  const { data: memberRooms } = await supabase
    .from("chatroom_members")
    .select("chatroom_id")
    .eq("user_id", user.id);

  const memberRoomIds = memberRooms?.map((r) => r.chatroom_id) ?? [];
  let myChatrooms: Chatroom[] = [];

  if (memberRoomIds.length > 0) {
    const { data } = await supabase
      .from("chatroom_with_member_count")
      .select("*")
      .in("id", memberRoomIds)
      .limit(3);
    myChatrooms = (data ?? []) as Chatroom[];
  }

  // Neue Collabs (neueste 3)
  const { data: newCollabs } = await supabase
    .from("collabs")
    .select("id, title, category, cover_emoji")
    .order("created_at", { ascending: false })
    .limit(3);

  // Kommende Events (nächste 3)
  const now = new Date().toISOString();
  const { data: upcomingEvents } = await supabase
    .from("events")
    .select("id, title, date")
    .gte("date", now)
    .order("date", { ascending: true })
    .limit(3);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-2xl text-forest sm:text-3xl">
          {greeting}, {displayName}!
        </h1>
        <p className="mt-1 text-sage">
          Willkommen zurück bei LoclSpots.
        </p>
      </div>

      {/* Meine Chatrooms */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-forest">Meine Chatrooms</h2>
          <Link
            href="/chatrooms"
            className="text-sm text-sage hover:text-forest"
          >
            Alle ansehen
          </Link>
        </div>
        <div className="mt-3">
          {myChatrooms.length === 0 ? (
            <EmptyState
              emoji="💬"
              title="Noch keine Chatrooms"
              description="Entdecke Chatrooms nach deinen Interessen und tritt bei."
            />
          ) : (
            <div className="space-y-2">
              {myChatrooms.map((room) => (
                <Link
                  key={room.id}
                  href={`/chatrooms/${room.id}`}
                  className="flex items-center gap-3 rounded-xl border border-warm bg-cream/50 p-4 transition-colors hover:border-sage/50"
                >
                  <span className="text-2xl">{room.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-forest">{room.name}</p>
                    <p className="text-xs text-sage">
                      {room.member_count} Mitglieder
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Neue Collabs */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-forest">Neue Collabs</h2>
          <Link
            href="/collabs"
            className="text-sm text-sage hover:text-forest"
          >
            Alle ansehen
          </Link>
        </div>
        <div className="mt-3">
          {!newCollabs || newCollabs.length === 0 ? (
            <EmptyState
              emoji="📋"
              title="Noch keine Collabs"
              description="Kuratierte Listen mit Tipps – von der Community erstellt."
            />
          ) : (
            <div className="space-y-2">
              {newCollabs.map((collab) => (
                <Link
                  key={collab.id}
                  href={`/collabs/${collab.id}`}
                  className="flex items-center gap-3 rounded-xl border border-warm bg-cream/50 p-4 transition-colors hover:border-sage/50"
                >
                  <span className="text-2xl">{collab.cover_emoji ?? "📋"}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-forest">{collab.title}</p>
                    <p className="text-xs text-sage">{collab.category}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Kommende Events */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-forest">Kommende Events</h2>
          <Link
            href="/events"
            className="text-sm text-sage hover:text-forest"
          >
            Alle ansehen
          </Link>
        </div>
        <div className="mt-3">
          {!upcomingEvents || upcomingEvents.length === 0 ? (
            <EmptyState
              emoji="📅"
              title="Keine kommenden Events"
              description="Events werden von der Community erstellt. Bald sind welche da!"
            />
          ) : (
            <div className="space-y-2">
              {upcomingEvents.map((event) => (
                <Link
                  key={event.id}
                  href={`/events`}
                  className="flex items-center gap-3 rounded-xl border border-warm bg-cream/50 p-4 transition-colors hover:border-sage/50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sage/10 text-sage">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-forest">{event.title}</p>
                    <p className="text-xs text-sage">
                      {formatEventDate(event.date)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
