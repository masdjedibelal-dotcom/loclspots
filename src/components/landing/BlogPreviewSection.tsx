import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { Badge } from "@/components/ui/Badge";
import type { Article } from "@/lib/types";

interface BlogPreviewSectionProps {
  articles: Article[];
}

export function BlogPreviewSection({ articles }: BlogPreviewSectionProps) {
  if (articles.length === 0) return null;

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-[1100px] px-6 sm:px-12">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="font-serif text-3xl font-bold leading-tight text-forest sm:text-4xl">
              Tipps & Stories aus München
            </h2>
            <p className="mt-2 text-[18px] font-light leading-relaxed text-muted">
              Neue Leute kennenlernen, Viertel entdecken, Sport-Communities finden — ehrliche Guides von und für Münchner ab 30.
            </p>
          </div>
          <Link
            href="/artikel"
            className="group inline-flex items-center gap-2 text-[15px] font-semibold text-forest transition-colors hover:text-sage"
          >
            Alle Artikel →
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ScrollReveal key={article.id}>
              <Link
                href={`/artikel/${article.slug}`}
                className={`
                  group flex flex-col overflow-hidden rounded-[18px] border border-sage/12 bg-cream
                  transition-all duration-300
                  hover:-translate-y-1 hover:border-mint hover:shadow-xl hover:shadow-forest/10
                `}
              >
                <div className="flex flex-1 flex-col p-6">
                  {article.category && (
                    <Badge variant="green" className="mb-3 w-fit">
                      {article.category}
                    </Badge>
                  )}
                  <h3 className="text-base font-semibold leading-snug text-forest line-clamp-2 group-hover:text-sage">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted line-clamp-2 sm:line-clamp-3">
                      {article.excerpt}
                    </p>
                  )}
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-forest transition-colors group-hover:text-sage">
                    Weiterlesen
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
