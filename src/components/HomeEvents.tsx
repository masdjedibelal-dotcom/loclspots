"use client";

import Link from "next/link";

interface EventItem {
  id: string;
  title: string;
  start_date?: string | null;
  start_time?: string | null;
  venue_name?: string | null;
  category?: string | null;
}

const CATEGORY_EMOJI: Record<string, string> = {
  Konzerte: "🎵",
  Theater: "🎭",
  "Party & Club": "🎉",
  "Kabarett & Comedy": "😂",
  Ausstellungen: "🎨",
  Sport: "⚽",
  "Klassik & Oper": "🎼",
  "Flohmärkte & Märkte": "🛍️",
  "Märkte & Flohmärkte": "🛒",
  Sonstiges: "📅",
};

function formatEventDate(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00");
  return {
    day: date.toLocaleDateString("de-DE", { weekday: "short" }),
    num: date.getDate(),
    month: date.toLocaleDateString("de-DE", { month: "short" }),
  };
}

interface HomeEventsProps {
  events: EventItem[];
  /** Wenn false, nur die Event-Liste rendern (Header von außen) */
  showHeader?: boolean;
}

export function HomeEvents({ events, showHeader = true }: HomeEventsProps) {
  if (events.length === 0) return null;

  const content = (
    <div className="space-y-2">
        {events.map((event) => {
          const emoji = CATEGORY_EMOJI[event.category ?? ""] ?? "📅";
          const { day, num, month } = event.start_date
            ? formatEventDate(event.start_date)
            : { day: "–", num: "–", month: "" };

          return (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 transition-shadow hover:shadow-sm"
            >
              <div className="flex-none w-14 text-center">
                <div className="text-xs font-medium uppercase text-gray-400">
                  {day}
                </div>
                <div className="text-2xl font-bold leading-none text-[#2D5016]">
                  {typeof num === "number" ? num : "–"}
                </div>
                <div className="text-xs uppercase text-gray-400">{month}</div>
              </div>

              <div className="h-10 w-px flex-none bg-gray-100" />

              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex items-center gap-1.5">
                  <span className="text-sm">{emoji}</span>
                  <span className="truncate text-xs text-gray-400">
                    {event.category}
                  </span>
                </div>
                <h3 className="truncate text-sm font-semibold text-gray-900">
                  {event.title}
                </h3>
                {event.venue_name && (
                  <p className="mt-0.5 truncate text-xs text-gray-400">
                    📍 {event.venue_name}
                  </p>
                )}
              </div>

              {event.start_time && (
                <div className="flex-none text-right text-xs text-gray-400">
                  {event.start_time.slice(0, 5)} Uhr
                </div>
              )}
            </Link>
          );
        })}
    </div>
  );

  if (!showHeader) return content;

  return (
    <section className="py-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">📅 Events</h2>
        <Link href="/events" className="text-sm font-medium text-[#2D5016]">
          Alle Events →
        </Link>
      </div>
      {content}
    </section>
  );
}
