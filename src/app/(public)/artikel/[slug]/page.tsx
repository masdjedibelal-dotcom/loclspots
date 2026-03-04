import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getArticleBySlug,
  getArticleSlugs,
  getRelatedArticles,
} from "@/lib/supabase";
import { ArtikelContent } from "@/components/ArtikelContent";
import { Badge } from "@/components/ui/Badge";
import { ArtikelBackButton } from "./ArtikelBackButton";
import { HomeLink } from "./HomeLink";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Artikel nicht gefunden" };

  const title = `${article.title} | LoclSpots`;
  const description =
    article.excerpt?.slice(0, 160) ?? article.title;

  return {
    title,
    description,
    alternates: {
      canonical: `/artikel/${slug}`,
    },
    openGraph: {
      title,
      description,
    },
  };
}

export async function generateStaticParams() {
  const slugs = await getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ArtikelDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  const related = await getRelatedArticles(
    article.id,
    article.category,
    2
  );

  return (
    <div className="min-h-screen bg-light">
      <header className="border-b border-sage/15 bg-cream/95 px-6 py-4 backdrop-blur-sm sm:px-12">
        <div className="mx-auto flex max-w-[720px] items-center justify-between">
          <HomeLink />
          <ArtikelBackButton />
        </div>
      </header>

      <div className="mx-auto max-w-[720px] px-6 py-12 sm:px-12">
        <div className="mb-8">
          <ArtikelBackButton />
        </div>
        <ArtikelContent article={article} />
      </div>

      {related.length > 0 && (
        <section className="border-t border-sage/12 bg-warm py-16">
          <div className="mx-auto max-w-[720px] px-6 sm:px-12">
            <h2 className="font-serif text-xl font-bold text-forest">
              Das könnte dich auch interessieren
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/artikel/${r.slug}`}
                  className="group rounded-xl border border-sage/12 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-mint hover:shadow-lg"
                >
                  {r.category && (
                    <Badge variant="green" className="mb-2">
                      {r.category}
                    </Badge>
                  )}
                  <h3 className="font-semibold text-forest line-clamp-2 group-hover:text-sage">
                    {r.title}
                  </h3>
                  {r.excerpt && (
                    <p className="mt-2 text-[14px] text-muted line-clamp-2">
                      {r.excerpt}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="border-t border-sage/12 px-6 py-8 sm:px-12">
        <div className="mx-auto flex max-w-[720px] justify-center">
          <ArtikelBackButton />
        </div>
      </footer>
    </div>
  );
}
