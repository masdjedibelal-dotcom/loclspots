import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { EntdeckenClient } from "./EntdeckenClient";
import { Pagination } from "@/components/ui/Pagination";
import type { Collab, Profile } from "@/lib/types";

const ITEMS_PER_PAGE = 12;

const CATEGORIES = [
  { value: "", label: "Alle" },
  { value: "Essen & Trinken", label: "🍽️ Essen" },
  { value: "Outdoor", label: "🌿 Outdoor" },
  { value: "Kultur", label: "🎭 Kultur" },
  { value: "Sport", label: "🏃 Sport" },
  { value: "After Work", label: "🍸 After Work" },
  { value: "Sonstiges", label: "📍 Sonstiges" },
];

// Relation place_id -> place (PostgREST gibt place als Objekt oder Array zurück)
interface PlaceRow {
  id: string;
  name: string;
  img_url: string | null;
}
interface CollabItemRow {
  place_id: string;
  position: number;
  place?: PlaceRow | PlaceRow[] | null;
}

function getPlaceImgUrl(place: PlaceRow | PlaceRow[] | undefined | null): string | null {
  if (!place) return null;
  const p = Array.isArray(place) ? place[0] : place;
  return p?.img_url ?? null;
}

interface CollabWithItemCount extends Collab {
  itemCount: number;
  photos?: string[];
}

type PageProps = {
  searchParams: Promise<{ page?: string; category?: string }>;
};

export default async function EntdeckenPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page ?? 1);
  const activeCategory = params.category ?? "";
  const from = (currentPage - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const [countResult, collabsResult] = await Promise.all([
    (async () => {
      let countQuery = supabase
        .from("collabs")
        .select("*", { count: "exact", head: true })
        .eq("is_public", true);
      if (activeCategory) countQuery = countQuery.eq("category", activeCategory);
      const { count } = await countQuery;
      return count ?? 0;
    })(),
    (async () => {
      let dataQuery = supabase
        .from("collabs")
        .select(`
          id,
          title,
          description,
          category,
          chatroom_id,
          creator_id,
          cover_emoji,
          likes_count,
          is_public,
          created_at,
          collab_items (
            place_id,
            position,
            place (
              id,
              name,
              img_url
            )
          )
        `)
        .eq("is_public", true)
        .order("created_at", { ascending: false })
        .range(from, to);
      if (activeCategory) dataQuery = dataQuery.eq("category", activeCategory);

      const { data: rawCollabs } = await dataQuery;

      if (!rawCollabs?.length) return [] as CollabWithItemCount[];

      const creatorIds = Array.from(new Set(rawCollabs.map((c) => c.creator_id)));
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url")
        .in("id", creatorIds);

      const profileMap = new Map(
        (profiles ?? []).map((p) => [p.id, p as Profile])
      );

      type Row = (typeof rawCollabs)[number] & {
        collab_items?: CollabItemRow[] | null;
      };

      return (rawCollabs as Row[]).map((c) => {
        const items = (c.collab_items ?? []) as CollabItemRow[];
        const photos = items
          .sort((a, b) => a.position - b.position)
          .map((item) => getPlaceImgUrl(item.place))
          .filter((url): url is string => Boolean(url))
          .slice(0, 3);
        const placeCount = items.length;

        const { collab_items: _, ...rest } = c;
        return {
          ...rest,
          profile: profileMap.get(c.creator_id),
          itemCount: placeCount,
          photos,
        } as CollabWithItemCount;
      });
    })(),
  ]);

  const totalCount = countResult;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const collabs = collabsResult ?? [];

  return (
    <div>
      {/* Header mit Erstellen-Button */}
      <div className="mb-4 flex items-start justify-between pt-4">
        <div>
          <h1 className="font-serif text-2xl text-forest">Entdecken</h1>
          <p className="mt-1 text-sm text-sage">
            Kuratierte Orte & Listen für München
          </p>
        </div>
        <Link
          href="/collabs/new"
          className="mt-1 flex flex-shrink-0 items-center gap-1.5 rounded-xl bg-[#2D5016] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1f3a10]"
        >
          <span>+</span> Erstellen
        </Link>
      </div>

      {/* Kategorie-Filter — horizontal scrollbar */}
      <div className="-mx-4 mb-5 px-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.value || "alle"}
              href={
                cat.value
                  ? `/entdecken?category=${encodeURIComponent(cat.value)}`
                  : "/entdecken"
              }
              className={`flex-none whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeCategory === cat.value
                  ? "bg-[#2D5016] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Collabs Grid */}
      <EntdeckenClient collabs={collabs} currentUserId={user.id} />

      {/* Paginierung */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/entdecken"
        searchParams={activeCategory ? { category: activeCategory } : {}}
      />
    </div>
  );
}
