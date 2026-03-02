import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { SectionHeader } from "@/components/ui/SectionHeader";
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

interface HomeArticlePreviewProps {
  articles: Article[];
}

export function HomeArticlePreview({ articles }: HomeArticlePreviewProps) {
  if (articles.length === 0) return null;

  return (
    <section>
      <SectionHeader
        title="Artikel"
        href="/artikel"
        linkText="Alle Artikel →"
        titleClassName="font-serif text-xl font-bold text-forest sm:text-2xl"
        className="mb-4"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/artikel/${article.slug}`}
            className="group flex flex-col overflow-hidden rounded-xl border border-warm bg-white p-4 transition-all hover:border-mint hover:shadow-lg"
          >
            {article.category && (
              <Badge
                variant={CATEGORY_COLORS[article.category] ?? "green"}
                className="mb-3 w-fit text-[10px]"
              >
                {article.category}
              </Badge>
            )}
            <h3 className="line-clamp-2 font-semibold text-forest group-hover:text-sage">
              {article.title}
            </h3>
            {(article.excerpt || article.content) && (
              <p className="mt-2 line-clamp-2 flex-1 text-sm text-sage">
                {(article.excerpt ?? article.content ?? "").replace(/\s+/g, " ").trim()}
              </p>
            )}
            <time
              dateTime={article.created_at}
              className="mt-3 block text-xs text-sage"
            >
              {formatDate(article.created_at)}
            </time>
          </Link>
        ))}
      </div>
    </section>
  );
}
