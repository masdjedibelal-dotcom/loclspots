import Link from "next/link";
import type { Metadata } from "next";
import { supabasePublic } from "@/lib/supabase/public";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { cn } from "@/lib/utils";

import { PAGINATION } from "@/lib/constants";

const CATEGORIES = [
  "",
  "Aktivitäten & Sport",
  "Neue Leute kennenlernen",
  "Stadtteile & Viertel",
] as const;

const CATEGORY_COLORS: Record<string, "green" | "peach" | "muted"> = {
  "Aktivitäten & Sport": "green",
  "Neue Leute kennenlernen": "peach",
  "Stadtteile & Viertel": "muted",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

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

export default async function ArtikelPage({ searchParams }: Props) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const category = params.category ?? "";

  const from = (currentPage - 1) * PAGINATION.ARTICLES;
  const to = from + PAGINATION.ARTICLES - 1;

  // Count
  let countQuery = supabasePublic
    .from("articles")
    .select("*", { count: "exact", head: true })
    .eq("is_published", true)
    .eq("is_public", true);

  if (category) {
    countQuery = countQuery.eq("category", category);
  }
  const { count } = await countQuery;
  const totalPages = Math.ceil((count ?? 0) / PAGINATION.ARTICLES);

  // Daten
  let dataQuery = supabasePublic
    .from("articles")
    .select("id, slug, title, excerpt, content, category, created_at")
    .eq("is_published", true)
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (category) {
    dataQuery = dataQuery.eq("category", category);
  }
  const { data: articles } = await dataQuery;

  const filterParams: Record<string, string> | undefined = category
    ? { category }
    : undefined;

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="mb-1 font-serif text-2xl font-semibold text-forest sm:text-3xl">
        Artikel
      </h1>
      <p className="mb-6 text-sm text-sage">
        Tipps & Stories für München ab 30
      </p>

      {/* Kategorie-Filter */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat || "alle"}
            href={
              cat
                ? `/artikel?category=${encodeURIComponent(cat)}`
                : "/artikel"
            }
            className={cn(
              "flex-none whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              (category === cat || (!category && !cat))
                ? "bg-forest text-white"
                : "border border-sage/40 bg-transparent text-sage hover:border-forest hover:bg-forest/10 hover:text-forest"
            )}
          >
            {cat || "Alle"}
          </Link>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles?.length === 0 ? (
          <p className="col-span-full py-12 text-center text-sage">
            Keine Artikel in dieser Kategorie.
          </p>
        ) : (
          articles?.map((article) => (
            <Link
              key={article.id}
              href={`/artikel/${article.slug}`}
              className={cn(
                "group flex flex-col overflow-hidden rounded-xl border border-sage/12 bg-white p-6",
                "transition-all duration-300 hover:-translate-y-0.5 hover:border-mint hover:shadow-lg hover:shadow-forest/10"
              )}
            >
              {article.category && (
                <Badge
                  variant={CATEGORY_COLORS[article.category] ?? "green"}
                  className="mb-3 w-fit"
                >
                  {article.category}
                </Badge>
              )}
              <h2 className="line-clamp-2 font-semibold leading-snug text-forest group-hover:text-sage">
                {article.title}
              </h2>
              {(article.excerpt || article.content) && (
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
                  {(article.excerpt ?? article.content ?? "")
                    .replace(/\s+/g, " ")
                    .trim()}
                </p>
              )}
              <time
                dateTime={article.created_at}
                className="mt-4 block text-xs text-sage"
              >
                {formatDate(article.created_at)}
              </time>
            </Link>
          ))
        )}
      </div>

      {/* Paginierung */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/artikel"
        searchParams={filterParams}
      />
    </main>
  );
}
