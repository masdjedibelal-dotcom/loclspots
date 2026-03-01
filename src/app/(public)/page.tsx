import { getLatestArticles, getPublicCollabs } from "@/lib/supabase";
import { LandingPageContent } from "@/components/landing/LandingPageContent";

export default async function LandingPage() {
  const [articles, collabs] = await Promise.all([
    getLatestArticles(3),
    getPublicCollabs(),
  ]);

  return (
    <LandingPageContent articles={articles} collabs={collabs} />
  );
}
