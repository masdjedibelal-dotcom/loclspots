"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { cn } from "@/lib/utils";
import type { Article } from "@/lib/types";

const CATEGORY_COLORS: Record<string, "green" | "peach" | "muted"> = {
  "Aktivitäten & Sport": "green",
  "Neue Leute kennenlernen": "peach",
  "Stadtteile & Viertel": "muted",
};

const FILTER_TABS = [
  { id: "all", label: "Alle" },
  { id: "Aktivitäten & Sport", label: "Aktivitäten & Sport" },
  { id: "Neue Leute kennenlernen", label: "Neue Leute kennenlernen" },
  { id: "Stadtteile & Viertel", label: "Stadtteile & Viertel" },
] as const;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function buildUrl(searchParams: URLSearchParams, updates: { page?: number; category?: string }): string {
  const next = new URLSearchParams(searchParams.toString());
  if (updates.page !== undefined) next.set("page", String(updates.page));
  if (updates.category !== undefined) {
    updates.category ? next.set("category", updates.category) : next.delete("category");
  }
  const qs = next.toString();
  return `/artikel${qs ? `?${qs}` : ""}`;
}

interface ArtikelClientProps {
  articles: Article[];
  totalCount?: number;
  currentPage?: number;
  totalPages?: number;
  categoryFilter?: string;
  categories?: readonly string[];
  /** Eingebettet z.B. in Entdecken: keine Filter, keine Pagination */
  embedded?: boolean;
}

export function ArtikelClient({
  articles,
  totalCount = 0,
  currentPage = 1,
  totalPages = 1,
  categoryFilter = "all",
  categories = [],
  embedded = false,
}: ArtikelClientProps) {
  const searchParams = useSearchParams();
  const page = Math.min(currentPage, totalPages);
  const showPagination = !embedded && totalPages > 1;
  const showFilters = !embedded;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-forest sm:text-3xl">
          Artikel
        </h1>
        <p className="mt-1 text-sage">
          Tipps, Inspiration und Geschichten aus der LoclSpots-Community.
        </p>
      </div>

      {/* Kategorie-Filter: horizontal scrollbar (nur auf Vollseite) */}
      {showFilters && (
      <div
        className="-mx-4 flex flex-nowrap gap-2 overflow-x-auto px-4 pb-4 scrollbar-hide md:mx-0 md:px-0"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {FILTER_TABS.map((tab) => {
          const isActive = categoryFilter === tab.id;
          return (
            <Link
              key={tab.id}
              href={buildUrl(searchParams, {
                page: 1,
                category: tab.id === "all" ? "" : tab.id,
              })}
              className={cn(
                "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-forest text-white"
                  : "border border-sage/40 bg-transparent text-sage hover:border-forest hover:bg-forest/10 hover:text-forest"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
      )}

      {/* 2 Spalten Desktop, 1 Spalte Mobile */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
        {articles.length === 0 ? (
          <p className="col-span-full py-12 text-center text-sage">
            Keine Artikel in dieser Kategorie.
          </p>
        ) : (
          articles.map((article) => (
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
              <h2 className="font-semibold leading-snug text-forest line-clamp-2 group-hover:text-sage">
                {article.title}
              </h2>
              {(article.excerpt || article.content) && (
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
                  {(article.excerpt ?? article.content ?? "").replace(/\s+/g, " ").trim()}
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

      {showPagination && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath="/artikel"
          searchParams={
            categoryFilter !== "all" ? { category: categoryFilter } : undefined
          }
        />
      )}
    </div>
  );
}
