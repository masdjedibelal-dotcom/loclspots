import { createClient } from "@/lib/supabase/server";
import { CollabsClient } from "./CollabsClient";
import type { Collab, Profile } from "@/lib/types";

interface CollabWithItemCount extends Collab {
  itemCount: number;
}

export default async function CollabsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: rawCollabs } = await supabase
    .from("collabs")
    .select("id, title, description, category, chatroom_id, creator_id, cover_emoji, likes_count, created_at")
    .order("created_at", { ascending: false });

  if (!rawCollabs?.length) {
    return (
      <CollabsClient collabs={[]} currentUserId={user.id} />
    );
  }

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

  const collabs: CollabWithItemCount[] = rawCollabs.map((c) => ({
    ...c,
    profile: profileMap.get(c.creator_id),
    itemCount: countMap.get(c.id) ?? 0,
  }));

  return (
    <CollabsClient
      collabs={collabs}
      currentUserId={user.id}
    />
  );
}
