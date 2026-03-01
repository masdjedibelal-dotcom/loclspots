import { getArticles } from "@/lib/supabase";
import { BlogClient } from "./BlogClient";

export const metadata = {
  title: "Blog — Tipps & Stories | LoclSpots",
  description: "Artikel, Tipps und Geschichten von LoclSpots — für Menschen, die echten Austausch suchen.",
};

export default async function BlogPage() {
  const articles = await getArticles();

  return <BlogClient articles={articles} />;
}
