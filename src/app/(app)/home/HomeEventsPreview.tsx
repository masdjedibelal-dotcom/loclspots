import Link from "next/link";
import { HomeEvents } from "@/components/HomeEvents";

interface EventPreview {
  id: string;
  title: string;
  start_date?: string | null;
  start_time?: string | null;
  venue_name?: string | null;
  category?: string | null;
}

interface HomeEventsPreviewProps {
  events: EventPreview[];
}

export function HomeEventsPreview({ events }: HomeEventsPreviewProps) {
  return (
    <section className="py-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">📅 Events</h2>
        <Link href="/events" className="text-sm font-medium text-[#2D5016]">
          Alle Events →
        </Link>
      </div>
      <HomeEvents events={events} showHeader={false} />
    </section>
  );
}
