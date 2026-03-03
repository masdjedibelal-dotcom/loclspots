import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CollabCard } from "@/components/collabs/CollabCard";
import { Pagination } from "@/components/ui/Pagination";
import type { Collab, Profile } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CollabWithItemCount extends Collab {
  itemCount: number;
}

import { PAGINATION } from "@/lib/constants";

const CATEGORIES = [
  "",
  "Essen & Trinken",
  "Outdoor",
  "Kultur",
  "Sport",
  "After Work",
  "Sonstiges",
] as const;

export default async function CollabsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const category = params.category ?? "";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const from = (currentPage - 1) * PAGINATION.COLLABS;
  const to = from + PAGINATION.COLLABS - 1;

  // Count für Paginierung
  let countQuery = supabase
    .from("collabs")
    .select("*", { count: "exact", head: true })
    .eq("is_public", true);

  if (category) {
    countQuery = countQuery.eq("category", category);
  }
  const { count } = await countQuery;
  const totalPages = Math.ceil((count ?? 0) / PAGINATION.COLLABS);

  // Daten laden
  let dataQuery = supabase
    .from("collabs")
    .select("id, title, description, category, chatroom_id, creator_id, cover_emoji, likes_count, created_at")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (category) {
    dataQuery = dataQuery.eq("category", category);
  }
  const { data: rawCollabs } = await dataQuery;

  let collabs: CollabWithItemCount[] = [];

  if (rawCollabs && rawCollabs.length > 0) {
    const creatorIds = Array.from(new Set(rawCollabs.map((c) => c.creator_id)));
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, username, display_name, avatar_url")
      .in("id", creatorIds);

    const profileMap = new Map(
      (profiles ?? []).map((p) => [p.id, p as Profile])
    );

    const { data: itemCounts } = await supabase
      .from("collab_items")
      .select("collab_id");

    const countMap = new Map<string, number>();
    for (const item of itemCounts ?? []) {
      countMap.set(
        item.collab_id,
        (countMap.get(item.collab_id) ?? 0) + 1
      );
    }

    collabs = rawCollabs.map((c) => ({
      ...c,
      profile: profileMap.get(c.creator_id),
      itemCount: countMap.get(c.id) ?? 0,
    })) as CollabWithItemCount[];
  }

  // Aktive Filter-Params für Pagination (ohne "page")
  const filterParams = category ? { category } : {};

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-forest sm:text-3xl">
            Collabs
          </h1>
          <p className="mt-1 text-sm text-sage">
            Kuratierte Orte & Listen für München
          </p>
        </div>
        <Link
          href="/collabs/new"
          className="flex shrink-0 items-center gap-2 rounded-xl bg-forest px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-forest/90"
        >
          <span>+</span>
          Collab erstellen
        </Link>
      </div>

      {/* Kategorie-Filter Chips */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat || "alle"}
            href={
              cat
                ? `/collabs?category=${encodeURIComponent(cat)}`
                : "/collabs"
            }
            className={cn(
              "flex-none whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              (category === cat || (!category && !cat))
                ? "bg-forest text-white"
                : "border border-sage/40 bg-transparent text-sage hover:border-forest hover:bg-forest/10 hover:text-forest"
            )}
          >
            {cat || "Alle"}
          </Link>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* Paginierung */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/collabs"
        searchParams={filterParams}
      />
    </main>
  );
}
