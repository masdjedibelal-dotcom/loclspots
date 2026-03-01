"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { Article } from "@/lib/types";

const FILTER_TABS = [
  { id: "all", label: "Alle" },
  { id: "Aktivitäten & Sport", label: "Aktivitäten & Sport" },
  { id: "Neue Leute kennenlernen", label: "Neue Leute kennenlernen" },
  { id: "Stadtteile & Viertel", label: "Stadtteile & Viertel" },
] as const;

const CATEGORY_COLORS: Record<string, "green" | "peach" | "muted"> = {
  "Aktivitäten & Sport": "green",
  "Neue Leute kennenlernen": "peach",
  "Stadtteile & Viertel": "muted",
};

function truncateExcerpt(text: string | null, maxLen: number): string {
  if (!text) return "";
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= maxLen) return cleaned;
  return cleaned.slice(0, maxLen).trim() + "…";
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

interface BlogClientProps {
  articles: Article[];
}

export function BlogClient({ articles }: BlogClientProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filtered =
    activeFilter === "all"
      ? articles
      : articles.filter((a) => a.category === activeFilter);

  return (
    <div className="min-h-screen bg-light">
      <div className="border-b border-sage/15 bg-cream/95 px-6 py-4 backdrop-blur-sm sm:px-12">
        <div className="mx-auto flex max-w-[900px] items-center justify-between">
          <Link
            href="/"
            className="font-serif text-[20px] font-bold tracking-tight text-forest"
          >
            Locl<span className="text-peach">Spots</span>
          </Link>
          <Link
            href="/"
            className="text-[14px] font-medium text-sage hover:text-forest"
          >
            ← Zur Startseite
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-[900px] px-6 py-12 sm:px-12">
        <div className="mb-10">
          <h1 className="font-serif text-3xl font-bold text-forest sm:text-4xl">
            Tipps & Stories
          </h1>
          <p className="mt-2 text-muted">
            Artikel, Inspiration und Geschichten aus der LoclSpots-Community.
          </p>
        </div>

        {/* Filter-Tabs */}
        <div className="mb-10 flex flex-wrap gap-2">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={cn(
                "rounded-full px-4 py-2 text-[14px] font-medium transition-colors",
                activeFilter === tab.id
                  ? "bg-forest text-white"
                  : "bg-warm text-sage hover:bg-sage/20 hover:text-forest"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Artikel-Grid */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
          {filtered.length === 0 ? (
            <p className="col-span-full py-12 text-center text-muted">
              Keine Artikel in dieser Kategorie.
            </p>
          ) : (
            filtered.map((article) => (
              <Link
                key={article.id}
                href={`/blog/${article.slug}`}
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
                  <p className="mt-3 text-[14px] leading-relaxed text-muted line-clamp-3">
                    {truncateExcerpt(
                      article.excerpt ?? article.content,
                      120
                    )}
                  </p>
                )}
                <time
                  dateTime={article.created_at}
                  className="mt-4 block text-[12px] text-sage"
                >
                  {formatDate(article.created_at)}
                </time>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
