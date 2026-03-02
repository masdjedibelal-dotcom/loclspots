import type { Metadata } from "next";
import { getLatestArticles, getLatestPublicCollabs, getHighlightEvents } from "@/lib/supabase";
import { LandingPageContent } from "@/components/landing/LandingPageContent";

export const metadata: Metadata = {
  title: "LoclSpots — Community für München ab 30 | Chatrooms, Events & Lokale Tipps",
  description:
    "LoclSpots ist die Community-Plattform für Menschen ab 30 in München. Thematische Chatrooms, kuratierte Orte und echte Gespräche — ohne Algorithmus-Druck.",
  metadataBase: new URL("https://loclspots.netlify.app"),
  openGraph: {
    title: "LoclSpots — Community für München ab 30",
    description:
      "Thematische Chatrooms, kuratierte Orte und echte Gespräche für Menschen ab 30 in München.",
    type: "website",
    url: "https://loclspots.netlify.app/",
  },
  alternates: {
    canonical: "https://loclspots.netlify.app/",
  },
};

export default async function LandingPage() {
  const [articles, collabs, events] = await Promise.all([
    getLatestArticles(3),
    getLatestPublicCollabs(4),
    getHighlightEvents(5),
  ]);

  return (
    <LandingPageContent articles={articles} collabs={collabs} events={events} />
  );
}
