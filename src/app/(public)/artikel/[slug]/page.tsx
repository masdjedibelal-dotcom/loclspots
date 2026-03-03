import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import {
  getArticleBySlug,
  getArticleSlugs,
  getRelatedArticles,
} from "@/lib/supabase";
import { Badge } from "@/components/ui/Badge";
import { ArtikelBackButton } from "./ArtikelBackButton";
import { HomeLink } from "./HomeLink";
import type { Metadata } from "next";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ from?: string }>;
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

export default async function ArtikelDetailPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { from } = await searchParams;
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  const relatedQuery = from === "dashboard" ? "?from=dashboard" : "";
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

      <article className="mx-auto max-w-[720px] px-6 py-12 sm:px-12">
        <div className="mb-8">
          <ArtikelBackButton />
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          {article.category && (
            <Badge variant="green">{article.category}</Badge>
          )}
          <time
            dateTime={article.created_at}
            className="text-[14px] text-sage"
          >
            {formatDate(article.created_at)}
          </time>
        </div>

        <h1 className="font-serif text-3xl font-bold text-forest sm:text-4xl">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="mt-4 text-lg leading-relaxed text-muted">
            {article.excerpt}
          </p>
        )}

        {article.content && (
          <div className="article-content mt-10 space-y-4 text-text [&_h2]:mt-8 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-forest [&_h3]:mt-6 [&_h3]:font-serif [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-forest [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mt-1 [&_a]:text-sage [&_a]:underline [&_a]:hover:text-forest [&_blockquote]:border-l-4 [&_blockquote]:border-sage [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted">
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </div>
        )}
      </article>

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
                  href={`/artikel/${r.slug}${relatedQuery}`}
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
