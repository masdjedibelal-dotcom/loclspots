"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EventCard } from "@/components/events/EventCard";
import type { Event } from "@/lib/types";
import { cn } from "@/lib/utils";

interface EventsClientProps {
  upcomingEvents: Event[];
  pastEvents: Event[];
  categories: string[];
  participantIds: string[];
  currentUserId: string;
}

const CATEGORY_EMOJI: Record<string, string> = {
  Konzerte: "🎵",
  Klassik: "🎻",
  Theater: "🎭",
  Shows: "🎪",
  Kabarett: "🎤",
  Sonstiges: "📌",
};

export function EventsClient({
  upcomingEvents,
  pastEvents,
  categories,
  participantIds,
  currentUserId,
}: EventsClientProps) {
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [showSuggestModal, setShowSuggestModal] = useState(false);

  const filteredUpcoming =
    !categoryFilter
      ? upcomingEvents
      : upcomingEvents.filter((e) => e.category === categoryFilter);

  const filteredPast =
    !categoryFilter
      ? pastEvents
      : pastEvents.filter((e) => e.category === categoryFilter);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl text-forest sm:text-3xl">
            Events in München
          </h1>
          <p className="mt-1 text-sage">
            Konzerte, Theater, Shows und mehr – von der Community entdeckt.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowSuggestModal(true)}
          className="shrink-0"
        >
          <Plus className="mr-2 h-4 w-4" />
          Event vorschlagen
        </Button>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategoryFilter("")}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-colors",
            !categoryFilter
              ? "bg-forest text-white"
              : "bg-warm text-sage hover:bg-sage/20"
          )}
        >
          Alle
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategoryFilter(cat)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              categoryFilter === cat
                ? "bg-forest text-white"
                : "bg-warm text-sage hover:bg-sage/20"
            )}
          >
            {CATEGORY_EMOJI[cat] ?? "📌"} {cat}
          </button>
        ))}
      </div>

      {/* Kommende Events */}
      <section>
        <h2 className="mb-4 font-semibold text-forest">Kommende Events</h2>
        {filteredUpcoming.length === 0 ? (
          <p className="py-8 text-center text-sage">
            Keine kommenden Events in dieser Kategorie.
          </p>
        ) : (
          <div className="space-y-4">
            {filteredUpcoming.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                currentUserId={currentUserId}
                isParticipating={participantIds.includes(event.id)}
                categoryEmoji={CATEGORY_EMOJI[event.category ?? ""] ?? "📌"}
              />
            ))}
          </div>
        )}
      </section>

      {/* Vergangene Events */}
      {filteredPast.length > 0 && (
        <section>
          <button
            type="button"
            onClick={() => setShowPastEvents(!showPastEvents)}
            className="flex w-full items-center justify-between rounded-lg border border-warm bg-cream/30 px-4 py-3 text-left text-forest transition-colors hover:bg-cream/50"
          >
            <span className="font-medium">
              {filteredPast.length} vergangene
              {filteredPast.length !== 1 ? " Events" : " Event"} anzeigen
            </span>
            <span
              className={cn(
                "text-sage transition-transform",
                showPastEvents && "rotate-180"
              )}
            >
              ▼
            </span>
          </button>
          {showPastEvents && (
            <div className="mt-4 space-y-4">
              {filteredPast.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  currentUserId={currentUserId}
                  isParticipating={participantIds.includes(event.id)}
                  categoryEmoji={CATEGORY_EMOJI[event.category ?? ""] ?? "📌"}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Event vorschlagen Modal (optional, Platzhalter) */}
      {showSuggestModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          onClick={(e) =>
            e.target === e.currentTarget && setShowSuggestModal(false)
          }
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-semibold text-forest">Event vorschlagen</h3>
            <p className="mt-2 text-sm text-sage">
              Diese Funktion kommt bald. Du kannst Events dann für die Community
              vorschlagen.
            </p>
            <Button
              className="mt-4"
              onClick={() => setShowSuggestModal(false)}
            >
              Schließen
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
