"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, ArrowRight, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { joinChatroom } from "@/app/(app)/chatrooms/actions";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";
import type { Article } from "@/lib/types";
import type { Chatroom } from "@/lib/types";

type FeedItem =
  | { type: "collab"; data: { id: string; title: string; description?: string | null; category?: string | null; cover_emoji?: string | null; likes_count?: number }; sortDate: string }
  | { type: "event"; data: { id: string; title: string; date: string; category?: string | null }; sortDate: string }
  | { type: "article"; data: Article; sortDate: string };

type ExampleChatroom = Chatroom & {
  lastMessage?: string;
  lastMessageAt?: string;
  isActive?: boolean;
};

interface DashboardClientProps {
  displayName: string;
  greeting: string;
  myChatrooms: Chatroom[];
  exampleChatrooms: ExampleChatroom[];
  collabs: Array<{
    id: string;
    title: string;
    description?: string | null;
    category?: string | null;
    cover_emoji?: string | null;
    likes_count?: number;
    created_at?: string;
  }>;
  upcomingEvents: Array<{
    id: string;
    title: string;
    date: string;
    category?: string | null;
    start_datetime?: string | null;
    start_date?: string | null;
    created_at?: string;
  }>;
  articles: Article[];
}

function formatEventDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("de-DE", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function buildFeed(
  collabs: DashboardClientProps["collabs"],
  events: DashboardClientProps["upcomingEvents"],
  articles: DashboardClientProps["articles"]
): FeedItem[] {
  const items: FeedItem[] = [
    ...collabs.map((c) => ({
      type: "collab" as const,
      data: c,
      sortDate: c.created_at ?? new Date().toISOString(),
    })),
    ...events.map((e) => ({
      type: "event" as const,
      data: e,
      sortDate: e.start_datetime ?? e.date ?? e.created_at ?? new Date().toISOString(),
    })),
    ...articles.map((a) => ({
      type: "article" as const,
      data: a,
      sortDate: a.created_at ?? new Date().toISOString(),
    })),
  ];
  items.sort((a, b) => new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime());
  return items.slice(0, 20);
}

function formatMessageTime(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return "gerade eben";
  if (diffMins < 60) return `vor ${diffMins} Min`;
  if (diffHours < 24) return `vor ${diffHours} Std`;
  if (diffDays < 7) return `vor ${diffDays} Tagen`;
  return date.toLocaleDateString("de-DE", { day: "numeric", month: "short" });
}

export function DashboardClient({
  displayName,
  greeting,
  myChatrooms,
  exampleChatrooms,
  collabs,
  upcomingEvents,
  articles,
}: DashboardClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [joiningId, setJoiningId] = useState<string | null>(null);

  const feedItems = buildFeed(collabs, upcomingEvents, articles);
  const hasContent = feedItems.length > 0;
  const showExampleChatrooms = myChatrooms.length === 0 && exampleChatrooms.length > 0;

  const handleJoinChatroom = async (roomId: string) => {
    setJoiningId(roomId);
    try {
      const result = await joinChatroom(roomId);
      if (result?.error) {
        toast(result.error, "error");
      } else {
        toast("Chatroom beigetreten!", "success");
        router.push(`/chatrooms/${roomId}`);
      }
    } catch {
      toast("Beitritt fehlgeschlagen.", "error");
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Begrüßung */}
      <div>
        <h1 className="font-serif text-2xl text-forest sm:text-3xl">
          {greeting}, {displayName}!
        </h1>
        <p className="mt-1 text-sage">
          Was passiert gerade in deiner Community.
        </p>
      </div>

      {/* Deine Chatrooms – Stories-Pills */}
      {myChatrooms.length > 0 && (
        <section>
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-sage">
            Deine Gespräche
          </p>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {myChatrooms.map((room) => (
              <Link
                key={room.id}
                href={`/chatrooms/${room.id}`}
                className="flex shrink-0 flex-col items-center gap-1.5 rounded-2xl border border-warm bg-cream/50 px-5 py-4 transition-all hover:border-sage/50 hover:bg-cream"
              >
                <span className="text-2xl" role="img" aria-hidden>
                  {room.emoji}
                </span>
                <span className="max-w-[72px] truncate text-center text-xs font-medium text-forest">
                  {room.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Beispiel-Chatrooms – wenn noch keine beigetreten */}
      {showExampleChatrooms && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-sage">
              Chatrooms entdecken
            </p>
            <Link
              href="/chatrooms"
              className="text-xs text-sage hover:text-forest"
            >
              Alle ansehen
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {exampleChatrooms.map((room) => (
              <div
                key={room.id}
                className="flex w-[200px] shrink-0 flex-col rounded-2xl border border-warm bg-white p-4 transition-all hover:border-mint hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-2xl" role="img" aria-hidden>
                    {room.emoji}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {room.isActive && (
                      <span className="flex items-center gap-1 text-[10px] font-medium text-mint">
                        <span className="h-1.5 w-1.5 rounded-full bg-mint" />
                        Live
                      </span>
                    )}
                    <span className="text-[10px] text-sage">
                      {room.member_count} Mitglieder
                    </span>
                  </div>
                </div>
                <h3 className="mt-2 line-clamp-2 font-semibold text-forest">
                  {room.name}
                </h3>
                {room.lastMessage && (
                  <p className="mt-1 line-clamp-2 text-xs text-sage">
                    {room.lastMessage}
                  </p>
                )}
                {room.lastMessageAt && (
                  <p className="mt-0.5 text-[10px] text-sage/80">
                    {formatMessageTime(room.lastMessageAt)}
                  </p>
                )}
                <Button
                  variant="primary"
                  size="sm"
                  className="mt-3 w-full"
                  onClick={() => handleJoinChatroom(room.id)}
                  isLoading={joiningId === room.id}
                  disabled={joiningId !== null}
                >
                  Beitreten
                </Button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Feed */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-sage">
            Für dich
          </p>
          <Link
            href="/collabs"
            className="text-xs text-sage hover:text-forest"
          >
            Alle ansehen
          </Link>
        </div>

        {!hasContent ? (
          <EmptyState
            emoji="🌿"
            title="Noch nichts Neues"
            description="Schau in Collabs, Events und dem Blog vorbei – oder erstelle selbst etwas!"
          />
        ) : (
          <div className="space-y-4">
            {feedItems.map((item, i) => {
              if (item.type === "collab") {
                return (
                  <Link
                    key={`c-${item.data.id}`}
                    href={`/collabs/${item.data.id}`}
                    className="group flex gap-4 rounded-2xl border border-warm bg-white p-4 transition-all hover:border-mint hover:shadow-lg"
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-sage/10 text-2xl">
                      {item.data.cover_emoji ?? "📋"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] font-medium uppercase tracking-wider text-sage">
                        Collab
                      </span>
                      <h3 className="mt-0.5 font-semibold text-forest line-clamp-1 group-hover:text-sage">
                        {item.data.title}
                      </h3>
                      {item.data.description && (
                        <p className="mt-1 line-clamp-2 text-sm text-sage">
                          {item.data.description}
                        </p>
                      )}
                      <div className="mt-2 flex flex-wrap gap-2">
                        {item.data.category && (
                          <Badge variant="green" className="text-[10px]">
                            {item.data.category}
                          </Badge>
                        )}
                        {typeof item.data.likes_count === "number" && (
                          <span className="text-xs text-sage">
                            ♥ {item.data.likes_count}
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 shrink-0 text-sage opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                );
              }

              if (item.type === "event") {
                return (
                  <Link
                    key={`e-${item.data.id}`}
                    href={`/events/${item.data.id}`}
                    className="group flex gap-4 rounded-2xl border border-warm bg-white p-4 transition-all hover:border-mint hover:shadow-lg"
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-peach/20">
                      <Calendar className="h-6 w-6 text-peach" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] font-medium uppercase tracking-wider text-sage">
                        Event
                      </span>
                      <h3 className="mt-0.5 font-semibold text-forest line-clamp-1 group-hover:text-sage">
                        {item.data.title}
                      </h3>
                      <p className="mt-1 flex items-center gap-1 text-sm text-sage">
                        <MapPin className="h-3.5 w-3.5" />
                        {formatEventDate(item.data.date)}
                      </p>
                      {item.data.category && (
                        <Badge variant="green" className="mt-2 text-[10px]">
                          {item.data.category}
                        </Badge>
                      )}
                    </div>
                    <ArrowRight className="h-5 w-5 shrink-0 text-sage opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                );
              }

              // article
              return (
                <Link
                  key={`a-${item.data.id}`}
                  href={`/blog/${item.data.slug}`}
                  className="group flex gap-4 rounded-2xl border border-warm bg-white p-4 transition-all hover:border-mint hover:shadow-lg"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-mint/20">
                    <span className="text-2xl">📝</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-sage">
                      Artikel
                    </span>
                    <h3 className="mt-0.5 font-semibold text-forest line-clamp-1 group-hover:text-sage">
                      {item.data.title}
                    </h3>
                    {item.data.excerpt && (
                      <p className="mt-1 line-clamp-2 text-sm text-sage">
                        {item.data.excerpt}
                      </p>
                    )}
                    {item.data.category && (
                      <Badge variant="green" className="mt-2 text-[10px]">
                        {item.data.category}
                      </Badge>
                    )}
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-sage opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
