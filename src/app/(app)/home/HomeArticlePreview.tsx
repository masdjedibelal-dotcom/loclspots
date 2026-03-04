import Link from "next/link";
import { ArtikelCard } from "@/components/ArtikelCard";
import type { Article } from "@/lib/types";

interface HomeArticlePreviewProps {
  articles: Article[];
}

export function HomeArticlePreview({ articles }: HomeArticlePreviewProps) {
  if (articles.length === 0) return null;

  return (
    <section className="py-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">📝 Artikel</h2>
          <p className="text-xs text-gray-500">Tipps & Guides für München</p>
        </div>
        <Link href="/artikel" className="text-sm font-medium text-[#2D5016]">
          Alle →
        </Link>
      </div>

      <div className="space-y-2">
        {articles.map((article) => (
          <ArtikelCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
