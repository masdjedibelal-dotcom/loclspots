import { SectionHeader } from "@/components/ui/SectionHeader";
import { HighlightsCarousel } from "@/components/home/HighlightsCarousel";

interface EventPreview {
  id: string;
  title: string;
  start_date?: string | null;
  start_time?: string | null;
  start_datetime?: string | null;
  venue_name?: string | null;
  category?: string | null;
  cover_image_url?: string | null;
}

interface HomeEventsPreviewProps {
  events: EventPreview[];
}

export function HomeEventsPreview({ events }: HomeEventsPreviewProps) {
  if (events.length === 0) return null;

  return (
    <section className="py-4">
      <SectionHeader
        title="Events"
        href="/events"
        linkText="Alle Events →"
        titleClassName="font-serif text-xl font-bold text-forest sm:text-2xl"
        className="mb-4"
      />
      <HighlightsCarousel events={events} limit={5} />
    </section>
  );
}
