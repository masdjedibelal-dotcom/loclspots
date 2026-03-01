"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { CollabCard } from "@/components/collabs/CollabCard";
import { Button } from "@/components/ui/Button";
import type { Collab } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CollabWithItemCount extends Collab {
  itemCount: number;
}

interface CollabsClientProps {
  collabs: CollabWithItemCount[];
  currentUserId: string;
}

type FilterMode = "all" | "mine";
type SortMode = "newest" | "popular";

export function CollabsClient({
  collabs,
  currentUserId,
}: CollabsClientProps) {
  const [filter, setFilter] = useState<FilterMode>("all");
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<SortMode>("newest");

  const categories = useMemo(() => {
    const set = new Set(collabs.map((c) => c.category));
    return Array.from(set).sort();
  }, [collabs]);

  const filteredAndSorted = useMemo(() => {
    let result = [...collabs];

    if (filter === "mine") {
      result = result.filter((c) => c.creator_id === currentUserId);
    }

    if (category !== "all") {
      result = result.filter((c) => c.category === category);
    }

    if (sort === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else {
      result.sort((a, b) => (b.likes_count ?? 0) - (a.likes_count ?? 0));
    }

    return result;
  }, [collabs, filter, category, sort, currentUserId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl text-forest sm:text-3xl">
            Collabs
          </h1>
          <p className="mt-1 text-sage">
            Kuratierte Listen mit Tipps – von der Community erstellt.
          </p>
        </div>
        <Link href="/collabs/new">
          <Button variant="primary" size="md">
            <Plus className="mr-2 h-4 w-4" />
            Neue Collab erstellen
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              filter === "all"
                ? "bg-forest text-cream"
                : "bg-warm text-sage hover:bg-sage/20"
            )}
          >
            Alle
          </button>
          <button
            type="button"
            onClick={() => setFilter("mine")}
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              filter === "mine"
                ? "bg-forest text-cream"
                : "bg-warm text-sage hover:bg-sage/20"
            )}
          >
            Meine Collabs
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="category" className="text-sm text-sage">
            Kategorie:
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-warm bg-cream px-3 py-2 text-sm text-forest focus:border-sage focus:outline-none focus:ring-1 focus:ring-sage"
          >
            <option value="all">Alle</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 sm:ml-auto">
          <label htmlFor="sort" className="text-sm text-sage">
            Sortierung:
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortMode)}
            className="rounded-lg border border-warm bg-cream px-3 py-2 text-sm text-forest focus:border-sage focus:outline-none focus:ring-1 focus:ring-sage"
          >
            <option value="newest">Neueste</option>
            <option value="popular">Beliebteste</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {filteredAndSorted.map((collab) => (
          <CollabCard
            key={collab.id}
            collab={collab}
            itemCount={collab.itemCount}
          />
        ))}
      </div>

      {filteredAndSorted.length === 0 && (
        <p className="py-12 text-center text-sage">
          Keine Collabs gefunden. Erstelle die erste!
        </p>
      )}
    </div>
  );
}
