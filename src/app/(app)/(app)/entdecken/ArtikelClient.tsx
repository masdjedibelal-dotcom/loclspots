"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { Article } from "@/lib/types";

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

interface ArtikelClientProps {
  articles: Article[];
  /** Eingebettet z.B. in Entdecken: nur Grid */
  embedded?: boolean;
}

export function ArtikelClient({
  articles,
  embedded = false,
}: ArtikelClientProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
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
            <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
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
      ))}
    </div>
  );
}
