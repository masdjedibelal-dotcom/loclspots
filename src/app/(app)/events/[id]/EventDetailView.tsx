import Link from "next/link";
import { MapPin, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { EventDetailClient } from "./EventDetailClient";
import type { Event } from "@/lib/types";

const CATEGORY_EMOJI: Record<string, string> = {
  Konzerte: "🎵",
  Klassik: "🎻",
  Theater: "🎭",
  Shows: "🎪",
  Kabarett: "🎤",
  Sonstiges: "📌",
};

function formatEventDateTime(event: Event): string {
  const dt = event.start_datetime ?? event.start_date;
  const time = event.start_time;

  if (!dt) return "Datum folgt";

  let d: Date;
  if (event.start_datetime) {
    d = new Date(event.start_datetime);
  } else if (event.start_date) {
    const [year, month, day] = event.start_date.split("-").map(Number);
    d = new Date(year, month - 1, day);
  } else {
    return "Datum folgt";
  }

  const dateStr = d.toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  if (time) {
    const [h, m] = time.slice(0, 5).split(":").map(Number);
    const hh = (h ?? 0).toString().padStart(2, "0");
    const mm = (m ?? 0).toString().padStart(2, "0");
    return dateStr + " · " + hh + ":" + mm + " Uhr";
  }

  return dateStr;
}

interface EventDetailViewProps {
  event: Event;
  mapUrl: string | null;
  profiles: { id: string; username: string; display_name: string; avatar_url: string | null }[];
  participantCount: number;
  isParticipating: boolean;
  currentUserId: string;
}

export function EventDetailView({
  event,
  mapUrl,
  profiles,
  participantCount,
  isParticipating,
  currentUserId,
}: EventDetailViewProps) {
  const eventWithExtras: Event = {
    ...event,
    participant_count: participantCount,
    is_participating: isParticipating,
  };

  return (
    <div className="space-y-6">
      <Link
        href="/events"
        className="inline-flex text-sm text-sage hover:text-forest"
      >
        ← Zurück zu Events
      </Link>

      <div className="overflow-hidden rounded-2xl border border-warm bg-white">
        {event.cover_image_url ? (
          <div className="relative h-56 sm:h-72">
            <img
              src={event.cover_image_url}
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        ) : (
          <div className="flex h-32 items-center justify-center bg-warm">
            <span className="text-6xl" role="img" aria-hidden>
              {CATEGORY_EMOJI[event.category ?? ""] ?? "📌"}
            </span>
          </div>
        )}

        <div className="p-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="text-sage">{formatEventDateTime(event)}</span>
            {event.is_cancelled && (
              <Badge variant="peach">Abgesagt</Badge>
            )}
            {event.category && !event.is_cancelled && (
              <Badge variant="green">{event.category}</Badge>
            )}
          </div>

          <h1 className="font-serif text-2xl font-bold text-forest sm:text-3xl">
            {event.title}
          </h1>

          {event.description && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-forest">Beschreibung</h3>
              <p className="mt-1 whitespace-pre-wrap text-sage">
                {event.description}
              </p>
            </div>
          )}

          {event.highlights && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-forest">Highlights</h3>
              <p className="mt-1 text-sage">
                {typeof event.highlights === "string"
                  ? event.highlights
                  : "⭐ Besonderes Event"}
              </p>
            </div>
          )}

          {(event.venue_name || mapUrl) && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-forest">Ort</h3>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                {event.venue_name && (
                  <span className="flex items-center gap-1.5 text-sage">
                    <MapPin className="h-4 w-4 shrink-0" />
                    {event.venue_name}
                  </span>
                )}
                {mapUrl && (
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-forest hover:text-sage"
                  >
                    In Google Maps öffnen
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-sage">
                {participantCount} {participantCount === 1 ? "Teilnehmer" : "Teilnehmer"}
              </span>
              {profiles.length > 0 && (
                <div className="flex -space-x-2">
                  {profiles.slice(0, 5).map((p) => (
                    <div
                      key={p.id}
                      className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-sage/30 text-xs font-medium text-forest"
                      title={p.display_name}
                    >
                      {p.avatar_url ? (
                        <img
                          src={p.avatar_url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span>{(p.display_name ?? "?").slice(0, 1)}</span>
                      )}
                    </div>
                  ))}
                  {profiles.length > 5 && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-warm text-xs text-sage">
                      +{profiles.length - 5}
                    </div>
                  )}
                </div>
              )}
            </div>
            {event.source_url && (
              <a
                href={event.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-medium text-forest hover:text-sage"
              >
                Mehr Info <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>

          {!event.is_cancelled && (
            <EventDetailClient
              event={eventWithExtras}
              currentUserId={currentUserId}
              isParticipating={isParticipating}
              participantCount={participantCount}
            />
          )}
        </div>
      </div>
    </div>
  );
}
