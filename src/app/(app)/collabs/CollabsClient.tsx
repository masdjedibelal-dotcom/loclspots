"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CollabCard } from "@/components/collabs/CollabCard";
import { Pagination } from "@/components/ui/Pagination";
import { cn } from "@/lib/utils";
import type { Collab } from "@/lib/types";

interface CollabWithItemCount extends Collab {
  itemCount: number;
}

const TYPE_OPTIONS = [
  { id: "all", label: "Alle" },
  { id: "perfekter-tag", label: "✨ Perfekter Tag" },
  { id: "beste-spots", label: "📍 Beste Spots" },
] as const;

const ITEMS_PER_PAGE = 12;

interface CollabsClientProps {
  collabs: CollabWithItemCount[];
  totalCount?: number;
  currentPage?: number;
  typeFilter?: string;
  categoryFilter?: string;
  categories?: readonly string[];
  currentUserId?: string;
  /** Eingebettet in Entdecken: keine Filter, keine Pagination */
  embedded?: boolean;
}

function buildPageUrl(
  searchParams: URLSearchParams,
  updates: { page?: number; type?: string; category?: string }
): string {
  const next = new URLSearchParams(searchParams.toString());
  if (updates.page !== undefined) next.set("page", String(updates.page));
  if (updates.type !== undefined) {
    updates.type ? next.set("type", updates.type) : next.delete("type");
  }
  if (updates.category !== undefined) {
    updates.category ? next.set("category", updates.category) : next.delete("category");
  }
  const qs = next.toString();
  return `/collabs${qs ? `?${qs}` : ""}`;
}

export function CollabsClient({
  collabs,
  totalCount = 0,
  currentPage = 1,
  typeFilter = "all",
  categoryFilter = "all",
  categories = [],
  embedded = false,
}: CollabsClientProps) {
  const searchParams = useSearchParams();
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));
  const page = Math.min(currentPage, totalPages);

  return (
    <div className="space-y-6">
      {!embedded && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-2xl text-forest sm:text-3xl">
              Collabs
            </h1>
            <p className="mt-1 text-sage">
              Kuratierte Listen mit Tipps – von der Community erstellt.
            </p>
          </div>
          <Link
            href="/collabs/new"
            className="flex items-center gap-2 rounded-xl bg-forest px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-forest/90"
          >
            <span>+</span>
            Collab erstellen
          </Link>
        </div>
      )}

      {/* Filter Ebene 1 + 2 (nur auf Vollseite) */}
      {!embedded && (
      <div className="overflow-x-auto border-b border-sage/20 pb-4 scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        <div className="flex min-w-0 flex-col gap-3">
          {/* Ebene 1: Typ */}
          <div className="flex shrink-0 flex-nowrap gap-2">
          {TYPE_OPTIONS.map((opt) => {
            const isActive = typeFilter === opt.id;
            return (
              <Link
                key={opt.id}
                href={buildPageUrl(searchParams, {
                  page: 1,
                  type: opt.id === "all" ? "" : opt.id,
                  category: categoryFilter === "all" ? "" : categoryFilter,
                })}
                className={cn(
                  "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-forest text-white"
                    : "border border-sage/40 bg-transparent text-sage hover:border-forest hover:bg-forest/10 hover:text-forest"
                )}
              >
                {opt.label}
              </Link>
            );
          })}
        </div>

          {/* Trennlinie + Ebene 2: Kategorie */}
          <div className="flex shrink-0 flex-nowrap gap-2 border-t border-sage/15 pt-3">
          {categories.map((cat) => {
            const isActive = categoryFilter === cat;
            return (
              <Link
                key={cat}
                href={buildPageUrl(searchParams, {
                  page: 1,
                  type: typeFilter === "all" ? "" : typeFilter,
                  category: isActive ? "" : cat,
                })}
                className={cn(
                  "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-forest text-white"
                    : "border border-sage/40 bg-transparent text-sage hover:border-forest hover:bg-forest/10 hover:text-forest"
                )}
              >
                {cat}
              </Link>
            );
          })}
          </div>
        </div>
      </div>
      )}

      {/* Karten-Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {collabs.map((collab) => (
          <CollabCard
            key={collab.id}
            collab={collab}
            itemCount={collab.itemCount}
          />
        ))}
      </div>

      {collabs.length === 0 && (
        <p className="py-12 text-center text-sage">
          Keine Collabs gefunden. Erstelle die erste!
        </p>
      )}

      {!embedded && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath="/collabs"
          searchParams={{
            ...(typeFilter !== "all" && { type: typeFilter }),
            ...(categoryFilter !== "all" && { category: categoryFilter }),
          }}
        />
      )}
    </div>
  );
}
