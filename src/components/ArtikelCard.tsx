"use client";

import { useState } from "react";
import { ArtikelContent } from "./ArtikelContent";
import type { Article } from "@/lib/types";

interface ArtikelPreview {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  category?: string | null;
  created_at: string;
}

export function ArtikelCard({ article }: { article: ArtikelPreview }) {
  const [open, setOpen] = useState(false);
  const [fullArticle, setFullArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleOpen() {
    setOpen(true);
    if (fullArticle) return;
    setLoading(true);
    const res = await fetch(`/api/artikel/${article.slug}`);
    const data = await res.json();
    setFullArticle(data);
    setLoading(false);
  }

  return (
    <>
      {/* Vorschau-Karte */}
      <button
        type="button"
        onClick={handleOpen}
        className="w-full rounded-2xl border border-gray-100 bg-white p-4 text-left transition-shadow hover:shadow-sm"
      >
        {article.category && (
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
            {article.category}
          </span>
        )}
        <h3 className="mt-2 line-clamp-2 text-sm font-semibold text-gray-900">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="mt-1 line-clamp-2 text-xs text-gray-500">
            {article.excerpt}
          </p>
        )}
        <span className="mt-2 block text-xs font-medium text-[#2D5016]">
          Weiterlesen →
        </span>
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Artikel"
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white sm:rounded-3xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3 rounded-t-3xl">
              <span className="text-sm font-medium text-gray-700">Artikel</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100"
                aria-label="Schließen"
              >
                ✕
              </button>
            </div>

            {/* Inhalt */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div
                  className="h-6 w-6 animate-spin rounded-full border-2 border-[#2D5016] border-t-transparent"
                  aria-hidden
                />
              </div>
            ) : fullArticle ? (
              <ArtikelContent article={fullArticle} />
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
