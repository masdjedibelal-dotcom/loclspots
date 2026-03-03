"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EventCard } from "@/components/events/EventCard";
import { Pagination } from "@/components/ui/Pagination";
import type { Event } from "@/lib/types";
import { cn } from "@/lib/utils";

const CATEGORY_EMOJI: Record<string, string> = {
  Konzerte: "🎵",
  Klassik: "🎻",
  Theater: "🎭",
  "Party & Club": "🎉",
  "Kabarett & Comedy": "🎤",
  Ausstellungen: "🖼️",
  Sport: "⚽",
  "Flohmärkte & Märkte": "🛒",
  "Märkte & Flohmärkte": "🛒",
  Shows: "🎪",
  Kabarett: "🎤",
  Sonstiges: "📌",
};

const HIGHLIGHTS_ID = "⭐ Highlights";

const FILTER_TABS = [
  { id: "all", label: "Alle" },
  { id: HIGHLIGHTS_ID, label: HIGHLIGHTS_ID },
  { id: "Konzerte", label: "Konzerte" },
  { id: "Theater", label: "Theater" },
  { id: "Kabarett & Comedy", label: "Kabarett & Comedy" },
  { id: "Party & Club", label: "Party & Club" },
  { id: "Ausstellungen", label: "Ausstellungen" },
  { id: "Sport", label: "Sport" },
  { id: "Flohmärkte & Märkte", label: "Flohmärkte & Märkte" },
  { id: "Sonstiges", label: "Sonstiges" },
] as const;

interface EventsClientProps {
  events: Event[];
  totalPages: number;
  currentPage: number;
  categoryFilter: string;
  participantIds: string[];
  currentUserId: string;
}

function buildFilterUrl(category: string): string {
  if (category === "all") return "/events";
  return `/events?category=${encodeURIComponent(category)}`;
}

export function EventsClient({
  events,
  totalPages,
  currentPage,
  categoryFilter,
  participantIds,
  currentUserId,
}: EventsClientProps) {
  const [showSuggestModal, setShowSuggestModal] = useState(false);

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

      {/* Kategorie-Filter: horizontal scrollbar */}
      <div
        className="-mx-4 flex flex-nowrap gap-2 overflow-x-auto px-4 pb-4 scrollbar-hide md:mx-0 md:px-0"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {FILTER_TABS.map((tab) => {
          const isActive = categoryFilter === tab.id;
          const isHighlightsTab = tab.id === HIGHLIGHTS_ID;
          return (
            <Link
              key={tab.id}
              href={buildFilterUrl(tab.id)}
              className={cn(
                "flex-none whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                isHighlightsTab
                  ? isActive
                    ? "bg-amber-500 text-white"
                    : "border border-amber-200 bg-amber-50 text-amber-700"
                  : isActive
                    ? "bg-forest text-white"
                    : "border border-sage/40 bg-transparent text-sage hover:border-forest hover:bg-forest/10 hover:text-forest"
              )}
            >
              {isHighlightsTab ? tab.label : `${CATEGORY_EMOJI[tab.id] ?? "📌"} ${tab.label}`}
            </Link>
          );
        })}
      </div>

      {/* Event-Liste */}
      <section>
        <h2 className="mb-4 font-semibold text-forest">Kommende Events</h2>
        {events.length === 0 ? (
          <p className="py-8 text-center text-sage">
            Keine kommenden Events in dieser Kategorie.
          </p>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
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

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/events"
        searchParams={
          categoryFilter !== "all" ? { category: categoryFilter } : undefined
        }
      />

      {/* Event vorschlagen Modal */}
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
