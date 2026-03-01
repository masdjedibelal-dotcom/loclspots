import { supabasePublic } from "@/lib/supabase/public";
import type { Collab, CollabItem, Place } from "@/lib/types";

const PLACE_SELECT =
  "id, name, category, address, rating, review_count, price, img_url, place_url, website, instagram_url, lat, lng, opening_hours_json";

export interface CollabWithItems {
  collab: Collab;
  items: (CollabItem & { place?: Place })[];
  chatroom: { id: string; name: string; emoji: string } | null;
  relatedCollabs: { id: string; title: string; cover_emoji: string | null }[];
}

export async function getCollabWithItems(
  id: string
): Promise<CollabWithItems | null> {
  const supabase = supabasePublic;

  const { data: collab, error: collabError } = await supabase
    .from("collabs")
    .select("*")
    .eq("id", id)
    .single();

  if (collabError || !collab) return null;

  const collabData = collab as Record<string, unknown>;
  if (collabData.is_public === false) return null;

  const category = (collabData.category as string) ?? "";

  const { data: itemsData } = await supabase
    .from("collab_items")
    .select("id, collab_id, place_id, position, description, created_at, name, maps_url")
    .eq("collab_id", id)
    .order("position", { ascending: true });

  const rawItems = (itemsData ?? []) as (Record<string, unknown>)[];
  const placeIds = rawItems
    .map((r) => r.place_id as string | undefined)
    .filter(Boolean) as string[];

  let placeMap = new Map<string, Record<string, unknown>>();
  if (placeIds.length > 0) {
    const { data: places } = await supabase
      .from("places")
      .select(PLACE_SELECT)
      .in("id", placeIds);
    placeMap = new Map((places ?? []).map((p) => [(p as { id: string }).id, p as Record<string, unknown>]));
  }

  const items = rawItems.map((row) => {
    const placeId = row.place_id as string | undefined;
    const place = placeId ? placeMap.get(placeId) : undefined;
    return { ...row, place };
  });

  let chatroom: { id: string; name: string; emoji: string } | null = null;
  const chatroomId = collabData.chatroom_id as string | undefined;
  if (chatroomId) {
    const { data: room } = await supabase
      .from("chatrooms")
      .select("id, name, emoji")
      .eq("id", chatroomId)
      .single();
    chatroom = room;
  } else {
    const { data: link } = await supabase
      .from("collab_chatroom_links")
      .select("chatroom_id")
      .eq("collab_id", id)
      .limit(1)
      .maybeSingle();
    if (link?.chatroom_id) {
      const { data: room } = await supabase
        .from("chatrooms")
        .select("id, name, emoji")
        .eq("id", link.chatroom_id)
        .single();
      chatroom = room;
    }
  }

  let relatedQuery = supabase
    .from("collabs")
    .select("id, title, cover_emoji")
    .eq("is_public", true)
    .neq("id", id)
    .order("created_at", { ascending: false })
    .limit(3);
  if (category) {
    relatedQuery = relatedQuery.eq("category", category);
  }
  const { data: related } = await relatedQuery;

  const normalizedItems = items.map((row) => ({
    ...row,
    place: row.place as Place | undefined,
  })) as (CollabItem & { place?: Place })[];

  return {
    collab: collab as Collab,
    items: normalizedItems,
    chatroom,
    relatedCollabs: (related ?? []).map((r) => ({
      id: r.id,
      title: r.title,
      cover_emoji: (r as Record<string, unknown>).cover_emoji ?? null,
    })),
  };
}
