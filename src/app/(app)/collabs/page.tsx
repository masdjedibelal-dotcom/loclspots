import { createClient } from "@/lib/supabase/server";
import { CollabsClient } from "./CollabsClient";
import type { Collab, Profile } from "@/lib/types";

interface CollabWithItemCount extends Collab {
  itemCount: number;
}

const CATEGORIES = [
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
  searchParams: Promise<{ page?: string; type?: string; category?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const typeFilter = params.type ?? "all";
  const categoryFilter = params.category ?? "all";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const offset = (page - 1) * 12;

  let query = supabase
    .from("collabs")
    .select("id, title, description, category, chatroom_id, creator_id, cover_emoji, likes_count, created_at", {
      count: "exact",
    })
    .eq("is_public", true);

  if (typeFilter === "perfekter-tag") {
    query = query.or("title.ilike.%perfekt%,title.ilike.%Tag%");
  } else if (typeFilter === "beste-spots") {
    query = query.or("title.ilike.%besten%,title.ilike.%Spots%");
  }

  if (categoryFilter !== "all" && CATEGORIES.includes(categoryFilter as (typeof CATEGORIES)[number])) {
    query = query.eq("category", categoryFilter);
  }

  const { data: rawCollabs, count: totalCount } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + 11);

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

    const collabIds = rawCollabs.map((c) => c.id);
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

  return (
    <CollabsClient
      collabs={collabs}
      totalCount={totalCount ?? 0}
      currentPage={page}
      typeFilter={typeFilter}
      categoryFilter={categoryFilter}
      categories={[...CATEGORIES]}
      currentUserId={user.id}
    />
  );
}
