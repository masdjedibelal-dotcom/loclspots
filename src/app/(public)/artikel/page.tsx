import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import type { Metadata } from "next";
import { Pagination } from "@/components/ui/Pagination";

const ITEMS_PER_PAGE = 9;

const CATEGORIES = [
  "",
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

export default async function ArtikelPage({ searchParams }: Props) {
  const params = await searchParams;
  const currentPage = Number(params.page ?? 1);
  const category = params.category ?? "";
  const from = (currentPage - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  let countQuery = supabase
    .from("articles")
    .select("*", { count: "exact", head: true })
    .eq("is_published", true)
    .eq("is_public", true);
  if (category) countQuery = countQuery.eq("category", category);
  const { count } = await countQuery;
  const totalPages = Math.ceil((count ?? 0) / ITEMS_PER_PAGE);

  let dataQuery = supabase
    .from("articles")
    .select("id, slug, title, excerpt, category, created_at")
    .eq("is_published", true)
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .range(from, to);
  if (category) dataQuery = dataQuery.eq("category", category);
  const { data: articles } = await dataQuery;

  return (
    <>
      {/* Public Header */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
          <Link href="/">
            <span className="text-xl font-bold">
              <span className="text-gray-900">Locl</span>
              <span className="text-[#E8651A]">Spots</span>
            </span>
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-gray-300 px-4 py-1.5 text-sm"
          >
            Einloggen
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        <h1 className="mb-1 text-2xl font-semibold">Artikel</h1>
        <p className="mb-6 text-sm text-gray-500">
          Tipps & Stories für München ab 30
        </p>

        {/* Kategorie Filter */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat || "alle"}
              href={cat ? `/artikel?category=${encodeURIComponent(cat)}` : "/artikel"}
              className={`flex-none whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                category === cat || (!category && !cat)
                  ? "bg-[#2D5016] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat || "Alle"}
            </Link>
          ))}
        </div>

        {/* Artikel Liste */}
        <div className="space-y-3">
          {!articles?.length ? (
            <p className="py-12 text-center text-gray-500">
              Keine Artikel in dieser Kategorie.
            </p>
          ) : (
            articles.map((article) => (
            <Link
              key={article.id}
              href={`/artikel/${article.slug}`}
              className="block rounded-2xl border border-gray-100 bg-white p-4 transition-shadow hover:shadow-sm"
            >
              {article.category && (
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                  {article.category}
                </span>
              )}
              <h2 className="mt-2 line-clamp-2 font-semibold text-gray-900">
                {article.title}
              </h2>
              {article.excerpt && (
                <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                  {article.excerpt}
                </p>
              )}
              <span className="mt-2 block text-xs text-gray-400">
                {new Date(article.created_at).toLocaleDateString("de-DE", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </Link>
          ))
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/artikel"
          searchParams={category ? { category } : {}}
        />
      </main>
    </>
  );
}
