import ReactMarkdown from "react-markdown";
import type { Article } from "@/lib/types";

interface ArtikelContentProps {
  article: Article;
}

export function ArtikelContent({ article }: ArtikelContentProps) {
  return (
    <article className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-4 flex items-center gap-2">
        {article.category && (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
            {article.category}
          </span>
        )}
        <span className="text-xs text-gray-400">
          {new Date(article.created_at).toLocaleDateString("de-DE", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>
      <h1 className="mb-3 text-2xl font-bold text-gray-900">{article.title}</h1>
      {article.excerpt && (
        <p className="mb-6 text-base leading-relaxed text-gray-500">
          {article.excerpt}
        </p>
      )}
      {article.content && (
        <div className="article-content space-y-4 [&_h2]:mt-8 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-forest [&_h3]:mt-6 [&_h3]:font-serif [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-forest [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mt-1 [&_a]:text-sage [&_a]:underline [&_a]:hover:text-forest [&_blockquote]:border-l-4 [&_blockquote]:border-sage [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </div>
      )}
    </article>
  );
}
