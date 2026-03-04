"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { MapPin, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { joinEvent, leaveEvent } from "@/app/(app)/events/actions";
import type { Event } from "@/lib/types";

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
    weekday: "short",
    day: "numeric",
    month: "long",
  });

  if (time) {
    const [h, m] = time.slice(0, 5).split(":").map(Number);
    const timeStr = `${h.toString().padStart(2, "0")}:${(m || 0)
      .toString()
      .padStart(2, "0")} Uhr`;
    return `${dateStr} · ${timeStr}`;
  }

  return dateStr;
}

interface EventCardProps {
  event: Event;
  currentUserId: string;
  isParticipating: boolean;
  categoryEmoji?: string;
}

export function EventCard({
  event,
  currentUserId,
  isParticipating,
  categoryEmoji = "📌",
}: EventCardProps) {
  const [participating, setParticipating] = useState(isParticipating);
  const [participantCount, setParticipantCount] = useState(
    event.participant_count ?? 0
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    const wasParticipating = participating;
    setParticipating(!participating);
    setParticipantCount((c) => (wasParticipating ? c - 1 : c + 1));

    const result = wasParticipating
      ? await leaveEvent(event.id)
      : await joinEvent(event.id);

    if (result?.error) {
      setParticipating(wasParticipating);
      setParticipantCount((c) => (wasParticipating ? c + 1 : c - 1));
    }
    setIsLoading(false);
  };

  const dateStr = formatEventDateTime(event);
  const mapUrl =
    event.lat && event.lng
      ? `https://www.google.com/maps?q=${event.lat},${event.lng}`
      : null;

  return (
    <Link href={`/events/${event.id}`}>
      <div
        className={cn(
          "overflow-hidden rounded-xl border border-warm bg-white transition-shadow hover:shadow-md",
          event.is_cancelled && "opacity-60"
        )}
      >
        {/* Cover oder Kategorie-Emoji */}
        <div className="flex h-32 items-center justify-center bg-warm">
          {event.cover_image_url ? (
            <img
              src={event.cover_image_url}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-5xl" role="img" aria-hidden>
              {categoryEmoji}
            </span>
          )}
        </div>

        <div className="p-4">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-sage">{dateStr}</span>
            {event.is_cancelled && (
              <Badge variant="peach" className="shrink-0">
                Abgesagt
              </Badge>
            )}
            {event.category && !event.is_cancelled && (
              <Badge variant="green">{event.category}</Badge>
            )}
          </div>

          <h3 className="font-semibold text-forest line-clamp-2">
            {event.title}
          </h3>
          {event.description && (
            <p className="mt-1 line-clamp-3 text-sm text-sage">
              {event.description}
            </p>
          )}

          {event.venue_name && (
            <div className="mt-2 flex items-center gap-1.5 text-sm text-muted">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{event.venue_name}</span>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="text-xs text-sage">
                {participantCount} {participantCount === 1 ? "Teilnehmer" : "Teilnehmer"}
              </span>
              {event.source_url && (
                <a
                  href={event.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 text-xs font-medium text-forest hover:text-sage"
                >
                  Mehr Info <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
            {!event.is_cancelled && (
              <Button
                size="sm"
                variant={participating ? "outline" : "primary"}
                onClick={(e) => {
                  e.preventDefault();
                  handleToggle();
                }}
                isLoading={isLoading}
                disabled={isLoading}
              >
                {participating ? "Abmelden" : "Teilnehmen"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
