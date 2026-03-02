import type { Metadata } from "next";
import { getArticlesPaginated } from "@/lib/supabase";
import { ArtikelClient } from "./ArtikelClient";

const ARTICLES_PER_PAGE = 9;
const CATEGORIES = [
  "Aktivitäten & Sport",
  "Neue Leute kennenlernen",
  "Stadtteile & Viertel",
] as const;

type Props = { searchParams: Promise<{ page?: string; category?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const parts: string[] = [];
  if (params.page) parts.push(`page=${params.page}`);
  if (params.category) parts.push(`category=${encodeURIComponent(params.category)}`);
  const qs = parts.length > 0 ? `?${parts.join("&")}` : "";

  return {
    title: "Tipps & Guides für München | LoclSpots",
    description:
      "Artikel, Tipps und Geschichten von LoclSpots — für Menschen, die echten Austausch suchen.",
    alternates: {
      canonical: `/artikel${qs}`,
    },
  };
}

export default async function ArtikelPage({
  searchParams,
}: Props) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const category =
    params.category && CATEGORIES.includes(params.category as (typeof CATEGORIES)[number])
      ? params.category
      : "all";

  const offset = (page - 1) * ARTICLES_PER_PAGE;
  const { data: articles, count } = await getArticlesPaginated(
    offset,
    ARTICLES_PER_PAGE,
    category === "all" ? undefined : category
  );

  const totalPages = Math.max(1, Math.ceil(count / ARTICLES_PER_PAGE));

  return (
    <ArtikelClient
        articles={articles}
        totalCount={count}
        currentPage={page}
        totalPages={totalPages}
        categoryFilter={category}
        categories={[...CATEGORIES]}
      />
  );
}
