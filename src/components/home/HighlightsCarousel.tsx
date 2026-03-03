import Link from "next/link";

const CATEGORY_EMOJI: Record<string, string> = {
  Konzerte: "🎵",
  Klassik: "🎻",
  Theater: "🎭",
  "Party & Club": "🎉",
  "Kabarett & Comedy": "🎤",
  Ausstellungen: "🖼️",
  Sport: "⚽",
  "Märkte & Flohmärkte": "🛒",
  Sonstiges: "📌",
};

interface EventItem {
  id: string;
  title: string;
  start_date?: string | null;
  start_time?: string | null;
  start_datetime?: string | null;
  venue_name?: string | null;
  category?: string | null;
  cover_image_url?: string | null;
}

function formatEventDate(event: EventItem): string {
  const dt = event.start_datetime ?? event.start_date;
  if (!dt) return "Datum folgt";
  const d = new Date(dt);
  return d.toLocaleDateString("de-DE", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

interface HighlightsCarouselProps {
  events: EventItem[];
  limit?: number;
}

export function HighlightsCarousel({ events, limit = 5 }: HighlightsCarouselProps) {
  const items = events.slice(0, limit);

  if (items.length === 0) return null;

  return (
    <div
      className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide scroll-smooth snap-x snap-mandatory md:mx-0 md:px-0"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {items.map((event) => (
        <Link
          key={event.id}
          href={`/events/${event.id}`}
          className="group flex w-[85vw] shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-warm bg-white transition-all hover:border-mint hover:shadow-lg md:w-72"
        >
          <div className="flex h-32 items-center justify-center bg-warm">
            {event.cover_image_url ? (
              <img
                src={event.cover_image_url}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-5xl" role="img" aria-hidden>
                {CATEGORY_EMOJI[event.category ?? ""] ?? "📌"}
              </span>
            )}
          </div>
          <div className="flex flex-1 flex-col p-4">
            <span className="text-xs font-medium text-sage">
              {formatEventDate(event)}
            </span>
            <h3 className="mt-0.5 line-clamp-2 font-semibold text-forest group-hover:text-sage">
              {event.title}
            </h3>
            {event.venue_name && (
              <p className="mt-1 line-clamp-1 text-sm text-sage">
                {event.venue_name}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
